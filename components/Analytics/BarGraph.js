import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import CircularProgressBar from "../CircularProgressBar";
import { format } from "date-fns";

const BarGraph = ({ heading, color = "black", maxValue, data }) => {
  const [selectedValue, setSelectedValue] = useState(null);
  const [selectedLabel, setSelectedLabel] = useState(null);
  const todayLabel = format(new Date(), "eee"); // Using date-fns to get today's day
  console.log(maxValue, "heading", heading);

  useEffect(() => {
    const todayData = data.find((item) => item.label === todayLabel);
    if (todayData) {
      setSelectedValue(todayData.value);
      setSelectedLabel(todayData.label);
    }
  }, [data, todayLabel]);

  const handleBarPress = (value, label) => {
    setSelectedValue(value);
    setSelectedLabel(label);
  };

  return (
    <View style={styles.container}>
      <View style={styles.circularProgressContainer}>
        <CircularProgressBar
          percentage={selectedValue}
          radius={40} // Set radius to one-fourth of the bar height
          color={color}
          max={maxValue}
        />
      </View>
      <View style={styles.barGraphContainer}>
        <Text style={styles.heading}>{heading}</Text>
        <View style={styles.barsContainer}>
          {data.map((item) => {
            const colorHeight = useSharedValue(0);

            useEffect(() => {
              const itemHeight =
                Number(item.value) > maxValue ? maxValue : item.value;
              colorHeight.value = withTiming((itemHeight / maxValue) * 100, {
                duration: 500,
                easing: Easing.out(Easing.ease),
              });
            }, [item.value]);

            const animatedStyle = useAnimatedStyle(() => ({
              height: `${colorHeight.value}%`,
              backgroundColor: color,
            }));

            const labelStyle =
              item.label === selectedLabel
                ? styles.selectedLabel
                : styles.barLabel;

            return (
              <TouchableOpacity
                key={item.label}
                onPress={() => handleBarPress(item.value, item.label)}
              >
                <View style={styles.barWrapper}>
                  <View style={styles.bar}>
                    <Animated.View style={[styles.barColor, animatedStyle]} />
                  </View>
                  <Text style={labelStyle}>{item.label}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 10,
  },
  circularProgressContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 20, // Add spacing between circular progress and bar graph
  },
  barGraphContainer: {
    flex: 2,
    alignItems: "center",
  },
  heading: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  barsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 200,
  },
  barWrapper: {
    alignItems: "center",
    marginHorizontal: 5, // Add spacing between bars
  },
  bar: {
    width: 20,
    height: 160, // Fixed height for all bars
    backgroundColor: "#e0e0e0", // Grey background for bars
    justifyContent: "flex-end",
    borderRadius: 5, // Make the bars circular
  },
  barColor: {
    width: "100%",
    borderRadius: 5, // Match the radius of the colored portion
  },
  barLabel: {
    marginTop: 5,
    color: "lightgrey",
  },
  selectedLabel: {
    marginTop: 5,
    color: "black",
  },
});

export default BarGraph;
