// import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
// import React, { useCallback, useState } from "react";
// import { SafeAreaView } from "react-native-safe-area-context";

// import { useNavigation } from "@react-navigation/native";
// import { userAuthUseContext } from "../../Context/UserAuthContext";
// import Toast from "react-native-simple-toast";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// const profileImage = require("../../assets/profile.jpeg");

// const AccountScreen = () => {
//   const { userDetail } = userAuthUseContext();
//   const [middleContainerOptions, setMiddleContainerOptions] = useState([
//     { heading: "Age", value: `${userDetail?.age}` },
//     { heading: "Gender", value: `${userDetail?.gender}` },
//     { heading: "Height", value: `${userDetail?.height} cm` },
//     {
//       heading: "Calorie Goal",
//       value: `${userDetail?.dailyCalorieValue.toFixed(0)} Kcal`,
//     },
//     { heading: "Email", value: `${userDetail?.email}` },
//   ]);

//   const handleLogout = async () => {
//     try {
//       await AsyncStorage.removeItem("uid");
//       navigation.navigate("signupScreen");
//     } catch (error) {
//       Toast.show("Something went wrong", Toast.LONG);
//       console.error("Error removing UID from AsyncStorage", error);
//     }
//   };

//   const navigation = useNavigation();

//   const RenderOptions = useCallback(({ item, index }) => {
//     return (
//       <View style={styles.middleContainerOptions}>
//         <View style={styles.middleInnerContainerOptions}>
//           <Text style={styles.middleContainerOptionName}>{item.heading}</Text>
//           <Text style={styles.middleContainerOptionValue}>{item.value}</Text>
//         </View>
//       </View>
//     );
//   });

//   return (
//     <View style={styles.container}>
//       <SafeAreaView style={styles.innerContainer}>
//         <View style={styles.topContainer}>
//           <Image source={profileImage} style={styles.profileImage} />
//           <Text style={styles.userName}>{userDetail?.userName}</Text>
//         </View>
//         <View style={styles.middleContainer}>
//           {middleContainerOptions.map((item, index) => {
//             return <RenderOptions item={item} index={index} key={index} />;
//           })}
//         </View>
//         <TouchableOpacity
//           style={styles.footerInnerContainer}
//           onPress={handleLogout}
//         >
//           <Text style={styles.footerButtonText}>Logout</Text>
//         </TouchableOpacity>
//       </SafeAreaView>
//     </View>
//   );
// };

// export default AccountScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#F6F5F2", //"#f7f8f9",
//   },
//   innerContainer: {
//     flex: 1,
//     paddingHorizontal: 10,
//     paddingVertical: 10,
//     gap: 20,
//   },
//   middleContainer: {
//     paddingHorizontal: 10,
//     paddingTop: 10,
//     backgroundColor: "white",
//     borderRadius: 20,
//     borderWidth: StyleSheet.hairlineWidth,
//     borderColor: "lightgrey",
//     // elevation: 2,
//   },
//   middleContainerOptions: {
//     padding: 10,
//     borderRadius: 20,
//     borderWidth: 1,
//     borderColor: "lightgrey",
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     marginBottom: 10,
//   },
//   middleInnerContainerOptions: {
//     gap: 5,
//   },
//   middleContainerOptionName: {
//     fontSize: 16,
//     color: "black",
//   },
//   middleContainerOptionValue: {
//     fontSize: 16,
//     color: "black",
//   },
//   footerContainer: {
//     paddingHorizontal: 10,
//     paddingTop: 10,
//     backgroundColor: "white",
//     borderRadius: 20,
//     borderWidth: StyleSheet.hairlineWidth,
//     borderColor: "lightgrey",
//   },
//   footerInnerContainer: {
//     padding: 20,
//     borderRadius: 20,
//     borderWidth: 1,
//     borderColor: "lightgrey",
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     marginBottom: 10,
//     backgroundColor: "white",
//   },
//   footerButtonText: {
//     fontSize: 18,
//     fontWeight: "600",
//     color: "black",
//   },
//   topContainer: {
//     padding: 10,
//     borderRadius: 20,
//     borderWidth: StyleSheet.hairlineWidth,
//     borderColor: "lightgrey",
//     gap: 10,
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: "white",
//   },
//   userName: {
//     fontSize: 20,
//     fontWeight: "600",
//     color: "black",
//   },
//   profileImage: {
//     width: 150,
//     height: 150,
//     borderRadius: 300,
//   },
// });

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
  Linking,
} from "react-native";
import React, { useCallback, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { useNavigation } from "@react-navigation/native";
import { userAuthUseContext } from "../../Context/UserAuthContext";
import Toast from "react-native-simple-toast";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from "react-native-vector-icons";
import Superwall from "@superwall/react-native-superwall";

const profileImage = require("../../assets/profile.jpeg");

const AccountScreen = () => {
  const { userDetail } = userAuthUseContext();
  const topContainerOptions = [
    { heading: "Name", value: `${userDetail?.userName}` },
    { heading: "Age", value: `${userDetail?.age}` },
    { heading: "Gender", value: `${userDetail?.gender}` },
    { heading: "Height", value: `${userDetail?.height} cm` },
    { heading: "Goal", value: `${userDetail?.goal} ` },
    { heading: "Goal Weight", value: `${userDetail?.goalWeight} kg` },
    {
      heading: "Calorie Goal",
      value: `${userDetail?.dailyCalorieValue.toFixed(0)} Kcal`,
    },
    { heading: "Email", value: `${userDetail?.email}` },
  ];

  const subscriptionOptions = [
    { title: "Restore Purchases", url: null },
    { title: "Upgrade to plus", url: null },
  ];

  const policiesLink = [
    { title: "Contact us", url: null },
    {
      title: "Terms & conditions",
      url: "https://calorifyai.app/terms-conditions",
    },
    {
      title: "Privacy Policy",
      url: "https://calorifyai.app/privacy-policy",
    },
  ];

  const handleContactUs = () => {
    const email = "support@calorifyai.app";
    const subject = "Contact Us Inquiry";
    const body = "Hello, I would like to inquire about...";
    const url = `mailto:${email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    Linking.openURL(url).catch((err) =>
      Toast.show(
        "An error occurred while trying to open the email client.",
        Toast.SHORT
      )
    );
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("uid");
      navigation.navigate("signupScreen");
    } catch (error) {
      Toast.show("Something went wrong", Toast.LONG);
      console.error("Error removing UID from AsyncStorage", error);
    }
  };

  const handleRestore = async () => {
    try {
      // Restore the user's purchases
      const result = await Superwall?.restorePurchases();

      // Check if there are any active subscriptions
      if (result.activeSubscription) {
        Alert.alert(
          "Subscription Restored",
          "Your subscription has been successfully restored."
        );
      } else {
        Alert.alert(
          "No Active Subscription",
          "No active subscription was found."
        );
      }
    } catch (error) {
      console.error("Error restoring purchases:", error);
      Toast.show(
        "There was an issue restoring your purchases. Please try again.",
        Toast.SHORT
      );
    }
  };

  const restorePurchases = async () => {
    try {
      console.log(
        Superwall.shared.didRestore,
        Superwall.shared.getSubscriptionStatus,
        Superwall.shared.didRestore(() => {
          console.log("restoration is completed");
        })
      );
      const restorationResult = await Superwall.shared.didRestore();
      console.log(restorationResult);

      // Handle the restoration result
      if (restorationResult) {
        // if (restorationResult.restoredPurchases.length > 0) {
        // Alert.alert(
        //   "Restore Successful",
        //   "Your purchases have been restored."
        // );
        // } else {
        //   Alert.alert(
        //     "No Purchases",
        //     "No previous purchases found to restore."
        //   );
        // }
        Alert.alert("Restore Successful", "Your purchases have been restored.");
      } else {
        Alert.alert(
          "Restore Failed",
          "There was an issue restoring your purchases."
        );
      }
    } catch (error) {
      console.error("Error restoring purchases:", error);
      Toast.show(
        "There was an issue restoring your purchases. Please try again.",
        Toast.SHORT
      );
    }
  };

  const navigation = useNavigation();

  const openLink = async (item, url = null) => {
    if (!url) {
      if (item === "Contact us") {
        handleContactUs();
      } else if (item === "Upgrade to plus") {
      } else if (item === "Restore Purchases") {
        await restorePurchases();
      }
      return;
    }
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert(`Don't know how to open this URL: ${url}`);
    }
  };

  const RenderOptions = useCallback(({ item, index }) => {
    return (
      <View style={styles.renderItemContainer}>
        <View style={styles.renderItemInnerContainer}>
          <Text style={styles.itemOptionName}>{item.heading}</Text>
          <Text style={styles.itemOptionValue}>{item.value}</Text>
        </View>
      </View>
    );
  });

  const RenderOtherOptions = useCallback(
    ({ item, index }) => {
      return (
        <View style={[styles.renderItemContainer, { paddingVertical: 10 }]}>
          <TouchableOpacity
            style={styles.renderItemInnerContainer}
            onPress={() => openLink(item?.title, item?.url)}
          >
            <Text style={styles.itemOptionName}>{item?.title}</Text>
            <MaterialIcons name="chevron-right" size={30} color="lightgrey" />
          </TouchableOpacity>
        </View>
      );
    },
    [subscriptionOptions, policiesLink]
  );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <SafeAreaView style={styles.innerContainer}>
          <View style={styles.optionsContainer}>
            {/* <Image source={profileImage} style={styles.profileImage} /> */}
            {topContainerOptions.map((item, index) => {
              return <RenderOptions item={item} index={index} key={index} />;
            })}
          </View>
          <View style={styles.optionsContainer}>
            {subscriptionOptions.map((item, index) => {
              return (
                <RenderOtherOptions item={item} index={index} key={index} />
              );
            })}
          </View>
          <View style={styles.optionsContainer}>
            {policiesLink.map((item, index) => {
              return (
                <RenderOtherOptions item={item} index={index} key={index} />
              );
            })}
          </View>
          <TouchableOpacity
            style={styles.footerInnerContainer}
            onPress={handleLogout}
          >
            <Text style={styles.footerButtonText}>Logout</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </ScrollView>
    </View>
  );
};

export default AccountScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F5F2", //"#f7f8f9",
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
    gap: 20,
  },
  optionsContainer: {
    paddingHorizontal: 10,
    paddingTop: 10,
    backgroundColor: "white",
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "lightgrey",
    // elevation: 2,
  },
  renderItemContainer: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "lightgrey",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  renderItemInnerContainer: {
    gap: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    flex: 1,
  },
  itemOptionName: {
    fontSize: 16,
    color: "black",
  },
  itemOptionValue: {
    fontSize: 16,
    color: "black",
  },
  middleContainer: {
    paddingHorizontal: 10,
    paddingTop: 10,
    backgroundColor: "white",
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "lightgrey",
  },
  membershipHeading: {
    fontSize: 18,
    color: "black",
  },
  footerContainer: {
    paddingHorizontal: 10,
    paddingTop: 10,
    backgroundColor: "white",
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "lightgrey",
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
  topContainer: {
    padding: 10,
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "lightgrey",
    gap: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },

  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 300,
  },
});
