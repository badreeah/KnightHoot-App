// SettingsScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Switch,
  Alert,
  StyleSheet as RNStyleSheet,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useAppSettings } from "../src/context/AppSettingProvid";
import { useTranslation } from "react-i18next";
import { COLORS } from "../util/colors";
import supabase from "../supabase";

export default function SettingsScreen() {
  const nav = useNavigation();
  const { theme, isRTL } = useAppSettings();
  const { t } = useTranslation();

  // تقدرِين تستخدمينهم لاحقاً لو رجعتي سويتشات أو إعدادات إضافية
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
            style={{
              fontSize: 12,
              marginTop: 2,
              color: theme.colors.subtext,
            }}
          >
            {sub}
          </Text>
        ) : null}
      </View>

      <View
        style={{
          marginLeft: isRTL ? 0 : 12,
          marginRight: isRTL ? 12 : 0,
        }}
      >
        {right}
      </View>
    </Pressable>
  );

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      Alert.alert(
        t("settings.errors.title"),
        t("settings.errors.logoutFail", { message: error.message })
      );
      return;
    }

    nav.reset({
      index: 0,
      routes: [{ name: "SignIn" }],
    });
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      t("settings.delete.title"),
      t("settings.delete.message"),
      [
        { text: t("settings.delete.cancel"), style: "cancel" },
        {
          text: t("settings.delete.confirm"),
          style: "destructive",
          onPress: async () => {
            try {
              const { data } = await supabase.auth.getUser();
              const user = data?.user;

              if (!user) {
                Alert.alert(
                  t("settings.errors.title"),
                  t("settings.errors.userNotFound")
                );
                return;
              }

              await supabase.from("profiles").delete().eq("id", user.id);
              await supabase.auth.signOut();

              nav.reset({
                index: 0,
                routes: [{ name: "SignIn" }],
              });
            } catch (err) {
              Alert.alert(
                t("settings.errors.title"),
                t("settings.errors.generic", { message: err.message })
              );
            }
          },
        },
      ]
    );
  };

  const handleContactSupport = () => {
    const subject = encodeURIComponent("KnightHoot Support");
    const body = encodeURIComponent("Hi KnightHoot team,\n\n");
    const email = "support@knighthoot.app"; // ايميل التواصل

    Linking.openURL(`mailto:${email}?subject=${subject}&body=${body}`).catch(
      () =>
        Alert.alert(
          t("settings.errors.title"),
          t("settings.errors.emailApp")
        )
    );
  };

  const handleRateApp = () => {
    const url = "https://knighthoot.app"; // رابط في حال نشرناه
    Linking.openURL(url).catch(() =>
      Alert.alert(
        t("settings.errors.title"),
        t("settings.errors.openLink")
      )
    );
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {/* Header */}
      <View
        style={[
          styles.header,
          { flexDirection: "row" },
        ]}
      >
        <Pressable onPress={() => nav.goBack()}>
          <Ionicons
            name={"arrow-back"}
            size={24}
            color={theme.colors.text}
          />
        </Pressable>

        <Text style={[styles.headerTitle, titleStyle]}>
          {t("settings.title")}
        </Text>

        <View style={{ width: 24 }} />
      </View>

     {/* Account & Security */}
<View style={[styles.card, cardStyle]}>
  <Text style={[styles.sectionTitle, titleStyle]}>
    {t("settings.accountSecurity")}
  </Text>

  <Row
    left={t("settings.changePassword")}
    right={<Ionicons name={arrow} size={18} color={theme.colors.subtext} />}
    onPress={() => nav.navigate("ChangePassword")}
  />

  <Row
    left={t("settings.changeEmail")}
    right={<Ionicons name={arrow} size={18} color={theme.colors.subtext} />}
    onPress={() => nav.navigate("ChangeEmail")}
  />

  {/* Browser Protection row */}
  <Row
  left={t("settings.BrowserProtection")}
  right={<Ionicons name={arrow} size={18} color={theme.colors.subtext} />}
  onPress={() => nav.navigate("BrowserProtection")}
/>
</View>

      {/* Account Actions */}
      <View style={[styles.card, cardStyle]}>
        <Text style={[styles.sectionTitle, titleStyle]}>
          {t("settings.accountActions")}
        </Text>

        <Row
          left={t("settings.logout")}
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
          left={t("settings.deleteAccount")}
          right={<Ionicons name="trash-outline" size={18} color="red" />}
          onPress={handleDeleteAccount}
        />
      </View>

      {/* About */}
      <View style={[styles.card, cardStyle]}>
        <Text style={[styles.sectionTitle, titleStyle]}>
          {t("settings.about")}
        </Text>

        <Row
          left={t("settings.privacy")}
          right={
            <Ionicons name={arrow} size={18} color={theme.colors.subtext} />
          }
          onPress={() => nav.navigate("Privacy")}
        />

        <Row
          left={t("settings.contactSupport")}
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
          left={t("settings.rateApp")}
          right={
            <Ionicons
              name="star-outline"
              size={18}
              color={theme.colors.subtext}
            />
          }
          onPress={handleRateApp}
        />

        <Row
          left={`${t("settings.versionLabel")} 1.0.0`}
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
