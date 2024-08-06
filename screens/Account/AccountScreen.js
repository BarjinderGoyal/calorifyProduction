import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import React, { useCallback, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { useNavigation } from "@react-navigation/native";
import { userAuthUseContext } from "../../Context/UserAuthContext";
import Toast from "react-native-simple-toast";
import AsyncStorage from "@react-native-async-storage/async-storage";

const profileImage = require("../../assets/profile.jpeg");

const AccountScreen = () => {
  const { userDetail } = userAuthUseContext();
  const [middleContainerOptions, setMiddleContainerOptions] = useState([
    { heading: "Age", value: `${userDetail?.age}` },
    { heading: "Gender", value: `${userDetail?.gender}` },
    { heading: "Height", value: `${userDetail?.height} cm` },
    {
      heading: "Calorie Goal",
      value: `${userDetail?.dailyCalorieValue.toFixed(0)} Kcal`,
    },
    { heading: "Email", value: `${userDetail?.email}` },
  ]);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("uid");
      navigation.navigate("signupScreen");
    } catch (error) {
      Toast.show("Something went wrong", Toast.LONG);
      console.error("Error removing UID from AsyncStorage", error);
    }
  };

  const navigation = useNavigation();

  const RenderOptions = useCallback(({ item, index }) => {
    return (
      <View style={styles.middleContainerOptions}>
        <View style={styles.middleInnerContainerOptions}>
          <Text style={styles.middleContainerOptionName}>{item.heading}</Text>
          <Text style={styles.middleContainerOptionValue}>{item.value}</Text>
        </View>
      </View>
    );
  });

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.innerContainer}>
        <View style={styles.topContainer}>
          <Image source={profileImage} style={styles.profileImage} />
          <Text style={styles.userName}>{userDetail?.userName}</Text>
        </View>
        <View style={styles.middleContainer}>
          {middleContainerOptions.map((item, index) => {
            return <RenderOptions item={item} index={index} key={index} />;
          })}
        </View>
        <TouchableOpacity
          style={styles.footerInnerContainer}
          onPress={handleLogout}
        >
          <Text style={styles.footerButtonText}>Logout</Text>
        </TouchableOpacity>
      </SafeAreaView>
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
  middleContainer: {
    paddingHorizontal: 10,
    paddingTop: 10,
    backgroundColor: "white",
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "lightgrey",
    // elevation: 2,
  },
  middleContainerOptions: {
    padding: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "lightgrey",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  middleInnerContainerOptions: {
    gap: 5,
  },
  middleContainerOptionName: {
    fontSize: 16,
    color: "black",
  },
  middleContainerOptionValue: {
    fontSize: 16,
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
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "lightgrey",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    backgroundColor: "white",
  },
  footerButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "black",
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
  userName: {
    fontSize: 20,
    fontWeight: "600",
    color: "black",
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 300,
  },
});
