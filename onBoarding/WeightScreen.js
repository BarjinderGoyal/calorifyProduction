import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import Toast from "react-native-simple-toast";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "react-native-vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useOnBoardingContext } from "../Context/OnBoardingContext";

const { width } = Dimensions.get("window");

const barItemWidth = (width - 140) / 8;

const WeightScreen = () => {
  const { user, setUserInfo } = useOnBoardingContext();

  const navigation = useNavigation();
  const [weight, setWeight] = useState(null);

  const handleNext = () => {
    const isNumeric = /^[0-9]*\.?[0-9]+$/.test(weight);
    if (weight !== null && isNumeric) {
      setUserInfo("weight", weight);
      if (user?.goal !== "Maintain weight") {
        navigation.navigate("setWeightGoalScreen");
      } else {
        navigation.navigate("nameScreen");
      }
    } else {
      Toast.show("Weight is Invalid", Toast.SHORT);
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.innerContainer}>
        <View style={styles.barContainer}>
          <Ionicons
            name="chevron-back"
            color="black"
            size={30}
            onPress={() => navigation.goBack()}
          />
          <View style={styles.innerBarContainer}>
            {[...new Array(6)].map((_, index) => (
              <View
                style={{
                  width: barItemWidth,
                  backgroundColor: "#d05b19",
                  height: 5,
                }}
                key={index}
              />
            ))}
            {[...new Array(2)].map((_, index) => (
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
          <Text style={styles.headerHeading}>What's your weight(in KG)?</Text>
        </View>
        <TextInput
          value={weight}
          onChangeText={(text) => setWeight(text)}
          // placeholder="Age"
          keyboardType="numeric"
          style={styles.weightInput}
        />
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

export default WeightScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F5F2",
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
  weightInput: {
    padding: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "black",
    // marginTop: 10,
    fontSize: 18,
    fontWeight: "600",
    color: "black",
    width: "100%",
  },
});
