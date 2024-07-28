import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useOnBoardingContext } from "../Context/OnBoardingContext";

const { width, height } = Dimensions.get("window");

const barItemWidth = (width - 140) / 8;

const ActivityLevelScreen = ({ navigation }) => {
  const [selected, setSelected] = useState(null);
  const { user, setUserInfo } = useOnBoardingContext();

  const activityLevels = [
    {
      label: "Not Very Active",
      description: "little or no exercise",
      value: 1.2,
    },
    {
      label: "Lightly Active",
      description: "light exercise/sports 1-3 days/week",
      value: 1.375,
    },
    {
      label: "Moderately active",
      description: "moderate exercise/sports 3-5 days/week",
      value: 1.55,
    },
    {
      label: "Active",
      description: "moderate exercise/sports 3-5 days/week",
      value: 1.725,
    },
    {
      label: "Very Active",
      description: "hard exercise/sports 6-7 days a week",
      value: 1.9,
    },
  ];

  const handleSelection = (index) => {
    setSelected((preIndex) => {
      if (preIndex === index) {
        return null;
      } else {
        return index;
      }
    });
  };

  const handleNext = () => {
    if (selected !== null) {
      // Navigate to the next screen or handle the selection
      console.log("Selected activity level:", activityLevels[selected]);
      setUserInfo("activityLevel", activityLevels[selected].value);
      navigation.navigate("genderScreen"); // Replace 'NextScreen' with your actual screen name
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.innerContainer}>
        <View style={styles.barContainer}>
          <Ionicons
            name="chevron-back"
            size={30}
            color="black"
            onPress={() => navigation.goBack()}
          />
          <View style={styles.innerBarContainer}>
            {[...new Array(2)].map((_, index) => (
              <View
                style={{
                  width: barItemWidth,
                  backgroundColor: "#d05b19",
                  height: 5,
                }}
                key={index}
              />
            ))}
            {[...new Array(6)].map((_, index) => (
              <View
                style={{
                  width: barItemWidth,
                  backgroundColor: "grey",
                  height: 5,
                }}
                key={index}
              />
            ))}
          </View>
        </View>
        <View style={styles.header}>
          <Text style={styles.headerHeading}>
            What is your baseline activity level?
          </Text>
        </View>
        <View style={styles.content}>
          {activityLevels.map((level, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.option,
                selected === index && styles.selectedOption,
              ]}
              onPress={() => handleSelection(index)}
            >
              <Text
                style={[
                  styles.optionLabel,
                  selected === index && styles.selectedOptionLabel,
                ]}
              >
                {level.label}
              </Text>
              <Text
                style={[
                  styles.optionDescription,
                  { color: selected === index ? "white" : "#666" },
                ]}
              >
                {level.description}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity
          style={styles.nextButtonContainer}
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
};

export default ActivityLevelScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f8f9",
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  header: {
    marginTop: width * 0.2,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
  },
  headerHeading: {
    fontSize: 25,
    fontWeight: "600",
    color: "black",
    textAlign: "center",
  },

  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  question: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 20,
    textAlign: "center",
  },
  subText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  option: {
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
    backgroundColor: "#fff",
    elevation: 2,
    borderWidth: 1,
    borderColor: "black",
  },
  selectedOption: {
    borderColor: "#d05b19",
    backgroundColor: "#d05b19",
  },
  optionLabel: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 5,
  },
  selectedOptionLabel: {
    color: "white",
  },
  optionDescription: {
    fontSize: 14,
  },

  nextButtonContainer: {
    padding: 15,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginTop: "auto",
    marginBottom: 20,
    backgroundColor: "#d05b19",
  },
  nextButtonText: {
    fontSize: 22,
    fontWeight: "600",
    color: "white",
  },
  barContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  innerBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
});
