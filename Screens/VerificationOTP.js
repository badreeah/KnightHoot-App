import React, { useState } from "react";
import {
  View,
  Text,
  ImageBackground,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import KeyboaredAvoidingWrapper from "../components/KeyboaredAvoidingWrapper";
import CustomButton from "../components/CustomButton";
import { COLORS } from "../util/colors";
import CodeInputField from "../components/CodeInputField";

export default function VerificationOTP({ navigation }) {
  const [code, setCode] = useState("");
  const [pinReady, setPinReady] = useState(false);

  const MAX_CODE_LENGTH = 4;
  const handleResend = () => {
    navigation.navigate("SetNewPasswordScreen");
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
      <KeyboaredAvoidingWrapper>
        <ScrollView contentContainerStyle={styles.overlay}>
          {/* Header / Title / Subtitle */}
          <View style={styles.topSection}>
            <Text style={styles.header}>KnightHooT</Text>
            <Text style={styles.title}>Verification OTP</Text>
            <Text style={styles.subTitle}>
              Enter the OTP code sent to your email
            </Text>
          </View>

          <CodeInputField
            code={code}
            setCode={setCode}
            setPinReady={setPinReady}
            MAX_CODE_LENGTH={4}
          />

          {/* Resend Text */}
          <View style={styles.signUpRow}>
            <Text style={styles.signUpText}>
              If you didn’t receive a code,{" "}
            </Text>
            <TouchableOpacity onPress={handleResend}>
              <Text style={styles.signUpUnderline}>Resend</Text>
            </TouchableOpacity>
          </View>

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
  topSection: {
    marginBottom: 40,
    alignItems: "center",
  },
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
  rowImage: {
    width: 300,
    height: 50,
    resizeMode: "contain",
    marginBottom: 20,
    marginTop: 200,
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
    fontFamily: "Poppins-300",
  },
  signUpUnderline: {
    color: "#797EF6",
    fontSize: 14,
    fontFamily: "Poppins-600",
    textDecorationLine: "underline",
  },
});
