// import {
//   Dimensions,
//   FlatList,
//   StyleSheet,
//   Text,
//   View,
//   TouchableOpacity,
//   TextInput,
// } from "react-native";
// import React, { useState } from "react";
// import { SafeAreaView } from "react-native-safe-area-context";
// import Toast from "react-native-simple-toast";
// import { Ionicons } from "react-native-vector-icons";
// import { useNavigation } from "@react-navigation/native";
// import { useOnBoardingContext } from "../Context/OnBoardingContext";

// const { width } = Dimensions.get("window");

// const barItemWidth = (width - 140) / 8;

// const HeightScreen = () => {
//   // const { setUserInfo } = useOnBoardingContext();

//   // const navigation = useNavigation();
//   const [height, setHeight] = useState();
//   const [heightInFT, setHeightInFT] = useState({ ft: "", in: "" });
//   const [selectedUnit, setSelectedUnit] = useState("FT");

//   const convertFTintoCM = () => {};

//   const handleNext = () => {
//     const isNumeric = /^[0-9]*\.?[0-9]+$/.test(height);
//     if (isNumeric) {
//       setHeight(height);
//       // setUserInfo("height", height);
//       // navigation.navigate("weightScreen");
//     } else {
//       Toast.show("Height is Invalied", Toast.SHORT);
//     }
//   };

//   const handleHeight = (value) => {
//     setHeight(value);
//   };

//   return (
//     <View style={styles.container}>
//       <SafeAreaView style={styles.innerContainer}>
//         <View style={styles.barContainer}>
//           <Ionicons
//             name="chevron-back"
//             color="black"
//             size={30}
//             // onPress={() => navigation.goBack()}
//           />
//           <View style={styles.innerBarContainer}>
//             {[...new Array(5)].map((_, index) => (
//               <View
//                 style={{
//                   width: barItemWidth,
//                   backgroundColor: "#d05b19",
//                   height: 5,
//                 }}
//                 key={index}
//               />
//             ))}
//             {[...new Array(3)].map((_, index) => (
//               <View
//                 style={{
//                   width: barItemWidth,
//                   backgroundColor: "grey",
//                   height: 5,
//                 }}
//                 key={index}
//               />
//             ))}
//           </View>
//         </View>
//         <View style={styles.header}>
//           <Text style={styles.headerHeading}>What's your height(in cm)?</Text>
//         </View>
//         <View style={styles.unitSelectorContainer}>
//           <Text
//             style={[
//               styles.unitName,
//               {
//                 backgroundColor: `${selectedUnit === "CM" ? "black" : "white"}`,
//                 color: `${selectedUnit === "CM" ? "white" : "black"}`,
//               },
//             ]}
//             onPress={() => setSelectedUnit("CM")}
//           >
//             CM
//           </Text>
//           <Text
//             style={[
//               styles.unitName,
//               {
//                 backgroundColor: `${selectedUnit === "FT" ? "black" : "white"}`,
//                 color: `${selectedUnit === "FT" ? "white" : "black"}`,
//               },
//             ]}
//             onPress={() => setSelectedUnit("FT")}
//           >
//             FT
//           </Text>
//         </View>
//         {selectedUnit === "CM" ? (
//           <View style={styles.heightInputContainer}>
//             <TextInput
//               value={heightInFT.ft}
//               placeholder="Cm"
//               placeholderTextColor={"lightgrey"}
//               onChangeText={(text) =>
//                 setHeightInFT({ ...heightInFT, ft: text })
//               }
//               keyboardType="numeric"
//               // placeholder="Age"
//               style={styles.heightInput}
//             />
//           </View>
//         ) : (
//           <View style={styles.heightInputContainer}>
//             <TextInput
//               value={heightInFT.in}
//               placeholder="Ft"
//               placeholderTextColor={"lightgrey"}
//               onChangeText={(text) =>
//                 setHeightInFT({ ...heightInFT, in: text })
//               }
//               keyboardType="numeric"
//               // placeholder="Age"
//               style={styles.heightInput}
//             />
//             <TextInput
//               value={height}
//               placeholder="In"
//               placeholderTextColor={"lightgrey"}
//               onChangeText={(text) => handleHeight(text)}
//               keyboardType="numeric"
//               // placeholder="Age"
//               style={styles.heightInput}
//             />
//           </View>
//         )}
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

// export default HeightScreen;

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
//   heightInput: {
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
//   ftContainer: {
//     gap: 15,
//   },
//   heightInputContainer: {
//     gap: 15,
//   },
//   heightUnitContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   ftunit: {
//     padding: 10,
//     width: width * 0.3,
//     borderTopLeftRadius: 20,
//     borderBottomLeftRadius: 20,
//     borderWidth: 1,
//     borderColor: "black",
//     textAlign: "center",
//     fontSize: 20,
//     fontWeight: "600",
//     color: "black",
//   },
//   cmunit: {
//     padding: 10,
//     width: width * 0.3,
//     borderTopRightRadius: 20,
//     borderBottomRightRadius: 20,
//     borderTopWidth: 1,
//     borderBottomWidth: 1,
//     borderRightWidth: 1,
//     borderColor: "black",
//     textAlign: "center",
//     fontSize: 20,
//     fontWeight: "600",
//     color: "black",
//   },
//   unitSelectorContainer: {
//     paddingHorizontal: 15,
//     paddingVertical: 10,
//     borderRadius: 100,
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 15,
//     marginBottom: 20,
//     backgroundColor: "white",
//     alignSelf: "center",
//   },
//   unitName: {
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     borderRadius: 100,
//     textAlign: "center",
//     fontSize: 16,
//     fontWeight: "500",
//   },
// });

// import {
//   Dimensions,
//   StyleSheet,
//   Text,
//   View,
//   TouchableOpacity,
// } from "react-native";
// import React, { useCallback, useState } from "react";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { Ionicons } from "react-native-vector-icons";
// import WheelPicker from "@quidone/react-native-wheel-picker";
// import { useNavigation } from "@react-navigation/native";
// import { useOnBoardingContext } from "../Context/OnBoardingContext";

// const { width } = Dimensions.get("window");
// const barItemWidth = (width - 120) / 6;

// const HeightScreen = () => {
//   const [cmValue, setCmValue] = useState(170);
//   const [ftValue, setFtValue] = useState(5);
//   const [inValue, setInValue] = useState(0);
//   const { setUserInfo } = useOnBoardingContext();

//     const navigation = useNavigation();
//   let cmData = [...new Array(184)].map((_, index) => ({
//     value: index + 60,
//     label: `${index + 60} cm`,
//   }));

//   const ftData = [1, 2, 3, 4, 5, 6, 7, 8, 9].map((item, index) => ({
//     value: item,
//     label: `${item} ft`,
//   }));
//   const inData = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((item, index) => ({
//     value: item,
//     label: `${item} in`,
//   }));

//   const [selectedUnit, setSelectedUnit] = useState("FT");
//   // const navigation = useNavigation();
//   // const { user, setUserInfo } = useOnBoardingContext();

//   const convertFtIntoCm = useCallback(
//     (ftValue, inValue) => {},
//     [cmValue, ftValue, inValue]
//   );

//   const handleNext = () => {
//     if (selectedUnit === "CM") {
//       setUserInfo("height", cmValue);
//       navigation.navigate("weightScreen");
//     } else {
//       const height = convertFtIntoCm(ftValue, inValue);
//       setUserInfo("height", height);
//       navigation.navigate("weightScreen");
//     }
//   };
//   // navigation.navigate("weightScreen");

//   const handleCmValue = useCallback(
//     (value) => {
//       console.log(value);
//       setCmValue(value);
//     },
//     [cmValue]
//   );

//   const handleFtValue = useCallback(
//     (value) => {
//       console.log(value);
//       setFtValue(value);
//     },
//     [ftValue]
//   );

//   const handleInValue = useCallback(
//     (value) => {
//       console.log(value);
//       setInValue(value);
//     },
//     [inValue]
//   );

//   return (
//     <View style={styles.container}>
//       <SafeAreaView style={styles.innerContainer}>
//         <View style={styles.barContainer}>
//           <Ionicons
//             name="chevron-back"
//             color="black"
//             size={30}
//             // onPress={() => navigation.goBack()}
//           />
//           <View style={styles.innerBarContainer}>
//             {[...new Array(4)].map((_, index) => (
//               <View
//                 style={{
//                   width: barItemWidth,
//                   backgroundColor: "#d05b19",
//                   height: 5,
//                 }}
//                 key={index}
//               />
//             ))}
//             {[...new Array(2)].map((_, index) => (
//               <View
//                 style={{
//                   width: barItemWidth,
//                   backgroundColor: "grey",
//                   height: 5,
//                 }}
//                 key={index}
//               />
//             ))}
//           </View>
//         </View>
//         <View style={styles.header}>
//           <Text style={styles.headerHeading}>What's your height?</Text>
//         </View>
//         <View style={styles.unitSelectorContainer}>
//           <Text
//             style={[
//               styles.unitName,
//               {
//                 backgroundColor: `${selectedUnit === "CM" ? "black" : "white"}`,
//                 color: `${selectedUnit === "CM" ? "white" : "black"}`,
//               },
//             ]}
//             onPress={() => setSelectedUnit("CM")}
//           >
//             CM
//           </Text>
//           <Text
//             style={[
//               styles.unitName,
//               {
//                 backgroundColor: `${selectedUnit === "FT" ? "black" : "white"}`,
//                 color: `${selectedUnit === "FT" ? "white" : "black"}`,
//               },
//             ]}
//             onPress={() => setSelectedUnit("FT")}
//           >
//             FT
//           </Text>
//         </View>
//         {selectedUnit === "CM" ? (
//           <View style={styles.cmPicker}>
//             <WheelPicker
//               data={cmData}
//               onValueChanged={({ item }) => handleCmValue(item?.value)}
//               width={100}
//             />
//           </View>
//         ) : (
//           <View style={styles.ftPicker}>
//             <WheelPicker
//               data={ftData}
//               onValueChanged={({ item }) => handleFtValue(item?.value)}
//               width={100}
//             />
//             <WheelPicker
//               data={inData}
//               onValueChanged={({ item }) => handleInValue(item?.value)}
//               width={100}
//             />
//           </View>
//         )}
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

// export default HeightScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#f7f8f9",
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
//   },
//   unitSelectorContainer: {
//     paddingHorizontal: 15,
//     paddingVertical: 10,
//     borderRadius: 100,
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 15,
//     marginBottom: 20,
//     backgroundColor: "white",
//     alignSelf: "center",
//   },
//   unitName: {
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     borderRadius: 100,
//     textAlign: "center",
//     fontSize: 16,
//     fontWeight: "500",
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
//   cmPicker: {
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   ftPicker: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: 15,
//   },
// });
// HeightScreen.js
// HeightScreen.js
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

const HeightScreen = () => {
  const [cmValue, setCmValue] = useState(170);
  const [ftValue, setFtValue] = useState("5 ft");
  const [selectedUnit, setSelectedUnit] = useState("FT");
  const navigation = useNavigation();
  const { setUserInfo } = useOnBoardingContext();

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
    InteractionManager.runAfterInteractions(() => {
      let height = 0;
      if (selectedUnit === "CM") {
        height = cmValue;
      } else {
        height = convertFtIntoCm(ftValue.ft, ftValue.inch);
      }
      setUserInfo("height", height);
      navigation.navigate("weightScreen");
    });
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.innerContainer}>
        <View style={styles.barContainer}>
          <Ionicons name="chevron-back" color="black" size={30} />
          <View style={styles.innerBarContainer}>
            {[...Array(5)].map((_, index) => (
              <View key={index} style={styles.barActive} />
            ))}
            {[...Array(3)].map((_, index) => (
              <View key={index} style={styles.barInactive} />
            ))}
          </View>
        </View>
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
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
};

export default HeightScreen;

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
