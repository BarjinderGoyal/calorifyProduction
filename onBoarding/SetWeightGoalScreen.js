// import react, { useCallback, useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Dimensions,
//   TextInput,
//   TouchableOpacity,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { Ionicons } from "react-native-vector-icons";
// import { useOnBoardingContext } from "../Context/OnBoardingContext";
// import { useNavigation } from "@react-navigation/native";

// const { width, height } = Dimensions.get("window");

// const barItemWidth = (width - 120) / 6;

// const SetWeightGoalScreen = () => {
//   const [weightGoal, setWeightGoal] = useState(0);
//   //   const navigation = useNavigation();
//   const weightGainweeklyGoal = [0.25, 0.5];
//   const weightLossweeklyGoal = [0.25, 0.5, 0.75, 1];
//   const [selected, setSelected] = useState(null);
//   const { user, setUserInfo } = useOnBoardingContext();

//   const handleGoalSelection = useCallback(
//     (item) => {
//       setSelected((prev) => {
//         if (prev === item) {
//           return null;
//         } else {
//           return item;
//         }
//       });
//     },
//     [selected]
//   );

//   const handleNext = () => {
//     if (weightGoal && selected) {
//       setUserInfo("goalWeight", weightGoal);
//       setUserInfo("weeklyGoal", selected);
//       navigation.navigate("customPlanScreen");
//     }
//   };

//   return (
//     <View
//       style={styles.container}
//       //   behavior={Platform.OS === "ios" ? "padding" : "height"}
//     >
//       <SafeAreaView style={styles.innerContainer}>
//         <View style={styles.barContainer}>
//           <Ionicons name="chevron-back" color="black" size={30} />
//           <View style={styles.innerBarContainer}>
//             {[...new Array(6)].map((_, index) => (
//               <View
//                 style={{
//                   width: barItemWidth,
//                   backgroundColor: "#d05b19",
//                   height: 5,
//                 }}
//                 key={index}
//               />
//             ))}
//             {[...new Array(0)].map((_, index) => (
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
//           <Text style={styles.headerHeading}>What's your goal weight(Kg)?</Text>
//           <TextInput
//             value={weightGoal}
//             placeholder="Weight (Kg)"
//             placeholderTextColor={"black"}
//             onChangeText={(text) => setWeightGoal(text)}
//             style={styles.weightGoalInput}
//             keyboardType="numeric"
//           />
//         </View>
//         <View style={{ marginTop: 20 }}>
//           <Text style={styles.weeklyGoalHeading}>Select weekly goal</Text>
//           {user.goal === "Gain weight" ? (
//             <View style={styles.weeklyGoalList}>
//               {weightGainweeklyGoal.map((item, index) => {
//                 return (
//                   <Text
//                     style={[
//                       styles.weeklyWeightoptionText,
//                       {
//                         backgroundColor: selected === item ? "#d05b19" : null,
//                         borderWidth: selected === item ? null : 1,
//                       },
//                     ]}
//                     onPress={() => handleGoalSelection(item)}
//                   >
//                     Gain {item} Kg per weak
//                   </Text>
//                 );
//               })}
//             </View>
//           ) : (
//             <View style={styles.weeklyGoalList}>
//               {weightLossweeklyGoal.map((item, index) => {
//                 if (item === 0.5) {
//                   return (
//                     <Text
//                       style={[
//                         styles.weeklyWeightoptionText,
//                         {
//                           backgroundColor: selected === item ? "#d05b19" : null,
//                           borderWidth: selected === item ? null : 1,
//                         },
//                       ]}
//                       onPress={() => handleGoalSelection(item)}
//                     >
//                       Loss {item} Kg per weak(Recommended)
//                     </Text>
//                   );
//                 } else {
//                   return (
//                     <Text
//                       onPress={() => handleGoalSelection(item)}
//                       style={[
//                         styles.weeklyWeightoptionText,
//                         {
//                           backgroundColor: selected === item ? "#d05b19" : null,
//                           borderWidth: selected === item ? null : 1,
//                         },
//                       ]}
//                     >
//                       Loss {item} Kg per weak
//                     </Text>
//                   );
//                 }
//               })}
//             </View>
//           )}
//         </View>
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

// export default SetWeightGoalScreen;

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
//   header: {
//     marginTop: width * 0.2,
//     justifyContent: "center",
//     marginBottom: 40,
//     gap: 15,
//   },
//   headerHeading: {
//     fontSize: 25,
//     fontWeight: "600",
//     color: "black",
//     textAlign: "center",
//   },
//   //   weightGoalInput: {
//   //     marginTop: 10,
//   //     padding: 10,
//   //     borderRadius: 20,
//   //     borderColor: "black",
//   //     borderWidth: 1,
//   //     fontSize: 18,
//   //     fontWeight: "600",
//   //     color: "black",
//   //     // backgroundColor: "white", // Change background color to white
//   //     width: "100%",
//   //   },
//   weightGoalInput: {
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

//   weeklyGoalHeading: {
//     fontSize: 25,
//     fontWeight: "600",
//     color: "black",
//     marginBottom: 15,
//     textAlign: "center",
//   },
//   weeklyWeightoptionText: {
//     padding: 15,
//     borderRadius: 20,
//     borderWidth: 1,
//     borderColor: "black",
//     marginBottom: 10,
//     fontWeight: "600",
//     fontSize: 18,
//   },
//   nextButtonContainer: {
//     padding: 15,
//     borderRadius: 40,
//     alignItems: "center",
//     justifyContent: "center",
//     position: "absolute",
//     bottom: 20,
//     right: 10,
//     left: 10,
//     backgroundColor: "#d05b19",
//   },
//   nextButtonText: {
//     fontSize: 22,
//     fontWeight: "600",
//     color: "white",
//   },
// });

import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "react-native-vector-icons";
import { useOnBoardingContext } from "../Context/OnBoardingContext";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");
const barItemWidth = (width - 140) / 8;

const SetWeightGoalScreen = () => {
  const [weightGoal, setWeightGoal] = useState("");
  const weightGainweeklyGoal = [0.25, 0.5];
  const weightLossweeklyGoal = [0.25, 0.5, 0.75, 1];
  const [selected, setSelected] = useState(null);
  const { user, setUserInfo } = useOnBoardingContext();
  const navigation = useNavigation();
  const [nextButtonVisibility, setNextButtonVisibility] = useState("flex");

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setNextButtonVisibility("none");
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setNextButtonVisibility("flex");
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const handleGoalSelection = useCallback(
    (item) => {
      setSelected((prev) => (prev === item ? null : item));
    },
    [selected]
  );

  const handleNext = () => {
    if (weightGoal && selected) {
      if (user?.goal === "Loose weight") {
        if (weightGoal > user?.weight) {
          Alert.alert(
            "Alert",
            "You selected Lose weight as your goal. This goal weight is higher than your current weight.",
            [
              {
                text: "Change Goal Type",
                onPress: () => navigation.navigate("goalScreen"),
                style: "default",
              },
              {
                text: "Change Goal Weight",
                style: "cancel",
              },
            ]
          );
          return;
        }
      } else if (user?.goal === "Gain weight") {
        if (weightGoal < user?.weight) {
          Alert.alert(
            "Alert",
            "You selected Gain weight as your goal. This goal weight is lower than your current weight.",
            [
              {
                text: "Change Goal Type",
                onPress: () => navigation.navigate("goalScreen"),
                style: "default",
              },
              {
                text: "Change Goal Weight",
                style: "cancel",
              },
            ]
          );
          return;
        }
      }
      setUserInfo("goalWeight", weightGoal);
      setUserInfo("weeklyGoal", selected);
      navigation.navigate("nameScreen");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <SafeAreaView style={styles.innerContainer}>
        <View style={styles.barContainer}>
          <Ionicons
            name="chevron-back"
            color="black"
            size={30}
            onPres={() => navigation.goBack()}
          />
          <View style={styles.innerBarContainer}>
            {[...new Array(7)].map((_, index) => (
              <View
                style={{
                  width: barItemWidth,
                  backgroundColor: "#d05b19",
                  height: 5,
                }}
                key={index}
              />
            ))}
            {[...new Array(1)].map((_, index) => (
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
            What's your goal weight(in KG)?
          </Text>
          <TextInput
            value={weightGoal.toString()}
            placeholder="Weight (Kg)"
            placeholderTextColor={""}
            onChangeText={(text) => setWeightGoal(text)}
            style={styles.weightGoalInput}
            keyboardType="numeric"
          />
        </View>
        <View style={{ marginTop: 20 }}>
          <Text style={styles.weeklyGoalHeading}>Select weekly goal</Text>
          {user.goal === "Gain weight" ? (
            <View style={styles.weeklyGoalList}>
              {weightGainweeklyGoal.map((item, index) => (
                <Text
                  key={index}
                  style={[
                    styles.weeklyWeightoptionText,
                    {
                      backgroundColor: selected === item ? "#d05b19" : "white",
                      borderWidth: selected === item ? null : 1,
                    },
                  ]}
                  onPress={() => handleGoalSelection(item)}
                >
                  Gain {item} Kg per week
                </Text>
              ))}
            </View>
          ) : (
            <View style={styles.weeklyGoalList}>
              {weightLossweeklyGoal.map((item, index) => (
                <Text
                  key={index}
                  style={[
                    styles.weeklyWeightoptionText,
                    {
                      backgroundColor: selected === item ? "#d05b19" : "white",
                      borderWidth: selected === item ? null : 1,
                    },
                  ]}
                  onPress={() => handleGoalSelection(item)}
                >
                  {item === 0.5
                    ? `Lose ${item} Kg per week (Recommended)`
                    : `Lose ${item} Kg per week`}
                </Text>
              ))}
            </View>
          )}
        </View>

        <TouchableOpacity
          style={[
            styles.nextButtonContainer,
            { display: nextButtonVisibility },
          ]}
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default SetWeightGoalScreen;

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
  header: {
    marginTop: width * 0.2,
    justifyContent: "center",
    marginBottom: 40,
    gap: 15,
  },
  headerHeading: {
    fontSize: 25,
    fontWeight: "600",
    color: "black",
    textAlign: "center",
  },
  weightGoalInput: {
    padding: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "black",
    fontSize: 18,
    fontWeight: "600",
    color: "black",
    backgroundColor: "white",
    width: "100%",
  },
  weeklyGoalHeading: {
    fontSize: 25,
    fontWeight: "600",
    color: "black",
    marginBottom: 15,
    textAlign: "center",
  },
  weeklyWeightoptionText: {
    padding: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "black",
    marginBottom: 10,
    fontWeight: "600",
    fontSize: 18,
  },
  weeklyGoalList: {
    marginBottom: 20,
  },
  nextButtonContainer: {
    padding: 15,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#d05b19",
    position: "absolute",
    bottom: 20,
    right: 10,
    left: 10,
  },
  nextButtonText: {
    fontSize: 22,
    fontWeight: "600",
    color: "white",
  },
});
