import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";
import React, { useState, useCallback, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign, Ionicons } from "react-native-vector-icons";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");
const MacroPercentageUpdateScreen = () => {
  const macroPercentage = {
    Default: ["Protein 20% . Carb 50% . Fat 30%"],
    "High Protein": ["Protein 40% . Carb 30% . Fat 30%"],
    "High Fat": ["Protein 25% . Carb 15% . Fat 60%"],
    Balanced: ["Protein 35% . Carb 35% . Fat 30%"],
  };
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      navigation.getParent()?.setOptions({ tabBarStyle: { display: "none" } });
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("blur", () => {
      navigation.getParent()?.setOptions({ tabBarStyle: { display: "flex" } });
    });
    return unsubscribe;
  }, [navigation]);

  const [selected, setSelected] = useState("Default");
  const handleNext = () => {
    InteractionManager.runAfterInteractions(() => {
      console.log("age of the user", value);

      setUserInfo("age", value);
      navigation.goBack();
    });
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.innerContainer}>
        <Ionicons
          name="chevron-back"
          color="black"
          size={30}
          onPress={() => navigation.goBack()}
        />
        <View style={styles.contentContainer}>
          {["Default", "High Protein", "High Fat", "Balanced"].map(
            (item, index) => {
              return (
                <TouchableOpacity
                  onPress={() => setSelected(item)}
                  key={index}
                  style={styles.optionContainer}
                >
                  <View style={styles.optionRightContainer}>
                    <Text style={styles.optionHeading}>{item}</Text>
                    <Text style={styles.optionSubHeading}>
                      {macroPercentage[`${item}`]}
                    </Text>
                  </View>
                  {selected === `${item}` ? (
                    <AntDesign name="checkcircle" size={30} color="black" />
                  ) : (
                    <AntDesign name="checkcircleo" size={30} color="black" />
                  )}
                </TouchableOpacity>
              );
            }
          )}
        </View>
        <TouchableOpacity
          style={styles.nextButtonContainer}
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>Update</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
};

export default MacroPercentageUpdateScreen;

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
  optionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 15,
    marginBottom: 15,
  },
  optionRightContainer: {
    gap: 3,
  },
  optionHeading: {
    fontSize: 18,
    color: "black",
    fontWeight: "400",
  },
  optionSubHeading: {
    fontSize: 16,
    color: "black",
    fontWeight: "400",
  },
  footerInnerContainer: {
    paddingVertical: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "lightgrey",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "auto",
    marginBottom: 10,
    backgroundColor: "#ee7214",
  },
  footerButtonText: {
    fontSize: 20,
    fontWeight: "500",
    color: "white",
  },
  contentContainer: {
    marginTop: width * 0.05,

    marginBottom: 40,
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
