import { View, StyleSheet, Dimensions, ActivityIndicator } from "react-native";
<<<<<<< HEAD
import React, { useRef, useState, useEffect } from "react";
import { Video } from "expo-av";
import AsyncStorage from '@react-native-async-storage/async-storage';
import supabase from "../supabase";
=======
import React, { useRef, useState } from "react";
import { Video } from "expo-av";
>>>>>>> main

const { width, height } = Dimensions.get("window");

export default function SplashScreen({ navigation }) {
  const videoRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

<<<<<<< HEAD
  useEffect(() => {
    checkUserSession();
  }, []);

  const checkUserSession = async () => {
    try {
      const sessionData = await AsyncStorage.getItem('userSession');
      if (sessionData) {
        const { session } = JSON.parse(sessionData);
        // Verify session is still valid
        const { data: { user }, error } = await supabase.auth.getUser(session.access_token);
        if (user && !error) {
          // Session is valid, navigate to Home after video
          return;
        } else {
          // Session expired, clear storage
          await AsyncStorage.removeItem('userSession');
        }
      }
    } catch (error) {
      console.log('Error checking session:', error);
    }
  };

=======
>>>>>>> main
  return (
    <View style={styles.container}>
      {!isReady && (
        <View style={styles.loaderOverlay}>
          <ActivityIndicator size={80} color="#6200EE" />
        </View>
      )}
      <Video
        ref={videoRef}
        source={require("../assets/splash-vid.mp4")}
        style={styles.video}
        resizeMode="contain"
        shouldPlay={isReady}
        isLooping={false}
        onReadyForDisplay={() => setIsReady(true)}
<<<<<<< HEAD
        onPlaybackStatusUpdate={async (status) => {
          if (status.didJustFinish) {
            // Check if user has valid session
            const sessionData = await AsyncStorage.getItem('userSession');
            if (sessionData) {
              const { session } = JSON.parse(sessionData);
              const { data: { user }, error } = await supabase.auth.getUser(session.access_token);
              if (user && !error) {
                navigation.replace("Home");
                return;
              }
            }
=======
        onPlaybackStatusUpdate={(status) => {
          if (status.didJustFinish) {
>>>>>>> main
            navigation.replace("OnBoarding");
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },
  loaderOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  video: {
    width: width * 0.9,
    height: height * 0.9,
  },
});
