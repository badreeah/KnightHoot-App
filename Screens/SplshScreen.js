import { View, Text, StyleSheet } from "react-native";
import React, { useMemo } from "react";
import { useAppSettings } from "../src/context/AppSettingProvid";
import { useTranslation } from "react-i18next";

export default function SplashScreen() {
  const { theme, isRTL } = useAppSettings(); // get theme & RTL
  const { t } = useTranslation(); // for i18n
  const styles = useMemo(() => createStyles(theme, isRTL), [theme, isRTL]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{t("splash.title", "SplashScreen")}</Text>
    </View>
  );
}

const createStyles = (theme, isRTL) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background, // dynamic background
      alignItems: "center",
      justifyContent: "center",
    },
    text: {
      color: theme.colors.text, // dynamic text color
      fontSize: 24,
      fontFamily: "Poppins-600",
      textAlign: isRTL ? "right" : "left",
    },
  });
