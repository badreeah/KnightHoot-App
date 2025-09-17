import { View, Text } from "react-native";
import React from "react";
import { StyleSheet } from "react-native";
import { useAppSettings } from "../src/context/AppSettingProvid";
import { useTranslation } from "react-i18next";


export default function SplshScreen() {
  return (
    <View style={styles.container}>
      <Text>SplshScreen</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
