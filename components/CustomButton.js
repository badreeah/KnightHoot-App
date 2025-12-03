import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

export default function CustomButton({
  children,
  onPress,
  borderRadius,
  backgroundColor,
  textColor = "#fff",
  fontFamily,
  fontSize = 16,

  width = "100%",
  height = 50,
  borderWidth = 0,
  borderColor = "transparent",
  underline = false,
  style,
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        {
          backgroundColor,
          borderRadius,
          width,
          height,
          borderWidth,
          borderColor,
          justifyContent: "center",
          alignItems: "center",
        },
        style,
      ]}
    >
      <Text
        style={{
          color: textColor,
          fontFamily,
          fontSize,
          textDecorationLine: underline ? "underline" : "none",
        }}
      >
        {children}
      </Text>
    </Pressable>
  );
}
