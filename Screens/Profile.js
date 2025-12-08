import React, {
  useState,
  useMemo,
  useEffect,
  useRef,
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
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../util/colors";
import { useTranslation } from "react-i18next";
import { useAppSettings } from "../src/context/AppSettingProvid";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ensureProfile,
  getMyProfile,
  updateMyProfile,
} from "../src/api/profile";
import supabase from "../supabase";
import { getAvatar } from "../util/avatar";

export default function Profile() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const scrollRef = useRef(null);
  const insets = useSafeAreaInsets();

  const { theme, isRTL, language, setLanguage, setThemeMode, profile, user } =
    useAppSettings();

  const [activeScreen, setActiveScreen] = useState("main"); // "main" | "edit" | "Privacy"
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [showGenderModal, setShowGenderModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showDatePickerModal, setShowDatePickerModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [appPasswordString, setAppPasswordString] = useState("");
  const [connecting, setConnecting] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [connectedEmail, setConnectedEmail] = useState(null);
  const [disconnecting, setDisconnecting] = useState(false);

  // تاريخ لاختيار اليوم/الشهر/السنة
  const [selectedDay, setSelectedDay] = useState(1);
  const [selectedMonth, setSelectedMonth] = useState(0); // 0-11
  const [selectedYear, setSelectedYear] = useState(2000);

  // بيانات العرض/التعديل
  const [userData, setUserData] = useState({
    firstName: "Name",
    lastName: "",
    username: "",
    gender: "",
    dateOfBirth: "", // YYYY-MM-DD
    phoneNumber: "",
    email: "",
    password: "",
  });
  const [tempData, setTempData] = useState({ ...userData });

  // رقم السعودية
  const KSA_PREFIX = "+966";
  function toE164Ksa(local) {
    if (!local) return null;
    const digits = String(local).replace(/\D/g, "");
    const withoutLeadingZero = digits.replace(/^0+/, "");
    if (!withoutLeadingZero) return null;
    return KSA_PREFIX + withoutLeadingZero;
  }
  function toLocalKsa(full) {
    if (!full) return "";
    const digits = String(full).replace(/\D/g, "");
    if (digits.startsWith("966")) {
      return digits.slice(3);
    }
    return digits;
  }

  // تحميل بيانات البروفايل من جدول profiles
  useEffect(() => {
    (async () => {
      await ensureProfile();
      const p = await getMyProfile();
      const localFromFull = toLocalKsa(p.phone || "");
      setTempData({
        firstName: p.first_name ?? "",
        lastName: p.last_name ?? "",
        gender: p.gender ?? user?.user_metadata?.gender ?? "",
        dateOfBirth: p.date_of_birth ?? "",
        phoneNumber: localFromFull ?? "",
        email: p.email ?? user?.email ?? "",
        password: "",
        username: p.username ?? "",
      });
      setUserData({
        firstName: p.first_name ?? "",
        lastName: p.last_name ?? "",
        gender: p.gender ?? user?.user_metadata?.gender ?? "",
        dateOfBirth: p.date_of_birth ?? "",
        phoneNumber: localFromFull ?? "",
        email: p.email ?? user?.email ?? "",
        password: "",
        username: p.username ?? "",
      });
    })();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const loadProfile = async () => {
        try {
          await ensureProfile();
          const p = await getMyProfile();
          const localFromFull = toLocalKsa(p.phone || "");

          const newUserData = {
            firstName: p.first_name ?? "Name",
            lastName: p.last_name ?? "",
            username: p.username ?? "",
            email: p.email ?? user?.email ?? "",
            gender: p.gender ?? user?.user_metadata?.gender ?? "",
            dateOfBirth: p.date_of_birth ?? "",
            phoneNumber: localFromFull ?? "",
            password: "",
          };

          setUserData(newUserData);

          if (activeScreen === "edit") {
            // Keep tempData in sync if we're on the edit screen
            setTempData(newUserData);
          }
        } catch (e) {
          console.log("Failed to load profile in Profile screen:", e);
        }
      };

      loadProfile();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, activeScreen])
  );

  useEffect(() => {
    const loadAuthEmail = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (!error && data?.user?.email) {
        const authEmail = data.user.email;

        setTempData((prev) => ({
          ...prev,
          email: prev.email || authEmail,
        }));
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
  const themeStyles = useMemo(() => {
    return {
      backgroundColor: theme.colors.background,
      textColor: theme.colors.text,
      cardBackground: theme.colors.card,
      borderColor: theme.colors.cardBorder,
      inputBackground: theme.mode === "dark" ? "#161b25" : "#fff",
      profileBackground: theme.mode === "dark" ? theme.colors.card : "#797EF6",
      profileText: theme.colors.text,
      profileUsername:
        theme.mode === "dark" ? theme.colors.subtext : "#b8b8b8ff",
    };
  }, [theme]);

  const styles = createStyles(theme, themeStyles, isRTL);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const years = Array.from(
    { length: 100 },
    (_, i) => new Date().getFullYear() - i
  );
  const GENDER_OPTIONS = ["male", "female"];

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const PHONE_RE = /^[0-9]{7,15}$/;
  const toISODateOrNull = (v) => {
    if (!v || String(v).trim() === "") return null;
    if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return v;
    const d = new Date(v);
    return isNaN(d) ? null : d.toISOString().slice(0, 10);
  };

  const effectiveGender =
    tempData?.gender || profile?.gender || user?.user_metadata?.gender || null;

  const avatarSrc = useMemo(
    () => getAvatar(effectiveGender),
    [effectiveGender]
  );

  // حفظ التغييرات
  const handleSave = async () => {
    try {
      await ensureProfile();

      const dob = toISODateOrNull(tempData.dateOfBirth);
      const fullPhone = toE164Ksa(tempData.phoneNumber);

      const cleanedEmail = (tempData.email || "").trim();

      if (cleanedEmail && !EMAIL_RE.test(cleanedEmail)) {
        Alert.alert("Invalid email", "ايميل غير صحيح");
        return;
      }
      if (
        tempData.phoneNumber &&
        !PHONE_RE.test(tempData.phoneNumber.replace(/^0+/, ""))
      ) {
        Alert.alert("Invalid phone", "اكتب رقم جوال صحيح بدون مسافات");
        return;
      }

      // 1) تحديث جدول profiles فقط
      await updateMyProfile({
        first_name: tempData.firstName,
        last_name: tempData.lastName,
        username: tempData.username || null,
        gender: tempData.gender || null, // "male" أو "female"
        date_of_birth: dob, // null أو YYYY-MM-DD
        phone: fullPhone, // بصيغة E.164
        email: cleanedEmail || null, // contact email فقط
      });

      // 2) تحديث metadata (مثلاً الجندر) في auth
      await supabase.auth.updateUser({
        data: { gender: tempData.gender || null },
      });

      if (tempData.password) {
        const { error: passErr } = await supabase.auth.updateUser({
          password: tempData.password,
        });
        if (passErr) throw passErr;
      }

      Alert.alert("Saved", "Profile updated successfully!");
      setUserData({ ...tempData, email: cleanedEmail });
      setActiveScreen("main");
    } catch (e) {
      Alert.alert("Error", e?.message ?? String(e));
    }
  };

  const handleCancel = () => {
    setTempData({ ...userData });
    setActiveScreen("main");
  };

  const handleDateSelect = () => {
    const iso = new Date(selectedYear, selectedMonth, selectedDay)
      .toISOString()
      .slice(0, 10);
    setTempData({ ...tempData, dateOfBirth: iso });
    setShowDatePickerModal(false);
  };

  const handleGenderSelect = (key) => {
    setTempData((prev) => ({ ...prev, gender: key })); // "male"/"female"
    setShowGenderModal(false);
  };

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

  // ---------- الشاشات ----------
  const renderMainScreen = () => (
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
        {/* My Account */}
        <Pressable
          style={styles.settingItem}
          onPress={() => {
            setTempData({ ...userData });
            setActiveScreen("edit");
          }}
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

        {/* Privacy */}
        <Pressable
          style={styles.settingItem}
          onPress={() => setActiveScreen("Privacy")}
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
  );

  const renderEditScreen = () => (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: themeStyles.backgroundColor }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={{ flex: 1 }}>
          {/* Header */}
          <View style={styles.header}>
            <Pressable onPress={() => setActiveScreen("main")}>
              <Ionicons name="arrow-back" size={24} color={COLORS.purple8} />
            </Pressable>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView
            ref={scrollRef}
            style={{ flex: 1 }}
            contentContainerStyle={{
              paddingBottom: (insets?.bottom ?? 0) + 220,
            }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode={
              Platform.OS === "ios" ? "interactive" : "on-drag"
            }
            scrollEventThrottle={16}
            contentInsetAdjustmentBehavior="automatic"
            automaticallyAdjustKeyboardInsets
            nestedScrollEnabled
          >
            {/* Profile Info */}
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
              <Text
                style={[styles.profileName, { color: themeStyles.profileText }]}
              >
                {tempData.firstName} {tempData.lastName}
              </Text>
              {!!tempData.username && (
                <Text
                  style={[
                    styles.profileUsername,
                    { color: themeStyles.profileUsername },
                  ]}
                >
                  {tempData.username}
                </Text>
              )}
            </View>

            {/* Form */}
            <View
              style={[
                styles.formContainer,
                {
                  backgroundColor: themeStyles.cardBackground,
                  borderColor: themeStyles.borderColor,
                },
              ]}
            >
              {/* First name */}
              <Text
                style={[styles.formLabel, { color: themeStyles.textColor }]}
              >
                {t("First Name")}
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: themeStyles.inputBackground,
                    color: themeStyles.textColor,
                  },
                ]}
                value={tempData.firstName}
                onChangeText={(text) =>
                  setTempData({ ...tempData, firstName: text })
                }
                textAlign={isRTL ? "right" : "left"}
                placeholder={t("First Name")}
                placeholderTextColor={theme.colors.subtext}
                returnKeyType="next"
                blurOnSubmit={false}
              />

              {/* Last name */}
              <Text
                style={[styles.formLabel, { color: themeStyles.textColor }]}
              >
                {t("Last Name")}
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: themeStyles.inputBackground,
                    color: themeStyles.textColor,
                  },
                ]}
                value={tempData.lastName}
                onChangeText={(text) =>
                  setTempData({ ...tempData, lastName: text })
                }
                textAlign={isRTL ? "right" : "left"}
                placeholder={t("Last Name")}
                placeholderTextColor={theme.colors.subtext}
                returnKeyType="next"
                blurOnSubmit={false}
              />

              {/* Gender */}
              <Text
                style={[styles.formLabel, { color: themeStyles.textColor }]}
              >
                {t("Gender")}
              </Text>
              <Pressable
                style={[
                  styles.input,
                  {
                    backgroundColor: themeStyles.inputBackground,
                    justifyContent: "center",
                  },
                ]}
                onPress={() => setShowGenderModal(true)}
              >
                <Text
                  style={[
                    tempData.gender
                      ? { color: themeStyles.textColor }
                      : { color: theme.colors.subtext },
                    { textAlign: isRTL ? "right" : "left" },
                  ]}
                >
                  {tempData.gender ? t(tempData.gender) : t("selectGender")}
                </Text>
              </Pressable>

              {/* Date of Birth */}
              <Text
                style={[styles.formLabel, { color: themeStyles.textColor }]}
              >
                {t("Date Of Birth")}
              </Text>
              <Pressable
                style={[
                  styles.input,
                  { backgroundColor: themeStyles.inputBackground },
                ]}
                onPress={() => setShowDatePickerModal(true)}
              >
                <Text
                  style={[
                    tempData.dateOfBirth
                      ? { color: themeStyles.textColor }
                      : { color: theme.colors.subtext },
                    { textAlign: isRTL ? "right" : "left" },
                  ]}
                >
                  {tempData.dateOfBirth || t("selectDate")}
                </Text>
              </Pressable>

              {/* Phone (KSA only) */}
              <Text
                style={[styles.formLabel, { color: themeStyles.textColor }]}
              >
                {t("Phone Number")}
              </Text>
              <View style={styles.phoneRow}>
                <View style={styles.ksaBadge}>
                  <Text style={styles.ksaFlag}>🇸🇦</Text>
                  <Text style={styles.ksaCode}>+966</Text>
                </View>
                <TextInput
                  style={[
                    styles.input,
                    styles.phoneInput,
                    {
                      backgroundColor: themeStyles.inputBackground,
                      color: themeStyles.textColor,
                    },
                  ]}
                  value={tempData.phoneNumber}
                  onChangeText={(text) => {
                    const onlyDigits = text.replace(/\D/g, "");
                    setTempData({ ...tempData, phoneNumber: onlyDigits });
                  }}
                  textAlign={isRTL ? "right" : "left"}
                  placeholder="5XXXXXXXX"
                  placeholderTextColor={theme.colors.subtext}
                  keyboardType="phone-pad"
                  maxLength={10}
                  returnKeyType="next"
                  blurOnSubmit={false}
                />
              </View>

              {/* Email */}
              <Text
                style={[styles.formLabel, { color: themeStyles.textColor }]}
              >
                {t("Email")}
              </Text>
              <TextInput
                onFocus={() =>
                  scrollRef.current?.scrollToEnd({ animated: true })
                }
                style={[
                  styles.input,
                  {
                    backgroundColor: themeStyles.inputBackground,
                    color: themeStyles.textColor,
                  },
                ]}
                value={tempData.email}
                onChangeText={(text) =>
                  setTempData({ ...tempData, email: text })
                }
                textAlign={isRTL ? "right" : "left"}
                placeholder="Enter your email"
                placeholderTextColor={theme.colors.subtext}
                keyboardType="email-address"
                autoCapitalize="none"
                returnKeyType="next"
                blurOnSubmit={false}
              />

              {/* Password */}
              <Text
                style={[styles.formLabel, { color: themeStyles.textColor }]}
              >
                {t("Password")}
              </Text>
              <View>
                <TextInput
                  onFocus={() =>
                    scrollRef.current?.scrollToEnd({ animated: true })
                  }
                  style={[
                    styles.input,
                    {
                      backgroundColor: themeStyles.inputBackground,
                      color: themeStyles.textColor,
                    },
                    styles.passwordInput,
                  ]}
                  value={tempData.password}
                  onChangeText={(text) =>
                    setTempData({ ...tempData, password: text })
                  }
                  textAlign={isRTL ? "right" : "left"}
                  placeholder="Enter your password"
                  placeholderTextColor={theme.colors?.subtext || "#999"}
                  secureTextEntry={!passwordVisible}
                  autoCapitalize="none"
                  returnKeyType="done"
                />
                <TouchableOpacity
                  style={styles.eyeBtn}
                  onPress={() => setPasswordVisible((v) => !v)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons
                    name={passwordVisible ? "eye" : "eye-off"}
                    size={20}
                    color="#797df6"
                  />
                </TouchableOpacity>
              </View>

              {/* Buttons */}
              <View style={styles.buttonRow}>
                <Pressable style={styles.cancelButton} onPress={handleCancel}>
                  <Text style={styles.cancelButtonText}>{t("cancel")}</Text>
                </Pressable>
                <Pressable style={styles.saveButton} onPress={handleSave}>
                  <Text style={styles.saveButtonText}>{t("save")}</Text>
                </Pressable>
              </View>
            </View>
          </ScrollView>

          {/* Date Picker Modal */}
          <Modal
            visible={showDatePickerModal}
            transparent
            animationType="slide"
          >
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
                  {t("selectDob")}
                </Text>

                <View style={styles.datePickerContainer}>
                  <ScrollView
                    style={styles.pickerColumn}
                    keyboardShouldPersistTaps="handled"
                  >
                    {days.map((day) => (
                      <Pressable
                        key={day}
                        style={[
                          styles.pickerOption,
                          selectedDay === day && styles.selectedPickerOption,
                        ]}
                        onPress={() => setSelectedDay(day)}
                      >
                        <Text
                          style={[
                            styles.pickerText,
                            {
                              color:
                                selectedDay === day
                                  ? COLORS.purple1
                                  : themeStyles.textColor,
                            },
                          ]}
                        >
                          {day}
                        </Text>
                      </Pressable>
                    ))}
                  </ScrollView>
                  <ScrollView
                    style={styles.pickerColumn}
                    keyboardShouldPersistTaps="handled"
                  >
                    {months.map((month, index) => (
                      <Pressable
                        key={index}
                        style={[
                          styles.pickerOption,
                          selectedMonth === index &&
                            styles.selectedPickerOption,
                        ]}
                        onPress={() => setSelectedMonth(index)}
                      >
                        <Text
                          style={[
                            styles.pickerText,
                            {
                              color:
                                selectedMonth === index
                                  ? COLORS.purple1
                                  : themeStyles.textColor,
                            },
                          ]}
                        >
                          {t(month)}
                        </Text>
                      </Pressable>
                    ))}
                  </ScrollView>
                  <ScrollView
                    style={styles.pickerColumn}
                    keyboardShouldPersistTaps="handled"
                  >
                    {years.map((year) => (
                      <Pressable
                        key={year}
                        style={[
                          styles.pickerOption,
                          selectedYear === year && styles.selectedPickerOption,
                        ]}
                        onPress={() => setSelectedYear(year)}
                      >
                        <Text
                          style={[
                            styles.pickerText,
                            {
                              color:
                                selectedYear === year
                                  ? COLORS.purple1
                                  : themeStyles.textColor,
                            },
                          ]}
                        >
                          {year}
                        </Text>
                      </Pressable>
                    ))}
                  </ScrollView>
                </View>

                <View style={styles.buttonRow}>
                  <Pressable
                    style={styles.cancelButton}
                    onPress={() => setShowDatePickerModal(false)}
                  >
                    <Text style={styles.cancelButtonText}>{t("cancel")}</Text>
                  </Pressable>
                  <Pressable
                    style={styles.saveButton}
                    onPress={handleDateSelect}
                  >
                    <Text style={styles.saveButtonText}>{t("select")}</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </Modal>

          {/* Gender Modal */}
          <Modal visible={showGenderModal} transparent animationType="slide">
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
                  {t("selectGender")}
                </Text>
                {GENDER_OPTIONS.map((gender) => (
                  <Pressable
                    key={gender}
                    style={({ pressed }) => [
                      styles.genderOption,
                      tempData.gender === gender && styles.selectedGenderOption,
                      pressed && styles.pressedGenderOption,
                    ]}
                    onPress={() => handleGenderSelect(gender)}
                  >
                    <Text
                      style={[
                        styles.genderText,
                        {
                          color:
                            tempData.gender === gender
                              ? COLORS.purple1
                              : themeStyles.textColor,
                        },
                      ]}
                    >
                      {t(gender)}
                    </Text>
                    {tempData.gender === gender && (
                      <Ionicons
                        name="checkmark-circle"
                        size={20}
                        color={COLORS.purple1}
                      />
                    )}
                  </Pressable>
                ))}
                <Pressable
                  style={[styles.cancelButton, { marginTop: 20 }]}
                  onPress={() => setShowGenderModal(false)}
                >
                  <Text style={styles.cancelButtonText}>{t("cancel")}</Text>
                </Pressable>
              </View>
            </View>
          </Modal>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );

  const renderPrivacyScreen = () => (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: themeStyles.backgroundColor },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => setActiveScreen("main")}>
          <Ionicons name="arrow-back" size={24} color={COLORS.purple8} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: themeStyles.textColor }]}>
          {t("Privacy")}
        </Text>
        <View style={{ width: 24 }} />
      </View>

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
          {t("dataControl")}
        </Text>

        {/* Delete Account */}
        <Pressable
          style={styles.settingItem}
          onPress={() => navigation.navigate("DeleteAccount")}
        >
          <View style={styles.settingInfo}>
            <Image
              source={require("../assets/icons/delete.png")}
              style={{ width: 58, height: 58 }}
            />
            <View style={styles.settingTextContainer}>
              <Text
                style={[
                  styles.settingTitle,
                  { color: COLORS.red, fontWeight: "bold" },
                ]}
              >
                {t("Delete Account")}
              </Text>
              <Text
                style={[
                  styles.settingDescription,
                  { color: theme.colors.subtext },
                ]}
              >
                {t("Delete all data")}
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
    </ScrollView>
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
            {t("Connect Email")}
          </Text>
          <Text
            style={[styles.modalDescription, { color: theme.colors.subtext }]}
          >
            {t("enterEmailForScanning")}
          </Text>

          {/* Email Input */}
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: themeStyles.inputBackground,
                color: themeStyles.textColor,
                marginBottom: 10,
              },
            ]}
            value={emailInput}
            onChangeText={setEmailInput}
            textAlign={isRTL ? "right" : "left"}
            placeholder={t("Email Address")}
            placeholderTextColor={theme.colors.subtext}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          {/* App Password Input */}
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: themeStyles.inputBackground,
                color: themeStyles.textColor,
              },
            ]}
            value={appPasswordString}
            onChangeText={setAppPasswordString}
            textAlign={isRTL ? "right" : "left"}
            placeholder={t("App Password (or regular password)")}
            placeholderTextColor={theme.colors.subtext}
            secureTextEntry
          />

          {!!passwordError && (
            <Text style={{ color: COLORS.red, marginTop: 10 }}>
              {passwordError}
            </Text>
          )}

          <View style={styles.buttonRow}>
            <Pressable
              style={styles.cancelButton}
              onPress={() => setShowEmailModal(false)}
              disabled={connecting}
            >
              <Text style={styles.cancelButtonText}>{t("cancel")}</Text>
            </Pressable>
            <Pressable
              style={styles.saveButton}
              onPress={handleConnectEmail}
              disabled={connecting}
            >
              <Text style={styles.saveButtonText}>
                {connecting ? t("connecting") : t("connect")}
              </Text>
            </Pressable>
          </View>

          <Text
            style={[styles.modalNote, { color: theme.colors.subtext }]}
            onPress={() =>
              Alert.alert("App Password Info", t("appPasswordDetails"))
            }
          >
            {t("whatIsAppPassword")}
          </Text>
        </View>
      </View>
    </Modal>
  );

  const handleConnectEmail = async () => {
    if (!EMAIL_RE.test(emailInput)) {
      setPasswordError(t("invalidEmailFormat"));
      return;
    }
    setPasswordError("");
    setConnecting(true);

    try {
      const { data, error } = await supabase.functions.invoke("link-email", {
        body: { email: emailInput, password: appPasswordString },
      });

      if (error) throw error;

      if (data.success) {
        Alert.alert("Success", t("emailConnectedSuccessfully"));
        setConnectedEmail(emailInput);
        setShowEmailModal(false);
        setEmailInput("");
        setAppPasswordString("");
      } else {
        throw new Error(data.message || t("failedToConnectEmail"));
      }
    } catch (error) {
      setPasswordError(error.message || t("failedToConnectEmail"));
      Alert.alert("Error", error.message || t("failedToConnectEmail"));
    } finally {
      setConnecting(false);
    }
  };

  // -------------------------

  const renderCurrentScreen = () => {
    switch (activeScreen) {
      case "edit":
        return renderEditScreen();
      case "Privacy":
        return renderPrivacyScreen();
      case "main":
      default:
        return renderMainScreen();
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {renderCurrentScreen()}
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
            <Text style={[styles.modalTitle, { color: themeStyles.textColor }]}>
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
              style={[styles.cancelButton, { marginTop: 20 }]}
              onPress={() => setShowLanguageModal(false)}
            >
              <Text style={styles.cancelButtonText}>{t("cancel")}</Text>
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
    profileSection: {
      alignItems: "center",
      padding: 20,
      borderRadius: 10,
      marginHorizontal: 20,
      marginTop: 10,
      marginBottom: 20,
    },
    profileImage: {
      width: 100,
      height: 100,
      borderRadius: 50,
      marginBottom: 10,
      borderWidth: 2,
      borderColor: theme.colors.cardBorder,
    },
    profileInfo: {
      alignItems: isRTL ? "flex-end" : "flex-start",
      flex: 1,
    },
    profileName: {
      fontSize: 22,
      fontWeight: "bold",
      marginBottom: 5,
    },
    profileUsername: {
      fontSize: 16,
      color: themeStyles.profileUsername,
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
    emailIconAligned: {
      width: 58,
      height: 58,
      marginLeft: isRTL ? 0 : 10,
      marginRight: isRTL ? 10 : 0,
    },

    // Edit Screen Styles
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
    input: {
      height: 50,
      borderRadius: 8,
      paddingHorizontal: 15,
      fontSize: 16,
      justifyContent: "center",
    },
    phoneRow: {
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
    },
    ksaBadge: {
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      backgroundColor: theme.colors.card,
      padding: 10,
      borderRadius: 8,
      marginRight: isRTL ? 0 : 10,
      marginLeft: isRTL ? 10 : 0,
      borderWidth: 1,
      borderColor: theme.colors.cardBorder,
    },
    ksaFlag: {
      fontSize: 18,
      marginRight: isRTL ? 0 : 5,
      marginLeft: isRTL ? 5 : 0,
    },
    ksaCode: {
      fontSize: 16,
      color: themeStyles.textColor,
    },
    phoneInput: {
      flex: 1,
    },
    passwordInput: {
      paddingRight: isRTL ? 15 : 45,
      paddingLeft: isRTL ? 45 : 15,
    },
    eyeBtn: {
      position: "absolute",
      top: 0,
      bottom: 0,
      [isRTL ? "left" : "right"]: 15,
      justifyContent: "center",
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
    selectedGenderOption: {
      backgroundColor: theme.mode === "dark" ? "#1A1A2E" : "#F0F0FF",
      borderRadius: 5,
    },
    pressedGenderOption: {
      opacity: 0.7,
    },
    genderText: {
      fontSize: 16,
    },

    // Date Picker Modal
    datePickerContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
      height: 200,
      marginBottom: 20,
    },
    pickerColumn: {
      flex: 1,
      marginHorizontal: 5,
      borderWidth: 1,
      borderColor: theme.colors.cardBorder,
      borderRadius: 8,
    },
    pickerOption: {
      paddingVertical: 15,
      alignItems: "center",
    },
    selectedPickerOption: {
      backgroundColor: theme.mode === "dark" ? "#1A1A2E" : "#F0F0FF",
    },
    pickerText: {
      fontSize: 16,
    },
  });
}
