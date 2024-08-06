import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, Entypo } from "react-native-vector-icons";
import { useMealsContext } from "../../Context/MealsContext";

const NutritionUpdateScreen = ({ navigation, route }) => {
  const { data, index } = route.params;
  const { mealInfo, updateMealInfo, updateMealAfterIngredientDeletion } =
    useMealsContext();
  const [values, setValues] = useState(data?.quantity[0]);
  const [localIngredients, setLocalIngredients] = useState(
    data?.ingredients || []
  );
  const [loading, setLoading] = useState(false);
  const isIngredientDeletedRef = useRef(false);

  useEffect(() => {
    setLocalIngredients(mealInfo?.items[index]?.ingredients);
  }, [mealInfo]);

  const handleUpdate = useCallback(async () => {
    if (
      Number(mealInfo?.items[index]?.quantity[0]) !== Number(values) &&
      !isIngredientDeletedRef.current
    ) {
      updateMealNutrition();
    } else if (
      isIngredientDeletedRef.current &&
      Number(mealInfo?.items[index]?.quantity[0]) === Number(values)
    ) {
      const updatedFoodItem = { ...data, ingredients: localIngredients };
      setLoading(true);
      await updateMealAfterIngredientDeletion(updatedFoodItem, index);
      setLoading(false);
    } else {
      const updatedFoodItem = { ...data, ingredients: localIngredients };
      setLoading(true);
      await updateMealAfterIngredientDeletion(updatedFoodItem, index, values);
      setLoading(false);
    }

    navigation.goBack();
  }, [
    mealInfo,
    navigation,
    values,
    index,
    updateMealInfo,
    localIngredients,
    isIngredientDeletedRef.current,
  ]);

  const updateMealNutrition = () => {
    const updatedCalorie =
      (Number(mealInfo?.items[index]?.calories) /
        Number(mealInfo?.items[index]?.quantity[0])) *
      Number(values);
    const updatedProtein =
      (Number(mealInfo?.items[index]?.protein) /
        Number(mealInfo?.items[index].quantity[0])) *
      Number(values);
    const updatedFat =
      (Number(mealInfo?.items[index]?.fat) /
        Number(mealInfo?.items[index].quantity[0])) *
      Number(values);
    const updatedCarbs =
      (Number(mealInfo?.items[index]?.carbs) /
        Number(mealInfo?.items[index].quantity[0])) *
      Number(values);

    // Spread mealInfo to create a new object
    let updatedMealInfo = {
      ...mealInfo,
      calories:
        mealInfo.calories - mealInfo?.items[index]?.calories + updatedCalorie,
      protein:
        mealInfo.protein - mealInfo?.items[index]?.protein + updatedProtein,
      fat: mealInfo.fat - mealInfo?.items[index]?.fat + updatedFat,
      carbs: mealInfo.carbs - mealInfo?.items[index]?.carbs + updatedCarbs,
      items: mealInfo.items.map((item, i) =>
        i === index
          ? {
              ...item,
              calories: updatedCalorie,
              protein: updatedProtein,
              fat: updatedFat,
              carbs: updatedCarbs,
              quantity: [values, ...item.quantity.slice(1)],
            }
          : item
      ),
    };

    updateMealInfo(updatedMealInfo);
  };

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

  const handleAddNutrition = useCallback(() => {
    navigation.navigate("updateNutritionScreen", { foodItem: data, index });
  }, [data, index, navigation]);

  const handleIngredientDeletion = (index) => {
    if (!isIngredientDeletedRef.current) {
      isIngredientDeletedRef.current = true;
    }
    const updatedIngredients = localIngredients.filter((item, i) => {
      if (i !== index) {
        return item;
      }
    });

    setLocalIngredients(updatedIngredients);
  };

  if (loading) {
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
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <Ionicons
            name="chevron-back"
            size={40}
            color="grey"
            onPress={() => navigation.goBack()}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Serving</Text>
          <TextInput
            style={styles.input}
            value={values}
            onChangeText={(text) => setValues(text)}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.ingredientsContainer}>
          {localIngredients.length > 0 && (
            <>
              <Text style={styles.ingredientHeading}>Ingredients</Text>
              <FlatList
                data={localIngredients}
                renderItem={({ item, index }) => (
                  <View style={styles.ingredientContainer}>
                    <Text style={styles.ingredient}>{item}</Text>
                    <Entypo
                      name="cross"
                      size={25}
                      color="grey"
                      onPress={() => handleIngredientDeletion(index)}
                    />
                  </View>
                )}
                keyExtractor={(item, i) => `${item}-${i}`}
                contentContainerStyle={{ gap: 10 }}
              />
            </>
          )}
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.fixedButton}
            onPress={handleAddNutrition}
          >
            <Text style={styles.buttonText}>Add ingredient</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.fixedButton} onPress={handleUpdate}>
            <Text style={styles.buttonText}>Update</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F5F2",
    padding: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "lightgrey",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    backgroundColor: "white",
  },
  ingredientsContainer: {
    marginVertical: 15,
    flex: 1,
  },
  ingredientHeading: {
    fontSize: 20,
    fontWeight: "500",
    color: "black",
    marginBottom: 15,
  },
  ingredientContainer: {
    padding: 10,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderWidth: 2,
    borderColor: "#FAEDCE",
    backgroundColor: "white",
  },
  ingredient: {
    flex: 1,
    fontSize: 16,
    fontWeight: "normal",
    color: "black",
  },
  buttonContainer: {
    marginTop: "auto",
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  fixedButton: {
    flex: 0.5,
    padding: 15,
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    width: "45%",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
  },
});

export default NutritionUpdateScreen;
