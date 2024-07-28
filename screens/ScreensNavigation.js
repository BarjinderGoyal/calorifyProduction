import { StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { Ionicons, AntDesign, Entypo } from "react-native-vector-icons";
import Home from "./Home";
import Analytics from "./Analytics";
import Account from "./Account";
import { bottomSheetUseContext } from "../Context/BottomSheetContext";

const Tab = createBottomTabNavigator();

const ScreenNavigation = () => {
  const { bottomSheetIsOpen } = bottomSheetUseContext();
  const [isTabBarVisible, setIsTabBarVisible] = useState(true);

  useEffect(() => {
    console.log(
      "value of bottomSheetIsOpen in bottom tab navigator container",
      bottomSheetIsOpen
    );
    setIsTabBarVisible(!bottomSheetIsOpen);
  }, [bottomSheetIsOpen]);

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        headerShown: false,
        tabBarActiveTintColor: "#ee7214", //#C0D6E8
        tabBarInactiveTintColor: "lightgrey",
        tabBarStyle: { display: isTabBarVisible ? "flex" : "none" },
      }}
    >
      <Tab.Screen
        name="home"
        component={Home}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Entypo name="home" color={color} size={30} />
          ),
        }}
      />
      <Tab.Screen
        name="analytics"
        component={Analytics}
        options={{
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="barschart" color={color} size={30} />
          ),
        }}
      />
      <Tab.Screen
        name="account"
        component={Account}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" color={color} size={30} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default ScreenNavigation;

const styles = StyleSheet.create({});
