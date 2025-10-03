import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Alert,
  ScrollView,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import KeyboaredAvoidingWrapper from "../components/KeyboaredAvoidingWrapper";
import CustomButton from "../components/CustomButton";
import { COLORS } from "../util/colors";
import { supabase } from "../supabaseClient";

export default function SetNewPasswordScreen({ navigation, route }) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const email = route.params.email;

  const handleConfirm = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }
    if (newPassword.length < 8) {
      Alert.alert("Error", "Password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    try {
      // Supabase password update for user email
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) throw error;

      Alert.alert("Success", "Password updated successfully");
      navigation.navigate("SignIn");
    } catch (err) {
      Alert.alert("Error", err.message || "Something went wrong");
      console.log(err);
    }
  };

  return (
    <ImageBackground
      source={require("../assets/images/bg.png")}
      style={styles.container}
      resizeMode="cover"
    >
      <KeyboaredAvoidingWrapper>
        <ScrollView contentContainerStyle={styles.overlay}>
          <View style={styles.topSection}>
            <Text style={styles.header}>KnightHooT</Text>
            <Text style={styles.title}>Set New Password</Text>
            <Text style={styles.subTitle}>Reset your Password</Text>
          </View>

          <Text style={styles.label}>New Password</Text>
          <View style={styles.inputContainer}>
            <MaterialIcons
              name="lock"
              size={20}
              color="#797df683"
              style={styles.icon}
            />
            <TextInput
              placeholder="At least 8 characters"
              placeholderTextColor={COLORS.gray1}
              style={styles.input}
              secureTextEntry={!newPasswordVisible}
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <TouchableOpacity
              onPress={() => setNewPasswordVisible(!newPasswordVisible)}
            >
              <Ionicons
                name={newPasswordVisible ? "eye" : "eye-off"}
                size={20}
                color="#797df683"
                style={styles.eyeIcon}
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Confirm Password</Text>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Re-enter password"
              placeholderTextColor={COLORS.gray1}
              style={styles.input}
              secureTextEntry={!confirmPasswordVisible}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity
              onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
            >
              <Ionicons
                name={confirmPasswordVisible ? "eye" : "eye-off"}
                size={20}
                color="#797df683"
                style={styles.eyeIcon}
              />
            </TouchableOpacity>
          </View>

          <CustomButton
            height={45}
            width={160}
            backgroundColor={COLORS.brightTiffany}
            fontFamily={"Poppins-600"}
            fontSize={18}
            borderRadius={6}
            onPress={handleConfirm}
            style={{ alignSelf: "center", marginTop: 30 }}
          >
            Confirm
          </CustomButton>
        </ScrollView>
      </KeyboaredAvoidingWrapper>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    alignItems: "center",
  },
  topSection: { marginBottom: 40, alignItems: "center" },
  header: {
    fontFamily: "Poppins-700",
    fontSize: 24,
    color: COLORS.purple8,
    marginBottom: 10,
    marginTop: 20,
  },
  title: {
    fontFamily: "Poppins-600",
    fontSize: 28,
    color: COLORS.purple5,
    marginBottom: 5,
    marginTop: 60,
  },
  subTitle: {
    fontFamily: "Poppins-400",
    fontSize: 16,
    color: COLORS.purple5,
    textAlign: "center",
    marginTop: 30,
  },
  label: {
    fontFamily: "Poppins-400",
    fontSize: 14,
    color: COLORS.purple5,
    alignSelf: "flex-start",
    marginBottom: 6,
    marginTop: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
    width: "100%",
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14,
    color: COLORS.gray1,
    fontFamily: "Poppins-400",
  },
  icon: { marginRight: 8 },
  eyeIcon: { marginLeft: 8 },
});
