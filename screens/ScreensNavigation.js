import { StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { Ionicons, AntDesign, Entypo } from "react-native-vector-icons";
import Home from "./Home";
import Analytics from "./Analytics";
import Account from "./Account";

const Tab = createBottomTabNavigator();

const ScreenNavigation = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        headerShown: false,
        tabBarActiveTintColor: "#ee7214", //#C0D6E8
        tabBarInactiveTintColor: "lightgrey",
        tabBarStyle: "flex",
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
