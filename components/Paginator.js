import { View, StyleSheet, Animated } from "react-native";
import React from "react";

export default function Paginator({ data, scrollX, width }) {
  return (
    <View style={styles.container}>
      {data.map((_, i) => {
        const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
        const dotWidth = scrollX.interpolate({
          inputRange,
          outputRange: [10, 20, 10],
          extrapolate: "clamp",
        });
        const dotColor = scrollX.interpolate({
          inputRange,
          outputRange: ["#ccc", "#7C43CE", "#ccc"],
          extrapolate: "clamp",
        });

        return (
          <Animated.View
            key={i}
            style={[styles.dot, { width: dotWidth, backgroundColor: dotColor }]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: 64,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 12,
  },
  dot: {
    height: 8,
    borderRadius: 5,
    marginHorizontal: 8,
  },
});
