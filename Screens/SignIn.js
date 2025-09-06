import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Image,
} from "react-native";
import { COLORS } from "../util/colors";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import CustomButton from "../components/CustomButton";

export default function SignIn({ navigation }) {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleSignIn = () => {
    navigation.replace("Home");
  };

  const handleSignUp = () => {
    navigation.navigate("SignUp");
  };

  return (
    <ImageBackground
      source={require("../assets/images/bg.png")}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        {/* Header / Title / Subtitle */}
        <View style={styles.topSection}>
          <Text style={styles.header}>KnightHooT</Text>
          <Text style={styles.title}>Sign In</Text>
          <Text style={styles.subTitle}>
            Hi, welcome back! You’ve been missed
          </Text>
        </View>

        {/* Form Inputs */}
        <View style={styles.form}>
          {/* Email */}
          <Text style={styles.label}>Email</Text>
          <View style={styles.inputContainer}>
            <Ionicons
              name="mail"
              size={20}
              color="#797df683"
              style={styles.icon}
            />
            <TextInput
              placeholder="example@abc.com"
              placeholderTextColor={COLORS.gray1}
              style={styles.input}
              keyboardType="email-address"
            />
          </View>

          {/* Password */}
          <Text style={styles.label}>Password</Text>
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
              secureTextEntry={!passwordVisible}
            />
            <TouchableOpacity
              onPress={() => setPasswordVisible(!passwordVisible)}
            >
              <Ionicons
                name={passwordVisible ? "eye-off" : "eye"}
                size={20}
                color="#797df683"
                style={styles.eyeIcon}
              />
            </TouchableOpacity>
          </View>
          {/* Forgot Password */}
          <TouchableOpacity
            onPress={() => navigation.navigate("ForgotPassword")}
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

          {/* Row Image */}
          <Image
            source={require("../assets/images/row2.png")}
            style={styles.rowImage}
          />

          {/* Google Button */}
          <CustomButton style={styles.googleButton}>
            <View style={styles.googleButtonContent}>
              <Image
                source={require("../assets/icons/google.png")}
                style={styles.googleIcon}
              />
              <Text style={styles.googleText}>Sign In with Google</Text>
            </View>
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
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  topSection: {
    marginBottom: 40,
    alignItems: "center",
  },
  header: {
    fontFamily: "Poppins-700",
    fontSize: 32,
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
  input: {
    flex: 1,
    paddingVertical: 10,
    fontFamily: "Poppins-400",
  },
  rowImage: {
    width: 300,
    height: 50,
    resizeMode: "contain",
    marginBottom: 20,
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
  signUpRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  signUpText: {
    color: "#4E1B96",
    fontSize: 14,
    fontFamily: "Poppins-400",
  },
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
