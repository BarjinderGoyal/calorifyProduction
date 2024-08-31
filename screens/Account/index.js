import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import AccountScreen from "./AccountScreen";
import WeightUpdateScreen from "./WeightUpdateScreen";
import HeightUpdateScreen from "./HeightUpdateScreen";
import CaloriesUpdateScreen from "./CaloriesUpdateScreen";
import MacroPercentageUpdateScreen from "./MacroPercentageUpdateScreen";
import AgeUpdateScreen from "./AgeUpdateScreen";

const Stack = createStackNavigator();

const Account = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="accountScreen" component={AccountScreen} />
      <Stack.Screen name="weightUpdateScreen" component={WeightUpdateScreen} />
      <Stack.Screen name="ageUpdateScreen" component={AgeUpdateScreen} />
      <Stack.Screen name="heightUpdateScreen" component={HeightUpdateScreen} />
      <Stack.Screen
        name="caloriesUpdateScreen"
        component={CaloriesUpdateScreen}
      />
      <Stack.Screen
        name="macroUpdateScreen"
        component={MacroPercentageUpdateScreen}
      />
    </Stack.Navigator>
  );
};

export default Account;

const styles = StyleSheet.create({});
