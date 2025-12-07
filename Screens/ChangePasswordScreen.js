// Screens/ChangePasswordScreen.js
import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

import { useAppSettings } from "../src/context/AppSettingProvid";
import { COLORS } from "../util/colors";
import supabase from "../supabase";

export default function ChangePasswordScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { theme, isRTL, user } = useAppSettings();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const themeStyles = useMemo(
    () => ({
      backgroundColor: theme.colors.background,
      textColor: theme.colors.text,
      cardBackground: theme.colors.card,
      borderColor: theme.colors.cardBorder,
      inputBackground: theme.mode === "dark" ? "#161b25" : "#fff",
    }),
    [theme]
  );

  const styles = createStyles(theme, themeStyles, isRTL);

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert("Error", "New password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      // 1) تأكيد الباسورد الحالي عن طريق تسجيل الدخول
      const email = user?.email;
      if (!email) {
        throw new Error("Cannot find current user email");
      }

      const { error: signinError } = await supabase.auth.signInWithPassword({
        email,
        password: currentPassword,
      });

      if (signinError) {
        Alert.alert("Error", "Current password is incorrect");
        setLoading(false);
        return;
      }

      // 2) تحديث الباسورد في Supabase Auth
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        Alert.alert("Error", updateError.message);
        setLoading(false);
        return;
      }

      Alert.alert("Success", "Password updated successfully", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]);

      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (e) {
      Alert.alert("Error", e?.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: themeStyles.backgroundColor }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View
          style={[
            styles.container,
            { paddingBottom: (insets?.bottom ?? 0) + 16 },
          ]}
        >
          {/* Header */}
          <View className="header" style={styles.header}>
            <Pressable onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color={COLORS.purple8} />
            </Pressable>
            <Text style={styles.headerTitle}>{t("Change Password")}</Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View
              style={[
                styles.card,
                {
                  backgroundColor: themeStyles.cardBackground,
                  borderColor: themeStyles.borderColor,
                },
              ]}
            >
              {/* Current password */}
              <Text style={[styles.label, { color: themeStyles.textColor }]}>
                {t("Current Password")}
              </Text>
              <View>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: themeStyles.inputBackground,
                      color: themeStyles.textColor,
                    },
                  ]}
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  secureTextEntry={!showCurrent}
                  textAlign={isRTL ? "right" : "left"}
                  placeholder="Enter current password"
                  placeholderTextColor={theme.colors.subtext}
                />
                <TouchableOpacity
                  style={styles.eyeBtn}
                  onPress={() => setShowCurrent((v) => !v)}
                >
                  <Ionicons
                    name={showCurrent ? "eye" : "eye-off"}
                    size={20}
                    color="#797df6"
                  />
                </TouchableOpacity>
              </View>

              {/* New password */}
              <Text style={[styles.label, { color: themeStyles.textColor }]}>
                {t("New Password")}
              </Text>
              <View>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: themeStyles.inputBackground,
                      color: themeStyles.textColor,
                    },
                  ]}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry={!showNew}
                  textAlign={isRTL ? "right" : "left"}
                  placeholder="Enter new password"
                  placeholderTextColor={theme.colors.subtext}
                />
                <TouchableOpacity
                  style={styles.eyeBtn}
                  onPress={() => setShowNew((v) => !v)}
                >
                  <Ionicons
                    name={showNew ? "eye" : "eye-off"}
                    size={20}
                    color="#797df6"
                  />
                </TouchableOpacity>
              </View>

              {/* Confirm new password */}
              <Text style={[styles.label, { color: themeStyles.textColor }]}>
                {t("Confirm New Password")}
              </Text>
              <View>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: themeStyles.inputBackground,
                      color: themeStyles.textColor,
                    },
                  ]}
                  value={confirmNewPassword}
                  onChangeText={setConfirmNewPassword}
                  secureTextEntry={!showConfirm}
                  textAlign={isRTL ? "right" : "left"}
                  placeholder="Re-enter new password"
                  placeholderTextColor={theme.colors.subtext}
                />
                <TouchableOpacity
                  style={styles.eyeBtn}
                  onPress={() => setShowConfirm((v) => !v)}
                >
                  <Ionicons
                    name={showConfirm ? "eye" : "eye-off"}
                    size={20}
                    color="#797df6"
                  />
                </TouchableOpacity>
              </View>

              {/* Button */}
              <View style={styles.buttonRow}>
                <Pressable
                  style={[styles.saveButton, loading && { opacity: 0.7 }]}
                  onPress={handleChangePassword}
                  disabled={loading}
                >
                  <Text style={styles.saveButtonText}>
                    {loading ? t("Saving...") : t("save")}
                  </Text>
                </Pressable>
              </View>
            </View>
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const createStyles = (theme, themeStyles, isRTL) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: themeStyles.backgroundColor,
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
    card: {
      borderRadius: 16,
      padding: 24,
      marginHorizontal: 6,
      marginBottom: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
      borderWidth: 1,
    },
    label: {
      fontSize: 16,
      fontWeight: "600",
      marginBottom: 8,
      marginTop: 16,
      textAlign: isRTL ? "right" : "left",
    },
    input: {
      borderWidth: 2,
      borderRadius: 16,
      padding: 16,
      fontSize: 16,
      borderColor: COLORS.purple2,
      textAlign: isRTL ? "right" : "left",
      writingDirection: isRTL ? "rtl" : "ltr",
    },
    eyeBtn: {
      position: "absolute",
      right: 12,
      height: 56,
      width: 40,
      alignItems: "center",
      justifyContent: "center",
    },
    buttonRow: {
      marginTop: 32,
    },
    saveButton: {
      paddingVertical: 16,
      borderRadius: 16,
      alignItems: "center",
      backgroundColor: theme.colors.primary,
    },
    saveButtonText: {
      color: theme.colors.primaryTextOn,
      fontWeight: "500",
      fontSize: 16,
    },
  });
