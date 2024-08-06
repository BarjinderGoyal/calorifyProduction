import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  SectionList,
} from "react-native";
import React, {
  useMemo,
  useRef,
  useState,
  useEffect,
  useCallback,
} from "react";
import { Ionicons, MaterialCommunityIcons } from "react-native-vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useNavigation } from "@react-navigation/native";
import { ActivityIndicator } from "react-native-paper";
import { userAuthUseContext } from "../../Context/UserAuthContext";
import { useMealsContext } from "../../Context/MealsContext";

const { width, height } = Dimensions.get("window");
const foodItemNameMaxWidth = (width - 20) * 0.5;

const placeholderImage = require("../../assets/placeholder.png");

const RenderFoodIngredient = React.memo(({ item, index }) => {
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
          {Number(item?.carbs).toFixed(2) || 0}g
        </Text>
      </View>
    </View>
  );
});

const SavedMealPreviewScreen = ({ route }) => {
  const { foodDetail, meal, date } = route.params;
  const { userUid } = userAuthUseContext();
  const { deleteMeal, savedFoodInBackend, deleteSavedFood } = useMealsContext();

  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ["50%", "80%"], []);

  const deleteCurrentMeal = useCallback(async () => {
    setLoading(true);
    await deleteMeal(userUid, meal, foodDetail?._id, date);
    setLoading(false);
    navigation.goBack();
  }, [foodDetail, userUid, date]);

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

  const handleSaveFood = useCallback(async () => {
    setLoading(true);
    await deleteSavedFood(userUid, foodDetail._id, meal);
    foodDetail.isSaved = false;
    setLoading(false);
  }, [userUid, foodDetail, meal]);

  const handleUnSaveFood = useCallback(async () => {
    setLoading(true);
    await savedFoodInBackend(userUid, foodDetail._id, meal);
    foodDetail.isSaved = true;
    setLoading(false);
  }, [userUid, foodDetail, meal]);

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
            {foodDetail?.isSaved ? (
              <Ionicons
                name="bookmark"
                size={40}
                color="#d05b19"
                onPress={() => handleSaveFood()}
              />
            ) : (
              <Ionicons
                name="bookmark-outline"
                size={40}
                color="lightgrey"
                onPress={() => handleUnSaveFood()}
              />
            )}
            <MaterialCommunityIcons
              name="delete"
              size={40}
              color="lightgrey"
              onPress={() => {
                deleteCurrentMeal();
              }}
            />
          </View>
        </View>
        {foodDetail?.foodImage !== "" && foodDetail?.foodImage ? (
          <Image
            source={{ uri: `${foodDetail?.foodImage}` }}
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
          <View style={[styles.bottomSheetContainer]}>
            <BottomSheetScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.topContainer}>
                <View style={styles.topInnerContainer}>
                  <Text
                    style={styles.foodName}
                    ellipsizeMode="tail"
                    numberOfLines={2}
                  >
                    {foodDetail?.name || "Meal"}
                  </Text>
                </View>
                <View style={styles.calorieContainer}>
                  <Text style={styles.calorieHeading}>
                    Calories: {Number(foodDetail?.calories)?.toFixed(2) || 0}{" "}
                    Kcal
                  </Text>
                </View>
                <View style={styles.nutrientDetailContainer}>
                  <Text style={styles.nutrientDetail}>
                    <Text style={[styles.nutrientDetail, { color: "#d96e6b" }]}>
                      P{" "}
                    </Text>
                    {Number(foodDetail?.protein)?.toFixed(2) || 0}g
                  </Text>
                  <Text style={styles.nutrientDetail}>
                    <Text style={[styles.nutrientDetail, { color: "#e09c63" }]}>
                      F{" "}
                    </Text>
                    {Number(foodDetail?.fat)?.toFixed(2) || 0}g
                  </Text>
                  <Text style={styles.nutrientDetail}>
                    <Text style={[styles.nutrientDetail, { color: "#8aa9ce" }]}>
                      C{" "}
                    </Text>
                    {Number(foodDetail?.carbs)?.toFixed(2) || 0}g
                  </Text>
                </View>
              </View>
              {foodDetail?.items?.length >= 1 && (
                <Text style={styles.ingredientHeading}>Items</Text>
              )}
              {foodDetail?.items?.map((item, index) => (
                <RenderFoodIngredient item={item} index={index} key={index} />
              ))}
            </BottomSheetScrollView>
          </View>
        </BottomSheet>
      </SafeAreaView>
    </View>
  );
};

export default SavedMealPreviewScreen;

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
    gap: 10,
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
    fontSize: 22,
    fontWeight: "bold",
    color: "black",
    maxWidth: width - 20,
  },
  topInnerContainer: {
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
    marginTop: 15,
  },
  calorieHeading: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
  },
  nutrientDetail: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
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
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
  },
  counterContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  button: {
    borderWidth: 1,
    borderColor: "lightgrey",
    padding: 5,
    borderRadius: 5,
  },
  count: {
    marginHorizontal: 10,
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
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
    flexDirection: "row",
    justifyContent: "space-around",
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
    width: "45%",
  },
});
