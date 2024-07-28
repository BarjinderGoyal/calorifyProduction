import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import AccountScreen from "./AccountScreen";
import UpdateInfoScreen from "./UpdateInfoScreen";

const Stack = createStackNavigator();

const Account = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="accountScreen" component={AccountScreen} />
      <Stack.Screen name="accountUpdateScreen" component={UpdateInfoScreen} />
    </Stack.Navigator>
  );
};

export default Account;

const styles = StyleSheet.create({});
