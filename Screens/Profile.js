// Screens/Profile.js
import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Switch,
  Image,
  Alert,
  Modal,
  TextInput,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../util/colors";
import { useTranslation } from "react-i18next";
import { useAppSettings } from "../src/context/AppSettingProvid";
import supabase from "../supabase";
import { getAvatar } from "../util/avatar";
import { ensureProfile, getMyProfile } from "../src/api/profile";

export default function Profile() {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const {
    theme,
    isRTL,
    language,
    setLanguage,
    setThemeMode,
    profile,
    user,
  } = useAppSettings();

  const [userData, setUserData] = useState({
  firstName: "Name",
  lastName: "",
  username: "",
  email: "",
  gender: "",
});

  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [appPasswordString, setAppPasswordString] = useState("");
  const [connecting, setConnecting] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [connectedEmail, setConnectedEmail] = useState(null);
  const [disconnecting, setDisconnecting] = useState(false);

 useFocusEffect(
  useCallback(() => {
    const loadProfile = async () => {
      try {
        await ensureProfile();
        const p = await getMyProfile();

        setUserData({
          firstName: p.first_name ?? "Name",
          lastName: p.last_name ?? "",
          username: p.username ?? "",
          email: p.email ?? user?.email ?? "",
          gender: p.gender ?? user?.user_metadata?.gender ?? "",
        });
      } catch (e) {
        console.log("Failed to load profile in Profile screen:", e);
      }
    };

    loadProfile();
  }, [user])
);

  // التحقق من ربط الإيميل
  useEffect(() => {
    const checkEmailConnection = async () => {
      try {
        const { data: auth } = await supabase.auth.getUser();
        if (auth?.user) {
          const { data, error } = await supabase
            .from("email_accounts")
            .select("email_address")
            .eq("user_id", auth.user.id)
            .eq("status", "connected")
            .single();

          if (data && !error) {
            setConnectedEmail(data.email_address);
          } else {
            setConnectedEmail(null);
          }
        }
      } catch (error) {
        console.error("Error checking email connection:", error);
        setConnectedEmail(null);
      }
    };

    checkEmailConnection();
  }, []);

  // ثيم
  const themeStyles = useMemo(
    () => ({
      backgroundColor: theme.colors.background,
      textColor: theme.colors.text,
      cardBackground: theme.colors.card,
      borderColor: theme.colors.cardBorder,
      inputBackground: theme.mode === "dark" ? "#161b25" : "#fff",
      profileBackground: theme.mode === "dark" ? theme.colors.card : "#797EF6",
      profileText: theme.colors.text,
      profileUsername:
        theme.mode === "dark" ? theme.colors.subtext : "#b8b8b8ff",
    }),
    [theme]
  );

  const styles = createStyles(theme, themeStyles, isRTL);

  const effectiveGender =
  userData.gender || profile?.gender || user?.user_metadata?.gender || null;

const avatarSrc = useMemo(() => getAvatar(effectiveGender), [effectiveGender]);

  const handleDisconnectEmail = async () => {
    if (!connectedEmail) return;
    setDisconnecting(true);
    try {
      const { error } = await supabase.functions.invoke("unlink-email", {
        body: { email: connectedEmail },
      });
      if (error) throw error;
      alert("Email disconnected successfully!");
      setConnectedEmail(null);
    } catch (error) {
      alert("Failed to disconnect email: " + error.message);
    } finally {
      setDisconnecting(false);
    }
  };

  const renderLanguageModal = () => (
    <Modal visible={showLanguageModal} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View
          style={[
            styles.modalContent,
            { backgroundColor: themeStyles.cardBackground },
          ]}
        >
          <Text style={[styles.modalTitle, { color: themeStyles.textColor }]}>
            {t("selectLanguage")}
          </Text>

          <Pressable
            style={styles.option}
            onPress={() => {
              setLanguage("en");
              setShowLanguageModal(false);
            }}
          >
            <Text style={[styles.optionText, { color: themeStyles.textColor }]}>
              {t("english")}
            </Text>
          </Pressable>

          <Pressable
            style={styles.option}
            onPress={() => {
              setLanguage("ar");
              setShowLanguageModal(false);
            }}
          >
            <Text style={[styles.optionText, { color: themeStyles.textColor }]}>
              {t("arabic")}
            </Text>
          </Pressable>

          <Pressable
            style={styles.closeButton}
            onPress={() => setShowLanguageModal(false)}
          >
            <Text style={styles.closeButtonText}>{t("close")}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );

  const renderEmailModal = () => (
    <Modal visible={showEmailModal} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View
          style={[
            styles.modalContent,
            { backgroundColor: themeStyles.cardBackground },
          ]}
        >
          <Text style={[styles.modalTitle, { color: themeStyles.textColor }]}>
            Connect Email for Scanning
          </Text>

          <Text style={[styles.formLabel, { color: themeStyles.textColor }]}>
            Email Address
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: themeStyles.inputBackground,
                color: themeStyles.textColor,
              },
            ]}
            value={emailInput}
            onChangeText={setEmailInput}
            placeholder="Enter your email"
            placeholderTextColor={theme.colors.subtext}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={[styles.formLabel, { color: themeStyles.textColor }]}>
            App Password
          </Text>
          <TextInput
            style={[
              styles.singleInput,
              {
                backgroundColor: themeStyles.inputBackground,
                color: themeStyles.textColor,
                borderColor:
                  appPasswordString.length === 16
                    ? "#4CAF50"
                    : appPasswordString.length > 0
                    ? COLORS.purple1
                    : theme.colors.cardBorder,
              },
            ]}
            value={appPasswordString}
            onChangeText={(text) => {
              const cleanText = text.replace(/\s+/g, "").toLowerCase().slice(0, 16);
              setAppPasswordString(cleanText);
              setPasswordError("");
            }}
            placeholder="Enter 16-character app password"
            placeholderTextColor={theme.colors.subtext}
            keyboardType="default"
            autoCapitalize="none"
            secureTextEntry
            maxLength={16}
          />

          {passwordError ? (
            <Text style={[styles.errorText, { color: "#F44336" }]}>
              {passwordError}
            </Text>
          ) : null}

          <View style={styles.buttonRow}>
            <Pressable
              style={[styles.cancelButton, { flex: 1 }]}
              onPress={() => {
                setShowEmailModal(false);
                setEmailInput("");
                setAppPasswordString("");
                setPasswordError("");
              }}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </Pressable>
            <Pressable
              style={[
                styles.saveButton,
                { flex: 1 },
                connecting && { opacity: 0.5 },
                appPasswordString.length === 16 &&
                  !connecting && {
                    backgroundColor: "#4CAF50",
                    shadowColor: "#4CAF50",
                  },
              ]}
              onPress={async () => {
                const appPassword = appPasswordString;

                if (!emailInput.trim()) {
                  setPasswordError("Please enter your email address");
                  return;
                }
                if (appPassword.length !== 16) {
                  setPasswordError(
                    "Please enter exactly 16 characters for your app password"
                  );
                  return;
                }

                setConnecting(true);
                setPasswordError("");
                try {
                  const { error } = await supabase.functions.invoke(
                    "register-email",
                    {
                      body: { email: emailInput.trim(), appPassword },
                    }
                  );
                  if (error) throw error;

                  alert("Email connected successfully!");
                  setConnectedEmail(emailInput.trim());
                  setShowEmailModal(false);
                  setEmailInput("");
                  setAppPasswordString("");
                } catch (error) {
                  setPasswordError("Failed to connect email: " + error.message);
                } finally {
                  setConnecting(false);
                }
              }}
              disabled={connecting}
            >
              <Text style={styles.saveButtonText}>
                {connecting ? "Connecting..." : "Connect"}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <View
      style={[styles.container, { backgroundColor: themeStyles.backgroundColor }]}
    >
      <ScrollView
        style={[styles.container, { backgroundColor: themeStyles.backgroundColor }]}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.purple1} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: themeStyles.textColor }]}>
            {t("Profile")}
          </Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Profile Section */}
        <View
          style={[
            styles.profileSection,
            {
              backgroundColor: themeStyles.profileBackground,
              borderColor: themeStyles.borderColor,
            },
          ]}
        >
          <Image source={avatarSrc} style={styles.profileImage} />

          <View style={styles.profileInfo}>
            <Text
              style={[
                styles.profileName,
                {
                  color: themeStyles.profileText,
                  textAlign: isRTL ? "right" : "left",
                },
              ]}
            >
              {userData.firstName} {userData.lastName}
            </Text>

            {!!userData.username && (
              <Text
                style={[
                  styles.profileUsername,
                  {
                    color: themeStyles.profileUsername,
                    textAlign: isRTL ? "right" : "left",
                  },
                ]}
              >
                {userData.username}
              </Text>
            )}

            {!!userData.email && (
              <Text
                style={[
                  styles.profileUsername,
                  {
                    color: themeStyles.profileUsername,
                    textAlign: isRTL ? "right" : "left",
                  },
                ]}
              >
                {userData.email}
              </Text>
            )}
          </View>
        </View>

        <View
          style={[styles.divider, { backgroundColor: themeStyles.borderColor }]}
        />

        {/* Settings Card */}
        <View
          style={[
            styles.settingsContainer,
            {
              backgroundColor: themeStyles.cardBackground,
              borderColor: themeStyles.borderColor,
            },
          ]}
        >
          {/* My Account → تذهب إلى EditProfile */}
          <Pressable
            style={styles.settingItem}
            onPress={() => navigation.navigate("EditProfile")}
          >
            <View style={styles.settingInfo}>
              <Image
                source={require("../assets/icons/account.png")}
                style={{ width: 58, height: 58 }}
              />
              <View style={styles.settingTextContainer}>
                <Text
                  style={[styles.settingTitle, { color: themeStyles.textColor }]}
                >
                  {t("Account")}
                </Text>
                <Text
                  style={[
                    styles.settingDescription,
                    { color: theme.colors.subtext },
                  ]}
                >
                  {t("Edit account")}
                </Text>
              </View>
            </View>
            <Ionicons
              name={isRTL ? "arrow-back" : "arrow-forward"}
              size={20}
              color={theme.colors.subtext}
            />
          </Pressable>

          {/* Language */}
          <Pressable
            style={styles.settingItem}
            onPress={() => setShowLanguageModal(true)}
          >
            <View style={styles.settingInfo}>
              <Image
                source={require("../assets/icons/language.png")}
                style={{ width: 58, height: 58 }}
              />
              <View style={styles.settingTextContainer}>
                <Text
                  style={[styles.settingTitle, { color: themeStyles.textColor }]}
                >
                  {t("Language")}
                </Text>
                <Text
                  style={[
                    styles.settingDescription,
                    { color: theme.colors.subtext },
                  ]}
                >
                  {t("language")}
                </Text>
              </View>
            </View>
            <Ionicons
              name={isRTL ? "arrow-back" : "arrow-forward"}
              size={20}
              color={theme.colors.subtext}
            />
          </Pressable>

          {/* Dark Mode */}
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Image
                source={require("../assets/icons/dark-mode.png")}
                style={{ width: 58, height: 58 }}
              />
              <View style={styles.settingTextContainer}>
                <Text
                  style={[styles.settingTitle, { color: themeStyles.textColor }]}
                >
                  {t("Dark Mode")}
                </Text>
                <Text
                  style={[
                    styles.settingDescription,
                    { color: theme.colors.subtext },
                  ]}
                >
                  {t("darkMode")}
                </Text>
              </View>
            </View>
            <Switch
              value={theme.mode === "dark"}
              onValueChange={(val) => setThemeMode(val ? "dark" : "light")}
              trackColor={{ false: COLORS.gray1, true: COLORS.purple1 }}
              thumbColor={theme.mode === "dark" ? COLORS.purple1 : "#ffffff"}
            />
          </View>

          {/* Settings */}
          <Pressable
            style={styles.settingItem}
            onPress={() => navigation.navigate("Settings")}
          >
            <View style={styles.settingInfo}>
              <Image
                source={require("../assets/icons/settings.png")}
                style={{ width: 58, height: 58 }}
              />
              <View style={styles.settingTextContainer}>
                <Text
                  style={[styles.settingTitle, { color: themeStyles.textColor }]}
                >
                  {t("settings")}
                </Text>
                <Text
                  style={[
                    styles.settingDescription,
                    { color: theme.colors.subtext },
                  ]}
                >
                  {t("settings")}
                </Text>
              </View>
            </View>
            <Ionicons
              name={isRTL ? "arrow-back" : "arrow-forward"}
              size={20}
              color={theme.colors.subtext}
            />
          </Pressable>

          {/* Email Scanning */}
          <Pressable
            style={styles.settingItem}
            onPress={() => {
              if (connectedEmail) {
                Alert.alert(
                  "Disconnect Email",
                  `Disconnect ${connectedEmail} from scam scanning?`,
                  [
                    { text: "Cancel", style: "cancel" },
                    {
                      text: "Disconnect",
                      style: "destructive",
                      onPress: handleDisconnectEmail,
                    },
                  ]
                );
              } else {
                setShowEmailModal(true);
              }
            }}
          >
            <View style={styles.settingInfo}>
              <Image
                source={require("../assets/icons/Email.png")}
                style={styles.emailIconAligned}
              />
              <View style={styles.settingTextContainer}>
                <Text
                  style={[styles.settingTitle, { color: themeStyles.textColor }]}
                >
                  {connectedEmail ? "Email" : "Email Scanning"}
                </Text>
                <Text
                  style={[
                    styles.settingDescription,
                    { color: theme.colors.subtext },
                  ]}
                >
                  {connectedEmail
                    ? "connected for scanning"
                    : "connect your email to scan"}
                </Text>
              </View>
            </View>
            <Ionicons
              name={
                connectedEmail
                  ? "checkmark-circle"
                  : isRTL
                  ? "arrow-back"
                  : "arrow-forward"
              }
              size={20}
              color={connectedEmail ? "#4CAF50" : theme.colors.subtext}
            />
          </Pressable>

          {/* Privacy → تذهب إلى PrivacyScreen */}
          <Pressable
            style={styles.settingItem}
            onPress={() => navigation.navigate("Privacy")}
          >
            <View style={styles.settingInfo}>
              <Image
                source={require("../assets/icons/privacy.png")}
                style={{ width: 58, height: 58 }}
              />
              <View style={styles.settingTextContainer}>
                <Text
                  style={[styles.settingTitle, { color: themeStyles.textColor }]}
                >
                  {t("Privacy")}
                </Text>
                <Text
                  style={[
                    styles.settingDescription,
                    { color: theme.colors.subtext },
                  ]}
                >
                  {t("Review privacy")}
                </Text>
              </View>
            </View>
            <Ionicons
              name={isRTL ? "arrow-back" : "arrow-forward"}
              size={20}
              color={theme.colors.subtext}
            />
          </Pressable>
        </View>

        <View
          style={[styles.divider, { backgroundColor: themeStyles.borderColor }]}
        />

        <View
          style={[
            styles.settingsContainer,
            {
              backgroundColor: themeStyles.cardBackground,
              borderColor: themeStyles.borderColor,
            },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: themeStyles.textColor }]}>
            More
          </Text>
        </View>
      </ScrollView>

      {renderLanguageModal()}
      {renderEmailModal()}
    </View>
  );
}

const createStyles = (theme, themeStyles, isRTL) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      paddingHorizontal: 10,
    },
    header: {
      flexDirection: isRTL ? "row-reverse" : "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingTop: 50,
      paddingBottom: 30,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: "600",
      color: theme.colors.text,
    },
    profileSection: {
      borderRadius: 24,
      padding: 40,
      marginBottom: 16,
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      shadowColor: "#797EF6",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
      borderWidth: 1,
      borderColor: theme.colors.cardBorder,
    },
    profileImage: {
      width: 90,
      height: 90,
      borderRadius: 39,
      marginRight: isRTL ? 0 : 12,
      marginLeft: isRTL ? 12 : 0,
      backgroundColor: "#fff",
    },
    profileInfo: { flex: 1 },
    profileName: {
      fontSize: 16,
      fontWeight: "700",
      marginBottom: 2,
      color: theme.colors.text,
    },
    profileUsername: { fontSize: 13, color: theme.colors.subtext },
    divider: {
      height: 1,
      marginVertical: 16,
      backgroundColor: theme.colors.cardBorder,
    },

    settingsContainer: {
      borderRadius: 16,
      padding: 24,
      marginBottom: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
      borderWidth: 1,
      borderColor: theme.colors.cardBorder,
      textAlign: isRTL ? "right" : "left",
      writingDirection: isRTL ? "rtl" : "ltr",
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "500",
      marginBottom: 16,
      color: theme.colors.text,
    },
    settingItem: {
      flexDirection: isRTL ? "row-reverse" : "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 12,
    },
    settingInfo: {
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      flex: 1,
      gap: 12,
    },
    settingTextContainer: { flex: 1 },
    settingTitle: {
      fontSize: 18,
      fontWeight: "500",
      marginBottom: 4,
      paddingHorizontal: 16,
      color: theme.colors.text,
      textAlign: isRTL ? "right" : "left",
      writingDirection: isRTL ? "rtl" : "ltr",
    },
    settingDescription: {
      fontSize: 14,
      paddingHorizontal: 16,
      color: theme.colors.subtext,
      textAlign: isRTL ? "right" : "left",
      writingDirection: isRTL ? "rtl" : "ltr",
    },

    formLabel: {
      fontSize: 16,
      fontWeight: "600",
      marginBottom: 8,
      marginTop: 16,
      textAlign: isRTL ? "right" : "left",
      color: theme.colors.text,
    },
    input: {
      borderWidth: 2,
      borderColor: COLORS.purple2,
      borderRadius: 16,
      padding: 16,
      fontSize: 18,
      color: theme.colors.text,
      backgroundColor: themeStyles.inputBackground,
      textAlign: isRTL ? "right" : "left",
      writingDirection: isRTL ? "rtl" : "ltr",
    },
    singleInput: {
      borderWidth: 2,
      borderRadius: 12,
      padding: 16,
      fontSize: 18,
      textAlign: isRTL ? "right" : "left",
      minHeight: 50,
    },
    errorText: {
      fontSize: 14,
      textAlign: "center",
      marginTop: 8,
      fontWeight: "500",
    },

    buttonRow: {
      flexDirection: isRTL ? "row-reverse" : "row",
      justifyContent: "space-between",
      marginTop: 24,
    },
    cancelButton: {
      flex: 1,
      borderWidth: 2,
      borderColor: COLORS.purple2,
      paddingVertical: 16,
      borderRadius: 16,
      marginRight: isRTL ? 0 : 8,
      marginLeft: isRTL ? 8 : 0,
      alignItems: "center",
      backgroundColor: theme.colors.card,
    },
    cancelButtonText: {
      fontWeight: "500",
      fontSize: 16,
      color: theme.colors.text,
    },
    saveButton: {
      flex: 1,
      paddingVertical: 16,
      borderRadius: 16,
      marginLeft: isRTL ? 0 : 8,
      marginRight: isRTL ? 8 : 0,
      alignItems: "center",
      backgroundColor: theme.colors.primary,
    },
    saveButtonText: {
      color: theme.colors.primaryTextOn,
      fontWeight: "500",
      fontSize: 16,
    },

    modalContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.25)",
    },
    modalContent: {
      borderRadius: 16,
      padding: 24,
      width: "86%",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.cardBorder,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: "600",
      marginBottom: 16,
      textAlign: "center",
      color: theme.colors.text,
    },

    option: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.cardBorder,
    },
    optionText: {
      fontSize: 16,
      textAlign: isRTL ? "right" : "left",
      color: theme.colors.text,
    },
    closeButton: { marginTop: 16, padding: 16, alignItems: "center" },
    closeButtonText: {
      fontSize: 16,
      fontWeight: "500",
      color: theme.colors.primary,
    },

    privacyContent: { padding: 20 },

    emailIconAligned: {
      width: 50,
      height: 50,
      marginHorizontal: 4,
      alignSelf: "center",
    },
  });
