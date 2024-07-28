import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { ScrollView, StyleSheet, Text, View, Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AppNavigationContainer from "./Navigation";
import UserAuthContext from "./Context/UserAuthContext";
import MealsContext from "./Context/MealsContext";
import OnBoardingScreen from "./onBoarding";
import Screens from "./screens";
import SignupScreen from "./onBoarding/SignupScreen";
import Superwall from "@superwall/react-native-superwall";
import AppIcon from "./AppIcon";
import BarGraph from "./components/Analytics/BarGraph";

// android client id =14057899659-p5rrbf2sqau7v8piqh9uh6llk6n4074l.apps.googleusercontent.com

export default function App() {
  useEffect(() => {
    const apiKey =
      Platform.OS === "ios"
        ? "pk_8417a31f8a89a78691154b527c68bf8579e4e70e8d34f669"
        : "pk_b5548093e7d8b8413fd5ff0c4c91705628d89aa8368efc7b";
    Superwall.configure(apiKey);
  }, []);

  return (
    <UserAuthContext>
      <MealsContext>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <View style={styles.container}>
            <AppNavigationContainer />
            {/* <AppIcon /> */}
            {/* <Screens /> */}
            {/* <StatusBar style="auto" /> */}
          </View>
        </GestureHandlerRootView>
      </MealsContext>
    </UserAuthContext>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f8f9",
    // justifyContent: "center",
  },
});
