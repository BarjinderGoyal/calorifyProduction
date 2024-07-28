import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  View,
} from "react-native";
import Toast from "react-native-simple-toast";
import React, { useCallback, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "react-native-vector-icons";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { fetchExerciseData } from "../../functions/OpenAiFunctions";
import { ActivityIndicator } from "react-native-paper";
import { userAuthUseContext } from "../../Context/UserAuthContext";
import { useMealsContext } from "../../Context/MealsContext";

const SearchScreen = ({ route }) => {
  const { previousScreen } = route.params;
  const { userUid } = userAuthUseContext();
  const {
    mealInfo,
    exerciseInfo,
    fetchNutritionsFromFoodDetail,
    fetchExerciseFromDetail,
  } = useMealsContext();
  const [searchedQuery, setSearchedQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const [layout, setLayout] = useState({
    search: {
      heading: "AI Calorie Analysis",
      subHeading: "please describe the food item and its quantity",
      placeholder:
        "Examples: 250 ml milk, 2 whole beat breads, 1 egg, 1 slice of pizza, 1 burger",
    },
    exercise: {
      heading: "AI Exercise Calorie Burn Analysis",
      subHeading:
        "Describe the type of exercise and the duration of the exercise",
      placeholder:
        "Examples: swimming 30 min, running 30 min, cycling 20 min, bench press 10min",
    },
  });
  const navigation = useNavigation();
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

  useEffect(() => {
    if (!userUid) {
      navigation.navigate("signupScreen");
    }
  }, [userUid]);

  const fetchDataFromDetail = useCallback(async () => {
    try {
      setLoading(true);
      if (previousScreen === "search") {
        if (!userUid) {
          return;
        }
        await fetchNutritionsFromFoodDetail(searchedQuery);
        console.log(mealInfo);
        if (mealInfo) {
          navigation.navigate("previewNutrientScreen", {
            foodUri: "",
            foodData: mealInfo,
          });
        }
      } else {
        if (!userUid) {
          return;
        }
        await fetchExerciseFromDetail(searchedQuery);
        if (exerciseInfo) {
          navigation.navigate("exercisePreviewScreen");
        }
      }
    } catch (e) {
      if (Platform.OS === "android") {
        Toast.show("Something went wrong", Toast.LONG);
        console.log(
          "ERROR WHILE FETCHING RESULT FROM OPENAI FROM TEXT TO NUTRITIONS  => ",
          e
        );
      }
    } finally {
      setSearchedQuery("");
      setLoading(false);
    }
  }, [userUid, searchedQuery]);

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
        <View style={styles.header}>
          <Ionicons
            name="chevron-back"
            size={30}
            color="black"
            onPress={() => navigation.goBack()}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.heading}>
            {layout[`${previousScreen}`].heading}
          </Text>
          <Text style={styles.subHeading}>
            {layout[`${previousScreen}`].subHeading}
          </Text>
          <TextInput
            value={searchedQuery}
            onChangeText={(text) => setSearchedQuery(text)}
            placeholder={layout[`${previousScreen}`].placeholder}
            placeholderTextColor={"lightgrey"}
            style={styles.input}
            multiline
          />
          <TouchableOpacity
            style={styles.submitButtonContainer}
            onPress={fetchDataFromDetail}
          >
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default SearchScreen;

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
  heading: {
    fontSize: 18,
    fontWeight: "500",
    color: "black",
    textAlign: "center",
  },
  subHeading: {
    fontSize: 16,
    color: "black",
    textAlign: "center",
  },
  input: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: "white",
    fontSize: 14,
    color: "black",
  },
  submitButtonContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#d05b19",
    borderRadius: 20,
    width: "80%",
    marginTop: 15,
  },
  submitButtonText: {
    fontSize: 18,
    color: "black",
    fontWeight: "600",
  },
  inputContainer: {
    gap: 15,
    alignItems: "center",
    marginTop: 15,
  },
});
