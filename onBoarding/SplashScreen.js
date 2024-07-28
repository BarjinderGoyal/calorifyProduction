import { StyleSheet, Text, View, Image } from "react-native";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { getUserFromDatabase } from "./../functions/GetUserFromDatabase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { userAuthUseContext } from "../Context/UserAuthContext";

const icon = require("./../assets/splashIcon.png");

const SplashScreen = () => {
  const navigation = useNavigation();
  const { handleUserDetail, setUid } = userAuthUseContext();

  const checkUserLocally = async () => {
    try {
      console.log("CHECK USER LOCALLY IS CALLED inside)");
      const uidJson = await AsyncStorage.getItem("uid");
      const uidData = uidJson ? JSON.parse(uidJson) : null;
      if (uidData) {
        const response = await getUserFromDatabase(uidData);
        setUid(uidData);
        handleUserDetail(response?.data?.data);
        navigation.navigate("mainScreen");
      } else {
        navigation.navigate("signupScreen");
      }
    } catch (e) {
      console.error("Error reading UID from AsyncStorage:", e);
    }
  };

  useEffect(() => {
    checkUserLocally();
  }, []);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.innerContainer}>
        <Image source={icon} style={styles.icon} />
      </SafeAreaView>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  innerContainer: {
    flex: 1,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    width: 200,
    height: 200,
  },
});
