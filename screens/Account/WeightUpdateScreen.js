import React, { useState, useMemo, useCallback, useEffect } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  InteractionManager,
  ActivityIndicator,
} from "react-native";
import Toast from "react-native-simple-toast";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import WheelPickerComponent from "../../components/Picker/WheelPickerComponent";
import { useNavigation } from "@react-navigation/native";
import { userAuthUseContext } from "../../Context/UserAuthContext";

const { width, height } = Dimensions.get("window");
const ITEM_WIDTH = 100;
const WeightUpdateScreen = () => {
  const { userDetail, updateTargetWeight } = userAuthUseContext();
  const [kgValue, setKgValue] = useState(userDetail?.weight);
  const [lbsValue, setLbsValue] = useState(120);
  const [selectedUnit, setSelectedUnit] = useState("KG");
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

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

  const kgData = useMemo(
    () =>
      [...Array(500)].map((_, index) => ({
        value: index + 20,
        label: `${index + 20} kg`,
      })),
    []
  );

  const lbsData = useMemo(
    () =>
      [...Array(500)].map((_, index) => ({
        value: index + 40,
        label: `${index + 40} lbs`,
      })),
    []
  );

  const convertLbsToKg = useCallback(
    (lbs) => {
      return lbs * 0.453592;
    },
    [lbsValue]
  );

  const checkWeightIsCorrect = useCallback(
    (weight) => {
      if (userDetail?.goal === "Loose weight") {
        return Number(userDetail?.weight) > Number(weight);
      } else if (userDetail?.goal === "Maintain weight") {
        return Number(userDetail?.weight) === Number(weight);
      } else if (userDetail?.goal === "Gain weight") {
        return Number(userDetail?.weight) < Number(weight);
      } else {
        return false;
      }
    },
    [kgValue, lbsValue]
  );

  const handleNext = useCallback(() => {
    InteractionManager.runAfterInteractions(async () => {
      if (selectedUnit === "KG") {
        console.log("weight in kg", kgValue);
        const checkedResult = checkWeightIsCorrect(kgValue);
        if (!checkedResult) {
          Toast.show("Selected Weight Doesn't Fit Your Goal", Toast.SHORT);
          return;
        }
        setLoading(true);
        await updateTargetWeight(kgValue);
        setLoading(false);
      } else {
        console.log("weight in lbs", lbsValue);
        const weight = convertLbsToKg(lbsValue);
        const checkedResult = checkWeightIsCorrect(weight);
        if (!checkedResult) {
          Toast.show("Selected Weight Doesn't Fit Your Goal", Toast.SHORT);
          return;
        }
        setLoading(true);
        await updateTargetWeight(weight);
        setLoading(false);
      }
      navigation.goBack();
    });
  }, [navigation, kgValue, lbsValue]);

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
          <Text style={styles.headerHeading}>What's your Target weight?</Text>
        </View>
        <View style={styles.unitSelectorContainer}>
          <Text
            style={[
              styles.unitName,
              selectedUnit === "LBS" && styles.unitSelected,
            ]}
            onPress={() => setSelectedUnit("LBS")}
          >
            LBS
          </Text>
          <Text
            style={[
              styles.unitName,
              selectedUnit === "KG" && styles.unitSelected,
            ]}
            onPress={() => setSelectedUnit("KG")}
          >
            KG
          </Text>
        </View>
        {selectedUnit === "KG" ? (
          <View style={styles.picker}>
            <WheelPickerComponent
              items={kgData}
              onIndexChange={setKgValue}
              defaultValue={kgValue}
            />
          </View>
        ) : (
          <View style={styles.picker}>
            <WheelPickerComponent
              items={lbsData}
              onIndexChange={setLbsValue}
              defaultValue={lbsValue}
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

export default WeightUpdateScreen;

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
  picker: {
    alignItems: "center",
    justifyContent: "center",
  },
});
