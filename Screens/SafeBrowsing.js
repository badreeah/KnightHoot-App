// Screens/SafeBrowsing.js  (safe-browning.js سابقًا)
import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Switch,
  StyleSheet,
  Alert,
  Linking,
  ScrollView,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../util/colors";
import { useAppSettings } from "../src/context/AppSettingProvid"; // [theme][rtl]
import { useTranslation } from "react-i18next"; // [i18n]
import { saveSafeResult } from "../services/saveWebResult";
import supabase from "../supabase";

const mockSuspiciousDomains = ["bad-site.example", "phishingsite.com", "malware-downloads.net"];
const suspiciousKeywords = ["verify account", "update payment", "confirm password", "free gift", "click here"];

const classifyUrlAI = async (inputUrl) => {
  const { data: { session } } = await supabase.auth.getSession();
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/url-classify`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
        ...(session?.access_token
          ? { Authorization: `Bearer ${session.access_token}` }
          : {}),
      },
      body: JSON.stringify({ url: inputUrl }),
    }
  );

  if (!response.ok) throw new Error("API classification failed");
  const data = await response.json(); // { label, score, reasons, domain }
  return data;
};
export default function SafeBrowningScreen({ navigation }) {
  const [url, setUrl] = useState("");
  const [siteRating, setSiteRating] = useState(null); // 'safe' | 'suspicious' | 'danger'
  const [downloadProtection, setDownloadProtection] = useState(true);
  const [lastScanInfo, setLastScanInfo] = useState(null);
  const [showWarning, setShowWarning] = useState(false);

  const { theme, isRTL } = useAppSettings(); // [theme][rtl]
  const { t } = useTranslation();            // [i18n]

  const styles = useMemo(() => createStyles(theme, isRTL), [theme, isRTL]); // [theme][rtl]

  // هنا ينحط المودل
  const scanUrl = async (inputUrl) => {
    const normalized = (inputUrl || "").trim().toLowerCase();
    if (!normalized) {
      Alert.alert(t("safe.invalidUrl", "Enter a valid URL to scan")); // [i18n]
      return;
    }

    try {
      let domain = normalized.replace(/^https?:\/\//, "").split("/")[0];

      // داتا بيس
      if (mockSuspiciousDomains.some((d) => domain.includes(d))) {
        setSiteRating("danger");
        setLastScanInfo({ domain, reason: "Domain listed in blocked DB" }); 
        setShowWarning(true);
        return;
      }

      const matchedKeyword = suspiciousKeywords.find((kw) => normalized.includes(kw));
      if (matchedKeyword) {
        setSiteRating("suspicious");
        setLastScanInfo({ domain, reason: `Found phishing keyword: "${matchedKeyword}"` });
        setShowWarning(true);
        return;
      }

      setSiteRating("safe");
      setLastScanInfo({ domain, reason: "No immediate issues found (local check)" });
      setShowWarning(false);
    } catch (err) {
      console.warn("scanUrl error", err);
      Alert.alert(t("safe.scanError", "An error occurred while scanning")); // [i18n]
    }
  };

  const onOpenLink = (link) => {
    if (siteRating === "danger") {
      Alert.alert(
        t("safe.warnTitle", "Warning: Suspicious Site"), // [i18n]
        t("safe.warnBody", "This site is flagged as blocked/phishing. Do you want to continue?"), // [i18n]
        [
          { text: t("common.cancel", "Cancel"), style: "cancel" }, // [i18n]
          {
            text: t("common.continue", "Continue"), // [i18n]
            onPress: () => {
              Linking.openURL(link).catch(() => Alert.alert(t("safe.openFail", "Could not open the link"))); // [i18n]
            },
          },
        ]
      );
    } else {
      Linking.openURL(link).catch(() => Alert.alert(t("safe.openFail", "Could not open the link"))); // [i18n]
    }
  };

  const renderRatingBadge = () => {
    if (!siteRating) return <Text style={styles.ratingPlaceholder}>—</Text>;
    if (siteRating === "safe") return <Text style={[styles.rating, styles.safe]}>{t("safe.rating.safe", "Safe")}</Text>; // [i18n]
    if (siteRating === "suspicious")
      return <Text style={[styles.rating, styles.suspicious]}>{t("safe.rating.suspicious", "Suspicious")}</Text>; // [i18n]
    if (siteRating === "danger")
      return <Text style={[styles.rating, styles.danger]}>{t("safe.rating.danger", "Danger")}</Text>; // [i18n]
    return <Text style={styles.ratingPlaceholder}>—</Text>;
  };

  const handleCheck = async () => {
  const input = (url || "").trim();
  if (!input) return Alert.alert("Enter a valid URL");

  try {
    // 1) 
    const res = await classifyUrlAI(input); 

    // 2) تحديث الواجهة
    setLastScanInfo({ domain: res.domain, reason: res.reasons?.[0] || "Classified" });
    setShowWarning(res.label === "notsafe");
    setSiteRating(res.label === "notsafe" ? "danger" : "safe");

    // 3) تخزين النتيجة
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.id) {
      await saveSafeResult(
        user.id,
        input,
        res.domain,
        res.label,           
        res.score,           
        (res.reasons || []).join("; ")
      );
    }
  } catch (e) {
    Alert.alert("Scan failed", String(e.message || e));
  }
};
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
        <Ionicons name="arrow-back" size={24} color={COLORS.purple1} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t("safe.title", "Safe Browsing")}</Text> {/* [i18n] */}
        <Image source={require("../assets/images/protection.png")} style={{ width: 24, height: 24 }} resizeMode="contain" />
      </View>

  
      {/* Check URL */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>{t("safe.checkUrl", "Check URL")}</Text> {/* [i18n] */}
        <Text style={styles.inputLabel}>{t("safe.websiteUrl", "Website URL")}</Text> {/* [i18n] */}
        <TextInput
          style={styles.input}
          placeholder={t("safe.urlPlaceholder", "https://example.com")} // [i18n]
          value={url}
          onChangeText={setUrl}
          autoCapitalize="none"
          keyboardType="url"
          placeholderTextColor={theme.colors.subtext} // [theme]
          textAlign={isRTL ? "right" : "left"}        // [rtl]
        />
        <TouchableOpacity style={styles.primaryBtn} onPress={handleCheck}>
          <Text style={styles.primaryBtnText}>{t("safe.checkUrl", "Check URL")}</Text> {/* [i18n] */}
        </TouchableOpacity>
      </View>

      {/* File Download Protection */}
      <View style={styles.cardRow}>
        <View style={styles.cardLeft}>
          <Text style={styles.cardTitle}>{t("safe.downloadProtTitle", "File Download Protection")}</Text> {/* [i18n] */}
          <Text style={styles.cardSub}>{t("safe.downloadProtDesc", "Prevents downloading suspicious files or shows a warning")}</Text> {/* [i18n] */}
        </View>
        <View style={styles.cardRight}>
          <Switch
            value={downloadProtection}
            onValueChange={setDownloadProtection}
            trackColor={{ false: theme.colors.cardBorder, true: COLORS.purple2 }} // [theme]
            thumbColor={downloadProtection ? COLORS.purple5 : theme.colors.card}  // [theme]
          />
        </View>
      </View>

      {/* Site Rating */}
      <View style={styles.cardRow}>
        <View style={styles.cardLeft}>
          <Text style={styles.cardTitle}>{t("safe.websiteRating", "Website Rating")}</Text> {/* [i18n] */}
          <Text style={styles.cardSub}>
            {t("safe.lastScan", "Last scan result")}: {lastScanInfo ? lastScanInfo.reason : t("safe.notScanned", "Not scanned yet")} {/* [i18n] */}
          </Text>
        </View>
        <View style={styles.cardRight}>{renderRatingBadge()}</View>
      </View>

      {/* Browsing Tips */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{t("safe.tipsTitle", "Browsing Tips")}</Text> {/* [i18n] */}
        <Text style={styles.tip}>• {t("safe.tip1", "Make sure you see HTTPS in the address bar")}</Text>       {/* [i18n] */}
        <Text style={styles.tip}>• {t("safe.tip2", "Don’t enter your data without a clear reason")}</Text>      {/* [i18n] */}
        <Text style={styles.tip}>• {t("safe.tip3", "Beware of short links or strange domains")}</Text>          {/* [i18n] */}
      </View>

      {/* Last scanned domain */}
      {lastScanInfo && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t("safe.lastScanTitle", "Last Scan Result")}</Text> {/* [i18n] */}
          <Text style={styles.cardSub}>{t("safe.domain", "Domain")}: {lastScanInfo.domain}</Text>   {/* [i18n] */}
          <Text style={styles.cardSub}>{t("safe.reason", "Reason")}: {lastScanInfo.reason}</Text>   {/* [i18n] */}

          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={() => {
                const toOpen = url.startsWith("http") ? url : `https://${url}`;
                onOpenLink(toOpen);
              }}
            >
              <Text style={styles.primaryBtnText}>{t("safe.openLink", "Open Link")}</Text> {/* [i18n] */}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryBtn}
              onPress={() => {
                Alert.alert(t("safe.reportSent", "Report sent to the system (Mock)")); // [i18n]
              }}
            >
              <Text style={styles.secondaryBtnText}>{t("safe.report", "Report")}</Text> {/* [i18n] */}
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const createStyles = (theme, isRTL) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background, // [theme]
      paddingHorizontal: 16,
    },

    header: {
      flexDirection: isRTL ? "row-reverse" : "row", // [rtl]
      justifyContent: "space-between",
      alignItems: "center",
      paddingTop: 60,
      paddingBottom: 20,
    },
    headerTitle: {
      fontFamily: "Poppins-600",
      fontSize: 20,
      color: theme.colors.text, // [theme]
      textAlign: "center",
    },

    // Sections
    sectionTitle: {
      fontFamily: "Poppins-500",
      fontSize: 18,
      color: theme.colors.text, // [theme]
      marginBottom: 12,
      textAlign: isRTL ? "right" : "left", // [rtl]
    },

    // Cards
    card: {
      backgroundColor: theme.colors.card,     // [theme]
      padding: 16,
      borderRadius: 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: theme.colors.cardBorder,   // [theme]
    },
    cardRow: {
      flexDirection: isRTL ? "row-reverse" : "row", // [rtl]
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: theme.colors.card,     // [theme]
      padding: 16,
      borderRadius: 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: theme.colors.cardBorder,   // [theme]
    },
    cardLeft: { flex: 1 },
    cardRight: { marginLeft: 12, alignItems: "flex-end" },
    cardTitle: {
      fontFamily: "Poppins-500",
      fontSize: 16,
      color: theme.colors.text, // [theme]
      marginBottom: 6,
      textAlign: isRTL ? "right" : "left", // [rtl]
    },
    cardSub: {
      fontFamily: "Poppins-400",
      fontSize: 12,
      color: theme.colors.subtext, // [theme]
      textAlign: isRTL ? "right" : "left", // [rtl]
    },

    // Inputs
    inputLabel: {
      fontFamily: "Poppins-500",
      fontSize: 16,
      color: theme.colors.text, // [theme]
      marginBottom: 8,
      textAlign: isRTL ? "right" : "left", // [rtl]
    },
    input: {
      backgroundColor: theme.colors.card,     // [theme]
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.colors.cardBorder,   // [theme]
      fontSize: 16,
      fontFamily: "Poppins-400",
      marginBottom: 16,
      color: theme.colors.text,               // [theme]
      textAlign: isRTL ? "right" : "left",    // [rtl]
    },

    // Buttons
    primaryBtn: {
      backgroundColor: theme.colors.primary,  // [theme]
      padding: 14,
      borderRadius: 16,
      alignItems: "center",
      marginTop: 4,
    },
    primaryBtnText: {
      color: theme.colors.primaryTextOn,      // [theme]
      fontSize: 16,
      fontFamily: "Poppins-600",
    },
    secondaryBtn: {
      backgroundColor: theme.colors.card,     // [theme]
      borderWidth: 1,
      borderColor: COLORS.purple4,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 16,
      alignItems: "center",
      marginLeft: isRTL ? 0 : 10,             // [rtl]
      marginRight: isRTL ? 10 : 0,            // [rtl]
    },
    secondaryBtnText: {
      color: COLORS.purple4,
      fontSize: 16,
      fontFamily: "Poppins-600",
    },

    // Rating badge
    rating: {
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 16,
      color: "#fff",
      fontFamily: "Poppins-600",
      minWidth: 72,
      textAlign: "center",
      fontSize: 12,
    },
    ratingPlaceholder: { color: theme.colors.subtext, fontFamily: "Poppins-400" }, // [theme]
    safe: { backgroundColor: COLORS.brightTiffany },
    suspicious: { backgroundColor: COLORS.purple2 },
    danger: { backgroundColor: COLORS.purple7 },

    tip: { color: theme.colors.text, marginTop: 6, fontFamily: "Poppins-400" }, // [theme]

    actionsRow: { flexDirection: isRTL ? "row-reverse" : "row", marginTop: 12 }, // [rtl]

    // Warning
    warningBox: {
      backgroundColor: isRTL ? "#F3F1FE" : "#F3F1FE", // مجرد لون ثابت خفيف
      borderRadius: 16,
      padding: 12,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: COLORS.purple1,
    },
    warningText: {
      color: COLORS.purple5,
      fontFamily: "Poppins-600",
      fontSize: 12,
      textAlign: isRTL ? "right" : "left", // [rtl]
    },
  });
