import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native";
import React, { useState, useCallback, useEffect } from "react";
import Toast from "react-native-simple-toast";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "react-native-vector-icons";
import { useNavigation } from "@react-navigation/native";
import { userAuthUseContext } from "../../Context/UserAuthContext";

const { width } = Dimensions.get("window");

const CaloriesUpdateScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const { userDetail, updateCalories } = userAuthUseContext();
  const [calories, setCalories] = useState(
    userDetail?.dailyCalorieValue?.toFixed(0)
  );

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      navigation.getParent()?.setOptions({ tabBarStyle: { display: "none" } });
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("blur", () => {
      navigation.getParent()?.setOptions({ tabBarStyle: { display: "flex" } });
    });
    return unsubscribe;
  }, [navigation]);

  const handleNext = async () => {
    const isNumeric = /^[0-9]+$/.test(calories);
    // if (age !== null && isNumeric) {
    //   setUserInfo("age", age);
    //   navigation.navigate("heightScreen");
    // } else {
    //   Toast.show("Age is Invalid", Toast.SHORT);
    // }
    setLoading(true);
    await updateCalories(calories);
    setLoading(false);
    navigation.goBack();
  };

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
    <View style={styles.container}>
      <SafeAreaView style={styles.innerContainer}>
        <Ionicons
          name="chevron-back"
          color="black"
          size={30}
          onPress={() => navigation.goBack()}
        />

        <View style={styles.header}>
          <Text style={styles.headerHeading}>
            What's your daily calorie goal?
          </Text>
        </View>
        <TextInput
          value={calories}
          onChangeText={(text) => setCalories(text)}
          keyboardType="numeric"
          style={styles.caloriesInput}
        />
        <TouchableOpacity
          style={styles.nextButtonContainer}
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>update</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
};

export default CaloriesUpdateScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F5F2",
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  header: {
    marginTop: width * 0.2,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
  },
  headerHeading: {
    fontSize: 25,
    fontWeight: "600",
    color: "black",
    textAlign: "center",
  },

  nextButtonContainer: {
    padding: 15,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginTop: "auto",
    marginBottom: 20,
    backgroundColor: "#d05b19",
  },
  nextButtonText: {
    fontSize: 22,
    fontWeight: "600",
    color: "white",
  },
  caloriesInput: {
    padding: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "black",
    // marginTop: 10,
    fontSize: 18,
    fontWeight: "600",
    color: "black",
    width: "100%",
  },
});
