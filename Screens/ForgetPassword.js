import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import KeyboaredAvoidingWrapper from "../components/KeyboaredAvoidingWrapper";
import CustomButton from "../components/CustomButton";
import { COLORS } from "../util/colors";
import supabase from "../supabase";

export default function ForgetPassword({ navigation }) {
  const [email, setEmail] = useState("");

  const handleForgetPassword = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email");
      return;
    }
    try {
      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: false, // prevent auto-signup
        },
      });
      if (error) throw error;

      Alert.alert("OTP Sent", "Check your email for the verification code.");
      navigation.navigate("VerificationOTP", { email });
    } catch (err) {
      Alert.alert("Error", err.message || "Something went wrong");
      console.log(err);
    }
  };

  const handleSignIn = () => navigation.replace("SignIn");
  const handleSignUp = () => navigation.navigate("SignUp");

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
            <Text style={styles.title}>Forgot Password</Text>
            <Text style={styles.subTitle}>Enter Email Address</Text>
          </View>

          <View style={styles.form}>
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
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View style={styles.signinRow}>
              <Text style={styles.signUpText}>You Remembered? </Text>
              <TouchableOpacity onPress={handleSignIn}>
                <Text style={styles.signUpUnderline}>Sign In</Text>
              </TouchableOpacity>
            </View>

            <CustomButton
              height={45}
              width={160}
              backgroundColor={COLORS.brightTiffany}
              fontFamily={"Poppins-600"}
              fontSize={18}
              borderRadius={6}
              onPress={handleForgetPassword}
              style={{ alignSelf: "center", marginTop: 45 }}
            >
              Verify
            </CustomButton>

            <View style={styles.signUpRow}>
              <Text style={styles.signUpText}>Don’t have an account? </Text>
              <TouchableOpacity onPress={handleSignUp}>
                <Text style={styles.signUpUnderline}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
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
  form: { alignItems: "center", width: "100%" },
  label: {
    fontFamily: "Poppins-400",
    fontSize: 12,
    color: COLORS.purple5,
    alignSelf: "flex-start",
    marginBottom: 5,
    paddingLeft: 32,
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
  input: { flex: 1, paddingVertical: 10, fontFamily: "Poppins-400" },

  signUpRow: { flexDirection: "row", justifyContent: "center", marginTop: 285 },
  signinRow: { flexDirection: "row", justifyContent: "center", marginTop: 24 },
  signUpText: { color: "#4E1B96", fontSize: 14, fontFamily: "Poppins-400" },
  signUpUnderline: {
    color: "#797EF6",
    fontSize: 14,
    fontFamily: "Poppins-600",
    textDecorationLine: "underline",
  },
});
