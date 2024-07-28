import { ImageBackground, StyleSheet, Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const FoodItemDetailScreen = () => {
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.innerContainer}>
        <ImageBackground source={{}} style={styles.topCard}></ImageBackground>
      </SafeAreaView>
    </View>
  );
};

export default FoodItemDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F5F2", //"#f7f8f9",
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
});
