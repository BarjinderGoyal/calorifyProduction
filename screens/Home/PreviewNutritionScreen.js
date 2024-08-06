import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  Platform,
  Modal,
} from "react-native";
import React, {
  useMemo,
  useRef,
  useState,
  useEffect,
  useCallback,
} from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import {
  Ionicons,
  MaterialCommunityIcons,
  Octicons,
  Entypo,
} from "react-native-vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useMealsContext } from "../../Context/MealsContext";
import { userAuthUseContext } from "../../Context/UserAuthContext";
import { ActivityIndicator } from "react-native-paper";

const { width, height } = Dimensions.get("window");
const foodItemNameMaxWidth = (width - 20) * 0.9;

const placeholderImage = require("../../assets/placeholder.png");

const RenderFoodIngredient = React.memo(
  ({ item, index, handleDeleteIngredient }) => {
    const navigation = useNavigation();
    return (
      <View style={styles.foodItemIngredientContainer}>
        <View style={styles.foodItemIngredientInnerContainer}>
          <Text
            style={styles.ingredientName}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item?.name || "Meal"}
          </Text>
          <Text style={styles.ingredientCalorie}>
            {Number(item?.calories)?.toFixed(2) || 0} kcal
          </Text>
          <Text style={styles.foodItemMicroNutrient}>
            <Text style={{ color: "#d96e6b" }}>P </Text>
            {Number(item?.protein)?.toFixed(2) || 0}g .
            <Text style={{ color: "#e09c63" }}> F </Text>
            {Number(item?.fat)?.toFixed(2) || 0}g .
            <Text style={{ color: "#8aa9ce" }}> C </Text>
            {Number(item?.carbs)?.toFixed(2) || 0}g
          </Text>
        </View>
        <View style={styles.foodItemIngredientRightContainer}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
            <Text
              style={styles.quantityText}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {item?.quantity[0]}
            </Text>
            <Text
              style={styles.quantityUnit}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {item?.quantity[1]}
            </Text>
          </View>
          <View style={styles.foodItemIngredientIconContainer}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("NutritionUpdateScreen", {
                  data: item,
                  index: index,
                })
              }
            >
              <Octicons name="pencil" size={24} color="grey" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDeleteIngredient(index)}>
              <MaterialCommunityIcons name="delete" size={24} color="grey" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
);

const PreviewNutritionScreen = ({ route }) => {
  const navigation = useNavigation();
  const { mealInfo, updateMealInfo, LogMeal, resetMealInfo, foodImage } =
    useMealsContext();
  const { userUid } = userAuthUseContext();
  const [loading, setLoading] = useState(false);
  const [bottomButtonContainerHeight, setBottomButtonContainerHeight] =
    useState(0);

  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ["50%", "80%"], []);

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

  const handleLog = async () => {
    setLoading(true);

    await LogMeal(userUid);
    setLoading(false);
    navigation.navigate("homeScreen");
  };

  const checkIsInteger = (number) => {
    return Number.isInteger(number) ? number : number.toFixed(2);
  };

  // const handleDeleteIngredient = (index) => {
  //   const calories = checkIsInteger(
  //     Number(mealInfo?.calories) - Number(mealInfo?.items[index]?.calories)
  //   );
  //   const protein = checkIsInteger(
  //     Number(mealInfo?.protein) - Number(mealInfo?.items[index]?.protein)
  //   );
  //   const fat = checkIsInteger(
  //     Number(mealInfo?.fat) - Number(mealInfo?.items[index]?.fat)
  //   );
  //   const carbs = checkIsInteger(
  //     Number(mealInfo?.carbs) - Number(mealInfo?.items[index]?.carbs)
  //   );
  //   const quantity = checkIsInteger(
  //     Number(mealInfo?.quantity[0]) -
  //       Number(mealInfo?.items[index]?.quantity[0])
  //   );

  //   const updatedMealInfo = mealInfo?.items?.filter((_, i) => i !== index);
  //   const updatedData = {
  //     ...mealInfo,
  //     calories,
  //     protein,
  //     fat,
  //     carbs,
  //     quantity: [quantity, ...mealInfo.quantity.slice(1)],
  //     items: updatedMealInfo,
  //   };
  //   // setData(updatedData);
  //   updateMealInfo(updatedData);
  //   deleteFoodIngredient(index);
  // };

  const handleDeleteIngredient = (index) => {
    const itemToDelete = mealInfo?.items[index];
    if (!itemToDelete) return;

    const updatedCalories = checkIsInteger(
      Number(mealInfo?.calories) - Number(itemToDelete?.calories)
    );
    const updatedProtein = checkIsInteger(
      Number(mealInfo?.protein) - Number(itemToDelete?.protein)
    );
    const updatedFat = checkIsInteger(
      Number(mealInfo?.fat) - Number(itemToDelete?.fat)
    );
    const updatedCarbs = checkIsInteger(
      Number(mealInfo?.carbs) - Number(itemToDelete?.carbs)
    );
    const updatedQuantity = checkIsInteger(
      Number(mealInfo?.quantity[0]) - Number(itemToDelete?.quantity[0])
    );

    const updatedItems = mealInfo?.items?.filter((_, i) => i !== index);
    const updatedData = {
      ...mealInfo,
      calories: updatedCalories.toString(),
      protein: updatedProtein.toString(),
      fat: updatedFat.toString(),
      carbs: updatedCarbs.toString(),
      quantity: [updatedQuantity.toString(), ...mealInfo.quantity.slice(1)],
      items: updatedItems,
    };

    // Updating the state with new meal info
    updateMealInfo(updatedData);
  };
  const handleAddNutrition = useCallback(() => {
    navigation.navigate("updateNutritionScreen");
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
    <View style={styles.container}>
      <SafeAreaView style={styles.innerContainer}>
        <View style={styles.headerContainer}>
          <Ionicons
            name="chevron-back"
            size={40}
            color="lightgrey"
            onPress={() => navigation.goBack()}
          />
          <View style={styles.headerInnerContainer}>
            <MaterialCommunityIcons
              name="delete"
              size={40}
              color="lightgrey"
              onPress={() => {
                resetMealInfo();
                navigation.goBack();
              }}
            />
          </View>
        </View>
        {foodImage !== "" ? (
          <Image
            source={{ uri: `${foodImage}` }}
            style={styles.foodImageBackground}
          />
        ) : (
          <Image source={placeholderImage} style={styles.foodImageBackground} />
        )}
        <BottomSheet
          ref={bottomSheetRef}
          index={0}
          snapPoints={snapPoints}
          enablePanDownToClose={false}
        >
          <View
            style={[
              styles.bottomSheetContainer,
              { paddingBottom: bottomButtonContainerHeight },
            ]}
          >
            <BottomSheetScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.topContainer}>
                <View style={styles.topInnerContainer}>
                  <Text
                    style={styles.foodName}
                    ellipsizeMode="tail"
                    numberOfLines={2}
                  >
                    {mealInfo?.name || "Meal"}
                  </Text>
                  {/* <Counter /> */}
                </View>
                <View style={styles.calorieContainer}>
                  <Text style={styles.calorieHeading}>
                    Calories: {Number(mealInfo?.calories)?.toFixed(2) || 0} Kcal
                  </Text>
                </View>
                <View style={styles.nutrientDetailContainer}>
                  <Text style={styles.nutrientDetail}>
                    <Text style={[styles.nutrientDetail, { color: "#d96e6b" }]}>
                      P{" "}
                    </Text>
                    {Number(mealInfo?.protein)?.toFixed(2) || 0}g
                  </Text>
                  <Text style={styles.nutrientDetail}>
                    <Text style={[styles.nutrientDetail, { color: "#e09c63" }]}>
                      F{" "}
                    </Text>
                    {Number(mealInfo?.fat)?.toFixed(2) || 0}g
                  </Text>
                  <Text style={styles.nutrientDetail}>
                    <Text style={[styles.nutrientDetail, { color: "#8aa9ce" }]}>
                      C{" "}
                    </Text>
                    {Number(mealInfo?.carbs)?.toFixed(2) || 0}g
                  </Text>
                </View>
              </View>
              {mealInfo?.items?.length >= 1 && (
                <Text style={styles.ingredientHeading}>Items</Text>
              )}
              {mealInfo?.items?.map((item, index) => (
                <RenderFoodIngredient
                  item={item}
                  index={index}
                  handleDeleteIngredient={handleDeleteIngredient}
                  key={index}
                />
              ))}
            </BottomSheetScrollView>
          </View>
        </BottomSheet>
        <View
          style={styles.fixedButtonContainer}
          onLayout={(event) =>
            setBottomButtonContainerHeight(event.nativeEvent.layout.height)
          }
        >
          <TouchableOpacity style={styles.fixedButton} onPress={handleLog}>
            <Text style={styles.buttonText}>Log Food</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default PreviewNutritionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F5F2",
  },
  innerContainer: {
    flex: 1,
  },
  headerContainer: {
    position: "absolute",
    top: 40,
    left: 10,
    right: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    zIndex: 1,
  },
  headerInnerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  foodImageBackground: {
    width: width,
    height: height * 0.6,
    resizeMode: "cover",
  },
  topContainer: {
    marginBottom: 15,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "lightgrey",
    padding: 10,
    paddingBottom: 15,
    borderRadius: 20,
  },
  foodName: {
    flex: 1,
    textAlign: "center",

    fontSize: 18,
    fontWeight: "500",
    color: "black",
    maxWidth: foodItemNameMaxWidth,
  },
  topInnerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingBottom: 10,
  },
  nutrientDetailContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
    justifyContent: "space-around",
    width: "100%",
  },
  calorieContainer: {
    alignItems: "center",
    marginTop: 5,
  },
  calorieHeading: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
    maxWidth: width - 100,
  },
  nutrientDetail: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
    maxWidth: (width - 80) / 3,
  },
  bottomSheetContainer: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: "white",
  },
  foodItemIngredientContainer: {
    padding: 10,
    borderRadius: 15,
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
    borderColor: "lightgrey",
    borderWidth: 1,
  },
  ingredientName: {
    fontSize: 16,
    fontWeight: "normal",
    color: "black",
    maxWidth: foodItemNameMaxWidth,
    flex: 0.6,
  },
  ingredientCalorie: {
    fontSize: 16,
    fontWeight: "normal",
    color: "black",
  },
  foodItemMicroNutrient: {
    fontSize: 14,
    fontWeight: "normal",
    color: "black",
  },
  foodItemIngredientInnerContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
    flex: 0.55,
  },
  foodItemIngredientRightContainer: {
    flex: 0.45,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "normal",
    color: "black",
    maxWidth: 60,
  },
  quantityUnit: {
    fontSize: 16,
    fontWeight: "normal",
    color: "black",
    maxWidth: 50,
  },
  foodItemRightContainer: {
    flexDirection: "column",
    justifyContent: "space-around",
  },
  foodItemIngredientIconContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 15,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
  },
  button: {
    borderWidth: 1,
    borderColor: "lightgrey",
    padding: 5,
    borderRadius: 5,
  },
  ingredientHeading: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
    paddingVertical: 10,
  },
  fixedButtonContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    bottom: Platform.OS === "ios" ? 20 : 0,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    backgroundColor: "white",
  },
  fixedButton: {
    padding: 15,
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    width: "80%",
  },
});
