// Screens/EditProfile.js
import React, {
  useState,
  useMemo,
  useEffect,
  useRef,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
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
import { useNavigation } from "@react-navigation/native";
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

export default function EditProfile() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const scrollRef = useRef(null);
  const insets = useSafeAreaInsets();

  const { theme, isRTL, profile, user } = useAppSettings();

  const [showGenderModal, setShowGenderModal] = useState(false);
  const [showDatePickerModal, setShowDatePickerModal] = useState(false);

  const [selectedDay, setSelectedDay] = useState(1);
  const [selectedMonth, setSelectedMonth] = useState(0); // 0-11
  const [selectedYear, setSelectedYear] = useState(2000);

  const [userData, setUserData] = useState({
    firstName: "Name",
    lastName: "",
    username: "",
    gender: "",
    dateOfBirth: "",
    phoneNumber: "",
    email: "",
  });

  const [tempData, setTempData] = useState({ ...userData });

  const [saving, setSaving] = useState(false);

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const PHONE_RE = /^[0-9]{7,15}$/;

  const toISODateOrNull = (v) => {
    if (!v || String(v).trim() === "") return null;
    if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return v;
    const d = new Date(v);
    return isNaN(d) ? null : d.toISOString().slice(0, 10);
  };

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

  // تحميل بيانات البروفايل
  useEffect(() => {
    (async () => {
      try {
        await ensureProfile();
        const p = await getMyProfile();
        const localFromFull = toLocalKsa(p.phone || "");
        const authGender = user?.user_metadata?.gender ?? "";

        const base = {
          firstName: p.first_name ?? "",
          lastName: p.last_name ?? "",
          gender: p.gender ?? authGender,
          dateOfBirth: p.date_of_birth ?? "",
          phoneNumber: localFromFull ?? "",
          email: p.email ?? user?.email ?? "",
          username: p.username ?? "",
        };

        setTempData(base);
        setUserData(base);

        // إعداد التاريخ للـ picker
        if (base.dateOfBirth) {
          const [y, m, d] = base.dateOfBirth.split("-").map(Number);
          if (y && m && d) {
            setSelectedYear(y);
            setSelectedMonth(m - 1);
            setSelectedDay(d);
          }
        }
      } catch (e) {
        console.log("failed to load profile in EditProfile:", e);
      }
    })();
  }, [user]);

  const themeStyles = useMemo(() => {
    return {
      backgroundColor: theme.colors.background,
      textColor: theme.colors.text,
      cardBackground: theme.colors.card,
      borderColor: theme.colors.cardBorder,
      inputBackground: theme.mode === "dark" ? "#161b25" : "#fff",
      profileBackground:
        theme.mode === "dark" ? theme.colors.card : "#797EF6",
      profileText: theme.colors.text,
      profileUsername:
        theme.mode === "dark" ? theme.colors.subtext : "#b8b8b8ff",
    };
  }, [theme]);

  const styles = createStyles(theme, themeStyles, isRTL);

  const effectiveGender =
    tempData?.gender || profile?.gender || user?.user_metadata?.gender || null;

  const avatarSrc = useMemo(() => getAvatar(effectiveGender), [effectiveGender]);

  const handleSave = async () => {
    if (saving) return;
    setSaving(true);

    try {
      await ensureProfile();

      const dob = toISODateOrNull(tempData.dateOfBirth);
      const fullPhone = toE164Ksa(tempData.phoneNumber);
      const cleanedEmail = (tempData.email || "").trim();

      if (cleanedEmail && !EMAIL_RE.test(cleanedEmail)) {
        Alert.alert("Invalid email", "ايميل غير صحيح");
        setSaving(false);
        return;
      }
      if (
        tempData.phoneNumber &&
        !PHONE_RE.test(tempData.phoneNumber.replace(/^0+/, ""))
      ) {
        Alert.alert("Invalid phone", "اكتب رقم جوال صحيح بدون مسافات");
        setSaving(false);
        return;
      }

      // تحديث جدول البروفايل فقط
      await updateMyProfile({
        first_name: tempData.firstName,
        last_name: tempData.lastName,
        username: tempData.username || null,
        gender: tempData.gender || null,
        date_of_birth: dob,
        phone: fullPhone,
        email: cleanedEmail || null, // إيميل البروفايل فقط (ليس auth)
      });

      // تحديث ميتاداتا الجنس في auth (اختياري)
      await supabase.auth.updateUser({
        data: { gender: tempData.gender || null },
      });

      Alert.alert("Saved", "Profile updated successfully!");
      setUserData({ ...tempData, email: cleanedEmail });
      navigation.goBack();
    } catch (e) {
      Alert.alert("Error", e?.message ?? String(e));
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setTempData({ ...userData });
    navigation.goBack();
  };

  const handleDateSelect = () => {
    const iso = new Date(selectedYear, selectedMonth, selectedDay)
      .toISOString()
      .slice(0, 10);
    setTempData({ ...tempData, dateOfBirth: iso });
    setShowDatePickerModal(false);
  };

  const handleGenderSelect = (key) => {
    setTempData((prev) => ({ ...prev, gender: key }));
    setShowGenderModal(false);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: themeStyles.backgroundColor }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={{ flex: 1 }}>
          {/* Header */}
          <View style={styles.header}>
            <Pressable onPress={() => navigation.goBack()}>
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
              <View style={styles.profileInfo}>
                <Text
                  style={[
                    styles.profileName,
                    { color: themeStyles.profileText },
                  ]}
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
                {!!tempData.email && (
                  <Text
                    style={[
                      styles.profileUsername,
                      { color: themeStyles.profileUsername },
                    ]}
                  >
                    {tempData.email}
                  </Text>
                )}
              </View>
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
              <Text style={[styles.formLabel, { color: themeStyles.textColor }]}>
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
              <Text style={[styles.formLabel, { color: themeStyles.textColor }]}>
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
              <Text style={[styles.formLabel, { color: themeStyles.textColor }]}>
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
              <Text style={[styles.formLabel, { color: themeStyles.textColor }]}>
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
              <Text style={[styles.formLabel, { color: themeStyles.textColor }]}>
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

              {/* Email (read-only) */}
              <Text style={[styles.formLabel, { color: themeStyles.textColor }]}>
                {t("Email")}
              </Text>
              <TextInput
                editable={false}
                selectTextOnFocus={false}
                style={[
                  styles.input,
                  {
                    backgroundColor: themeStyles.inputBackground,
                    color: themeStyles.textColor,
                    opacity: 0.7,
                  },
                ]}
                value={tempData.email}
                textAlign={isRTL ? "right" : "left"}
                placeholder="Email"
                placeholderTextColor={theme.colors.subtext}
              />

              {/* أزرار تغيير الإيميل والباسورد */}
              <View style={styles.securitySection}>
                
                <Pressable
                  style={[
                    styles.secondaryButton,
                    { borderColor: COLORS.purple2 },
                  ]}
                  onPress={() => navigation.navigate("ChangeEmail")}
                >
                  <Text
                    style={[
                      styles.secondaryButtonText,
                      { color: theme.colors.text },
                    ]}
                  >
                    {t("Change Email") || "Change Email"}
                  </Text>
                </Pressable>

                <Pressable
                  style={[
                    styles.secondaryButton,
                    { marginTop: 10, borderColor: COLORS.purple2 },
                  ]}
                  onPress={() => navigation.navigate("ChangePassword")}
                >
                  <Text
                    style={[
                      styles.secondaryButtonText,
                      { color: theme.colors.text },
                    ]}
                  >
                    {t("Change Password") || "Change Password"}
                  </Text>
                </Pressable>
              </View>

              {/* Buttons */}
              <View style={styles.buttonRow}>
                <Pressable style={styles.cancelButton} onPress={handleCancel}>
                  <Text style={styles.cancelButtonText}>{t("cancel")}</Text>
                </Pressable>
                <Pressable
                  style={[styles.saveButton, saving && { opacity: 0.7 }]}
                  onPress={handleSave}
                  disabled={saving}
                >
                  <Text style={styles.saveButtonText}>
                    {saving ? "Saving..." : t("save")}
                  </Text>
                </Pressable>
              </View>
            </View>
          </ScrollView>

          {/* Date Picker Modal */}
          <Modal visible={showDatePickerModal} transparent animationType="slide">
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
                  {t("select birthday")}
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
                            styles.pickerOptionText,
                            selectedDay === day &&
                              styles.selectedPickerOptionText,
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
                        key={month}
                        style={[
                          styles.pickerOption,
                          selectedMonth === index && styles.selectedPickerOption,
                        ]}
                        onPress={() => setSelectedMonth(index)}
                      >
                        <Text
                          style={[
                            styles.pickerOptionText,
                            selectedMonth === index &&
                              styles.selectedPickerOptionText,
                          ]}
                        >
                          {month}
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
                            styles.pickerOptionText,
                            selectedYear === year &&
                              styles.selectedPickerOptionText,
                          ]}
                        >
                          {year}
                        </Text>
                      </Pressable>
                    ))}
                  </ScrollView>
                </View>

                <View style={styles.modalButtons}>
                  <Pressable
                    style={styles.modalButton}
                    onPress={() => setShowDatePickerModal(false)}
                  >
                    <Text style={styles.modalButtonText}>{t("cancel")}</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.modalButton, styles.modalButtonPrimary]}
                    onPress={handleDateSelect}
                  >
                    <Text
                      style={[
                        styles.modalButtonText,
                        styles.modalButtonPrimaryText,
                      ]}
                    >
                      {t("selectDate")}
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </Modal>

          {/* Gender Selection Modal */}
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

                {GENDER_OPTIONS.map((key) => (
                  <Pressable
                    key={key}
                    style={styles.option}
                    onPress={() => handleGenderSelect(key)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        { color: themeStyles.textColor },
                      ]}
                    >
                      {t(key)}
                    </Text>
                  </Pressable>
                ))}

                <Pressable
                  style={styles.closeButton}
                  onPress={() => setShowGenderModal(false)}
                >
                  <Text style={styles.closeButtonText}>{t("close")}</Text>
                </Pressable>
              </View>
            </View>
          </Modal>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const createStyles = (theme, themeStyles, isRTL) =>
  StyleSheet.create({
    header: {
      flexDirection: isRTL ? "row-reverse" : "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingTop: 50,
      paddingBottom: 30,
      paddingHorizontal: 10,
    },
    profileSection: {
      borderRadius: 24,
      padding: 40,
      marginBottom: 16,
      marginHorizontal: 16,
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

    formContainer: {
      borderRadius: 16,
      padding: 24,
      marginHorizontal: 16,
      marginBottom: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
      borderWidth: 1,
      borderColor: theme.colors.cardBorder,
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
      fontSize: 16,
      color: theme.colors.text,
      backgroundColor: themeStyles.inputBackground,
      textAlign: isRTL ? "right" : "left",
      writingDirection: isRTL ? "rtl" : "ltr",
    },

    phoneRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    ksaBadge: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 12,
      height: 56,
      borderWidth: 2,
      borderColor: COLORS.purple2,
      borderRadius: 16,
      marginRight: 8,
      backgroundColor: themeStyles.inputBackground,
    },
    ksaFlag: { fontSize: 18, marginRight: 6 },
    ksaCode: { fontSize: 16, color: theme.colors.text },
    phoneInput: { flex: 1 },

    securitySection: {
      marginTop: 24,
    },
    securityTitle: {
      fontSize: 16,
      fontWeight: "600",
      marginBottom: 10,
      textAlign: isRTL ? "right" : "left",
    },
    secondaryButton: {
      paddingVertical: 12,
      borderRadius: 14,
      borderWidth: 2,
      alignItems: "center",
      justifyContent: "center",
    },
    secondaryButtonText: {
      fontSize: 15,
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

    datePickerContainer: {
      flexDirection: "row",
      height: 200,
      marginVertical: 16,
    },
    pickerColumn: { flex: 1 },
    pickerOption: { padding: 10, alignItems: "center" },
    selectedPickerOption: { backgroundColor: COLORS.purple1, borderRadius: 8 },
    pickerOptionText: { fontSize: 16, color: theme.colors.text },
    selectedPickerOptionText: { color: "#fff", fontWeight: "bold" },
    modalButtons: {
      flexDirection: isRTL ? "row-reverse" : "row",
      justifyContent: "space-between",
      marginTop: 16,
    },
    modalButton: {
      flex: 1,
      padding: 12,
      alignItems: "center",
      borderRadius: 8,
      marginHorizontal: 8,
      backgroundColor: theme.colors.subtext,
    },
    modalButtonPrimary: { backgroundColor: COLORS.purple1 },
    modalButtonText: { color: "#fff", fontWeight: "bold" },
    modalButtonPrimaryText: { color: "#fff" },
  });
