import React, { useState } from "react";
import {
  View,
  Text,
  ImageBackground,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import KeyboaredAvoidingWrapper from "../components/KeyboaredAvoidingWrapper";
import CustomButton from "../components/CustomButton";
import { COLORS } from "../util/colors";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function SetNewPasswordScreen({ navigation }) {
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const handleSignUp = () => {
    navigation.navigate("SignUp");
  };
  const handelconfirm = () => {
    navigation.navigate("Home");
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
            <Text style={styles.title}>Set New Password</Text>
            <Text style={styles.subTitle}>Reset your Password</Text>
          </View>

          {/* Enter New Password */}
          <Text style={styles.label}>Enter New Password</Text>
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
            />
            <TouchableOpacity
              onPress={() => setNewPasswordVisible(!newPasswordVisible)}
            ></TouchableOpacity>
          </View>

          {/* Confirm Password */}
          <Text style={styles.label}>Confirm Password</Text>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Re-enter password"
              placeholderTextColor={COLORS.gray1}
              style={styles.input}
              secureTextEntry={!confirmPasswordVisible}
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

          {/* Sign In Button */}
          <CustomButton
            height={45}
            width={160}
            backgroundColor={COLORS.brightTiffany}
            fontFamily={"Poppins-600"}
            fontSize={18}
            borderRadius={6}
            onPress={handelconfirm}
            style={{ alignSelf: "center", marginTop: 42 }}
          >
            Confirm
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
  rowImage: {
    width: 300,
    height: 50,
    resizeMode: "contain",
    marginBottom: 20,
    marginTop: 90,
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
