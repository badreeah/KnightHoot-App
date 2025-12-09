// ChangePasswordScreen.js
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
      Alert.alert(t("errors.title"), t("password.errors.fillAll"));
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert(t("errors.title"), t("password.errors.minLength"));
      return;
    }

    if (newPassword !== confirmNewPassword) {
      Alert.alert(t("errors.title"), t("password.errors.notMatch"));
      return;
    }

    setLoading(true);
    try {
      const email = user?.email;
      if (!email) throw new Error(t("password.errors.noEmail"));

      // تحقق من الباسورد الحالي
      const { error: signinError } = await supabase.auth.signInWithPassword({
        email,
        password: currentPassword,
      });

      if (signinError) {
        Alert.alert(t("errors.title"), t("password.errors.wrongCurrent"));
        setLoading(false);
        return;
      }

      // تحديث الباسورد
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        Alert.alert(t("errors.title"), updateError.message);
        setLoading(false);
        return;
      }

      Alert.alert(t("success.title"), t("password.success.updated"), [
        { text: t("ok"), onPress: () => navigation.goBack() },
      ]);

      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (e) {
      Alert.alert(t("errors.title"), e?.message ?? t("errors.generic"));
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
        <View style={[styles.container, { paddingBottom: (insets?.bottom ?? 0) + 16 }]}>
          {/* Header */}
          <View style={styles.header}>
            <Pressable onPress={() => navigation.goBack()}>
              <Ionicons name={ "arrow-back"} size={24} color={COLORS.purple8} />
            </Pressable>
            <Text style={styles.headerTitle}>{t("password.title")}</Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="handled">
            <View style={[styles.card, { backgroundColor: themeStyles.cardBackground, borderColor: themeStyles.borderColor }]}>
              
              {/* Current password */}
              <Text style={[styles.label, { color: themeStyles.textColor }]}>{t("password.current")}</Text>
              <View>
                <TextInput
                  style={[styles.input, { backgroundColor: themeStyles.inputBackground, color: themeStyles.textColor }]}
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  secureTextEntry={!showCurrent}
                  textAlign={isRTL ? "right" : "left"}
                  placeholder={t("password.placeholders.current")}
                  placeholderTextColor={theme.colors.subtext}
                />
                <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowCurrent(v => !v)}>
                  <Ionicons name={showCurrent ? "eye" : "eye-off"} size={20} color="#797df6" />
                </TouchableOpacity>
              </View>

              {/* New password */}
              <Text style={[styles.label, { color: themeStyles.textColor }]}>{t("password.new")}</Text>
              <View>
                <TextInput
                  style={[styles.input, { backgroundColor: themeStyles.inputBackground, color: themeStyles.textColor }]}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry={!showNew}
                  textAlign={isRTL ? "right" : "left"}
                  placeholder={t("password.placeholders.new")}
                  placeholderTextColor={theme.colors.subtext}
                />
                <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowNew(v => !v)}>
                  <Ionicons name={showNew ? "eye" : "eye-off"} size={20} color="#797df6" />
                </TouchableOpacity>
              </View>

              {/* Confirm */}
              <Text style={[styles.label, { color: themeStyles.textColor }]}>{t("password.confirm")}</Text>
              <View>
                <TextInput
                  style={[styles.input, { backgroundColor: themeStyles.inputBackground, color: themeStyles.textColor }]}
                  value={confirmNewPassword}
                  onChangeText={setConfirmNewPassword}
                  secureTextEntry={!showConfirm}
                  textAlign={isRTL ? "right" : "left"}
                  placeholder={t("password.placeholders.confirm")}
                  placeholderTextColor={theme.colors.subtext}
                />
                <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowConfirm(v => !v)}>
                  <Ionicons name={showConfirm ? "eye" : "eye-off"} size={20} color="#797df6" />
                </TouchableOpacity>
              </View>

              {/* Button */}
              <View style={styles.buttonRow}>
                <Pressable style={[styles.saveButton, loading && { opacity: 0.7 }]} onPress={handleChangePassword}>
                  <Text style={styles.saveButtonText}>
                    {loading ? t("loading") : t("save")}
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
    container: { flex: 1, backgroundColor: themeStyles.backgroundColor, paddingHorizontal: 10 },
    header: {
      flexDirection:  "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingTop: 50,
      paddingBottom: 30,
    },
    headerTitle: { fontSize: 20, fontWeight: "600", color: theme.colors.text },
    card: {
      borderRadius: 16,
      padding: 24,
      marginHorizontal: 6,
      marginBottom: 20,
      borderWidth: 1,
    },
    label: { fontSize: 16, fontWeight: "600", marginBottom: 8, marginTop: 16, textAlign: isRTL ? "right" : "left" },
    input: {
      borderWidth: 2,
      borderRadius: 16,
      padding: 16,
      fontSize: 16,
      borderColor: COLORS.purple2,
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
    buttonRow: { marginTop: 32 },
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
