import { View, StyleSheet, Animated, useWindowDimensions } from "react-native";
import React, { useRef, useState } from "react";
import OnBoardingItem from "./OnBoardingItem";
import slides from "../util/slides";
import Paginator from "./Paginator";

export default function OnBoarding({ navigation }) {
  const scrollX = useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  const { width } = useWindowDimensions();

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current.scrollToIndex({ index: currentIndex + 1 });
    } else {
      navigation.replace("Welcome");
    }
  };

  const handleSkip = () => {
    navigation.replace("Welcome");
  };

  const viewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) setCurrentIndex(viewableItems[0].index);
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  return (
    <View style={styles.container}>
      <Animated.FlatList
        data={slides}
        renderItem={({ item }) => (
          <OnBoardingItem
            item={item}
            scrollX={scrollX}
            isLast={currentIndex === slides.length - 1}
          />
        )}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        keyExtractor={(item) => item.id}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={viewConfig}
        ref={flatListRef}
      />

      {/* Pinned Skip Button */}
      {currentIndex < slides.length - 1 && (
        <View style={styles.skipButtonContainer}>
          <OnBoardingItem.SkipButton onPress={handleSkip} />
        </View>
      )}

      {/* Pinned Pagination Dots */}
      <View style={styles.paginatorPinned}>
        <Paginator data={slides} scrollX={scrollX} width={width} />
      </View>

      {/* Pinned Next/Done Button */}
      <View style={styles.nextButtonPinned}>
        <OnBoardingItem.NextButton
          onPress={handleNext}
          isLast={currentIndex === slides.length - 1}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  skipButtonContainer: {
    position: "absolute",
    top: 40,
    right: 16,
    zIndex: 10,
  },
  paginatorPinned: {
    position: "absolute",
    bottom: 150, // Adjust so it's above the Next button
    alignSelf: "center",
    zIndex: 10,
  },
  nextButtonPinned: {
    position: "absolute",
    bottom: 60,
    alignSelf: "center",
    zIndex: 10,
  },
});
