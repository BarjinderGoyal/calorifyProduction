// import {
//   Dimensions,
//   StyleSheet,
//   Text,
//   View,
//   TouchableOpacity,
//   FlatList,
// } from "react-native";
// import React from "react";
// import { SafeAreaView } from "react-native-safe-area-context";
// import Animated, {
//   interpolate,
//   useAnimatedStyle,
//   useSharedValue,
//   useAnimatedScrollHandler,
//   Extrapolation,
//   interpolateColor,
// } from "react-native-reanimated";
// import { Ionicons } from "react-native-vector-icons";
// import { useNavigation } from "@react-navigation/native";
// import { useOnBoardingContext } from "../Context/OnBoardingContext";

// const ItemHeight = 80;
// const ItemWidth = 120;
// const { width } = Dimensions.get("window");
// const barItemWidth = (width - 120) / 6;

// const HeightScreen = () => {
//   let data = [...new Array(100)].map((_, index) => index);
//   data = ["", "", ...data, "", ""];
//   const navigation = useNavigation();
//   const { user, setUserInfo } = useOnBoardingContext();

//   const firstScrollY = useSharedValue(0);
//   const secondScrollY = useSharedValue(0);
//   const thirdScrollY = useSharedValue(0);
//   const firstHeightValue = useSharedValue(0);
//   const secondHeightValue = useSharedValue(0);
//   const heightMeasurementValue = useSharedValue(3);

//   const firstScrollHandler = useAnimatedScrollHandler({
//     onScroll: (event) => {
//       firstScrollY.value = event.contentOffset.y;
//     },
//     onMomentumEnd: (event) => {
//       const y = event.contentOffset.y;
//       firstHeightValue.value = Math.round(y / ItemHeight);
//       console.log(firstHeightValue.value);
//     },
//   });

//   const secondScrollHandler = useAnimatedScrollHandler({
//     onScroll: (event) => {
//       secondScrollY.value = event.contentOffset.y;
//     },
//     onMomentumEnd: (event) => {
//       const y = event.contentOffset.y;
//       secondHeightValue.value = Math.round(y / ItemHeight);
//       console.log(secondHeightValue.value);
//     },
//   });

//   const thirdScrollHandler = useAnimatedScrollHandler({
//     onScroll: (event) => {
//       thirdScrollY.value = event.contentOffset.y;
//     },
//     onMomentumEnd: (event) => {
//       const y = event.contentOffset.y;
//       heightMeasurementValue.value = Math.round(y / ItemHeight);
//       console.log(heightMeasurementValue.value);
//     },
//   });

//   const RenderItem = ({ item, index, scrollY }) => {
//     const renderAnimation = useAnimatedStyle(() => ({
//       transform: [
//         {
//           scale: interpolate(
//             scrollY.value,
//             [
//               (index - 3) * ItemHeight,
//               (index - 2) * ItemHeight,
//               (index - 1) * ItemHeight,
//             ],
//             [0.8, 1, 0.8],
//             Extrapolation.CLAMP
//           ),
//         },
//       ],
//       color: interpolateColor(
//         scrollY.value,
//         [
//           (index - 3) * ItemHeight,
//           (index - 2) * ItemHeight,
//           (index - 1) * ItemHeight,
//         ],
//         ["black", "#d05b19", "black"]
//       ),
//     }));

//     return (
//       <Animated.View style={[styles.renderItemContainer, renderAnimation]}>
//         <Animated.Text style={[styles.renderItem, renderAnimation]}>
//           {item}
//         </Animated.Text>
//       </Animated.View>
//     );
//   };

//   const handleNext = () => {
//     if (firstHeightValue.value && secondHeightValue.value) {
//       if (heightMeasurementValue.value === 3) {
//         setUserInfo("height", [
//           firstHeightValue.value,
//           secondHeightValue.value,
//           "ft",
//         ]);
//       } else {
//         setUserInfo("height", [
//           firstHeightValue.value,
//           secondHeightValue.value,
//           "cm",
//         ]);
//       }
//     }
//     navigation.navigate("weightScreen");
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
//         <View style={styles.pickerContainer}>
//           <View style={styles.innerPickerContainer}>
//             <Animated.FlatList
//               data={data}
//               renderItem={({ item, index }) => (
//                 <RenderItem item={item} index={index} scrollY={firstScrollY} />
//               )}
//               onScroll={firstScrollHandler}
//               showsVerticalScrollIndicator={false}
//               snapToInterval={ItemHeight}
//               initialScrollIndex={2}
//               getItemLayout={(_, index) => ({
//                 length: ItemHeight,
//                 offset: ItemHeight * index,
//                 index,
//               })}
//             />
//             <View style={styles.indicatorContainer}>
//               <View style={styles.indicator} />
//               <View style={[styles.indicator, { marginTop: ItemHeight }]} />
//             </View>
//           </View>
//           <View style={styles.dot} />
//           <View style={styles.innerPickerContainer}>
//             <Animated.FlatList
//               data={data}
//               renderItem={({ item, index }) => (
//                 <RenderItem item={item} index={index} scrollY={secondScrollY} />
//               )}
//               onScroll={secondScrollHandler}
//               showsVerticalScrollIndicator={false}
//               snapToInterval={ItemHeight}
//               initialScrollIndex={2}
//               getItemLayout={(_, index) => ({
//                 length: ItemHeight,
//                 offset: ItemHeight * index,
//                 index,
//               })}
//             />
//             <View style={styles.indicatorContainer}>
//               <View style={styles.indicator} />
//               <View style={[styles.indicator, { marginTop: ItemHeight }]} />
//             </View>
//           </View>
//           <View style={styles.innerPickerContainer}>
//             <Animated.FlatList
//               data={["", "", "cm", "ft", "", ""]}
//               renderItem={({ item, index }) => (
//                 <RenderItem item={item} index={index} scrollY={thirdScrollY} />
//               )}
//               onScroll={thirdScrollHandler}
//               showsVerticalScrollIndicator={false}
//               snapToInterval={ItemHeight}
//               initialScrollIndex={2}
//               getItemLayout={(_, index) => ({
//                 length: ItemHeight,
//                 offset: ItemHeight * index,
//                 index,
//               })}
//             />
//             <View style={styles.indicatorContainer}>
//               <View style={styles.indicator} />
//               <View style={[styles.indicator, { marginTop: ItemHeight }]} />
//             </View>
//           </View>
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
//   pickerContainer: {
//     flexDirection: "row",
//     backgroundColor: "white",
//     borderRadius: 20,
//     borderWidth: StyleSheet.hairlineWidth,
//     elevation: 2,
//     alignSelf: "center",
//   },
//   innerPickerContainer: {
//     height: ItemHeight * 5,
//     width: ItemWidth,
//   },
//   renderItemContainer: {
//     height: ItemHeight,
//     width: ItemWidth,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   renderItem: {
//     fontSize: 30,
//     fontWeight: "600",
//   },
//   indicatorContainer: {
//     position: "absolute",
//     top: 2 * ItemHeight,
//     right: 0,
//     left: 0,
//   },
//   indicator: {
//     width: ItemWidth,
//     height: 3,
//     backgroundColor: "#d05b19",
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
//   dot: {
//     position: "absolute",
//     top: 2.5 * ItemHeight,
//     width: 5,
//     height: 5,
//     backgroundColor: "#d05b19",
//     borderRadius: 2,
//     left: ItemWidth,
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
// });

import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { Ionicons } from "react-native-vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useOnBoardingContext } from "../Context/OnBoardingContext";

const { width } = Dimensions.get("window");

const barItemWidth = (width - 140) / 8;

const HeightScreen = () => {
  const { setUserInfo } = useOnBoardingContext();

  const navigation = useNavigation();
  const [height, setHeight] = useState({
    cm: null,
    ft: null,
    in: null,
  });
  const [heightUnit, setHeightUnit] = useState("cm");

  const handleNext = () => {
    if (heightUnit === "cm") {
      if (height.cm !== null) {
        setUserInfo("height", [height.cm, heightUnit]);
        navigation.navigate("weightScreen");
      }
    } else {
      if (height.ft !== null) {
        setUserInfo("height", [
          { ft: height.ft, in: height.in ? height.in : "00" },
          heightUnit,
        ]);
        navigation.navigate("weightScreen");
      }
    }
  };

  const handleHeight = (key, value) => {
    console.log(key, value);
    setHeight({ ...height, [key]: value });
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
            {[...new Array(5)].map((_, index) => (
              <View
                style={{
                  width: barItemWidth,
                  backgroundColor: "#d05b19",
                  height: 5,
                }}
                key={index}
              />
            ))}
            {[...new Array(3)].map((_, index) => (
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
          <Text style={styles.headerHeading}>What's your height?</Text>
        </View>
        <View style={styles.heightInputContainer}>
          <View style={styles.heightUnitContainer}>
            <Text
              style={[
                styles.ftunit,
                { backgroundColor: heightUnit === "cm" ? "#d05b19" : null },
              ]}
              onPress={() => setHeightUnit("cm")}
            >
              cm
            </Text>
            <Text
              style={[
                styles.cmunit,
                { backgroundColor: heightUnit === "ft" ? "#d05b19" : null },
              ]}
              onPress={() => setHeightUnit("ft")}
            >
              ft
            </Text>
          </View>
          {heightUnit === "cm" ? (
            <TextInput
              value={height.cm}
              placeholder="Cm"
              placeholderTextColor={"lightgrey"}
              onChangeText={(text) => handleHeight("cm", text)}
              keyboardType="numeric"
              // placeholder="Age"
              style={styles.heightInput}
            />
          ) : (
            <View style={styles.ftContainer}>
              <TextInput
                value={height.ft}
                placeholder="Ft"
                placeholderTextColor={"lightgrey"}
                onChangeText={(text) => handleHeight("ft", text)}
                keyboardType="numeric"
                // placeholder="Age"
                style={styles.heightInput}
              />
              <TextInput
                value={height.in}
                placeholder="In"
                placeholderTextColor={"lightgrey"}
                onChangeText={(text) => handleHeight("in", text)}
                keyboardType="numeric"
                // placeholder="Age"
                style={styles.heightInput}
              />
            </View>
          )}
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
  heightInput: {
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
  ftContainer: {
    gap: 15,
  },
  heightInputContainer: {
    gap: 15,
  },
  heightUnitContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  ftunit: {
    padding: 10,
    width: width * 0.3,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    borderWidth: 1,
    borderColor: "black",
    textAlign: "center",
    fontSize: 20,
    fontWeight: "600",
    color: "black",
  },
  cmunit: {
    padding: 10,
    width: width * 0.3,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderColor: "black",
    textAlign: "center",
    fontSize: 20,
    fontWeight: "600",
    color: "black",
  },
});
