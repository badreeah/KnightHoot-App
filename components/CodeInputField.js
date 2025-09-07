import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useRef, useState, useEffect } from "react";

export default function CodeInputField({
  code,
  setCode,
  setPinReady,
  MAX_CODE_LENGTH = 4,
}) {
  const textInputRef = useRef(null);

  // Track if input is ready
  useEffect(() => {
    setPinReady(code.length === MAX_CODE_LENGTH);
  }, [code]);

  // Create array for boxes
  const boxArray = new Array(MAX_CODE_LENGTH).fill(0);

  return (
    <View style={styles.CodeInputSection}>
      {/* Hidden Input */}
      <TextInput
        ref={textInputRef}
        style={styles.HiddenTextInput}
        value={code}
        onChangeText={setCode}
        maxLength={MAX_CODE_LENGTH}
        keyboardType="number-pad"
        autoFocus={true}
      />

      {/* Touchable wrapper to focus input when pressing boxes */}
      <TouchableOpacity
        style={{ flexDirection: "row", justifyContent: "space-between" }}
        activeOpacity={1}
        onPress={() => textInputRef.current.focus()}
      >
        {boxArray.map((_, index) => {
          const digit = code[index] || "";
          return (
            <View
              key={index}
              style={[
                styles.CodeInputBox,
                { borderColor: index === code.length ? "#6200EE" : "#ccc" },
              ]}
            >
              <Text style={styles.CodeInputText}>{digit}</Text>
            </View>
          );
        })}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  CodeInputSection: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 30,
  },
  HiddenTextInput: {
    position: "absolute",
    opacity: 0,
  },
  CodeInputBox: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    margin: 5,
    minWidth: 50,
    alignItems: "center",
  },
  CodeInputText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
});
