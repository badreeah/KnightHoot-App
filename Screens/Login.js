import { View, Text } from "react-native";
import React from "react";
import { StyleSheet } from "react-native";

export default function login() {
  return (
    <View style={styles.container}>
      <Text>login</Text>
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
