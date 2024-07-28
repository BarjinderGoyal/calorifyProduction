import React, { useCallback, useEffect, useState } from "react";
import { View, Text } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import ScreenNavigation from "./ScreensNavigation";
import MealsContext, { useMealsContext } from "../Context/MealsContext";
import { userAuthUseContext } from "../Context/UserAuthContext";
import BottomSheetProvider from "../Context/BottomSheetContext";

const Screens = () => {
  const { fetchMeals, calculateWeeklyCalorie, fetchExercises, getMySavedFood } =
    useMealsContext();
  const {
    userUid,
    userLoggedWeight,
    fetchUserLoggedWeight,
    calculateDailyMacroIntake,
  } = userAuthUseContext();
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    if (userUid) {
      try {
        await Promise.all([
          // calculateWeeklyCalorie(userUid),
          fetchMeals(userUid),
          fetchUserLoggedWeight(userUid),
          calculateDailyMacroIntake(),
          fetchExercises(userUid),
          getMySavedFood(userUid),
        ]);
      } catch (error) {
        console.error("Error fetching data: ", error);
        // Handle error appropriately, e.g., show a toast or alert
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    fetchData();
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
    <BottomSheetProvider>
      <ScreenNavigation />
    </BottomSheetProvider>
  );
};

export default Screens;
