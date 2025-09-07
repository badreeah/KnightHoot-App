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
import KeyboaredAvoidingWrapper from "../components/KeyboaredAvoidingWrapper";

export default function SignUp({ navigation }) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [agree, setAgree] = useState(false);

  const handleSignIn = () => {
    navigation.replace("SignIn");
  };

  const handleSignUp = () => {
    navigation.navigate("Home");
  };

  return (
    <ImageBackground
      source={require("../assets/images/bg.png")}
      style={styles.container}
      resizeMode="cover"
    >
      <KeyboaredAvoidingWrapper>
        <View style={styles.overlay}>
          {/* Header / Title / Subtitle */}
          <View style={styles.topSection}>
            <Text style={styles.header}>KnightHooT</Text>
            <Text style={styles.title}>Sign Up</Text>
            <Text style={styles.subTitle}>
              Fill the form below or register with your Google account.
            </Text>
          </View>

          {/* Form Inputs */}
          <View style={styles.form}>
            {/* Username */}
            <Text style={styles.label}>Username</Text>
            <View style={styles.inputContainer}>
              <Ionicons
                name="person"
                size={20}
                color="#797df683"
                style={styles.icon}
              />
              <TextInput
                placeholder="e.g. sara"
                placeholderTextColor={COLORS.gray1}
                style={styles.input}
              />
            </View>

            {/* Phone number */}
            <Text style={styles.label}>Phone Number</Text>
            <View style={styles.inputContainer}>
              <Ionicons
                name="call"
                size={20}
                color="#797df683"
                style={styles.icon}
              />
              <TextInput
                placeholder="055xx"
                placeholderTextColor={COLORS.gray1}
                style={styles.input}
              />
            </View>

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
                  name={passwordVisible ? "eye" : "eye-off"}
                  size={20}
                  color="#797df683"
                  style={styles.eyeIcon}
                />
              </TouchableOpacity>
            </View>

            {/* Terms & Conditions Checkbox */}
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => setAgree(!agree)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={agree ? "checkbox" : "square-outline"}
                size={20}
                color={COLORS.purple5}
                style={{ marginRight: 8 }}
              />
              <Text style={styles.checkboxText}>
                Agree with{" "}
                <Text style={styles.termsLink}>Terms & Conditions</Text>
              </Text>
            </TouchableOpacity>

            {/* Buttons */}
            <View style={styles.buttonSection}>
              <CustomButton
                height={45}
                width={160}
                backgroundColor={COLORS.brightTiffany}
                fontFamily={"Poppins-600"}
                fontSize={18}
                borderRadius={6}
                onPress={handleSignUp}
              >
                Sign Up
              </CustomButton>
            </View>

            {/* Google Button */}
            <View style={styles.googleSection}>
              <CustomButton style={styles.googleButton}>
                <View style={styles.googleButtonContent}>
                  <Image
                    source={require("../assets/icons/google.png")}
                    style={styles.googleIcon}
                  />
                  <Text style={styles.googleText}>Sign Up with Google</Text>
                </View>
              </CustomButton>
            </View>

            {/* Already have account */}
            <View style={styles.signUpRow}>
              <Text style={styles.signUpText}>Already have an account? </Text>
              <TouchableOpacity onPress={handleSignIn}>
                <Text style={styles.signUpUnderline}>Sign In</Text>
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
    marginTop: 20,
  },
  subTitle: {
    fontFamily: "Poppins-400",
    fontSize: 16,
    color: COLORS.purple5,
    textAlign: "center",
    marginTop: 10,
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
    marginBottom: 15,
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
  buttonSection: {
    marginTop: 25,
    alignItems: "center",
  },
  googleSection: {
    marginTop: 65,
    alignItems: "center",
  },
  googleButton: {
    width: 320,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.purple3,
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
    marginTop: 20,
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
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
    marginBottom: 10,
    alignSelf: "flex-start",
    marginLeft: 28,
  },
  checkboxText: {
    fontFamily: "Poppins-400",
    fontSize: 13,
    color: COLORS.purple5,
  },
  termsLink: {
    color: "#797EF6",
    fontFamily: "Poppins-500",
    textDecorationLine: "underline",
  },
});
