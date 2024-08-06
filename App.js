import { useEffect } from "react";
import { StyleSheet, Text, View, Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AppNavigationContainer from "./Navigation";
import UserAuthContext from "./Context/UserAuthContext";
import MealsContext from "./Context/MealsContext";

import Superwall from "@superwall/react-native-superwall";
import { SUPERWALL_ANDROID_API_KEY, SUPERWALL_IOS_API_KEY } from "@env";

export default function App() {
  useEffect(() => {
    const apiKey =
      Platform.OS === "ios"
        ? `${SUPERWALL_IOS_API_KEY}`
        : `${SUPERWALL_ANDROID_API_KEY}`;
    Superwall.configure(apiKey);
  }, []);

  return (
    <UserAuthContext>
      <MealsContext>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <View style={styles.container}>
            <AppNavigationContainer />
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
