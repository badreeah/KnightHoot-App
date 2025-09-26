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
        <ActivityIndicator
          size="large"
          color="#6200EE"
          style={{ alignItems: "center", justifyContent: "center", flex: 1 }}
        />
      )}
      <Video
        ref={videoRef}
        source={require("../assets/splash-vid.mp4")}
        style={styles.video}
        resizeMode="contain"
        shouldPlay={isReady} // only play when ready
        isLooping={false}
        onReadyForDisplay={() => setIsReady(true)} // video loaded
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
    backgroundColor: "#ffffff44",
    alignItems: "center",
    justifyContent: "center",
  },
  video: {
    width: width * 0.9, // almost full width
    height: height * 0.9, // half screen height
  },
});
