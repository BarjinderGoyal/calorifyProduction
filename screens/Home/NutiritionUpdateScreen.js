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
  Modal,
  Dimensions,
  Pressable,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Ionicons,
  Entypo,
  MaterialCommunityIcons,
} from "react-native-vector-icons";
import { useMealsContext } from "../../Context/MealsContext";

const { width, height } = Dimensions.get("window");

const NutritionUpdateScreen = ({ navigation, route }) => {
  const { data, index } = route.params;
  const { mealInfo, updateMealInfo, updateMealAfterIngredientDeletion } =
    useMealsContext();
  const [values, setValues] = useState({
    servings: data?.quantity[0],
    calories: data?.calories,
    protein: data?.protein,
    fat: data?.fat,
    carbs: data?.carbs,
  });
  const [localIngredients, setLocalIngredients] = useState(
    data?.ingredients || []
  );
  const [loading, setLoading] = useState(false);
  const isIngredientDeletedRef = useRef(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [currentTitle, setCurrentTitle] = useState("");
  const [currentValue, setCurrentValue] = useState("");

  useEffect(() => {
    setLocalIngredients(mealInfo?.items[index]?.ingredients);
  }, [mealInfo]);

  const handleUpdate = useCallback(async () => {
    if (
      Number(mealInfo?.items[index]?.quantity[0]) !== Number(values.servings) &&
      !isIngredientDeletedRef.current
    ) {
      updateMealNutrition();
    } else if (
      isIngredientDeletedRef.current &&
      Number(mealInfo?.items[index]?.quantity[0]) === Number(values.servings)
    ) {
      const updatedFoodItem = { ...data, ingredients: localIngredients };
      setLoading(true);
      await updateMealAfterIngredientDeletion(updatedFoodItem, data, index);
      setLoading(false);
    } else if (
      isIngredientDeletedRef.current &&
      Number(mealInfo?.items[index]?.quantity[0]) !== Number(values.servings)
    ) {
      const updatedFoodItem = { ...data, ingredients: localIngredients };
      setLoading(true);
      await updateMealAfterIngredientDeletion(
        updatedFoodItem,
        data,
        index,
        values.servings
      );
      setLoading(false);
    } else if (
      Number(mealInfo?.items[index]?.calories) !== Number(values.calories) ||
      Number(mealInfo?.items[index]?.fat) !== Number(values.fat) ||
      Number(mealInfo?.items[index]?.carbs) !== Number(values.carbs) ||
      Number(mealInfo?.items[index]?.protein) !== Number(values.protein)
    ) {
      updateMealNutrition();
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
      (Number(values.calories) / Number(mealInfo?.items[index]?.quantity[0])) *
      Number(values.servings);
    const updatedProtein =
      (Number(values.protein) / Number(mealInfo?.items[index].quantity[0])) *
      Number(values.servings);
    const updatedFat =
      (Number(values.fat) / Number(mealInfo?.items[index].quantity[0])) *
      Number(values.servings);
    const updatedCarbs =
      (Number(values.carbs) / Number(mealInfo?.items[index].quantity[0])) *
      Number(values.servings);

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
              quantity: [values.servings, ...item.quantity.slice(1)],
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

  const updateValue = (title, value) => {
    setCurrentTitle(title);
    setCurrentValue(value);
    setModalVisible(true);
  };

  const saveValue = () => {
    // Handle saving logic here
    switch (currentTitle) {
      case "Calories": {
        setValues({ ...values, calories: currentValue });
        break;
      }

      case "Fat": {
        setValues({ ...values, fat: currentValue });
        break;
      }

      case "Carbs": {
        setValues({ ...values, carbs: currentValue });
        break;
      }

      case "Protein": {
        setValues({ ...values, protein: currentValue });
        break;
      }

      case "Servings": {
        setValues({ ...values, servings: currentValue });
        break;
      }
    }
    setCurrentTitle("");
    setCurrentValue("");
    setModalVisible(false);
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
        {/* <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Serving</Text>
          <TextInput
            style={styles.input}
            value={values}
            onChangeText={(text) => setValues(text)}
            keyboardType="numeric"
          />
        </View> */}
        <View style={styles.nutritionalContainer}>
          <View style={styles.row}>
            <View style={styles.infoCard}>
              <Text style={styles.label}>Calories</Text>
              <View style={styles.valueContainer}>
                <Text style={styles.value}>{values.calories}</Text>
                <MaterialCommunityIcons
                  name="pencil"
                  size={16}
                  color="gray"
                  onPress={() => updateValue("Calories", values.calories)}
                />
              </View>
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.label}>Carbs</Text>
              <View style={styles.valueContainer}>
                <Text style={styles.value}>{values.carbs}g</Text>
                <MaterialCommunityIcons
                  name="pencil"
                  size={16}
                  color="gray"
                  onPress={() => updateValue("Carbs", values.carbs)}
                />
              </View>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.infoCard}>
              <Text style={styles.label}>Protein</Text>
              <View style={styles.valueContainer}>
                <Text style={styles.value}>{values.protein}g</Text>
                <MaterialCommunityIcons
                  name="pencil"
                  size={16}
                  color="gray"
                  onPress={() => updateValue("Protein", values.protein)}
                />
              </View>
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.label}>Fat</Text>
              <View style={styles.valueContainer}>
                <Text style={styles.value}>{values.fat}g</Text>
                <MaterialCommunityIcons
                  name="pencil"
                  size={16}
                  color="gray"
                  onPress={() => updateValue("Fat", values.fat)}
                />
              </View>
            </View>
          </View>

          <View style={styles.servingContainer}>
            <View style={styles.servingCard}>
              <Text style={styles.label}>Serving</Text>
              <View style={styles.valueContainer}>
                <Text style={styles.value}>{values.servings} </Text>
                <MaterialCommunityIcons
                  name="pencil"
                  size={16}
                  color="gray"
                  onPress={() => updateValue("Servings", values.servings)}
                />
              </View>
            </View>
          </View>
        </View>
        <View style={styles.ingredientsContainer}>
          {/* {localIngredients.length > 0 && (
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
                showsVerticalScrollIndicator={false}
              />
            </>
          )} */}
          <View style={styles.ingredientsContainer}>
            {localIngredients.length > 0 && (
              <>
                <Text style={styles.ingredientHeading}>Ingredients</Text>
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  style={styles.ingredientWrapper}
                >
                  {localIngredients.map((item, index) => (
                    <View
                      key={`${item}-${index}`}
                      style={styles.ingredientContainer}
                    >
                      <Text style={styles.ingredient}>{item}</Text>
                      <Entypo
                        name="cross"
                        size={25}
                        color="grey"
                        onPress={() => handleIngredientDeletion(index)}
                      />
                    </View>
                  ))}
                </ScrollView>
              </>
            )}
          </View>
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
      {isModalVisible && (
        <Modal
          isVisible={isModalVisible}
          transparent={true}
          onBackdropPress={() => setModalVisible(false)}
        >
          <Pressable
            onPress={() => setModalVisible(false)}
            style={styles.modalContainer}
          >
            <View style={styles.modelContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{currentTitle}</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <MaterialCommunityIcons
                    name="close"
                    size={24}
                    color="black"
                  />
                </TouchableOpacity>
              </View>
              <TextInput
                style={styles.input}
                placeholder={currentValue}
                placeholderTextColor={"black"}
                value={currentValue}
                onChangeText={(text) => setCurrentValue(text)}
              />
              <TouchableOpacity style={styles.saveButton} onPress={saveValue}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Modal>
      )}
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
  ingredientWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10, // gap between rows
  },
  ingredientContainer: {
    padding: 10,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderWidth: 2,
    borderColor: "#FAEDCE",
    backgroundColor: "white",
    marginBottom: 10,
    marginRight: 10, // margin to space between items
  },
  ingredient: {
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
  nutritionalContainer: {
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  infoCard: {
    width: "48%", // Two cards per row
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  valueContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  value: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
  servingContainer: {
    alignItems: "center",
  },
  servingCard: {
    width: "50%", // Centered card with some width
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  modalContainer: {
    // backgroundColor: "rgba(0,0,0,0.4)",
    // padding: 16,
    // borderRadius: 8,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modelContent: {
    width: width - 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 25,
    fontWeight: "bold",
    // marginLeft: 16,
    color: "black",
  },
  input: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderColor: "black",
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 16,
    fontSize: 18,
    color: "black",
  },
  saveButton: {
    backgroundColor: "transparent",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "black",
    marginHorizontal: "10%",
  },
  saveButtonText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 18,
  },
});

export default NutritionUpdateScreen;
