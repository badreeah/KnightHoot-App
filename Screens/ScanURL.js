<<<<<<< HEAD
// ملف: ScanURL.js في مجلد Screens
=======
// ملف: ScanURLScreen.js في مجلد Screens
>>>>>>> origin/feature/alerts-stats
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "../util/colors";

export default function ScanURLScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scan URL</Text>
      <Text style={styles.subtitle}>
        This is the Scan URL screen. Add your scanner form or input field here.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontFamily: "Poppins-600",
    color: COLORS.purple3,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "Poppins-400",
    color: COLORS.purple7,
    textAlign: "center",
  },
});
