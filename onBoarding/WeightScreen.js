// import {
//   Dimensions,
//   FlatList,
//   StyleSheet,
//   Text,
//   View,
//   TouchableOpacity,
// } from "react-native";
// import React, { useCallback, useState } from "react";
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
// const { width, height } = Dimensions.get("window");
// const barItemWidth = (width - 120) / 6;

// const WeightScreen = () => {
//   let data = [...new Array(301)].map((_, index) => index);
//   data = ["", "", ...data.slice(1), "", ""];
//   const [weight, setWeight] = useState(null);
//   const { user, setUserInfo } = useOnBoardingContext();
//   const weightIndex = useSharedValue(0);
//   const navigation = useNavigation();

//   const scrollY = useSharedValue(0);

//   const scrollHandler = useAnimatedScrollHandler({
//     onScroll: (event) => {
//       scrollY.value = event.contentOffset.y;
//     },
//     onMomentumEnd: (event) => {
//       const y = event.contentOffset.y;
//       weightIndex.value = Math.round(y / ItemHeight) + 1;
//       console.log(weightIndex.value);
//     },
//   });

//   const RenderWeight = useCallback(
//     ({ item, index }) => {
//       const renderAnimation = useAnimatedStyle(() => ({
//         transform: [
//           {
//             scale: interpolate(
//               scrollY.value,
//               [
//                 (index - 3) * ItemHeight,
//                 (index - 2) * ItemHeight,

//                 (index - 1) * ItemHeight,
//               ],
//               [0.8, 1, 0.8],
//               Extrapolation.CLAMP
//             ),
//           },
//         ],
//       }));

//       const renderTextAnimation = useAnimatedStyle(() => ({
//         color: interpolateColor(
//           scrollY.value,
//           [
//             (index - 3) * ItemHeight,
//             (index - 2) * ItemHeight,
//             (index - 1) * ItemHeight,
//           ],
//           ["black", "#d05b19", "black"]
//         ),
//       }));
//       return (
//         <Animated.View style={[styles.renderItemContainer, renderAnimation]}>
//           <Animated.Text style={[styles.renderItem, renderTextAnimation]}>
//             {item}
//           </Animated.Text>
//         </Animated.View>
//       );
//     },
//     [scrollY]
//   );

//   const momentumScrollEnd = (event) => {
//     const y = event.nativeEvent.contentOffset.y;
//     const index = Math.round(y / ItemHeight);
//     //   onIndexChange(index);
//     setWeight(data[index]);
//     console.log(index);
//   };

//   const handleNext = () => {
//     if (weightIndex.value !== 0) {
//       setUserInfo("weight", weight);
//       if (user.goal !== "Maintain weight") {
//         navigation.navigate("setWeightGoalScreen");
//       } else {
//         navigation.navigate("customPlanScreen");
//       }
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <SafeAreaView style={styles.innerContainer}>
//         <View style={styles.barContainer}>
//           <Ionicons name="chevron-back" color="black" size={30} />
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
//             {[...new Array(1)].map((_, index) => (
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
//           <Text style={styles.headerHeading}>What's your weight(in KG)?</Text>
//         </View>
//         <View style={styles.pickerContainer}>
//           <Animated.FlatList
//             data={data}
//             renderItem={({ item, index }) => (
//               <RenderWeight item={item} index={index} />
//             )}
//             onMomentumScrollEnd={momentumScrollEnd}
//             onScroll={scrollHandler}
//             showsVerticalScrollIndicator={false}
//             snapToInterval={ItemHeight}
//             initialScrollIndex={2}
//             getItemLayout={(_, index) => ({
//               length: ItemHeight,
//               offset: ItemHeight * index,
//               index,
//             })}
//           />
//           <View style={styles.indicatorContainer}>
//             <View style={styles.indicator} />
//             <View style={[styles.indicator, { marginTop: ItemHeight }]} />
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

// export default WeightScreen;

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
//     height: ItemHeight * 5,
//     width: ItemWidth,
//     backgroundColor: "white",
//     borderRadius: 80,
//     borderWidth: StyleSheet.hairlineWidth,
//     elevation: 2,
//     alignSelf: "center",
//   },
//   renderItemContainer: {
//     height: ItemHeight,
//     width: ItemWidth,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   renderItem: {
//     fontSize: 30,
//     colot: "#d3d3d3",
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

const WeightScreen = () => {
  const { user, setUserInfo } = useOnBoardingContext();

  const navigation = useNavigation();
  const [weight, setWeight] = useState(null);

  const handleNext = () => {
    if (weight !== null) {
      setUserInfo("weight", weight);
      if (user?.goal !== "Maintain weight") {
        navigation.navigate("setWeightGoalScreen");
      } else {
        navigation.navigate("nameScreen");
      }
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
