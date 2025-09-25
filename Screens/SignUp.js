import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Alert,
} from "react-native";
import { COLORS } from "../util/colors";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import CustomButton from "../components/CustomButton";
import KeyboaredAvoidingWrapper from "../components/KeyboaredAvoidingWrapper";
import supabase from "../supabase";

export default function SignUp({ navigation }) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [agree, setAgree] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [phoneNum, setPhoneNum] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleSignIn = () => navigation.replace("SignIn");

  const handleSignUp = async () => {
    // Terms agreement check
    if (!agree) {
      Alert.alert("Error", "You must agree to the Terms & Conditions");
      return;
    }
    // Required fields check
    if (!email || !password || !userName || !phoneNum) {
      Alert.alert("Error", "All fields are required");
      return;
    }
    // Password length check
    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return;
    } else {
      setPasswordError("");
    }

    try {
      // 1. Sign up with Supabase Auth
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;

      if (!data?.user?.id) {
        Alert.alert("Error", "Unable to create account. Please try again.");
        return;
      }

      // 2. Insert user data into 'users' table
      const { error: tableError } = await supabase.from("users").insert([
        {
          id: data.user.id,
          username: userName,
          email,
          phoneNum,
        },
      ]);
      if (tableError) throw tableError;

      Alert.alert("Success", "Account created!.");
      navigation.navigate("SignIn");
    } catch (err) {
      Alert.alert("Error", err.message || "Something went wrong!");
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
        <View style={styles.overlay}>
          {/* Header */}
          <View style={styles.topSection}>
            <Text style={styles.header}>KnightHooT</Text>
            <Text style={styles.title}>Sign Up</Text>
            <Text style={styles.subTitle}>
              Fill the form below or register with your Google account.
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Username */}
            <Text style={styles.label}>Username</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="person" size={20} color="#797df683" />
              <TextInput
                placeholder="e.g. Sara"
                placeholderTextColor={COLORS.gray1}
                style={styles.input}
                value={userName}
                onChangeText={setUserName}
              />
            </View>

            {/* Phone */}
            <Text style={styles.label}>Phone Number</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="call" size={20} color="#797df683" />
              <TextInput
                placeholder="055xx"
                placeholderTextColor={COLORS.gray1}
                style={styles.input}
                value={phoneNum}
                onChangeText={setPhoneNum}
              />
            </View>

            {/* Email */}
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="mail" size={20} color="#797df683" />
              <TextInput
                placeholder="example@abc.com"
                placeholderTextColor={COLORS.gray1}
                style={styles.input}
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            {/* Password */}
            <Text style={styles.label}>Password</Text>
            <View
              style={[
                styles.inputContainer,
                passwordError ? { borderColor: "red", borderWidth: 1 } : {},
              ]}
            >
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
            {passwordError ? (
              <Text
                style={{
                  color: "red",
                  alignSelf: "flex-start",
                  marginLeft: 28,
                  marginBottom: 10,
                }}
              >
                {passwordError}
              </Text>
            ) : null}

            {/* Terms */}
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => setAgree(!agree)}
            >
              <Ionicons
                name={agree ? "checkbox" : "square-outline"}
                size={20}
                color={COLORS.purple5}
              />
              <Text style={styles.checkboxText}>
                Agree with{" "}
                <Text style={styles.termsLink}>Terms & Conditions</Text>
              </Text>
            </TouchableOpacity>

            {/* Sign Up Button */}
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

            {/* Navigate to Sign In */}
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
  header: { fontFamily: "Poppins-700", fontSize: 24, color: COLORS.purple8 },
  title: {
    fontFamily: "Poppins-600",
    fontSize: 28,
    color: COLORS.purple5,
    marginTop: 20,
  },
  subTitle: {
    fontFamily: "Poppins-400",
    fontSize: 16,
    color: COLORS.purple5,
    textAlign: "center",
    marginTop: 10,
  },
  form: { alignItems: "center", width: "100%" },
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
  input: { flex: 1, paddingVertical: 10, fontFamily: "Poppins-400" },
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
  buttonSection: { marginTop: 25, alignItems: "center" },
  signUpRow: { flexDirection: "row", justifyContent: "center", marginTop: 20 },
  signUpText: { color: "#4E1B96", fontSize: 14, fontFamily: "Poppins-400" },
  signUpUnderline: {
    color: "#797EF6",
    fontSize: 14,
    fontFamily: "Poppins-600",
    textDecorationLine: "underline",
  },
});
