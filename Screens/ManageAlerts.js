import { View, Text } from "react-native";
import React from "react";
import { StyleSheet } from "react-native";

export default function ManageAlerts() {
  return (
    <View style={styles.container}>
      <Text>ManageAlerts</Text>
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
