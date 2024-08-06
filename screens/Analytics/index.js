import { StyleSheet } from "react-native";
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import AnalyticsScreen from "./AnalyticsScreen";
import WeightLogScreen from "./WeightLogScreen";

const Stack = createStackNavigator();

export default function Analytics() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AnalyticsMainScreen" component={AnalyticsScreen} />
      <Stack.Screen name="WeightLogScreen" component={WeightLogScreen} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({});
