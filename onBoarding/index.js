import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import SignupScreen from "./SignupScreen";
import GoalScreen from "./GoalScreen";
import GenderScreen from "./GenderScreen";
import AgeScreen from "./AgeScreen";
import HeightScreen from "./HeightScreen";
import WeightScreen from "./WeightScreen";
import SetWeightGoalScreen from "./SetWeightGoalScreen";
import { NavigationContainer } from "@react-navigation/native";
import { OnBoardingProvider } from "../Context/OnBoardingContext";

import ActivityLevelScreen from "./ActivityLevelScreen";
import NameScreen from "./NameScreen";
import SplashScreen from "./SplashScreen";

const Stack = createStackNavigator();

const OnBoardingScreen = () => {
  return (
    <OnBoardingProvider>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="splashScreen" component={SplashScreen} />
        <Stack.Screen name="signupScreen" component={SignupScreen} />
        <Stack.Screen name="goalScreen" component={GoalScreen} />
        <Stack.Screen
          name="activityLevelScreen"
          component={ActivityLevelScreen}
        />
        <Stack.Screen name="genderScreen" component={GenderScreen} />

        <Stack.Screen name="ageScreen" component={AgeScreen} />
        <Stack.Screen name="heightScreen" component={HeightScreen} />
        <Stack.Screen name="weightScreen" component={WeightScreen} />
        <Stack.Screen
          name="setWeightGoalScreen"
          component={SetWeightGoalScreen}
        />
        <Stack.Screen name="nameScreen" component={NameScreen} />
      </Stack.Navigator>
    </OnBoardingProvider>
  );
};

export default OnBoardingScreen;

const styles = StyleSheet.create({});
