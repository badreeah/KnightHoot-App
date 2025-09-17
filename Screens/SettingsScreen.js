// screens/SettingsScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Switch,
  StyleSheet as RNStyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useAppSettings } from "../src/context/AppSettingProvid";
import { useTranslation } from "react-i18next";
import { COLORS } from "../util/colors";

export default function SettingsScreen() {
  const nav = useNavigation();
  const { theme, isRTL } = useAppSettings();
  const { t } = useTranslation();

  const [realTime, setRealTime] = useState(true);
  const [downloadProt, setDownloadProt] = useState(true);
  const [twoFA, setTwoFA] = useState(false);
  const [alertCalls, setAlertCalls] = useState(true);
  const [alertSMS, setAlertSMS] = useState(true);
  const [alertEmail, setAlertEmail] = useState(false);

  const arrow = isRTL ? "arrow-back" : "arrow-forward";

  const dividerColor =
    theme.mode === "dark" ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)";
  const cardBorder =
    theme.mode === "dark" ? "rgba(255,255,255,0.12)" : theme.colors.cardBorder;

  const cardStyle = {
    backgroundColor: theme.colors.card,
    borderColor: cardBorder,
  };
  const titleStyle = { color: theme.colors.text };
  const subStyle = { color: theme.colors.subtext };

  const Row = ({ left, sub, right, onPress }) => (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          paddingVertical: 12,
          alignItems: "center",
          justifyContent: "space-between",
          flexDirection: isRTL ? "row-reverse" : "row",
          borderBottomWidth: RNStyleSheet.hairlineWidth,
          borderBottomColor: dividerColor,
          opacity: pressed ? 0.85 : 1,
        },
      ]}
    >
      <View style={{ flex: 1 }}>
        <Text
          numberOfLines={1}
          style={{ fontSize: 16, fontWeight: "500", color: theme.colors.text }}
        >
          {left}
        </Text>
        {sub ? (
          <Text
            numberOfLines={2}
            style={{ fontSize: 12, marginTop: 2, color: theme.colors.subtext }}
          >
            {sub}
          </Text>
        ) : null}
      </View>
      <View
        style={{ marginLeft: isRTL ? 0 : 12, marginRight: isRTL ? 12 : 0 }}
      >
        {right}
      </View>
    </Pressable>
  );

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {/* Header */}
      <View
        style={[
          styles.header,
          { flexDirection: isRTL ? "row-reverse" : "row" },
        ]}
      >
        <Pressable onPress={() => nav.goBack()}>
          <Ionicons
            name={isRTL ? "arrow-forward" : "arrow-back"}
            size={24}
            color={theme.colors.text}
          />
        </Pressable>
        <Text style={[styles.headerTitle, titleStyle]}>
          {t("settings", "Settings")}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Protection */}
      <View style={[styles.card, cardStyle, { borderColor: cardBorder }]}>
        <Text style={[styles.sectionTitle, titleStyle]}>
          {t("protection", "Protection")}
        </Text>

        <Row
          left={t("realTime", "Real-time Protection")}
          sub={t("realTimeSub", "Scan URLs, calls, and SMS in the background")}
          right={
            <Switch
              value={realTime}
              onValueChange={setRealTime}
              trackColor={{
                false: theme.colors.cardBorder,
                true: COLORS.purple1,
              }}
              thumbColor={"#fff"}
            />
          }
        />

        <Row
          left={t("safeBrowsing", "Safe Browsing")}
          sub={t("safeBrowsingSub", "Check URLs before opening")}
          right={
            <Ionicons name={arrow} size={18} color={theme.colors.subtext} />
          }
          onPress={() => nav.navigate("SafeBrowsing")}
        />

        <Row
          left={t("downloadProt", "Download Protection")}
          sub={t("downloadProtSub", "Warn or block suspicious files")}
          right={
            <Switch
              value={downloadProt}
              onValueChange={setDownloadProt}
              trackColor={{
                false: theme.colors.cardBorder,
                true: COLORS.purple1,
              }}
              thumbColor={"#fff"}
            />
          }
        />
      </View>

      {/* Notifications */}
      <View style={[styles.card, cardStyle, { borderColor: cardBorder }]}>
        <Text style={[styles.sectionTitle, titleStyle]}>
          {t("notifications", "Notifications")}
        </Text>

        <Row
          left={t("callsAlert", "Calls Alerts")}
          right={
            <Switch
              value={alertCalls}
              onValueChange={setAlertCalls}
              trackColor={{
                false: theme.colors.cardBorder,
                true: COLORS.purple1,
              }}
              thumbColor={"#fff"}
            />
          }
        />
        <Row
          left={t("smsAlert", "SMS Alerts")}
          right={
            <Switch
              value={alertSMS}
              onValueChange={setAlertSMS}
              trackColor={{
                false: theme.colors.cardBorder,
                true: COLORS.purple1,
              }}
              thumbColor={"#fff"}
            />
          }
        />
        <Row
          left={t("emailAlert", "Email Alerts")}
          right={
            <Switch
              value={alertEmail}
              onValueChange={setAlertEmail}
              trackColor={{
                false: theme.colors.cardBorder,
                true: COLORS.purple1,
              }}
              thumbColor={"#fff"}
            />
          }
        />
        <Row
          left={t("quietHours", "Quiet Hours")}
          sub={t("quietHoursSub", "Silence alerts during selected time")}
          right={
            <Ionicons name={arrow} size={18} color={theme.colors.subtext} />
          }
          onPress={() => nav.navigate("QuietHours")}
        />
      </View>

      {/* Account & Security */}
      <View style={[styles.card, cardStyle, { borderColor: cardBorder }]}>
        <Text style={[styles.sectionTitle, titleStyle]}>
          {t("accountSecurity", "Account & Security")}
        </Text>

        <Row
          left={t("changePassword", "Change Password")}
          right={
            <Ionicons name={arrow} size={18} color={theme.colors.subtext} />
          }
          onPress={() => nav.navigate("ChangePassword")}
        />
        <Row
          left={t("twoFA", "Two-Factor Authentication")}
          right={
            <Switch
              value={twoFA}
              onValueChange={setTwoFA}
              trackColor={{
                false: theme.colors.cardBorder,
                true: COLORS.purple1,
              }}
              thumbColor={"#fff"}
            />
          }
        />
        <Row
          left={t("sessions", "Sessions / Devices")}
          right={
            <Ionicons name={arrow} size={18} color={theme.colors.subtext} />
          }
          onPress={() => nav.navigate("AddDevice")}
        />
        <Row
          left={t("exportDelete", "Export / Delete Data")}
          right={
            <Ionicons name={arrow} size={18} color={theme.colors.subtext} />
          }
          onPress={() => nav.navigate("DataCenter")}
        />
      </View>

      {/* Appearance & Language */}
      <View style={[styles.card, cardStyle, { borderColor: cardBorder }]}>
        <Text style={[styles.sectionTitle, titleStyle]}>
          {t("appearanceLang", "Appearance & Language")}
        </Text>

        <Row
          left={t("theme", "Theme")}
          sub={t("themeSub", "System / Light / Dark")}
          right={
            <Ionicons name={arrow} size={18} color={theme.colors.subtext} />
          }
          onPress={() => nav.navigate("ThemePicker")}
        />
        <Row
          left={t("language", "Language")}
          right={
            <Ionicons name={arrow} size={18} color={theme.colors.subtext} />
          }
          onPress={() => nav.navigate("LanguagePicker")}
        />
      </View>

      {/* About */}
      <View style={[styles.card, cardStyle, { borderColor: cardBorder }]}>
        <Text style={[styles.sectionTitle, titleStyle]}>
          {t("about", "About")}
        </Text>

        <Row
          left={t("privacy", "Privacy Policy")}
          right={
            <Ionicons name={arrow} size={18} color={theme.colors.subtext} />
          }
          onPress={() => nav.navigate("Privacy")}
        />
        <Row
          left={t("terms", "Terms of Use")}
          right={
            <Ionicons name={arrow} size={18} color={theme.colors.subtext} />
          }
          onPress={() => nav.navigate("Terms")}
        />
        <Row
          left={`${t("version", "Version")} 1.0.0`}
          right={
            <Ionicons
              name="information-circle-outline"
              size={18}
              color={theme.colors.subtext}
            />
          }
        />
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16 },
  header: {
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 50,
    paddingBottom: 20,
  },
  headerTitle: { fontSize: 20, fontWeight: "600" },
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  sectionTitle: { fontSize: 16, fontWeight: "600", marginBottom: 8 },
});
