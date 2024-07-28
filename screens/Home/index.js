import { createStackNavigator } from "@react-navigation/stack";
import React from "react";

import HomeScreen from "./HomeScreen";

import CameraScreen from "../Camera";
// import Search from "../Search";
import PreviewNutritionScreen from "./PreviewNutritionScreen";

import NutiritionUpdateScreen from "./NutiritionUpdateScreen";
import BottomSheetProvider from "../../Context/BottomSheetContext";
import SearchScreen from "./SearchScreen";
import UpdateNutritionScreen from "./UpdateNutritionScreen";
import PreviousDateReportScreen from "./PreviousDateReportScreen";
import ExercisePreviewScreen from "./ExercisePreviewScreen";
import SavedMealPreviewScreen from "./SavedMealPreviewScreen";
import SavedFoodScreen from "./SavedFoodScreen";

const Stack = createStackNavigator();

const Home = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="homeScreen" component={HomeScreen} />
      <Stack.Screen name="cameraScreen" component={CameraScreen} />

      <Stack.Screen
        name="previewNutrientScreen"
        component={PreviewNutritionScreen}
      />

      <Stack.Screen
        name="NutritionUpdateScreen"
        component={NutiritionUpdateScreen}
      />
      <Stack.Screen
        name="updateNutritionScreen"
        component={UpdateNutritionScreen}
      />
      <Stack.Screen name="searchScreen" component={SearchScreen} />
      <Stack.Screen
        name="previousDateReportScreen"
        component={PreviousDateReportScreen}
      />
      <Stack.Screen
        name="exercisePreviewScreen"
        component={ExercisePreviewScreen}
      />
      <Stack.Screen
        name="savedMealPreviewScreen"
        component={SavedMealPreviewScreen}
      />
      <Stack.Screen name="savedFoodScreen" component={SavedFoodScreen} />
    </Stack.Navigator>
  );
};

export default Home;
