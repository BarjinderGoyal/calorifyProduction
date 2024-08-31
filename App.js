import { useEffect, useState } from "react";
import { StyleSheet, Text, View, Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AppNavigationContainer from "./Navigation";
import UserAuthContext from "./Context/UserAuthContext";
import MealsContext from "./Context/MealsContext";
import HeightScreen from "./onBoarding/HeightScreen";
import WeightScreen from "./onBoarding/WeightScreen";
import WheelPicker from "./components/Picker/WheelPickerComponent";
// import { RCPurchaseController } from "./utils/SuperWall";

import Superwall from "@superwall/react-native-superwall";
import { SUPERWALL_ANDROID_API_KEY, SUPERWALL_IOS_API_KEY } from "@env";

import AgeScreen from "./onBoarding/AgeScreen";
import SetWeightGoalScreen from "./onBoarding/SetWeightGoalScreen";

const data = [...Array(100).keys()].map((index) => ({
  value: index,
  label: index.toString(),
}));

export default function App() {
  useEffect(() => {
    // const MyPurchaseController = new RCPurchaseController();
    const apiKey =
      Platform.OS === "ios"
        ? `${SUPERWALL_IOS_API_KEY}`
        : `${SUPERWALL_ANDROID_API_KEY}`;
    Superwall.configure(apiKey);
  }, []);

  const items = [...new Array(400)].map((_, index) => index);
  return (
    <UserAuthContext>
      <MealsContext>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <View style={styles.container}>
            <AppNavigationContainer />
            {/* <WheelPicker
              items={items}
              onIndexChange={(item) => console.log(item)}
              defaultValue={250}
            /> */}
            {/* <HeightScreen /> */}
            {/* <WeightScreen /> */}
            {/* <SetWeightGoalScreen /> */}
            {/* <AgeScreen /> */}
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
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 20,
    // justifyContent: "center",
  },
});
