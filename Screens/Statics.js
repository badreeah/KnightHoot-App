import { View, Text } from "react-native";
import React from "react";
import { StyleSheet } from "react-native";
import { useAppSettings } from "../src/context/AppSettingProvid";
import { useTranslation } from "react-i18next";

export default function Statics() {
  return (
    <View style={styles.container}>
      <Text>Statics</Text>
    </View>
  );
}
const styles = (theme, isRTL) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
