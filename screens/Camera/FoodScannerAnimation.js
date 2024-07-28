import React, { useEffect } from "react";
import { StyleSheet, View, Image, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

const { width, height } = Dimensions.get("window");

const FoodScannerAnimation = ({ imageUrl }) => {
  const translateX = useSharedValue(0);

  useEffect(() => {
    console.log("imageUrl: ", imageUrl); // Log the imageUrl to check its type and value
    translateX.value = withRepeat(
      withTiming(width - 20, { duration: 2000 }),
      -1,
      true
    );
  }, [translateX, width, imageUrl]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value - (width - 20) / 2 }],
    };
  });

  return (
    <View style={styles.container}>
      <Image source={{ uri: imageUrl }} style={styles.image} />
      <Animated.View style={[styles.scanner, animatedStyle]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
  },
  image: {
    width: width - 20,
    height: height * 0.6,
    borderRadius: 20,
    overflow: "hidden",
  },
  scanner: {
    position: "absolute",
    width: 4,
    height: height * 0.6,
    backgroundColor: "rgba(255, 0, 0, 0.5)",
  },
});

export default FoodScannerAnimation;
