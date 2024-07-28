import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

const CustomPlan = ({ route }) => {
  const navigation = useNavigation();
  const { dailyCalorieValue } = route.params;
  const handleNext = () => {
    navigation.navigate("mainScreen");
  };
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.innerContainer}>
        <View style={styles.header}>
          <Text style={styles.headerHeading}>Your daily net goal is:</Text>
        </View>
        <View style={styles.calorieContainer}>
          <Text style={styles.calorieValue}>{dailyCalorieValue} </Text>
          <Text style={styles.calorieHeading}>calorie</Text>
        </View>
        <TouchableOpacity
          style={styles.nextButtonContainer}
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>Done</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
};

export default CustomPlan;

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
  },
  calorieContainer: {
    alignItems: "center",
    gap: 5,
  },
  calorieValue: {
    fontSize: 35,
    fontWeight: "600",
    color: "black",
  },
  calorieHeading: {
    fontSize: 18,
    fontWeight: "600",
    color: "black",
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
});
