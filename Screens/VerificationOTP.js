import React, { useState } from "react";
import {
  View,
  Text,
  ImageBackground,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import KeyboaredAvoidingWrapper from "../components/KeyboaredAvoidingWrapper";
import CustomButton from "../components/CustomButton";
import { COLORS } from "../util/colors";
import CodeInputField from "../components/CodeInputField";
import { supabase } from "../supabaseClient";

export default function VerificationOTP({ navigation, route }) {
  const [code, setCode] = useState("");
  const [pinReady, setPinReady] = useState(false);
  const email = route.params.email; // from ForgetPassword

  const MAX_CODE_LENGTH = 6;

  const handleVerifyOTP = async () => {
    if (!code || code.length !== MAX_CODE_LENGTH) {
      Alert.alert("Error", "Please enter the valid OTP code");
      return;
    }

    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.verifyOtp({
        email,
        token: code,
        type: "email",
      });

      if (error) {
        Alert.alert("Error", error.message);
        return;
      }

      if (session) {
        Alert.alert("Success", "OTP verified! Set your new password.");
        navigation.navigate("SetNewPasswordScreen", { email });
      }
    } catch (err) {
      Alert.alert("Error", "Failed to verify OTP");
      console.log(err);
    }
  };

  const handleResend = () => navigation.navigate("ForgetPassword");

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
            <Text style={styles.title}>Verification OTP</Text>
            <Text style={styles.subTitle}>
              Enter the OTP code sent to your email
            </Text>
          </View>

          <CodeInputField
            code={code}
            setCode={setCode}
            setPinReady={setPinReady}
            MAX_CODE_LENGTH={MAX_CODE_LENGTH}
          />

          <View style={styles.signUpRow}>
            <Text style={styles.signUpText}>
              If you didn’t receive a code,{" "}
            </Text>
            <TouchableOpacity onPress={handleResend}>
              <Text style={styles.signUpUnderline}>Resend</Text>
            </TouchableOpacity>
          </View>

          <CustomButton
            height={45}
            width={160}
            backgroundColor={COLORS.brightTiffany}
            fontFamily={"Poppins-600"}
            fontSize={18}
            borderRadius={6}
            onPress={handleVerifyOTP}
            style={{ alignSelf: "center", marginTop: 30 }}
          >
            Verify OTP
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
  signUpRow: { flexDirection: "row", justifyContent: "center", marginTop: 20 },
  signUpText: { color: "#4E1B96", fontSize: 14, fontFamily: "Poppins-400" },
  signUpUnderline: {
    color: "#797EF6",
    fontSize: 14,
    fontFamily: "Poppins-600",
    textDecorationLine: "underline",
  },
});
