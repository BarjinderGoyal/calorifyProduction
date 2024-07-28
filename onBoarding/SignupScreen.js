import {
  Platform,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  BackHandler,
  Alert,
} from "react-native";
import Toast from "react-native-simple-toast";
import React, { useEffect, useState } from "react";
import * as Google from "expo-auth-session/providers/google";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
} from "firebase/auth";
import { auth } from "../Firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { TouchableOpacity } from "react-native-gesture-handler";
import GoogleG from "../components/SigninGoogleIcon";
import { useNavigation } from "@react-navigation/native";
import { useOnBoardingContext } from "../Context/OnBoardingContext";
import { userAuthUseContext } from "../Context/UserAuthContext";
import { ActivityIndicator } from "react-native-paper";
import { getUserFromDatabase } from "../functions/GetUserFromDatabase";

const { width, height } = Dimensions.get("window");

const SignupScreen = () => {
  const [signInUser, setsignInUser] = useState();
  const navigation = useNavigation();
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId:
      "14057899659-vdtgh7nmq9ho1geasham7inhmlbicev4.apps.googleusercontent.com",
  });
  const { user, setUserInfo } = useOnBoardingContext();
  const { handleUserDetail, setUid } = userAuthUseContext();
  const [loading, setLoading] = useState(false);

  // const checkUserLocally = async () => {
  //   try {
  //     console.log("CHECK USER LOCALLY IS CALLED");
  //     const uidJson = await AsyncStorage.getItem("uid");
  //     const uidData = uidJson ? JSON.parse(uidJson) : null;
  //     if (uidData) {
  //       const response = await getUserFromDatabase(uidData);
  //       setUid(uidData);
  //       handleUserDetail(response?.data?.data);
  //       navigation.navigate("mainScreen");
  //     }
  //   } catch (e) {
  //     console.error("Error reading UID from AsyncStorage:", e);
  //   }
  // };

  useEffect(() => {
    const backAction = () => {
      Alert.alert("Hold on!", "Are you sure you want to exit the app?", [
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel",
        },
        { text: "YES", onPress: () => BackHandler.exitApp() },
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential).catch((error) => {
        console.error("Error signing in with Google credential:", error);
      });
    }
  }, [response]);

  useEffect(() => {
    setLoading(true);
    checkUserLocally();
    const unsub = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          console.log(user);
          const response = await getUserFromDatabase(user?.uid);
          console.log("RESPONSE FROM BACKEND USER DATA   =>>", response);
          if (response?.data?.data) {
            await AsyncStorage.setItem("uid", JSON.stringify(user?.uid));
            handleUserDetail(response?.data?.data);
            navigation.navigate("mainScreen");
          } else {
            // await AsyncStorage.setItem("uid", JSON.stringify(user?.uid));
            setUserInfo("uid", user?.uid);
            setUserInfo("email", user?.email);
            setUid(user?.uid);
            // handleUserDetail(user?.uid);
            setLoading(false);
            navigation.navigate("goalScreen");
          }
        } else {
          setLoading(false);
          // if (Platform.OS === "android") {
          //   ToastAndroid.show("Something went wrong", ToastAndroid.LONG);
          // }
          // console.log("in onauthchnaged else condition is running");
        }
      } catch (e) {
        setLoading(false);

        Toast.show("User not found", Toast.LONG);

        console.error("Error during signup:", e);
      }
    });

    return () => unsub();
  }, []);

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
        {/* <Image
          source={require("../assets/adaptive-icon.png")}
          style={styles.appIcon}
        /> */}
        <TouchableOpacity style={styles.button} onPress={promptAsync}>
          <View style={styles.iconContainer}>
            <GoogleG size={24} />
          </View>
          <Text style={styles.buttonText}>Sign in with Google</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: 10,
    // justifyContent: "center",
    // alignItems: "center",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4285F4",
    padding: 10,
    borderRadius: 5,
    position: "absolute",
    top: height - 80,
    right: 10,
    left: 10,
    zIndex: 10,
  },
  iconContainer: {
    backgroundColor: "#fff",
    borderRadius: 3,
    padding: 3,
    marginRight: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  appIcon: {
    width: width * 0.6,
    height: height * 0.3,
  },
});
