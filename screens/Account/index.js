import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import AccountScreen from "./AccountScreen";

const Stack = createStackNavigator();

const Account = () => {
  return <AccountScreen />;
};

export default Account;

const styles = StyleSheet.create({});
