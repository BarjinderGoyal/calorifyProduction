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

// const AgeScreen = () => {
//   const { setUserInfo } = useOnBoardingContext();

//   const navigation = useNavigation();
//   const [age, setAge] = useState(null);

//   const handleNext = () => {
//     const isNumeric = /^[0-9]+$/.test(age);
//     if (age !== null && isNumeric) {
//       setUserInfo("age", age);
//       navigation.navigate("heightScreen");
//     } else {
//       Toast.show("Age is Invalid", Toast.SHORT);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <SafeAreaView style={styles.innerContainer}>
//         <View style={styles.barContainer}>
//           <Ionicons
//             name="chevron-back"
//             color="black"
//             size={30}
//             onPress={() => navigation.goBack()}
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
//             {[...new Array(4)].map((_, index) => (
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
//           <Text style={styles.headerHeading}>What's your age?</Text>
//         </View>
//         <TextInput
//           value={age}
//           onChangeText={(text) => setAge(text)}
//           keyboardType="numeric"
//           // placeholder="Age"
//           style={styles.ageInput}
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

// export default AgeScreen;

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
//   ageInput: {
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

// // import React, { useState } from "react";
// // import { View, Text, StyleSheet, FlatList } from "react-native";
// // import Animated, {
// //   useSharedValue,
// //   useAnimatedScrollHandler,
// //   useAnimatedStyle,
// //   interpolate,
// //   Extrapolate,
// // } from "react-native-reanimated";

// // const ITEM_HEIGHT = 50;

// // const AgeScreen = ({ selectedAge, setSelectedAge }) => {
// //   const ageData = Array.from({ length: 150 }, (_, i) => ({
// //     key: (i + 1).toString(),
// //   }));

// //   const scrollYAge = useSharedValue(0);

// //   const onScrollAge = useAnimatedScrollHandler({
// //     onScroll: (event) => {
// //       scrollYAge.value = event.contentOffset.y;
// //     },
// //   });

// //   const renderItem = ({ item, index }) => {
// //     const inputRange = [
// //       (index - 2) * ITEM_HEIGHT,
// //       index * ITEM_HEIGHT,
// //       (index + 2) * ITEM_HEIGHT,
// //     ];

// //     const scale = useAnimatedStyle(() => ({
// //       transform: [
// //         {
// //           scale: interpolate(
// //             scrollYAge.value,
// //             inputRange,
// //             [0.7, 1, 0.7],
// //             Extrapolate.CLAMP
// //           ),
// //         },
// //       ],
// //     }));

// //     const opacity = useAnimatedStyle(() => ({
// //       opacity: interpolate(
// //         scrollYAge.value,
// //         inputRange,
// //         [0.3, 1, 0.3],
// //         Extrapolate.CLAMP
// //       ),
// //     }));

// //     return (
// //       <Animated.View style={[styles.itemContainer, scale, opacity]}>
// //         <Text
// //           style={[styles.text, item.key == selectedAge && styles.selectedText]}
// //         >
// //           {item.key}
// //         </Text>
// //       </Animated.View>
// //     );
// //   };

// //   return (
// //     <View style={styles.agePickerContainer}>
// //       <FlatList
// //         data={ageData}
// //         keyExtractor={(item) => item.key}
// //         showsVerticalScrollIndicator={false}
// //         contentContainerStyle={styles.contentContainer}
// //         snapToAlignment="center"
// //         snapToInterval={ITEM_HEIGHT}
// //         decelerationRate="fast"
// //         onMomentumScrollEnd={(event) => {
// //           const index = Math.round(
// //             event.nativeEvent.contentOffset.y / ITEM_HEIGHT
// //           );
// //           setSelectedAge(index + 1);
// //         }}
// //         renderItem={renderItem}
// //         onScroll={onScrollAge}
// //       />
// //     </View>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   agePickerContainer: {
// //     alignItems: "center",
// //     justifyContent: "center",
// //     height: 300, // Adjust as needed
// //   },
// //   contentContainer: {
// //     paddingVertical: 100,
// //   },
// //   itemContainer: {
// //     height: ITEM_HEIGHT,
// //     justifyContent: "center",
// //     alignItems: "center",
// //   },
// //   text: {
// //     fontSize: 24,
// //     color: "#888",
// //   },
// //   selectedText: {
// //     color: "#00A6FF",
// //     fontWeight: "bold",
// //     fontSize: 30,
// //   },
// // });

// // export default AgeScreen;

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

const AgeScreen = () => {
  const [value, setValue] = useState(60);
  const navigation = useNavigation();
  const { setUserInfo } = useOnBoardingContext();

  const data = useMemo(
    () =>
      [...Array(200)].map((_, index) => ({
        value: index + 3,
        label: `${index + 3}`,
      })),
    []
  );

  const handleNext = () => {
    InteractionManager.runAfterInteractions(() => {
      console.log("age of the user", value);

      setUserInfo("age", value);
      navigation.navigate("heightScreen");
    });
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.innerContainer}>
        <View style={styles.barContainer}>
          <Ionicons name="chevron-back" color="black" size={30} />
          <View style={styles.innerBarContainer}>
            {[...Array(4)].map((_, index) => (
              <View key={index} style={styles.barActive} />
            ))}
            {[...Array(4)].map((_, index) => (
              <View key={index} style={styles.barInactive} />
            ))}
          </View>
        </View>
        <View style={styles.header}>
          <Text style={styles.headerHeading}>What's your age?</Text>
        </View>

        <View style={styles.picker}>
          <WheelPickerComponent
            items={data}
            onIndexChange={setValue}
            defaultValue={value}
          />
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

export default AgeScreen;

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
