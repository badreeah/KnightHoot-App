// ChangeEmailScreen.js
import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
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
import { updateMyProfile } from "../src/api/profile";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ChangeEmailScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { theme, isRTL, user } = useAppSettings();

  const [newEmail, setNewEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

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

  const handleChangeEmail = async () => {
    const trimmedEmail = newEmail.trim();

    if (!trimmedEmail || !password) {
      Alert.alert(t("errors.title"), t("email.errors.fillAll"));
      return;
    }

    if (!EMAIL_RE.test(trimmedEmail)) {
      Alert.alert(t("errors.title"), t("email.errors.invalid"));
      return;
    }

    setLoading(true);
    try {
      const currentEmail = user?.email;
      if (!currentEmail) throw new Error(t("email.errors.noEmail"));

      // تأكيد الباسورد
      const { error: signinError } = await supabase.auth.signInWithPassword({
        email: currentEmail,
        password,
      });

      if (signinError) {
        Alert.alert(t("errors.title"), t("email.errors.wrongPassword"));
        setLoading(false);
        return;
      }

      // تحديث الايميل في auth
      const { error: updateError } = await supabase.auth.updateUser({
        email: trimmedEmail,
      });

      if (updateError) {
        Alert.alert(t("errors.title"), updateError.message);
        setLoading(false);
        return;
      }

      await updateMyProfile({ email: trimmedEmail });

      Alert.alert(
        t("email.verifyTitle"),
        t("email.verifyMessage"),
        [{ text: t("ok"), onPress: () => navigation.goBack() }]
      );
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
            <Text style={styles.headerTitle}>{t("email.title")}</Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="handled">
            <View style={[styles.card, { backgroundColor: themeStyles.cardBackground, borderColor: themeStyles.borderColor }]}>

              <Text style={[styles.label, { color: themeStyles.textColor }]}>{t("email.new")}</Text>
              <TextInput
                style={[styles.input, { backgroundColor: themeStyles.inputBackground, color: themeStyles.textColor }]}
                value={newEmail}
                onChangeText={setNewEmail}
                textAlign={isRTL ? "right" : "left"}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder={t("email.placeholders.new")}
                placeholderTextColor={theme.colors.subtext}
              />

              <Text style={[styles.label, { color: themeStyles.textColor }]}>{t("email.password")}</Text>
              <TextInput
                style={[styles.input, { backgroundColor: themeStyles.inputBackground, color: themeStyles.textColor }]}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                textAlign={isRTL ? "right" : "left"}
                placeholder={t("email.placeholders.password")}
                placeholderTextColor={theme.colors.subtext}
              />

              <View style={styles.buttonRow}>
                <Pressable
                  style={[styles.saveButton, loading && { opacity: 0.7 }]}
                  onPress={handleChangeEmail}
                  disabled={loading}
                >
                  <Text style={styles.saveButtonText}>{loading ? t("loading") : t("save")}</Text>
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
