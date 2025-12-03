import { View, StyleSheet, Dimensions, ActivityIndicator } from "react-native";
import React, { useRef, useState } from "react";
import { Video } from "expo-av";

const { width, height } = Dimensions.get("window");

export default function SplashScreen({ navigation }) {
  const videoRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

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
        onPlaybackStatusUpdate={(status) => {
          if (status.didJustFinish) {
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
