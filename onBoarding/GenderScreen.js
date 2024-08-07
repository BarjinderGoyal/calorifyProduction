import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "react-native-vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useOnBoardingContext } from "../Context/OnBoardingContext";

const { width, height } = Dimensions.get("window");
const barItemWidth = (width - 140) / 8;

const GenderScreen = () => {
  const [selected, setSelected] = useState(null);
  const navigation = useNavigation();
  const { user, setUserInfo } = useOnBoardingContext();

  const RenderOption = ({ item, index }) => {
    const handleSelection = () => {
      if (selected === item) {
        setSelected(null);
      } else {
        setSelected(item);
      }
    };
    return (
      <TouchableOpacity
        onPress={handleSelection}
        style={[
          styles.renderContainer,
          { backgroundColor: selected === item ? "#d05b19" : "white" },
        ]}
      >
        <Text
          style={[
            styles.renderOptionText,
            {
              color: selected === item ? "white" : "black",
            },
          ]}
        >
          {item}
        </Text>
      </TouchableOpacity>
    );
  };

  const handleNext = () => {
    if (selected !== null) {
      setUserInfo("gender", selected);
      navigation.navigate("ageScreen");
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
            {[...new Array(3)].map((_, index) => (
              <View
                style={{
                  width: barItemWidth,
                  backgroundColor: "#d05b19",
                  height: 5,
                }}
                key={index}
              />
            ))}
            {[...new Array(5)].map((_, index) => (
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
          <Text style={styles.headerHeading}>What's your gender?</Text>
        </View>
        <View style={styles.pickerContainer}>
          {["Male", "Female", "Other"].map((item, index) => (
            <RenderOption item={item} key={index} index={index} />
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

export default GenderScreen;

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
  renderContainer: {
    padding: 15,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "black",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 25,
    elevation: 2,
  },
  renderOptionText: {
    fontSize: 18,
    fontWeight: "600",
    color: "black",
    textAlign: "left",
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
