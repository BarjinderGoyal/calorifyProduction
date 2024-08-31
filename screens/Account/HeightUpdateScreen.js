import React, { useState, useMemo, useCallback, useEffect } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  InteractionManager,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import WheelPickerComponent from "../../components/Picker/WheelPickerComponent";
import { useNavigation } from "@react-navigation/native";
import { userAuthUseContext } from "../../Context/UserAuthContext";
import { ActivityIndicator } from "react-native-paper";

const { width, height } = Dimensions.get("window");
const ITEM_WIDTH = 100;

const HeightUpdateScreen = () => {
  const { userDetail, updateHeight } = userAuthUseContext();
  const [cmValue, setCmValue] = useState(userDetail?.height);
  const [ftValue, setFtValue] = useState("5 ft");
  const [loading, setLoading] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState("FT");
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

  const cmData = useMemo(
    () =>
      [...Array(123)].map((_, index) => ({
        value: index + 122,
        label: `${index + 60} cm`,
      })),
    []
  );

  const ftData = useMemo(() => {
    const data = [];
    for (let ft = 4; ft <= 8; ft++) {
      for (let inch = 0; inch < 12; inch++) {
        if (ft === 8 && inch > 0) break; // Limit to 8 ft 0 in
        data.push({
          value: { ft, inch },
          label: inch === 0 ? `${ft} ft` : `${ft} ft ${inch} in`,
        });
      }
    }
    return data;
  }, []);
  const convertFtIntoCm = (ft, inches) => ft * 30.48 + inches * 2.54;

  const handleNext = () => {
    InteractionManager.runAfterInteractions(async () => {
      let height = 0;
      if (selectedUnit === "CM") {
        height = cmValue;
      } else {
        // Assuming 'ftInValue' is the selected height value like '4 ft 1 in' or '4 ft'
        console.log("ft value", ftValue, typeof ftValue);
        height = convertFtIntoCm(ftValue.ft, ftValue.inch);
      }
      setLoading(true);
      await updateHeight(height);
      setLoading(false);
      navigation.goBack();
    });
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#f7f8f9",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size={"large"} color="#d05b19" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.innerContainer}>
        <Ionicons
          name="chevron-back"
          color="black"
          size={30}
          onPress={() => navigation.goBack()}
        />

        <View style={styles.header}>
          <Text style={styles.headerHeading}>What's your height?</Text>
        </View>
        <View style={styles.unitSelectorContainer}>
          <Text
            style={[
              styles.unitName,
              selectedUnit === "CM" && styles.unitSelected,
            ]}
            onPress={() => setSelectedUnit("CM")}
          >
            CM
          </Text>
          <Text
            style={[
              styles.unitName,
              selectedUnit === "FT" && styles.unitSelected,
            ]}
            onPress={() => setSelectedUnit("FT")}
          >
            FT
          </Text>
        </View>
        {selectedUnit === "CM" ? (
          <View style={styles.cmPicker}>
            <WheelPickerComponent
              items={cmData}
              onIndexChange={setCmValue}
              defaultValue={cmValue}
            />
          </View>
        ) : (
          <View style={styles.ftPicker}>
            <WheelPickerComponent
              items={ftData}
              onIndexChange={setFtValue}
              defaultValue={ftValue}
            />
          </View>
        )}
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

export default HeightUpdateScreen;

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
  unitSelectorContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 100,
    backgroundColor: "white",
    alignSelf: "center",
    marginBottom: 20,
  },
  unitName: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 100,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "500",
  },
  unitSelected: {
    backgroundColor: "black",
    color: "white",
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
  cmPicker: {
    alignItems: "center",
    justifyContent: "center",
  },
  ftPicker: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 15,
  },
});
