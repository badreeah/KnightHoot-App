// Screens/SafeBrowsing.js
import React, { useState, useMemo, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Linking,
  ScrollView,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

import { COLORS } from "../util/colors";
import { useAppSettings } from "../src/context/AppSettingProvid";
import { useTranslation } from "react-i18next";
import { supabase } from "../supabase";
import { saveSafeResult } from "../services/saveWebResult";

// عنوان الـ API على Railway
const API_BASE =
  process.env.EXPO_PUBLIC_URL_MODEL_API ??
  "https://url-scam-detector-api-production.up.railway.app";

// دالة استدعاء المودل + حساب الـ risk + label للتخزين
const classifyUrlAI = async (inputUrl) => {
  const response = await fetch(`${API_BASE}/predict`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url: inputUrl }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`API error (${response.status}): ${text}`);
  }

  const data = await response.json();

  const domain =
    data.domain ||
    (inputUrl || "")
      .replace(/^https?:\/\//, "")
      .split("/")[0]
      .toLowerCase();

  // احتمال أن الرابط خبيث من الـ API
  const proba =
    data.probability_malicious ?? data.probability ?? data.score ?? null;

  // تحديد الـ risk ثلاثي (للوصف)
  let risk = "safe"; // safe | suspicious | malicious

  if (proba !== null) {
    if (proba >= 0.85) {
      risk = "malicious";
    } else if (proba > 0.3) {
      risk = "suspicious";
    } else {
      risk = "safe";
    }
  }

  let finalLabel;
  if (risk === "malicious") {
    finalLabel = "notsafe";
  } else if (risk === "suspicious") {
    if (proba !== null && proba < 0.8) {
      finalLabel = "safe";
    } else {
      finalLabel = "notsafe";
    }
  } else {
    finalLabel = "safe";
  }

  const reasons = [];
  if (risk === "malicious") {
    reasons.push("Model classified the URL as malicious");
  } else if (risk === "suspicious") {
    reasons.push("Model classified the URL as suspicious");
  } else {
    reasons.push("Model classified the URL as safe");
  }

  return {
    domain,
    risk, // safe | suspicious | malicious (لوصف الحالة)
    label: finalLabel, // safe | notsafe حسب القاعدة
    score: proba,
    reasons,
    raw: data,
  };
};

// تهذيب والتحقق من الـ URL (فورمات معيّن)
const normalizeAndValidateUrl = (raw) => {
  const trimmed = (raw || "").trim();
  if (!trimmed) return null;

  let candidate = trimmed;

  // لو ما فيه بروتوكول, نضيف https:// تلقائياً
  if (!/^https?:\/\//i.test(candidate)) {
    candidate = `https://${candidate}`;
  }

  try {
    const urlObj = new URL(candidate);

    // تأكد أن فيه hostname وفيه نقطة (example.com)
    if (!urlObj.hostname || !urlObj.hostname.includes(".")) {
      return null;
    }

    // نرجع الرابط النهائي كـ string نظيف
    return urlObj.toString();
  } catch (err) {
    // لو new URL فشل، يعني الفورمات غلط
    return null;
  }
};

function SafeBrowsingScreen({ navigation }) {
  const [url, setUrl] = useState("");
  const [siteRating, setSiteRating] = useState(null); // 'safe' | 'danger'
  const [lastScanInfo, setLastScanInfo] = useState(null);
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const { theme, isRTL } = useAppSettings();
  const { t } = useTranslation();

  const styles = useMemo(() => createStyles(theme, isRTL), [theme, isRTL]);

  // تحميل آخر 20 نتيجة من جدول safe_scans (قراءة فقط)
  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const loadHistory = async () => {
        try {
          setLoadingHistory(true);

          const {
            data: { user },
          } = await supabase.auth.getUser();
          if (!user || !isActive) {
            setLoadingHistory(false);
            return;
          }

          const { data, error } = await supabase
            .from("safe_scans")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })
            .limit(20);

          if (!isActive) return;

          if (error) {
            console.log("loadHistory error:", error);
            setLoadingHistory(false);
            return;
          }

          const results = data || [];
          setHistory(results);

          if (results.length > 0) {
            const last = results[0];
            setLastScanInfo({
              domain: last.domain,
              reason: last.reasons || "Classified by ML model",
              url: last.url,
            });
            const uiRating = last.label === "notsafe" ? "danger" : "safe";
            setSiteRating(uiRating);
          } else {
            setLastScanInfo(null);
            setSiteRating(null);
          }

          setLoadingHistory(false);
        } catch (e) {
          if (!isActive) return;
          console.log("loadHistory error:", e);
          setLoadingHistory(false);
        }
      };

      loadHistory();

      return () => {
        isActive = false;
      };
    }, [])
  );

  const onOpenLink = (link) => {
    if (!link) {
      Alert.alert(t("safe.invalidUrl", "Enter a valid URL to scan"));
      return;
    }

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

  // فحص الرابط هنا مباشرة + حفظه في Supabase
  const handleCheck = async () => {
    const rawInput = url;

    // نستخدم الدالة الجديدة للتحقق من الفورمات + إضافة البروتوكول
    const normalizedUrl = normalizeAndValidateUrl(rawInput);

    if (!normalizedUrl) {
      Alert.alert(
        t("safe.invalidUrlFormatTitle", "Invalid URL format"),
        t(
          "safe.invalidUrlFormatBody",
          "Please enter a valid website address like example.com or https://example.com"
        )
      );
      return;
    }

    try {
      const res = await classifyUrlAI(normalizedUrl);

      // rating في الواجهة نعتمد على label المخزّن (safe / notsafe)
      const uiRating = res.label === "notsafe" ? "danger" : "safe";

      const uiLastScan = {
        domain: res.domain,
        reason: res.reasons?.[0] || "Classified by ML model",
        url: normalizedUrl,
      };

      setLastScanInfo(uiLastScan);
      setSiteRating(uiRating);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user?.id) {
        await saveSafeResult(
          user.id,
          normalizedUrl, // نخزن الفورمات النهائي النظيف
          res.domain,
          res.label, // safe | notsafe حسب القاعدة
          res.score,
          (res.reasons || []).join("; ")
        );

        // نحدّث الـ history محلياً بدون انتظار refresh من السيرفر
        const newRow = {
          id: Date.now(), // ID مؤقت محلي
          user_id: user.id,
          url: normalizedUrl,
          domain: res.domain,
          label: res.label,
          score: res.score,
          reasons: (res.reasons || []).join("; "),
          created_at: new Date().toISOString(),
        };
        setHistory((prev) => [newRow, ...prev]);
      }
    } catch (e) {
      console.log("handleCheck error:", e);
      Alert.alert("Scan failed", String(e.message || e));
    }
  };

  // ربط زر Report مع صفحة البلاغ ReportScam
  const handleReport = () => {
    if (!lastScanInfo || !lastScanInfo.url) {
      Alert.alert("No URL", "Please scan a website first.");
      return;
    }

    navigation.navigate("ReportScam", {
      selectedCategory: "web",
      url: lastScanInfo.url,
      description: "",
    });
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

      {/* Site Rating + Last Scan */}
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
          {"\u2022 "}
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

      {/* Last scanned domain card */}
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
                const scanUrl = lastScanInfo?.url;
                const toOpen =
                  scanUrl && scanUrl.startsWith("http")
                    ? scanUrl
                    : scanUrl
                    ? `https://${scanUrl}`
                    : null;

                onOpenLink(toOpen);
              }}
            >
              <Text style={styles.primaryBtnText}>
                {t("safe.openLink", "Open Link")}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryBtn}
              onPress={handleReport}
            >
              <Text style={styles.secondaryBtnText}>
                {t("safe.report", "Report")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Scan History */}
      {history.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            {t("safe.historyTitle", "Scan History")}
          </Text>

          {history.map((item, index) => (
            <View key={item.id ?? index} style={styles.historyRow}>
              <Text style={styles.historyDomain}>{item.domain}</Text>
              <Text
                style={[
                  styles.historyLabel,
                  item.label === "notsafe"
                    ? styles.historyDanger
                    : styles.historySafe,
                ]}
              >
                {item.label === "notsafe"
                  ? t("safe.history.phishing", "Phishing")
                  : t("safe.history.safe", "Safe")}
              </Text>
            </View>
          ))}

          {loadingHistory && (
            <Text style={styles.cardSub}>
              {t("safe.loadingHistory", "Loading history...")}
            </Text>
          )}
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

    historyRow: {
      flexDirection: isRTL ? "row-reverse" : "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 8,
    },
    historyDomain: {
      fontFamily: "Poppins-400",
      fontSize: 12,
      color: theme.colors.text,
      flex: 1,
      marginRight: isRTL ? 0 : 8,
      marginLeft: isRTL ? 8 : 0,
    },
    historyLabel: {
      fontFamily: "Poppins-600",
      fontSize: 12,
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 12,
      overflow: "hidden",
    },
    historySafe: {
      backgroundColor: COLORS.brightTiffany,
      color: "#fff",
    },
    historyDanger: {
      backgroundColor: COLORS.purple7,
      color: "#fff",
    },
  });
