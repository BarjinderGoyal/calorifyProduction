import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "react-native-vector-icons";
import { useMealsContext } from "../../Context/MealsContext";

const NutritionUpdateScreen = ({ navigation, route }) => {
  const { data, index } = route.params;
  const { mealInfo, updateMealInfo } = useMealsContext();
  const [values, setValues] = useState({
    calories: data?.calories,
    fat: data?.fat,
    protein: data?.protein,
    carbs: data?.carbs,
    quantity: data?.quantity[0],
  });

  const handleUpdate = useCallback(() => {
    const calories =
      Number(mealInfo?.calories) -
      Number(mealInfo?.ingredients[index]?.calories) +
      Number(values.calories);
    const protein =
      Number(mealInfo?.protein) -
      Number(mealInfo?.ingredients[index]?.protein) +
      Number(values.protein);
    const fat =
      Number(mealInfo?.fat) -
      Number(mealInfo?.ingredients[index]?.fat) +
      Number(values.fat);
    const carbs =
      Number(mealInfo?.carbs) -
      Number(mealInfo?.ingredients[index]?.carbs) +
      Number(values.carbs);
    const itemQuanity =
      Number(mealInfo?.quantity[0]) -
      Number(mealInfo?.ingredients[index]?.quantity[0]) +
      Number(values.quantity);

    const updatedIngredients = mealInfo?.ingredients?.map((item, i) => {
      if (i !== index) {
        return item;
      } else {
        return {
          ...item,
          calories: values.calories,
          fat: values.fat,
          protein: values.protein,
          carbs: values.carbs,
          quantity: [
            Number(values.quantity) !== 0 ? Number(values.quantity) : Number(1),
            item?.quantity[1],
          ],
        };
      }
    });

    updateMealInfo({
      ...mealInfo,
      calories,
      protein,
      fat,
      carbs,
      quantity: [itemQuanity, mealInfo?.quantity[1]],
      ingredients: updatedIngredients,
    });
    navigation.goBack();
  }, [navigation, values]);

  const checkNumberIsInteger = (number) => {
    return Number.isInteger(number) ? number : number.toFixed(2);
  };

  const handleQuantity = useCallback(
    (text) => {
      if (text.length > 4) return;
      const factor = Number(text) !== 0 ? Number(text) : 1;
      const calories = checkNumberIsInteger(
        (Number(values.calories) / Number(values.quantity)) * factor
      );
      const fat = checkNumberIsInteger(
        (Number(values.fat) / Number(values.quantity)) * factor
      );
      const protein = checkNumberIsInteger(
        (Number(values.protein) / Number(values.quantity)) * factor
      );
      const carbs = checkNumberIsInteger(
        (Number(values.carbs) / Number(values.quantity)) * factor
      );
      const itemQuantity = Number(text) !== 0 ? Number(text) : 1;

      setValues({ calories, fat, carbs, protein, quantity: itemQuantity });
    },
    [values]
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

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Ionicons
              name="chevron-back"
              size={40}
              color="grey"
              onPress={() => navigation.goBack()}
            />
            {/* <Text style={styles.headerTitle}>Burger</Text> */}
            {/* <MaterialCommunityIcons name="delete" size={40} color="grey" /> */}
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Calories</Text>
            <TextInput
              style={styles.input}
              value={String(values.calories)}
              onChangeText={(text) =>
                setValues({ ...values, calories: Number(text) })
              }
              keyboardType="numeric"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Protein</Text>
            <TextInput
              style={styles.input}
              value={String(values.protein)}
              onChangeText={(text) =>
                setValues({ ...values, protein: Number(text) })
              }
              keyboardType="numeric"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Fats</Text>
            <TextInput
              style={styles.input}
              value={String(values.fat)}
              onChangeText={(text) =>
                setValues({ ...values, fat: Number(text) })
              }
              keyboardType="numeric"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Carbs</Text>
            <TextInput
              style={styles.input}
              value={String(values.carbs)}
              onChangeText={(text) =>
                setValues({ ...values, carbs: Number(text) })
              }
              keyboardType="numeric"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Serving</Text>
            <TextInput
              style={styles.input}
              value={values.quantity}
              onChangeText={(text) => handleQuantity(text)}
              keyboardType="numeric"
            />
          </View>
          <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
            <Text style={styles.updateButtonText}>Update</Text>
          </TouchableOpacity>
        </ScrollView>
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
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
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
  updateButton: {
    marginTop: "auto",
    backgroundColor: "#d05b19",
    padding: 15,
    borderRadius: 20,
    alignItems: "center",
  },
  updateButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
});

export default NutritionUpdateScreen;
