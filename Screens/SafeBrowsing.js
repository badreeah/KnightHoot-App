// Screens/SafeBrowsing.js
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
import { useAppSettings } from "../src/context/AppSettingProvid";
import { useTranslation } from "react-i18next";
import { saveSafeResult } from "../services/saveWebResult";
import supabase from "../supabase";

const mockSuspiciousDomains = [
  "bad-site.example",
  "phishingsite.com",
  "malware-downloads.net",
];

const suspiciousKeywords = [
  "verify account",
  "update payment",
  "confirm password",
  "free gift",
  "click here",
];

const classifyUrlAI = async (inputUrl) => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

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

function SafeBrowsingScreen({ navigation }) {
  const [url, setUrl] = useState("");
  const [siteRating, setSiteRating] = useState(null); // 'safe' | 'suspicious' | 'danger'
  const [downloadProtection, setDownloadProtection] = useState(true);
  const [lastScanInfo, setLastScanInfo] = useState(null);

  const { theme, isRTL } = useAppSettings();
  const { t } = useTranslation();

  const styles = useMemo(() => createStyles(theme, isRTL), [theme, isRTL]);

  const scanUrl = async (inputUrl) => {
    const normalized = (inputUrl || "").trim().toLowerCase();
    if (!normalized) {
      Alert.alert(t("safe.invalidUrl", "Enter a valid URL to scan"));
      return;
    }

    try {
      let domain = normalized.replace(/^https?:\/\//, "").split("/")[0];

      if (mockSuspiciousDomains.some((d) => domain.includes(d))) {
        setSiteRating("danger");
        setLastScanInfo({
          domain,
          reason: "Domain listed in blocked DB",
        });
        return;
      }

      const matchedKeyword = suspiciousKeywords.find((kw) =>
        normalized.includes(kw)
      );
      if (matchedKeyword) {
        setSiteRating("suspicious");
        setLastScanInfo({
          domain,
          reason: `Found phishing keyword: "${matchedKeyword}"`,
        });
        return;
      }

      setSiteRating("safe");
      setLastScanInfo({
        domain,
        reason: "No immediate issues found (local check)",
      });
    } catch (err) {
      console.warn("scanUrl error", err);
      Alert.alert(t("safe.scanError", "An error occurred while scanning"));
    }
  };

  const onOpenLink = (link) => {
    if (siteRating === "danger") {
      Alert.alert(
        t("safe.warnTitle", "Warning: Suspicious Site"),
        t(
          "safe.warnBody",
          "This site is flagged as blocked/phishing. Do you want to continue?"
        ),
        [
          { text: t("common.cancel", "Cancel"), style: "cancel" },
          {
            text: t("common.continue", "Continue"),
            onPress: () => {
              Linking.openURL(link).catch(() =>
                Alert.alert(t("safe.openFail", "Could not open the link"))
              );
            },
          },
        ]
      );
    } else {
      Linking.openURL(link).catch(() =>
        Alert.alert(t("safe.openFail", "Could not open the link"))
      );
    }
  };

  const renderRatingBadge = () => {
    if (!siteRating)
      return (
        <Text style={styles.ratingPlaceholder}>
          {t("safe.notScannedShort", "—")}
        </Text>
      );

    if (siteRating === "safe")
      return (
        <Text style={[styles.rating, styles.safe]}>
          {t("safe.rating.safe", "Safe")}
        </Text>
      );

    if (siteRating === "suspicious")
      return (
        <Text style={[styles.rating, styles.suspicious]}>
          {t("safe.rating.suspicious", "Suspicious")}
        </Text>
      );

    if (siteRating === "danger")
      return (
        <Text style={[styles.rating, styles.danger]}>
          {t("safe.rating.danger", "Danger")}
        </Text>
      );

    return (
      <Text style={styles.ratingPlaceholder}>
        {t("safe.notScannedShort", "—")}
      </Text>
    );
  };

  const handleCheck = async () => {
    const input = (url || "").trim();
    if (!input) {
      Alert.alert(t("safe.invalidUrl", "Enter a valid URL to scan"));
      return;
    }

    try {
      const res = await classifyUrlAI(input);

      setLastScanInfo({
        domain: res.domain,
        reason: res.reasons?.[0] || "Classified",
      });
      const isNotSafe = res.label === "notsafe";
      setSiteRating(isNotSafe ? "danger" : "safe");

      const {
        data: { user },
      } = await supabase.auth.getUser();

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
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          <Ionicons name="arrow-back" size={24} color={COLORS.purple1} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          {t("safe.title", "Safe Browsing")}
        </Text>

        <Image
          source={require("../assets/images/protection.png")}
          style={{ width: 24, height: 24 }}
          resizeMode="contain"
        />
      </View>

      {/* Check URL */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>
          {t("safe.checkUrl", "Check URL")}
        </Text>

        <Text style={styles.inputLabel}>
          {t("safe.websiteUrl", "Website URL")}
        </Text>

        <TextInput
          style={styles.input}
          placeholder={t("safe.urlPlaceholder", "https://example.com")}
          value={url}
          onChangeText={setUrl}
          autoCapitalize="none"
          keyboardType="url"
          placeholderTextColor={theme.colors.subtext}
          textAlign={isRTL ? "right" : "left"}
        />

        <TouchableOpacity style={styles.primaryBtn} onPress={handleCheck}>
          <Text style={styles.primaryBtnText}>
            {t("safe.checkUrl", "Check URL")}
          </Text>
        </TouchableOpacity>
      </View>

      {/* File Download Protection */}
      <View style={styles.cardRow}>
        <View style={styles.cardLeft}>
          <Text style={styles.cardTitle}>
            {t("safe.downloadProtTitle", "File Download Protection")}
          </Text>
          <Text style={styles.cardSub}>
            {t(
              "safe.downloadProtDesc",
              "Prevents downloading suspicious files or shows a warning"
            )}
          </Text>
        </View>

        <View style={styles.cardRight}>
          <Switch
            value={downloadProtection}
            onValueChange={setDownloadProtection}
            trackColor={{
              false: theme.colors.cardBorder,
              true: COLORS.purple2,
            }}
            thumbColor={
              downloadProtection ? COLORS.purple5 : theme.colors.card
            }
          />
        </View>
      </View>

      {/* Site Rating */}
      <View style={styles.cardRow}>
        <View style={styles.cardLeft}>
          <Text style={styles.cardTitle}>
            {t("safe.websiteRating", "Website Rating")}
          </Text>

          <Text style={styles.cardSub}>
            {t("safe.lastScan", "Last scan result")}{" "}
            {lastScanInfo
              ? lastScanInfo.reason
              : t("safe.notScanned", "Not scanned yet")}
          </Text>
        </View>

        <View style={styles.cardRight}>{renderRatingBadge()}</View>
      </View>

      {/* Browsing Tips */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          {t("safe.tipsTitle", "Browsing Tips")}
        </Text>

        <Text style={styles.tip}>
          {"\u2022 "} {/* نقطة • */}
          {t("safe.tip1", "Make sure you see HTTPS in the address bar")}
        </Text>

        <Text style={styles.tip}>
          {"\u2022 "}
          {t("safe.tip2", "Don’t enter your data without a clear reason")}
        </Text>

        <Text style={styles.tip}>
          {"\u2022 "}
          {t("safe.tip3", "Beware of short links or strange domains")}
        </Text>
      </View>

      {/* Last scanned domain */}
      {lastScanInfo && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            {t("safe.lastScanTitle", "Last Scan Result")}
          </Text>

          <Text style={styles.cardSub}>
            {t("safe.domain", "Domain")}: {lastScanInfo.domain}
          </Text>

          <Text style={styles.cardSub}>
            {t("safe.reason", "Reason")}: {lastScanInfo.reason}
          </Text>

          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={() => {
                const toOpen = url.startsWith("http") ? url : `https://${url}`;
                onOpenLink(toOpen);
              }}
            >
              <Text style={styles.primaryBtnText}>
                {t("safe.openLink", "Open Link")}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryBtn}
              onPress={() => {
                Alert.alert(
                  t("safe.reportSent", "Report sent to the system (Mock)")
                );
              }}
            >
              <Text style={styles.secondaryBtnText}>
                {t("safe.report", "Report")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

export default SafeBrowsingScreen;

const createStyles = (theme, isRTL) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      paddingHorizontal: 16,
    },

    header: {
      flexDirection: isRTL ? "row-reverse" : "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingTop: 60,
      paddingBottom: 20,
    },
    headerTitle: {
      fontFamily: "Poppins-600",
      fontSize: 20,
      color: theme.colors.text,
      textAlign: "center",
    },

    sectionTitle: {
      fontFamily: "Poppins-500",
      fontSize: 18,
      color: theme.colors.text,
      marginBottom: 12,
      textAlign: isRTL ? "right" : "left",
    },

    card: {
      backgroundColor: theme.colors.card,
      padding: 16,
      borderRadius: 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: theme.colors.cardBorder,
    },
    cardRow: {
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: theme.colors.card,
      padding: 16,
      borderRadius: 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: theme.colors.cardBorder,
    },
    cardLeft: { flex: 1 },
    cardRight: { marginLeft: 12, alignItems: "flex-end" },
    cardTitle: {
      fontFamily: "Poppins-500",
      fontSize: 16,
      color: theme.colors.text,
      marginBottom: 6,
      textAlign: isRTL ? "right" : "left",
    },
    cardSub: {
      fontFamily: "Poppins-400",
      fontSize: 12,
      color: theme.colors.subtext,
      textAlign: isRTL ? "right" : "left",
    },

    inputLabel: {
      fontFamily: "Poppins-500",
      fontSize: 16,
      color: theme.colors.text,
      marginBottom: 8,
      textAlign: isRTL ? "right" : "left",
    },
    input: {
      backgroundColor: theme.colors.card,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.colors.cardBorder,
      fontSize: 16,
      fontFamily: "Poppins-400",
      marginBottom: 16,
      color: theme.colors.text,
      textAlign: isRTL ? "right" : "left",
    },

    primaryBtn: {
      backgroundColor: theme.colors.primary,
      padding: 14,
      borderRadius: 16,
      alignItems: "center",
      marginTop: 4,
    },
    primaryBtnText: {
      color: theme.colors.primaryTextOn,
      fontSize: 16,
      fontFamily: "Poppins-600",
    },
    secondaryBtn: {
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: COLORS.purple4,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 16,
      alignItems: "center",
      marginLeft: isRTL ? 0 : 10,
      marginRight: isRTL ? 10 : 0,
    },
    secondaryBtnText: {
      color: COLORS.purple4,
      fontSize: 16,
      fontFamily: "Poppins-600",
    },

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
    ratingPlaceholder: {
      color: theme.colors.subtext,
      fontFamily: "Poppins-400",
    },
    safe: { backgroundColor: COLORS.brightTiffany },
    suspicious: { backgroundColor: COLORS.purple2 },
    danger: { backgroundColor: COLORS.purple7 },

    tip: {
      color: theme.colors.text,
      marginTop: 6,
      fontFamily: "Poppins-400",
    },

    actionsRow: {
      flexDirection: isRTL ? "row-reverse" : "row",
      marginTop: 12,
    },
  });
