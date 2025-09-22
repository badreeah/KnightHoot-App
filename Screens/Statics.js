import { View, Text, StyleSheet } from "react-native";
import React, { useMemo } from "react";
import { useAppSettings } from "../src/context/AppSettingProvid";
import { useTranslation } from "react-i18next";

export default function Statics() {
  const { theme, isRTL } = useAppSettings(); // get theme and RTL
  const styles = useMemo(() => createStyles(theme, isRTL), [theme, isRTL]); // create styles with theme

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Statics</Text>
    </View>
  );
}

const createStyles = (theme, isRTL) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background, // now theme works
      alignItems: "center",
      justifyContent: "center",
    },
    text: {
      color: theme.colors.text, // example text color from theme
    },
  });
