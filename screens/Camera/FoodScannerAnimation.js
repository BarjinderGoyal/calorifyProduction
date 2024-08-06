import React, { useState, useEffect } from "react";
import { StyleSheet, View, Image, Dimensions } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

const { width, height } = Dimensions.get("window");
const AREA_HEIGHT = height * 0.6;
const AREA_WIDTH = width - 20;

const defaultOffset = AREA_HEIGHT / 2;
const duration = 2000;

export default function FoodScannerAnimation({ imageUri }) {
  const margin = useSharedValue(15);
  const offset = useSharedValue(0);
  const opacity = useSharedValue(1);

  const animatedTransformStyles = useAnimatedStyle(() => ({
    transform: [{ translateY: offset.value }],
  }));
  const animatedStyles = useAnimatedStyle(() => ({
    height: AREA_HEIGHT * 0.95 + margin.value,
    width: AREA_WIDTH * 0.9 + margin.value,
  }));
  const opacityStyles = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  useEffect(() => {
    setTimeout(() => {
      margin.value = withRepeat(
        withSequence(
          withTiming(-margin.value, { duration }),
          withTiming(margin.value, { duration })
        ),
        -1
      );
      offset.value = withRepeat(
        withSequence(
          withTiming(defaultOffset, { duration, easing: Easing.linear }),
          withTiming(-defaultOffset, { duration, easing: Easing.linear })
        ),
        -1,
        true
      );
      opacity.value = withRepeat(
        withSequence(
          withTiming(0.5, { duration, easing: Easing.ease }),
          withTiming(1, { duration, easing: Easing.ease })
        ),
        -1,
        true
      );
    }, 2500);
  }, []);

  return (
    <View style={styles.containerCenter}>
      <Image
        resizeMode="cover"
        source={{
          uri: imageUri,
        }}
        style={styles.image}
      />
      <Animated.View style={[styles.container, animatedStyles, opacityStyles]}>
        <View style={styles.row}>
          <View style={[styles.box, styles.rotateY]} />
          <View style={styles.box} />
        </View>
        <View style={styles.row}>
          <View style={[styles.box, styles.rotate]} />
          <View style={[styles.box, styles.rotateX]} />
        </View>
      </Animated.View>
      <View style={styles.lineContainer}>
        <Animated.View
          style={[styles.line, animatedTransformStyles, opacityStyles]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  containerCenter: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  image: {
    height: AREA_HEIGHT * 0.8,
    width: AREA_WIDTH * 0.8,
    position: "absolute",
    borderRadius: 10,
  },
  gradientOverlay: {
    position: "absolute",
    height: AREA_HEIGHT * 0.8,
    width: AREA_WIDTH * 0.8,
    borderRadius: 10,
  },
  container: {
    justifyContent: "space-between",
    borderRadius: 10,
    overflow: "hidden",
  },
  rotateX: { transform: [{ rotateX: "180deg" }] },
  rotateY: { transform: [{ rotateY: "180deg" }] },
  rotate: { transform: [{ rotate: "180deg" }] },
  row: { flexDirection: "row", justifyContent: "space-between" },
  box: {
    height: 70,
    width: 40,
    borderTopColor: "white",
    borderTopWidth: 3,
    borderRightColor: "white",
    borderRightWidth: 3,
  },
  lineContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    position: "absolute",
  },
  line: {
    height: 2,
    width: AREA_WIDTH,
    borderColor: "red",
    borderWidth: 1,
    shadowColor: "red",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
  },
});
