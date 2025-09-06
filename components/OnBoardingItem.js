import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  Image,
} from "react-native";
import React from "react";
import { COLORS } from "../util/colors";
import CustomButton from "./CustomButton";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";

export default function OnBoardingItem({ item }) {
  const { width } = useWindowDimensions();

  const floatY = useSharedValue(0);
  floatY.value = withRepeat(
    withTiming(-30, { duration: 3000, easing: Easing.inOut(Easing.sin) }),
    -1,
    true
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floatY.value }],
  }));

  return (
    <View style={[styles.container, { width }]}>
      <Animated.Image
        source={item.image}
        style={[styles.image, animatedStyle]}
        resizeMode="contain"
      />
      <View style={{ flex: 0.3 }}>
        <Text style={styles.title}>{item.title}</Text>
        <Text
          style={[
            styles.description,
            item.id === "3" ? { paddingTop: 34 } : null,
          ]}
        >
          {item.description}
        </Text>
      </View>
    </View>
  );
}

// Pinned Buttons
OnBoardingItem.SkipButton = ({ onPress }) => (
  <CustomButton
    height={45}
    width={80}
    backgroundColor={null}
    fontFamily={"Poppins-300"}
    fontSize={14}
    textColor={COLORS.gray2}
    onPress={onPress}
  >
    Skip
  </CustomButton>
);

OnBoardingItem.NextButton = ({ onPress, isLast }) => (
  <CustomButton
    height={45}
    width={146}
    backgroundColor={COLORS.brightTiffany}
    fontFamily={"Poppins-600"}
    fontSize={18}
    borderRadius={6}
    onPress={onPress}
  >
    {isLast ? "Done" : "Next"}
  </CustomButton>
);

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center" },
  image: {
    width: "100%",
    maxWidth: 400,
    maxHeight: 400,
    height: undefined,
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontFamily: "Poppins-600",
    color: COLORS.purple4,
    fontSize: 21,
    paddingHorizontal: 16,
  },
  description: {
    fontFamily: "Poppins-400",
    color: COLORS.lightTiffany,
    fontSize: 15,
    paddingHorizontal: 16,
    paddingTop: 5,
  },
});
