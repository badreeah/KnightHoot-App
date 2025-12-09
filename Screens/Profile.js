// Screens/Profile.js
import React, {
  useState,
  useMemo,
  useEffect,
  useCallback,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Switch,
  TextInput,
  Modal,
  Image,
  Alert,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../util/colors";
import { useTranslation } from "react-i18next";
import { useAppSettings } from "../src/context/AppSettingProvid";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ensureProfile, getMyProfile } from "../src/api/profile";
import supabase from "../supabase";
import { getAvatar } from "../util/avatar";

export default function Profile() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const { theme, isRTL, language, setLanguage, setThemeMode, profile, user } =
    useAppSettings();

  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [appPasswordString, setAppPasswordString] = useState("");
  const [connecting, setConnecting] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [appPasswordError, setAppPasswordError] = useState("");
  const [connectedEmail, setConnectedEmail] = useState(null);

  // بيانات العرض فقط
  const [userData, setUserData] = useState({
    firstName: "Name",
    lastName: "",
    username: "",
    email: "",
    gender: "",
  });

  // رقم السعودية
  const KSA_PREFIX = "+966";
  function toLocalKsa(full) {
    if (!full) return "";
    const digits = String(full).replace(/\D/g, "");
    if (digits.startsWith("966")) {
      return digits.slice(3);
    }
    return digits;
  }

  // تحميل بيانات البروفايل
  useEffect(() => {
    (async () => {
      try {
        await ensureProfile();
        const p = await getMyProfile();
        const localFromFull = toLocalKsa(p.phone || "");

        setUserData({
          firstName: p.first_name ?? "Name",
          lastName: p.last_name ?? "",
          username: p.username ?? "",
          email: p.email ?? user?.email ?? "",
          gender: p.gender ?? user?.user_metadata?.gender ?? "",
          phoneNumber: localFromFull ?? "",
        });
      } catch (e) {
        console.log("Failed to load profile:", e);
      }
    })();
  }, []);

  // تحديت بيانات العرض عند الرجوع من EditProfile
  useFocusEffect(
    useCallback(() => {
      const reload = async () => {
        try {
          await ensureProfile();
          const p = await getMyProfile();
          const localFromFull = toLocalKsa(p.phone || "");

          setUserData({
            firstName: p.first_name ?? "Name",
            lastName: p.last_name ?? "",
            username: p.username ?? "",
            email: p.email ?? user?.email ?? "",
            gender: p.gender ?? user?.user_metadata?.gender ?? "",
            phoneNumber: localFromFull ?? "",
          });
        } catch (e) {
          console.log("Failed to reload profile:", e);
        }
      };
      reload();
    }, [user])
  );

  // تحميل إيميل Supabase auth إذا ناقص
  useEffect(() => {
    const loadAuthEmail = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (!error && data?.user?.email) {
        const authEmail = data.user.email;
        setUserData((prev) => ({
          ...prev,
          email: prev.email || authEmail,
        }));
      }
    };
    loadAuthEmail();
  }, []);

  // التحقق من ربط الإيميل
  useEffect(() => {
    const checkEmailConnection = async () => {
      try {
        const { data: auth } = await supabase.auth.getUser();
        if (auth?.user) {
          const { data, error } = await supabase
            .from("email_accounts")
            .select("*")
            .eq("user_id", auth.user.id)
            .eq("status", "connected")
            .single();

          if (data && !error) {
            setConnectedEmail("Connected");
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

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateEmail = (email) => {
    if (!email || email.trim() === "") {
      setEmailError("Please enter an email address");
      return false;
    }
    if (!EMAIL_RE.test(email)) {
      setEmailError("Please enter a valid email address");
      return false;
    }
    setEmailError("");
    return true;
  };

  const validateAppPassword = (password) => {
    if (!password || password.trim() === "") {
      setAppPasswordError("Please enter your email provider's app password");
      return false;
    }
    if (password.length !== 16) {
      setAppPasswordError("App password must be exactly 16 characters");
      return false;
    }
    setAppPasswordError("");
    return true;
  };

  const effectiveGender =
    userData?.gender || profile?.gender || user?.user_metadata?.gender || null;

  const avatarSrc = useMemo(
    () => getAvatar(effectiveGender),
    [effectiveGender]
  );

  const handleDisconnectEmail = async () => {
    if (!connectedEmail) return;
    try {
      const { data: auth } = await supabase.auth.getUser();
      if (auth?.user) {
        const { error } = await supabase.functions.invoke("unlink-email", {
          body: { user_id: auth.user.id },
        });
        if (error) throw error;
        alert("Email disconnected successfully!");
        setConnectedEmail(null);
      }
    } catch (error) {
      alert("Failed to disconnect email: " + error.message);
    }
  };

  const handleConnectEmail = async () => {
    setEmailError("");
    setAppPasswordError("");
    setPasswordError("");

    const isEmailValid = validateEmail(emailInput);
    const isPasswordValid = validateAppPassword(appPasswordString);
    if (!isEmailValid || !isPasswordValid) return;

    setConnecting(true);
    try {
      const { data, error } = await supabase.functions.invoke("register-email", {
        body: { email: emailInput, appPassword: appPasswordString },
      });

      if (error) throw error;

      if (data.success) {
        Alert.alert("Success", "Email connected successfully!");
        setConnectedEmail(emailInput);
        setShowEmailModal(false);
        setEmailInput("");
        setAppPasswordString("");
      } else {
        throw new Error(data.message || t("failedToConnectEmail"));
      }
    } catch (error) {
      let errorMessage = error.message || t("failedToConnectEmail");

      if (errorMessage.includes("IMAP") || errorMessage.includes("authentication")) {
        setPasswordError(
          "Invalid credentials. Check your email and app password, then ensure 2FA is enabled."
        );
      } else if (errorMessage.includes("Unsupported")) {
        setPasswordError(
          "This email provider is not supported. Please use Gmail, Outlook, or Hotmail."
        );
      } else {
        setPasswordError(errorMessage);
      }

      Alert.alert("Error", errorMessage);
    } finally {
      setConnecting(false);
    }
  };

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
          <Text
            style={[
              styles.modalDescription,
              { color: theme.colors.subtext, marginBottom: 20 },
            ]}
          >
            Connect your email account to automatically scan for scam and
            phishing emails
          </Text>

          {/* Email Input */}
          <Text
            style={[
              styles.inputLabel,
              { color: themeStyles.textColor, marginTop: 10 },
            ]}
          >
            Email Address
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: themeStyles.inputBackground,
                color: themeStyles.textColor,
                marginBottom: emailError ? 5 : 20,
                borderColor: emailError ? COLORS.red : theme.colors.cardBorder,
              },
            ]}
            value={emailInput}
            onChangeText={(text) => {
              setEmailInput(text);
              if (emailError) validateEmail(text);
            }}
            onEndEditing={() => validateEmail(emailInput)}
            textAlign={isRTL ? "right" : "left"}
            placeholder="Enter your email address"
            placeholderTextColor={theme.colors.subtext}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {emailError ? (
            <Text style={[styles.fieldError, { marginBottom: 15 }]}>
              {emailError}
            </Text>
          ) : null}

          {/* App Password Input */}
          <Text style={[styles.inputLabel, { color: themeStyles.textColor }]}>
            App Password
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: themeStyles.inputBackground,
                color: themeStyles.textColor,
                marginBottom: appPasswordError ? 5 : 10,
                borderColor: appPasswordError
                  ? COLORS.red
                  : theme.colors.cardBorder,
              },
            ]}
            value={appPasswordString}
            onChangeText={(text) => {
              setAppPasswordString(text);
              if (appPasswordError) validateAppPassword(text);
            }}
            onBlur={() => validateAppPassword(appPasswordString)}
            textAlign={isRTL ? "right" : "left"}
            placeholder="Enter app password"
            placeholderTextColor={theme.colors.subtext}
            secureTextEntry
          />
          {appPasswordError ? (
            <Text style={[styles.fieldError, { marginBottom: 10 }]}>
              {appPasswordError}
            </Text>
          ) : null}

          {!!passwordError && (
            <Text
              style={{
                color: COLORS.red,
                marginTop: 10,
                marginBottom: 10,
              }}
            >
              {passwordError}
            </Text>
          )}

          <View style={styles.buttonRow}>
            <Pressable
              style={styles.cancelButton}
              onPress={() => setShowEmailModal(false)}
              disabled={connecting}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </Pressable>
            <Pressable
              style={styles.saveButton}
              onPress={handleConnectEmail}
              disabled={connecting}
            >
              <Text style={styles.saveButtonText}>
                {connecting ? "Connecting..." : "Connect"}
              </Text>
            </Pressable>
          </View>

          <View style={{ marginTop: 20 }}>
            <Text
              style={[
                styles.modalNote,
                { color: theme.colors.primary, marginBottom: 10 },
              ]}
              onPress={() =>
                Alert.alert(
                  "What is an App Password?",
                  "An app password is a unique passcode that lets apps access your email account securely.\n\n" +
                    "You need to enable 2FA in your email provider's security settings first, then generate an app password from there."
                )
              }
            >
              What is an App Password?
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );

  // ==== UI الرئيسي ====
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        style={[
          styles.container,
          { backgroundColor: themeStyles.backgroundColor },
        ]}
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
                },
              ]}
            >
              {userData.firstName} {userData.lastName}
            </Text>

            {!!userData.username && (
              <Text
                style={[
                  styles.profileUsername,
                  { color: themeStyles.profileUsername },
                ]}
              >
                {userData.username}
              </Text>
            )}

            {!!userData.email && (
              <Text
                style={[
                  styles.profileUsername,
                  { color: themeStyles.profileUsername },
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
          {/* My Account → EditProfile screen */}
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
                  style={[
                    styles.settingTitle,
                    { color: themeStyles.textColor },
                  ]}
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
                  style={[
                    styles.settingTitle,
                    { color: themeStyles.textColor },
                  ]}
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
                  style={[
                    styles.settingTitle,
                    { color: themeStyles.textColor },
                  ]}
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
  {t("profile.settings")}
</Text>
<Text
  style={[
    styles.settingDescription,
    { color: theme.colors.subtext },
  ]}
>
  {t("profile.settings")}
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
                style={{
                  width: 50,
                  height: 50,
                  marginLeft: 4,
                  marginRight: 4,
                }}
              />
            <View style={styles.settingTextContainer}>
              <Text
                style={[
                  styles.settingTitle,
                  { color: themeStyles.textColor },
                ]}
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
                  ? "Connected for scanning"
                  : "Connect your email to scan"}
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

          {/* Privacy → PrivacyScreen */}
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
                  style={[
                    styles.settingTitle,
                    { color: themeStyles.textColor },
                  ]}
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

      {renderEmailModal()}

      {/* Language Modal */}
      <Modal visible={showLanguageModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: themeStyles.cardBackground },
            ]}
          >
            <Text
              style={[styles.modalTitle, { color: themeStyles.textColor }]}
            >
              {t("selectLanguage")}
            </Text>
            <Pressable
              style={styles.genderOption}
              onPress={() => {
                setLanguage("en");
                setShowLanguageModal(false);
              }}
            >
              <Text
                style={[
                  styles.genderText,
                  {
                    color:
                      language === "en"
                        ? COLORS.purple1
                        : themeStyles.textColor,
                  },
                ]}
              >
                English
              </Text>
              {language === "en" && (
                <Ionicons
                  name="checkmark-circle"
                  size={20}
                  color={COLORS.purple1}
                />
              )}
            </Pressable>
            <Pressable
              style={styles.genderOption}
              onPress={() => {
                setLanguage("ar");
                setShowLanguageModal(false);
              }}
            >
              <Text
                style={[
                  styles.genderText,
                  {
                    color:
                      language === "ar"
                        ? COLORS.purple1
                        : themeStyles.textColor,
                  },
                ]}
              >
                العربية
              </Text>
              {language === "ar" && (
                <Ionicons
                  name="checkmark-circle"
                  size={20}
                  color={COLORS.purple1}
                />
              )}
            </Pressable>
            <Pressable
  onPress={() => setShowLanguageModal(false)}
  style={{
    marginTop: 20,
    backgroundColor: "#F3F1FF",   // خلفية بنفسجية فاتحة وواضحة
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.purple1,
  }}
>
  <Text
    style={{
      textAlign: "center",
      color: COLORS.purple1,
      fontWeight: "600",
      fontSize: 16,
    }}
  >
    {t("cancel")}
  </Text>
</Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function createStyles(theme, themeStyles, isRTL) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: themeStyles.backgroundColor,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingVertical: 10,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: "bold",
    },

    // بطاقة البروفايل
    profileSection: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 24,
      paddingHorizontal: 16,
      borderRadius: 16,
      marginHorizontal: 20,
      marginTop: 10,
      marginBottom: 20,
    },
    profileImage: {
      width: 100,
      height: 100,
      borderRadius: 50,
      marginBottom: 10,
      borderWidth: 3,
      borderColor: "#ffffff",
      backgroundColor: "#ffffff",
    },
    profileInfo: {
      alignItems: "center",
      justifyContent: "center",
      marginTop: 4,
    },
    profileName: {
      fontSize: 20,
      fontWeight: "700",
      marginBottom: 2,
      textAlign: "center",
    },
    profileUsername: {
      fontSize: 14,
      color: themeStyles.profileUsername,
      textAlign: "center",
    },

    divider: {
      height: 1,
      marginHorizontal: 20,
      marginVertical: 10,
    },
    settingsContainer: {
      borderRadius: 10,
      marginHorizontal: 20,
      borderWidth: 1,
      padding: 10,
      overflow: "hidden",
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "bold",
      marginVertical: 10,
      paddingHorizontal: 10,
    },
    settingItem: {
      flexDirection: isRTL ? "row-reverse" : "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 10,
      paddingHorizontal: 10,
    },
    settingInfo: {
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      flex: 1,
    },
    settingTextContainer: {
      flex: 1,
      marginHorizontal: 15,
      alignItems: isRTL ? "flex-end" : "flex-start",
    },
    settingTitle: {
      fontSize: 16,
      fontWeight: "bold",
    },
    settingDescription: {
      fontSize: 12,
    },

    // فورم مودال الإيميل
    formContainer: {
      borderRadius: 10,
      marginHorizontal: 20,
      borderWidth: 1,
      padding: 20,
      marginTop: 20,
    },
    formLabel: {
      fontSize: 14,
      marginTop: 15,
      marginBottom: 5,
      textAlign: isRTL ? "right" : "left",
    },
    inputLabel: {
      fontSize: 16,
      fontWeight: "600",
      marginBottom: 8,
      color: themeStyles.textColor,
    },
    fieldError: {
      fontSize: 12,
      color: COLORS.red,
      marginTop: -5,
    },
    input: {
      height: 50,
      borderRadius: 8,
      paddingHorizontal: 15,
      fontSize: 16,
      justifyContent: "center",
      borderWidth: 1,
      borderColor: theme.colors.cardBorder,
    },
    buttonRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 20,
    },
    cancelButton: {
      flex: 1,
      backgroundColor: theme.colors.card,
      padding: 15,
      borderRadius: 8,
      marginRight: 10,
      borderWidth: 1,
      borderColor: theme.colors.cardBorder,
    },
    cancelButtonText: {
      textAlign: "center",
      color: themeStyles.textColor,
      fontWeight: "bold",
    },
    saveButton: {
      flex: 1,
      backgroundColor: COLORS.purple1,
      padding: 15,
      borderRadius: 8,
      marginLeft: 10,
    },
    saveButtonText: {
      textAlign: "center",
      color: COLORS.white,
      fontWeight: "bold",
    },

    // Modal Styles
    modalContainer: {
      flex: 1,
      justifyContent: "flex-end",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
      padding: 20,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      width: "100%",
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 15,
      textAlign: "center",
    },
    modalDescription: {
      fontSize: 14,
      marginBottom: 15,
      textAlign: "center",
    },
    modalNote: {
      fontSize: 12,
      marginTop: 15,
      textAlign: "center",
      textDecorationLine: "underline",
    },

    // Gender/Language Modal
    genderOption: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 15,
      paddingHorizontal: 10,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.cardBorder,
    },
    genderText: {
      fontSize: 16,
    },
  });
}
