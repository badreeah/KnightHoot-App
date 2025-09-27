import React, { useState } from "react";
import { StyleSheet, View, Text, Image, ActivityIndicator } from "react-native";
import { Video } from "expo-av";
import { useEffect, useRef } from "react";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import CustomButton from "../components/CustomButton";
import { TouchableOpacity } from "react-native";

// FrostedButton wrapper for reuse
const FrostedButton = ({ children, style, width, height, onPress }) => (
  <View style={[styles.frostedButtonContainer, style]}>
    <BlurView intensity={30} tint="light" style={styles.blur}>
      <LinearGradient
        colors={["rgba(255,255,255,0.1)", "rgba(255,255,255,0.2)"]}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.gradient,
          {
            borderWidth: 2,
            borderColor: "rgba(255,255,255,0.3)",
            width: width,
            height: height,
            justifyContent: "center",
            alignItems: "center",
          },
        ]}
      >
        <TouchableOpacity activeOpacity={0.8} style={style} onPress={onPress}>
          {children}
        </TouchableOpacity>
      </LinearGradient>
    </BlurView>
  </View>
);

export default function Welcome({ navigation }) {
  const videoRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (videoRef.current && isReady) {
      videoRef.current.playAsync();
    }
  }, [isReady]);
  return (
    <View style={styles.container}>
      {/* Background Video */}
      <Video
        ref={videoRef}
        source={require("../assets/images/CnwI8ks5la.mp4")}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
        shouldPlay={false} // initially false, play in useEffect
        isLooping
        isMuted
        useNativeControls={false}
        onReadyForDisplay={() => setIsReady(true)}
      />

      {/* Loader while video loads */}
      {!isReady && (
        <View style={styles.loaderOverlay}>
          <ActivityIndicator size={100} color="#6200EE" />
        </View>
      )}

      {/* Full-screen blur overlay */}
      <BlurView intensity={40} tint="light" style={StyleSheet.absoluteFill} />

      {/* Foreground content */}
      <View style={styles.overlay}>
        {/* Title */}
        <Text style={styles.title}>Welcome to KnightHooT</Text>

        {/* Row with Sign In / Sign Up */}
        <View style={styles.buttonRow}>
          <FrostedButton
            width={150}
            height={50}
            onPress={() => navigation.replace("SignIn")}
          >
            <Text style={styles.buttonText}>Sign In</Text>
          </FrostedButton>

          <FrostedButton width={150} height={50}>
            <Text
              style={styles.buttonText}
              onPress={() => navigation.navigate("SignUp")}
            >
              Sign Up
            </Text>
          </FrostedButton>
        </View>
      </View>
    </View>
  );
}

export { FrostedButton };

const styles = StyleSheet.create({
  container: { flex: 1 },
  loaderOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 300,
  },
  title: {
    fontFamily: "Poppins-800",
    fontSize: 28,
    color: "#fff",
    marginBottom: 40,
  },
  Image: {
    width: 350,
    height: 200,
    resizeMode: "contain",
    marginBottom: -50,
    marginTop: 30,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 60,
    gap: 32,
  },
  frostedButtonContainer: {
    borderRadius: 16,
    overflow: "hidden",
  },
  blur: {
    borderRadius: 16,
    overflow: "hidden",
  },
  gradient: {
    borderRadius: 16,
    overflow: "hidden",
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  googleButton: {
    width: 320,
    borderRadius: 16,
    overflow: "hidden",
  },
  googleButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  googleText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Poppins-500",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Poppins-600",
    textAlign: "center",
  },
});
