<<<<<<< HEAD
// screens/SettingsScreen.js
=======
>>>>>>> main
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Switch,
<<<<<<< HEAD
  StyleSheet as RNStyleSheet,
=======
  Alert,
  StyleSheet as RNStyleSheet,
  Linking,
>>>>>>> main
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useAppSettings } from "../src/context/AppSettingProvid";
import { useTranslation } from "react-i18next";
import { COLORS } from "../util/colors";
<<<<<<< HEAD
=======
import supabase from "../supabase";
>>>>>>> main

export default function SettingsScreen() {
  const nav = useNavigation();
  const { theme, isRTL } = useAppSettings();
  const { t } = useTranslation();

<<<<<<< HEAD
=======
  // تقدرِين تستخدمينهم لاحقاً لو رجعتي سويتشات أو إعدادات إضافية
>>>>>>> main
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
<<<<<<< HEAD
  const subStyle = { color: theme.colors.subtext };
=======
>>>>>>> main

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
<<<<<<< HEAD
          numberOfLines={1}
=======
>>>>>>> main
          style={{ fontSize: 16, fontWeight: "500", color: theme.colors.text }}
        >
          {left}
        </Text>
<<<<<<< HEAD
        {sub ? (
          <Text
            numberOfLines={2}
            style={{ fontSize: 12, marginTop: 2, color: theme.colors.subtext }}
=======

        {sub ? (
          <Text
            numberOfLines={2}
            style={{
              fontSize: 12,
              marginTop: 2,
              color: theme.colors.subtext,
            }}
>>>>>>> main
          >
            {sub}
          </Text>
        ) : null}
      </View>
<<<<<<< HEAD
      <View
        style={{ marginLeft: isRTL ? 0 : 12, marginRight: isRTL ? 12 : 0 }}
=======

      <View
        style={{
          marginLeft: isRTL ? 0 : 12,
          marginRight: isRTL ? 12 : 0,
        }}
>>>>>>> main
      >
        {right}
      </View>
    </Pressable>
  );

<<<<<<< HEAD
=======
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      Alert.alert("Error", error.message);
      return;
    }

    nav.reset({
      index: 0,
      routes: [{ name: "SignIn" }],
    });
  };

  const handleDeleteAccount = async () => {
    Alert.alert("Delete Account", "Are you sure? This action is permanent.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            const { data } = await supabase.auth.getUser();
            const user = data?.user;

            if (!user) {
              Alert.alert("Error", "User not found");
              return;
            }

            await supabase.from("profiles").delete().eq("id", user.id);

            await supabase.auth.signOut();

            nav.reset({
              index: 0,
              routes: [{ name: "SignIn" }],
            });
          } catch (err) {
            Alert.alert("Error", err.message);
          }
        },
      },
    ]);
  };

  const handleContactSupport = () => {
    const subject = encodeURIComponent("KnightHoot Support");
    const body = encodeURIComponent("Hi KnightHoot team,\n\n");
    const email = "support@knighthoot.app"; // ايميل التواصل

    Linking.openURL(`mailto:${email}?subject=${subject}&body=${body}`).catch(
      () => Alert.alert("Error", "Unable to open email app.")
    );
  };

  const handleRateApp = () => {
    const url = "https://knighthoot.app"; // رابط في حال نشرناه
    Linking.openURL(url).catch(() =>
      Alert.alert("Error", "Unable to open the link.")
    );
  };

>>>>>>> main
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
<<<<<<< HEAD
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
=======

        <Text style={[styles.headerTitle, titleStyle]}>
          {t("settings", "Settings")}
        </Text>

        <View style={{ width: 24 }} />
      </View>

      {/* Account & Security */}
      <View style={[styles.card, cardStyle]}>
>>>>>>> main
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
<<<<<<< HEAD
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
=======

        <Row
          left={t("changeEmail", "Change Email")}
          right={
            <Ionicons name={arrow} size={18} color={theme.colors.subtext} />
          }
          onPress={() => nav.navigate("ChangeEmail")}
        />
      </View>

      {/* Account Actions */}
      <View style={[styles.card, cardStyle]}>
        <Text style={[styles.sectionTitle, titleStyle]}>
          {t("accountActions", "Account Actions")}
        </Text>

        <Row
          left={t("logout", "Log Out")}
          right={
            <Ionicons
              name="log-out-outline"
              size={18}
              color={theme.colors.subtext}
            />
          }
          onPress={handleLogout}
        />

        <Row
          left={t("deleteAccount", "Delete Account")}
          right={<Ionicons name="trash-outline" size={18} color="red" />}
          onPress={handleDeleteAccount}
>>>>>>> main
        />
      </View>

      {/* About */}
<<<<<<< HEAD
      <View style={[styles.card, cardStyle, { borderColor: cardBorder }]}>
=======
      <View style={[styles.card, cardStyle]}>
>>>>>>> main
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
<<<<<<< HEAD
        <Row
          left={t("terms", "Terms of Use")}
          right={
            <Ionicons name={arrow} size={18} color={theme.colors.subtext} />
          }
          onPress={() => nav.navigate("Terms")}
        />
=======

        <Row
          left={t("contactSupport", "Contact Support")}
          right={
            <Ionicons
              name="mail-outline"
              size={18}
              color={theme.colors.subtext}
            />
          }
          onPress={handleContactSupport}
        />

        <Row
          left={t("rateApp", "Rate KnightHoot")}
          right={
            <Ionicons
              name="star-outline"
              size={18}
              color={theme.colors.subtext}
            />
          }
          onPress={handleRateApp}
        />

>>>>>>> main
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
