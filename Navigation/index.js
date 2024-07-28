import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import OnBoardingScreen from "../onBoarding";
import Screens from "../screens";

const Stack = createStackNavigator();

const AppNavigationContainer = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="onBoardingScreen" component={OnBoardingScreen} />
        <Stack.Screen name="mainScreen" component={Screens} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigationContainer;

const styles = StyleSheet.create({});
