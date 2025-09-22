import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useAppSettings } from "../src/context/AppSettingProvid";
import { useTranslation } from "react-i18next";

export default function ManageAlerts() {
  const { theme, isRTL } = useAppSettings();
  const { t } = useTranslation();

  const styles = createStyles(theme, isRTL);

  return (
    <View style={styles.container}>
      <Text style={{ color: theme.colors.text }}>{t("manageAlerts")}</Text>
    </View>
  );
}

const createStyles = (theme, isRTL) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 16,
    },
  });
