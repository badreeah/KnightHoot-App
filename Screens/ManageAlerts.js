import { View, Text, useMemo} from "react-native";
import React from "react";
import { StyleSheet } from "react-native";
import { useAppSettings } from "../src/context/AppSettingProvid";
import { useTranslation } from "react-i18next";

export default function ManageAlerts() {
  return (
    <View style={styles.container}>
      <Text>ManageAlerts</Text>
    </View>
  );
}
const styles = (theme, isRTL) =>StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
});
