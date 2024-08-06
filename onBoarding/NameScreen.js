// import {
//   Dimensions,
//   FlatList,
//   StyleSheet,
//   Text,
//   View,
//   TouchableOpacity,
//   TextInput,
//   Platform,
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
// import Toast from "react-native-simple-toast";
// import { Ionicons } from "react-native-vector-icons";
// import { useNavigation } from "@react-navigation/native";
// import { useOnBoardingContext } from "../Context/OnBoardingContext";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { createAccount } from "../functions/CreateAccount";
// import { ActivityIndicator } from "react-native-paper";
// import { userAuthUseContext } from "../Context/UserAuthContext";

// const ItemHeight = 80;
// const ItemWidth = 120;
// const { width, height } = Dimensions.get("window");

// const barItemWidth = (width - 140) / 8;

// const NameScreen = () => {
//   const { user, setUserInfo } = useOnBoardingContext();
//   const { handleUserDetail } = userAuthUseContext();
//   const [loading, setLoading] = useState(false);

//   const navigation = useNavigation();
//   const [name, setName] = useState(null);

//   const handleNext = async () => {
//     if (name !== null) {
//       setUserInfo("userName", name);
//       await registerUser(name);
//     }
//   };

//   const registerUser = async (name) => {
//     try {
//       setLoading(true);
//       const response = await createAccount(
//         (uid = user.uid),
//         (userName = name),
//         (email = user.email),
//         (age = user.age),
//         (userHeight = user.height),
//         (weight = user.weight),
//         (gender = user.gender),
//         (goal = user.goal),
//         (goalWeight = user.goalWeight),
//         (activityLevel = user.activityLevel),
//         (weeklyGoal = user.weeklyGoal)
//       );
//       if (response) {
//         const dailyCalorieValue = response?.data?.data?.dailyCalorieValue;
//         handleUserDetail(response?.data?.data);

//         await AsyncStorage.setItem("uid", JSON.stringify(user?.uid));
//         setLoading(false);

//         navigation.navigate("mainScreen");
//       } else {
//         // await AsyncStorage.removeItem("uid");
//         setLoading(false);

//         Toast.show("Something went wrong", Toast.LONG);

//         navigation.navigate("signupScreen");
//       }
//     } catch (e) {
//       setLoading(false);

//       Toast.show("Error while registering user", Toast.LONG);
//       console.log("Error while registering user", e);
//     }
//   };

//   if (loading) {
//     return (
//       <View
//         style={{
//           flex: 1,
//           backgroundColor: "#f7f8f9",
//           justifyContent: "center",
//           alignItems: "center",
//         }}
//       >
//         <ActivityIndicator size={"large"} color="#d05b19" />
//       </View>
//     );
//   }

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
//             {[...new Array(8)].map((_, index) => (
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
//           <Text style={styles.headerHeading}>What's your name?</Text>
//         </View>
//         <TextInput
//           value={name}
//           onChangeText={(text) => setName(text)}
//           // placeholder="name"
//           style={styles.nameInput}
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

// export default NameScreen;

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
//   nameInput: {
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

import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Platform,
} from "react-native";
import React, { useCallback, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  useAnimatedScrollHandler,
  Extrapolation,
  interpolateColor,
} from "react-native-reanimated";
import Toast from "react-native-simple-toast";
import { Ionicons } from "react-native-vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useOnBoardingContext } from "../Context/OnBoardingContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAccount } from "../functions/CreateAccount";
import { ActivityIndicator } from "react-native-paper";
import { userAuthUseContext } from "../Context/UserAuthContext";

const ItemHeight = 80;
const ItemWidth = 120;
const { width, height } = Dimensions.get("window");

const barItemWidth = (width - 140) / 8;

const NameScreen = () => {
  const { user, setUserInfo } = useOnBoardingContext();
  const { handleUserDetail } = userAuthUseContext();
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();
  const [name, setName] = useState(null);

  console.log("user inside name screen", user);

  const handleNext = async () => {
    if (name !== null) {
      setUserInfo("userName", name);
      await registerUser(name);
    }
  };

  const registerUser = async (name) => {
    try {
      setLoading(true);
      const response = await createAccount(
        (uid = user.uid),
        (userName = name),
        (email = user.email),
        (age = user.age),
        (userHeight = user.height),
        (weight = user.weight),
        (gender = user.gender),
        (goal = user.goal),
        (goalWeight = user.goalWeight),
        (activityLevel = user.activityLevel),
        (weeklyGoal = user.weeklyGoal)
      );
      if (response) {
        const dailyCalorieValue = response?.data?.data?.dailyCalorieValue;
        handleUserDetail(response?.data?.data);
        await AsyncStorage.setItem("uid", JSON.stringify(user?.uid));
        setLoading(false);
        navigation.navigate("mainScreen");
      } else {
        // await AsyncStorage.removeItem("uid");
        setLoading(false);
        console.log("response of the create account", response);
        Toast.show("Something went wrong", Toast.LONG);

        navigation.navigate("signupScreen");
      }
    } catch (e) {
      setLoading(false);

      Toast.show("Error while registering user", Toast.LONG);
      console.log("Error while registering user", e);
    }
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
        <View style={styles.barContainer}>
          <Ionicons
            name="chevron-back"
            color="black"
            size={30}
            onPress={() => navigation.goBack()}
          />
          <View style={styles.innerBarContainer}>
            {[...new Array(8)].map((_, index) => (
              <View
                style={{
                  width: barItemWidth,
                  backgroundColor: "#d05b19",
                  height: 5,
                }}
                key={index}
              />
            ))}
            {[...new Array(0)].map((_, index) => (
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
          <Text style={styles.headerHeading}>What's your name?</Text>
        </View>
        <TextInput
          value={name}
          onChangeText={(text) => setName(text)}
          // placeholder="name"
          style={styles.nameInput}
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

export default NameScreen;

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
  nameInput: {
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
