// Screens/ScanURL.js
import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { COLORS } from "../util/colors";
import { useAppSettings } from "../src/context/AppSettingProvid";
import { useTranslation } from "react-i18next";
import supabase from "../supabase";

const API_BASE =
  process.env.EXPO_PUBLIC_URL_MODEL_API ??
  "https://url-scam-detector-api-production.up.railway.app";

// استدعاء مودل الذكاء الاصطناعي
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
    (inputUrl || "").replace(/^https?:\/\//, "").split("/")[0].toLowerCase();

  const prediction = (data.prediction || "").toLowerCase();
  const proba =
    data.probability_malicious ?? data.probability ?? data.score ?? null;

  // 1) risk ثلاثي للواجهة
  let risk = "safe";
  if (prediction === "malicious") {
    risk = "malicious";
  } else if (prediction === "suspicious") {
    risk = "suspicious";
  }

  // 2) label ثنائي للـ DB مع شرط الـ 80%
  let label = "safe"; // القيمة الافتراضية

  if (risk === "safe") {
    label = "safe";
  } else if (risk === "suspicious") {
    // إذا مشبوه لكن الاحتمال أقل من 80% نخزّنه كـ safe
    if (proba != null && proba < 0.8) {
      label = "safe";
    } else {
      label = "notsafe";
    }
  } else {
    // malicious
    label = "notsafe";
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
    risk,   // safe | suspicious | malicious (للـ UI)
    label,  // safe | notsafe (للـ جدول safe_scans)
    score: proba,
    reasons,
    raw: data,
  };
};


export default function ScanURLScreen({ navigation }) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null); // { domain, risk, label, score, reasons }

  const { theme, isRTL } = useAppSettings();
  const { t } = useTranslation();

  const styles = useMemo(() => createStyles(theme, isRTL), [theme, isRTL]);

  const handleScan = async () => {
    const input = (url || "").trim();
    if (!input) {
      Alert.alert(
        t("safe.invalidUrl", "Enter a valid URL to scan")
      );
      return;
    }

    try {
      setLoading(true);

      // 1) استدعاء المودل
      const res = await classifyUrlAI(input);
      setResult(res);

      // 2) الحصول على المستخدم الحالي
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // 3) حفظ النتيجة في جدول safe_scans
      if (user?.id) {
        const { error } = await supabase.from("safe_scans").insert([
          {
            user_id: user.id,
            url: input,
            domain: res.domain,
            label: res.label, // safe | notsafe
            score: res.score,
            reasons: (res.reasons || []).join("; "),
          },
        ]);

        if (error) {
          console.error("Supabase insert error (safe_scans):", error);
        }
      }
    } catch (e) {
      console.log("handleScan error:", e);
      Alert.alert("Scan failed", String(e.message || e));
    } finally {
      setLoading(false);
    }
  };

  const renderRiskBadge = () => {
    if (!result?.risk) {
      return (
        <Text style={styles.ratingPlaceholder}>
          {t("safe.notScannedShort", "—")}
        </Text>
      );
    }

    if (result.risk === "safe") {
      return (
        <Text style={[styles.rating, styles.safe]}>
          {t("safe.rating.safe", "Safe")}
        </Text>
      );
    }

    if (result.risk === "suspicious") {
      return (
        <Text style={[styles.rating, styles.suspicious]}>
          {t("safe.rating.suspicious", "Suspicious")}
        </Text>
      );
    }

    // malicious
    return (
      <Text style={[styles.rating, styles.danger]}>
        {t("safe.rating.danger", "Danger")}
      </Text>
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.purple1} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          {t("scan.title", "Scan URL")}
        </Text>

        <Image
          source={require("../assets/images/protection.png")}
          style={{ width: 24, height: 24 }}
          resizeMode="contain"
        />
      </View>

      {/* URL Input + Scan Button */}
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

        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={handleScan}
          disabled={loading}
        >
          <Text style={styles.primaryBtnText}>
            {loading
              ? t("safe.scanning", "Scanning...")
              : t("scan.scanNow", "Scan now")}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Result Card */}
      <View style={styles.cardRow}>
        <View style={styles.cardLeft}>
          <Text style={styles.cardTitle}>
            {t("scan.resultTitle", "Scan result")}
          </Text>

          <Text style={styles.cardSub}>
            {result?.domain
              ? `${t("safe.domain", "Domain")}: ${result.domain}`
              : t("safe.notScanned", "Not scanned yet")}
          </Text>

          {result?.score != null && (
            <Text style={styles.cardSub}>
              {t("scan.riskScore", "Risk score")}:{" "}
              {(result.score * 100).toFixed(1)}%
            </Text>
          )}

          {result?.reasons?.[0] && (
            <Text style={styles.cardSub}>
              {t("safe.reason", "Reason")}: {result.reasons[0]}
            </Text>
          )}
        </View>

        <View style={styles.cardRight}>{renderRiskBadge()}</View>
      </View>
    </ScrollView>
  );
}

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
      marginTop: 2,
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
    suspicious: { backgroundColor: COLORS.purple4 },
    danger: { backgroundColor: COLORS.purple7 },
  });
