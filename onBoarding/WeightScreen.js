// import {
//   Dimensions,
//   StyleSheet,
//   Text,
//   View,
//   TouchableOpacity,
//   TextInput,
// } from "react-native";
// import React, { useState } from "react";
// import Toast from "react-native-simple-toast";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { Ionicons } from "react-native-vector-icons";
// import { useNavigation } from "@react-navigation/native";
// import { useOnBoardingContext } from "../Context/OnBoardingContext";

// const { width } = Dimensions.get("window");

// const barItemWidth = (width - 140) / 8;

// const WeightScreen = () => {
//   const { user, setUserInfo } = useOnBoardingContext();

//   const navigation = useNavigation();
//   const [weight, setWeight] = useState(null);

//   const handleNext = () => {
//     const isNumeric = /^[0-9]*\.?[0-9]+$/.test(weight);
//     if (weight !== null && isNumeric) {
//       setUserInfo("weight", weight);
//       if (user?.goal !== "Maintain weight") {
//         navigation.navigate("setWeightGoalScreen");
//       } else {
//         navigation.navigate("nameScreen");
//       }
//     } else {
//       Toast.show("Weight is Invalid", Toast.SHORT);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <SafeAreaView style={styles.innerContainer}>
// <View style={styles.barContainer}>
//   <Ionicons
//     name="chevron-back"
//     color="black"
//     size={30}
//     onPress={() => navigation.goBack()}
//   />
//   <View style={styles.innerBarContainer}>
//     {[...new Array(6)].map((_, index) => (
//       <View
//         style={{
//           width: barItemWidth,
//           backgroundColor: "#d05b19",
//           height: 5,
//         }}
//         key={index}
//       />
//     ))}
//     {[...new Array(2)].map((_, index) => (
//       <View
//         style={{
//           width: barItemWidth,
//           backgroundColor: "grey",
//           height: 5,
//         }}
//         key={index}
//       />
//     ))}
//   </View>
// </View>
//         <View style={styles.header}>
//           <Text style={styles.headerHeading}>What's your weight(in KG)?</Text>
//         </View>
//         <TextInput
//           value={weight}
//           onChangeText={(text) => setWeight(text)}
//           // placeholder="Age"
//           keyboardType="numeric"
//           style={styles.weightInput}
//         />
//         <TouchableOpacity
//           style={styles.nextButtonContainer}
//           onPress={handleNext}
//         >
//           <Text style={styles.nextButtonText}>Next</Text>
//         </TouchableOpacity>
//       </SafeAreaView>
//     </View>
//   );
// };

// export default WeightScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#F6F5F2",
//   },
//   innerContainer: {
//     flex: 1,
//     paddingHorizontal: 10,
//     paddingVertical: 10,
//   },
//   header: {
//     marginTop: width * 0.2,
//     alignItems: "center",
//     justifyContent: "center",
//     marginBottom: 40,
//   },
//   headerHeading: {
//     fontSize: 25,
//     fontWeight: "600",
//     color: "black",
//     textAlign: "center",
//   },

//   nextButtonContainer: {
//     padding: 15,
//     borderRadius: 40,
//     alignItems: "center",
//     justifyContent: "center",
//     marginTop: "auto",
//     marginBottom: 20,
//     backgroundColor: "#d05b19",
//   },
//   nextButtonText: {
//     fontSize: 22,
//     fontWeight: "600",
//     color: "white",
//   },
//   barContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 10,
//   },
//   innerBarContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 10,
//   },
//   weightInput: {
//     padding: 15,
//     borderRadius: 20,
//     borderWidth: 1,
//     borderColor: "black",
//     // marginTop: 10,
//     fontSize: 18,
//     fontWeight: "600",
//     color: "black",
//     width: "100%",
//   },
// });

import React, { useState, useMemo, useCallback } from "react";
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
import WheelPickerComponent from "../components/Picker/WheelPickerComponent";
import { useNavigation } from "@react-navigation/native";

import { useOnBoardingContext } from "../Context/OnBoardingContext";

const { width } = Dimensions.get("window");
const barItemWidth = (width - 140) / 8;

const ITEM_WIDTH = 100;

const WeightScreen = () => {
  const [kgValue, setKgValue] = useState(60);
  const [lbsValue, setLbsValue] = useState(120);
  const [selectedUnit, setSelectedUnit] = useState("KG");
  const navigation = useNavigation();
  const { setUserInfo } = useOnBoardingContext();

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

  const handleNext = () => {
    InteractionManager.runAfterInteractions(() => {
      if (selectedUnit === "KG") {
        console.log("weight in kg", kgValue);
        setUserInfo("weight", kgValue);
      } else {
        console.log("weight in lbs", lbsValue);
        const weight = convertLbsToKg(lbsValue);
        setUserInfo("weight", weight);
      }
      navigation.navigate("setWeightGoalScreen");
    });
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.innerContainer}>
        <View style={styles.barContainer}>
          <Ionicons name="chevron-back" color="black" size={30} />
          <View style={styles.innerBarContainer}>
            {[...Array(6)].map((_, index) => (
              <View key={index} style={styles.barActive} />
            ))}
            {[...Array(2)].map((_, index) => (
              <View key={index} style={styles.barInactive} />
            ))}
          </View>
        </View>
        <View style={styles.header}>
          <Text style={styles.headerHeading}>What's your current weight?</Text>
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
  barActive: {
    width: barItemWidth,
    backgroundColor: "#d05b19",
    height: 5,
  },
  barInactive: {
    width: barItemWidth,
    backgroundColor: "grey",
    height: 5,
  },
  picker: {
    alignItems: "center",
    justifyContent: "center",
  },
});
