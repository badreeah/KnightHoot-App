import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ImageBackground,
  Image,
  StyleSheet,
  Modal,
} from "react-native";
import { COLORS } from "../util/colors";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import CustomButton from "../components/CustomButton";
import KeyboaredAvoidingWrapper from "../components/KeyboaredAvoidingWrapper";
import { supabase } from "../supabaseClient";

export default function SignIn({ navigation }) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password.");
      return;
    }

    try {
      // Attempt to sign in
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // If account doesn’t exist
        if (
          error.message.includes("Invalid login") ||
          error.message.includes("User not found")
        ) {
          Alert.alert(
            "No Account Found",
            "This email has no account. Please sign up first.",
            [
              {
                text: "Go to Sign Up",
                onPress: () => navigation.navigate("SignUp"),
              },
              { text: "Cancel", style: "cancel" },
            ]
          );
        } else {
          Alert.alert("Error", error.message);
        }
        return;
      }

      // Success: navigate to Home
      navigation.replace("Home");
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Something went wrong. Try again.");
    }
  };

  const handleSignUp = () => navigation.navigate("SignUp");

  return (
    <ImageBackground
      source={require("../assets/images/bg.png")}
      style={styles.container}
      resizeMode="cover"
    >
      <KeyboaredAvoidingWrapper>
        <View style={styles.overlay}>
          {/* Header */}
          <View style={styles.topSection}>
            <Text style={styles.header}>KnightHooT</Text>
            <Text style={styles.title}>Sign In</Text>
            <Text style={styles.subTitle}>
              Hi, welcome back! You’ve been missed
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Email */}
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="mail" size={20} color="#797df683" />
              <TextInput
                placeholder="example@abc.com"
                placeholderTextColor={COLORS.gray1}
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            {/* Password */}
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputContainer}>
              <MaterialIcons name="lock" size={20} color="#797df683" />
              <TextInput
                placeholder="At least 8 characters"
                placeholderTextColor={COLORS.gray1}
                style={styles.input}
                secureTextEntry={!passwordVisible}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                onPress={() => setPasswordVisible(!passwordVisible)}
              >
                <Ionicons
                  name={passwordVisible ? "eye" : "eye-off"}
                  size={20}
                  color="#797df683"
                />
              </TouchableOpacity>
            </View>

            {/* Forgot Password */}
            <TouchableOpacity
              onPress={() => navigation.navigate("ForgetPassword")}
              style={styles.forgotPasswordContainer}
            >
              <Text style={styles.forgotPasswordText}>Forgot password?</Text>
            </TouchableOpacity>

            {/* Sign In Button */}
            <CustomButton
              height={45}
              width={160}
              backgroundColor={COLORS.brightTiffany}
              fontFamily={"Poppins-600"}
              fontSize={18}
              borderRadius={6}
              onPress={handleSignIn}
              style={{ alignSelf: "center", marginBottom: 20 }}
            >
              Sign In
            </CustomButton>

            {/* Sign Up Text */}
            <View style={styles.signUpRow}>
              <Text style={styles.signUpText}>Don’t have an account? </Text>
              <TouchableOpacity onPress={handleSignUp}>
                <Text style={styles.signUpUnderline}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboaredAvoidingWrapper>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 65,
    justifyContent: "center",
    alignItems: "center",
  },
  topSection: {
    marginBottom: 40,
    alignItems: "center",
  },
  header: {
    fontFamily: "Poppins-700",
    fontSize: 24,
    color: COLORS.purple8,
    marginBottom: 10,
  },
  title: {
    fontFamily: "Poppins-600",
    fontSize: 28,
    color: COLORS.purple5,
    marginBottom: 5,
    marginTop: 40,
  },
  subTitle: {
    fontFamily: "Poppins-400",
    fontSize: 16,
    color: COLORS.purple5,
    textAlign: "center",
    marginTop: 20,
  },
  form: {
    alignItems: "center",
    width: "100%",
  },
  label: {
    fontFamily: "Poppins-400",
    fontSize: 12,
    color: COLORS.purple5,
    alignSelf: "flex-start",
    marginBottom: 5,
    paddingLeft: 28,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 12,
    paddingHorizontal: 10,
    marginBottom: 20,
    width: "100%",
    maxWidth: 320,
    borderWidth: 1,
    borderColor: COLORS.purple3,
  },
  icon: { marginRight: 10 },
  eyeIcon: { marginLeft: 10 },
  input: { flex: 1, paddingVertical: 10, fontFamily: "Poppins-400" },
  rowImage: {
    width: 300,
    height: 50,
    resizeMode: "contain",
    marginBottom: 20,
    marginTop: 120,
  },
  googleButton: {
    width: 320,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.purple3,
    marginBottom: 20,
  },
  googleButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
  },
  googleIcon: { width: 21, height: 21, marginRight: 10 },
  googleText: {
    color: COLORS.purple3,
    fontSize: 16,
    fontFamily: "Poppins-300",
  },
  signUpRow: { flexDirection: "row", justifyContent: "center", marginTop: 260 },
  signUpText: { color: "#4E1B96", fontSize: 14, fontFamily: "Poppins-400" },
  signUpUnderline: {
    color: "#797EF6",
    fontSize: 14,
    fontFamily: "Poppins-600",
    textDecorationLine: "underline",
  },
  forgotPasswordContainer: {
    width: "100%",
    maxWidth: 320,
    alignSelf: "flex-end",
    paddingRight: 28,
    marginBottom: 20,
  },
  forgotPasswordText: {
    fontFamily: "Poppins-500",
    fontSize: 12,
    color: "#797EF6",
    textDecorationLine: "underline",
    textAlign: "right",
  },
});
