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
      console.log(" CALLED insidefljdkfjdsoksdj)");
      const uidJson = await AsyncStorage.getItem("uid");
      console.log("hello")
      console.log("helloeeesndfkjkdsjkdsjdsj")
      const uidData = uidJson ? JSON.parse(uidJson) : null;
      if (uidData) {
        console.log("uid", uidData);
        console.log("no idea2fdsfdsfdsfdsfs");
        const response = await getUserFromDatabase(uidData);
        console.log("fuck it");
        setUid(uidData);
        handleUserDetail(response?.data?.data);
        navigation.navigate("mainScreen");
      } else {
        navigation.navigate("signupScreen");
      }
    } catch (e) {
      console.error("no jsjsdfhdddddddjksfdkh222222")
      console.log("Error reading UID from AsyncStorage3333:", e.response);
      if (e.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log("data", e.response.data);
        console.log("status", e.response.status);
        console.log("header", e.response.headers);
      } else if (e.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log("request", e.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', e.message);
      }
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
