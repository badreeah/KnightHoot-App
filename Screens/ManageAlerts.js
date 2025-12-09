// ManageAlerts.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../supabase";
import { useAppSettings } from "../src/context/AppSettingProvid";
import { useTranslation } from "react-i18next";

// Enable LayoutAnimation on Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const initialAlertsData = {
  sms: {
    uncertain: [],
    certain: [],
  },
  email: {
    uncertain: [],
    certain: [],
  },
};

const ManageAlertsScreen = ({ navigation }) => {
  const { theme } = useAppSettings();
  const styles = makeStyles(theme);
  const { t } = useTranslation();

  const [alertsData, setAlertsData] = useState(initialAlertsData);
  const [activeCardId, setActiveCardId] = useState(null);
  const [userId, setUserId] = useState(null);

  // دالة التاريخ النسبي (مترجمة)
  const getRelativeDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return t("manageAlerts.time.today");
    if (diffDays === 1) return t("manageAlerts.time.yesterday");
    if (diffDays < 7) return t("manageAlerts.time.days", { count: diffDays });

    if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return t("manageAlerts.time.weeks", { count: weeks });
    }

    const months = Math.floor(diffDays / 30);
    return t("manageAlerts.time.months", { count: months });
  };

  // Fetch SMS scans
  const fetchSMSScans = async () => {
    try {
      const { data: scans, error } = await supabase
        .from("sms_scans")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;

      const uncertain = [];
      const certain = [];

      scans?.forEach((scan) => {
        const isSpam = scan.classification_response?.toLowerCase() === "spam";
        const confidence = scan.confidence_score || 0;

        const timeStr = new Date(scan.created_at).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        });

        const alert = {
          id: scan.id,
          title: isSpam
            ? t("manageAlerts.titles.suspiciousSms")
            : t("manageAlerts.titles.smsScanned"),
          from: scan.sender_id || t("manageAlerts.sms.unknownSender"),
          description:
            (scan.message_content?.substring(0, 100) || "") +
            (scan.message_content?.length > 100 ? "..." : ""),
          action: isSpam
            ? t("manageAlerts.sms.senderBlocked")
            : t("manageAlerts.sms.safe"),
          time: t("manageAlerts.sms.detectedAt", { time: timeStr }),
          date: getRelativeDate(scan.created_at),
          iconColor: isSpam ? "#FE6D72" : "#FDFEBB",
          confidence,
          reported: false,
          restored: false,
          raw_data: scan,
        };

        if (isSpam && confidence > 0.7) {
          certain.push(alert);
        } else {
          uncertain.push(alert);
        }
      });

      setAlertsData((prev) => ({
        ...prev,
        sms: { uncertain, certain },
      }));
    } catch (err) {
      console.error("Error fetching SMS scans:", err);
      Alert.alert(
        t("manageAlerts.alerts.errorTitle"),
        t("manageAlerts.alerts.fetchSmsError")
      );
    }
  };

  // Fetch Email scans
  const fetchEmailScans = async (userId) => {
    try {
      const { data: scans, error } = await supabase
        .from("email_scans")
        .select("*")
        .eq("user_id", userId)
        .order("scanned_at", { ascending: false })
        .limit(20);

      if (error) throw error;

      const emailAlerts = { uncertain: [], certain: [] };

      scans.forEach((scan) => {
        const alert = {
          id: `email-${scan.id}`,
          title: scan.is_scam
            ? t("manageAlerts.titles.suspiciousEmail")
            : t("manageAlerts.titles.emailScanned"),
          from: scan.from_address,
          description:
            scan.subject + (scan.snippet ? ` - ${scan.snippet}` : ""),
          action: scan.is_scam
            ? t("manageAlerts.email.flagged")
            : t("manageAlerts.email.safe"),
          time: new Date(scan.scanned_at).toLocaleTimeString(),
          date: new Date(scan.scanned_at).toLocaleDateString(),
          iconColor: scan.is_scam ? theme.badges.danger : theme.badges.safe,
          reported: false,
          restored: false,
        };

        if (scan.is_scam) emailAlerts.certain.push(alert);
        else emailAlerts.uncertain.push(alert);
      });

      setAlertsData((prev) => ({ ...prev, email: emailAlerts }));
    } catch (err) {
      console.error("Error fetching email scans:", err);
    }
  };

  // Get user and fetch data
  useEffect(() => {
    const getUserAndFetch = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        await fetchSMSScans();
        await fetchEmailScans(user.id);
      } else {
        await fetchSMSScans();
      }
    };
    getUserAndFetch();
  }, []);

  // Real-time updates
  useEffect(() => {
    if (!userId) return;

    const smsChannel = supabase
      .channel("sms_scans_changes")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "sms_scans" },
        fetchSMSScans
      )
      .subscribe();

    const emailChannel = supabase
      .channel("email_scans_changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "email_scans",
          filter: `user_id=eq.${userId}`,
        },
        () => fetchEmailScans(userId)
      )
      .subscribe();

    return () => {
      supabase.removeChannel(smsChannel);
      supabase.removeChannel(emailChannel);
    };
  }, [userId]);

  // Expand/Collapse card
  const toggleExpand = (id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setActiveCardId(activeCardId === id ? null : id);
  };

  // Report alert
  const reportAlert = async (type, id) => {
    const [channel, subType] = type.split("-");
    const alert = alertsData[channel][subType].find((a) => a.id === id);
    if (!alert) return;

    // ملاحظة: النص الداخلي في الوصف تركناه إنجليزي كما هو
    // حتى لا تتأثر مطابقة السجلات في قاعدة البيانات.
    const description =
      channel === "email"
        ? `Email: ${alert.from}\nSubject: ${
            alert.description.split(" - ")[0]
          }\nDescription: ${alert.description
            .split(" - ")
            .slice(1)
            .join(" - ")}`
        : `From: ${alert.from}\nMessage: ${alert.description}\nConfidence: ${(
            alert.confidence * 100 || 0
          ).toFixed(1)}%`;

    try {
      const { error } = await supabase
        .from("scam_reports")
        .insert([{ user_id: userId, scam_type: channel, description }]);
      if (error) throw error;

      setAlertsData((prev) => ({
        ...prev,
        [channel]: {
          ...prev[channel],
          [subType]: prev[channel][subType].map((a) =>
            a.id === id ? { ...a, reported: true, restored: false } : a
          ),
        },
      }));
      Alert.alert(
        t("manageAlerts.alerts.successTitle"),
        t("manageAlerts.alerts.reportSuccess", {
          channel: channel.toUpperCase(),
        })
      );
    } catch (err) {
      console.error("Error reporting alert:", err);
      Alert.alert(
        t("manageAlerts.alerts.errorTitle"),
        t("manageAlerts.alerts.reportError")
      );
    }
  };

  // Unreport alert
  const unreportAlert = async (type, id) => {
    const [channel, subType] = type.split("-");
    const alert = alertsData[channel][subType].find((a) => a.id === id);
    if (!alert) return;

    const description =
      channel === "email"
        ? `Email: ${alert.from}\nSubject: ${
            alert.description.split(" - ")[0]
          }\nDescription: ${alert.description
            .split(" - ")
            .slice(1)
            .join(" - ")}`
        : `From: ${alert.from}\nMessage: ${alert.description}\nConfidence: ${(
            alert.confidence * 100 || 0
          ).toFixed(1)}%`;

    try {
      const { error } = await supabase
        .from("scam_reports")
        .update({ status: "dismissed_by_user" })
        .eq("user_id", userId)
        .eq("scam_type", channel)
        .eq("description", description);

      if (error) throw error;

      setAlertsData((prev) => ({
        ...prev,
        [channel]: {
          ...prev[channel],
          [subType]: prev[channel][subType].map((a) =>
            a.id === id ? { ...a, reported: false } : a
          ),
        },
      }));
      Alert.alert(
        t("manageAlerts.alerts.successTitle"),
        t("manageAlerts.alerts.unreportSuccess", {
          channel: channel.toUpperCase(),
        })
      );
    } catch (err) {
      console.error("Error unreporting alert:", err);
      Alert.alert(
        t("manageAlerts.alerts.errorTitle"),
        t("manageAlerts.alerts.unreportError")
      );
    }
  };

  // Restore alert
  const restoreAlert = (type, id) => {
    const [channel, subType] = type.split("-");
    setAlertsData((prev) => ({
      ...prev,
      [channel]: {
        ...prev[channel],
        [subType]: prev[channel][subType].filter((a) => a.id !== id),
      },
    }));
    Alert.alert(
      t("manageAlerts.alerts.successTitle"),
      t("manageAlerts.alerts.restoreSuccess")
    );
  };

  const renderAlertCard = (alert, type) => {
    const isActive = activeCardId === alert.id;
    return (
      <TouchableOpacity
        key={alert.id}
        activeOpacity={0.8}
        onPress={() => toggleExpand(alert.id)}
        style={[
          styles.alertCard,
          isActive && styles.alertCardActive,
          alert.reported && styles.alertReported,
          alert.restored && styles.alertRestored,
        ]}
      >
        <View
          style={[styles.alertIcon, { backgroundColor: alert.iconColor }]}
        />
        <View style={styles.alertContent}>
          <Text style={styles.alertTitle}>{alert.title}</Text>
          <View style={styles.divider} />
          <Text style={styles.alertText}>
            <Text style={styles.alertLabel}>
              {t("manageAlerts.labels.from")}:
            </Text>{" "}
            {alert.from}
          </Text>
          <Text style={styles.alertText}>
            <Text style={styles.alertLabel}>
              {t("manageAlerts.labels.description")}:
            </Text>{" "}
            {alert.description}
          </Text>

          {isActive && (
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[
                  styles.reportButton,
                  { backgroundColor: theme.badges.danger },
                ]}
                onPress={() =>
                  alert.reported
                    ? unreportAlert(type, alert.id)
                    : reportAlert(type, alert.id)
                }
              >
                <Ionicons
                  name="alert-circle-outline"
                  size={18}
                  color={theme.colors.primaryTextOn}
                  style={{ marginRight: 6 }}
                />
                <Text
                  style={[
                    styles.reportButtonText,
                    { color: theme.colors.primaryTextOn },
                  ]}
                >
                  {alert.reported
                    ? t("manageAlerts.actions.unreport")
                    : t("manageAlerts.actions.report")}
                </Text>
              </TouchableOpacity>

              {!(type.startsWith("email") && alert.reported) && (
                <TouchableOpacity
                  style={[
                    styles.restoreButton,
                    { backgroundColor: theme.badges.safe },
                  ]}
                  onPress={() => restoreAlert(type, alert.id)}
                >
                  <Ionicons
                    name="refresh-outline"
                    size={18}
                    color={theme.colors.primaryTextOn}
                    style={{ marginRight: 6 }}
                  />
                  <Text
                    style={[
                      styles.restoreButtonText,
                      { color: theme.colors.primaryTextOn },
                    ]}
                  >
                    {t("manageAlerts.actions.restore")}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.mainContainer}>
      <ScrollView style={styles.container}>
        {Object.keys(alertsData).map((channel) => (
          <View key={channel}>
            <Text style={styles.channelTitle}>
              {channel === "sms"
                ? t("manageAlerts.headers.sms")
                : t("manageAlerts.headers.email")}
            </Text>
            {["uncertain", "certain"].map((type) => (
              <View key={`${channel}-${type}`} style={styles.section}>
                <Text style={styles.sectionTitle}>
                  {channel === "sms"
                    ? type === "uncertain"
                      ? t("manageAlerts.sections.sms.uncertain")
                      : t("manageAlerts.sections.sms.certain")
                    : type === "uncertain"
                    ? t("manageAlerts.sections.email.uncertain")
                    : t("manageAlerts.sections.email.certain")}
                </Text>
                {alertsData[channel][type].length === 0 ? (
                  <Text style={styles.placeholderText}>
                    {channel === "sms"
                      ? type === "uncertain"
                        ? t("manageAlerts.empty.sms.uncertain")
                        : t("manageAlerts.empty.sms.certain")
                      : type === "uncertain"
                      ? t("manageAlerts.empty.email.uncertain")
                      : t("manageAlerts.empty.email.certain")}
                  </Text>
                ) : (
                  alertsData[channel][type].map((alert) =>
                    renderAlertCard(alert, `${channel}-${type}`)
                  )
                )}
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const makeStyles = (theme) =>
  StyleSheet.create({
    mainContainer: { flex: 1, backgroundColor: theme.colors.background },
    container: { flex: 1, paddingHorizontal: 20, paddingTop: 40 },
    channelTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.colors.tint,
      marginTop: 20,
      marginBottom: 10,
    },
    section: { marginBottom: 20 },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.colors.text,
      marginBottom: 10,
    },
    alertCard: {
      flexDirection: "row",
      backgroundColor: theme.colors.card,
      borderRadius: 16,
      padding: 16,
      marginBottom: 15,
      borderWidth: 1,
      borderColor: theme.colors.cardBorder,
    },
    alertCardActive: { borderColor: theme.colors.primary },
    alertReported: { opacity: 0.7 },
    alertRestored: { opacity: 0.7 },
    alertIcon: { width: 24, height: 24, borderRadius: 8, marginRight: 15 },
    alertContent: { flex: 1 },
    alertTitle: {
      fontSize: 16,
      fontWeight: "bold",
      marginBottom: 5,
      color: theme.colors.text,
    },
    divider: {
      height: 1,
      backgroundColor: theme.colors.cardBorder,
      marginVertical: 8,
    },
    alertText: { fontSize: 13, color: theme.colors.subtext },
    alertLabel: { fontWeight: "bold", color: theme.colors.text },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "flex-end",
      marginTop: 15,
    },
    reportButton: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 8,
      marginRight: 10,
    },
    reportButtonText: { fontWeight: "bold" },
    restoreButton: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 8,
    },
    restoreButtonText: { fontWeight: "bold" },
    placeholderText: {
      fontSize: 16,
      fontStyle: "italic",
      color: theme.colors.subtext,
      textAlign: "center",
    },
  });

export default ManageAlertsScreen;
