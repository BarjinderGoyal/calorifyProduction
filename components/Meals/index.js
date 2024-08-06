import { StyleSheet, Text, View, Image, Pressable, Alert } from "react-native";
import React, { useCallback, useEffect } from "react";
import {
  MaterialIcons,
  MaterialCommunityIcons,
  Ionicons,
} from "react-native-vector-icons";
import { mealDropDownUseContext } from "../../Context/MealDropDownContext";
import { useNavigation } from "@react-navigation/native";
import { useMealsContext } from "../../Context/MealsContext";
import Superwall from "@superwall/react-native-superwall";
import { bottomSheetUseContext } from "../../Context/BottomSheetContext";
import { userAuthUseContext } from "../../Context/UserAuthContext";

const placeholderImage = require("../../assets/placeholder.png");

const RenderFoodItem = React.memo(({ item, date, meal, index }) => {
  const navigation = useNavigation();
  if (meal === "exercise") {
    return (
      <View style={styles.exerciseItemContainer}>
        <Text
          style={styles.exerciseName}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {item?.name}
        </Text>
        <Text style={styles.exerciseCalorieBurned}>
          {Number(item?.caloriesBurned)?.toFixed(2)} Kcal
        </Text>
      </View>
    );
  }

  return (
    <Pressable
      onPress={() =>
        navigation.navigate("savedMealPreviewScreen", {
          foodDetail: item,
          meal,
          date,
        })
      }
      style={styles.foodItem}
    >
      {item?.foodImage === "" || item?.foodImage === null ? (
        <Image source={placeholderImage} style={styles.foodImage} />
      ) : (
        <Image source={{ uri: item?.foodImage }} style={styles.foodImage} />
      )}
      {/* <Image source={placeholderImage} style={styles.foodImage} /> */}
      <View style={styles.foodItemDetail}>
        <Text
          style={styles.foodItemName}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {item?.name}
        </Text>
        <Text style={styles.foodItemCal}>
          {Number(item?.calories)?.toFixed(2) || 0} Kcal{" "}
        </Text>
        <Text style={styles.foodItemMicroNutrient}>
          <Text style={{ color: "#d96e6b" }}>
            P {Number(item?.protein)?.toFixed(2) || 0}g{" "}
            <Text style={{ color: "black" }}>.</Text>{" "}
          </Text>
          <Text style={{ color: "#e09c63" }}>
            F {Number(item?.fat)?.toFixed(2) || 0}g{" "}
            <Text style={{ color: "black" }}>.</Text>{" "}
          </Text>
          <Text style={{ color: "#8aa9ce" }}>
            C {Number(item?.carbs).toFixed(2) || 0}g
          </Text>
        </Text>
      </View>
    </Pressable>
  );
});

const Meals = ({ mealName }) => {
  const { meals, fetchTodayMeals, updateSelectedMeal, exercise } =
    useMealsContext();
  const { userDetail, updateUserFlags, userUid } = userAuthUseContext();
  const { updateBottomSheet } = bottomSheetUseContext();
  const [openedMealName, updateOpenedMealName] = mealDropDownUseContext();
  const navigation = useNavigation();

  const RenderExercise = useCallback(() => {
    return (
      <View style={styles.exerciseContainer}>
        {mealName === openedMealName ? (
          <>
            {exercise?.exercise?.map((item, index) => (
              <RenderFoodItem
                item={item}
                meal={"exercise"}
                date={exercise?.date}
                index={index}
                key={index}
              />
            ))}
            <Ionicons
              name="chevron-up"
              color="black"
              size={30}
              style={{ alignSelf: "center" }}
              onPress={handleUpArrow}
            />
          </>
        ) : (
          <View>
            {exercise?.exercise?.length > 0 && (
              <RenderFoodItem
                item={exercise.exercise[0]}
                meal={"exercise"}
                date={exercise?.date}
                index={0}
              />
            )}
            {exercise?.exercise?.length > 1 && (
              <Ionicons
                name="chevron-down"
                color="black"
                size={30}
                style={{ alignSelf: "center" }}
                onPress={handleDownArrow}
              />
            )}
          </View>
        )}
      </View>
    );
  }, [meals, exercise, meals, openedMealName]);

  const handleAddClick = async () => {
    if (userDetail?.hasUsedFreeLogging) {
      Superwall.shared.register("logMeal").then(() => {
        if (mealName !== "exercise") {
          updateSelectedMeal(mealName.toLowerCase());
          updateBottomSheet(true);
        } else {
          navigation.navigate("searchScreen", {
            previousScreen: "exercise",
          });
        }
      });
    } else {
      if (mealName !== "exercise") {
        updateSelectedMeal(mealName.toLowerCase());
        updateBottomSheet(true);
        await updateUserFlags({ uid: userUid, hasUsedFreeLogging: true });
      } else {
        navigation.navigate("searchScreen", {
          previousScreen: "exercise",
        });
      }
    }
  };

  // const handleAddClick = async () => {
  //   if (userDetail?.hasUsedFreeLogging) {
  //     try {
  //       // Register the paywall event and wait for the response
  //       const result = await Superwall.shared.register("logMeal");

  //       // Handle paywall interaction based on result
  //       if (result === "purchased" || result === "restored") {
  //         // User has successfully subscribed, proceed with the action
  //         if (mealName !== "exercise") {
  //           updateSelectedMeal(mealName.toLowerCase());
  //           updateBottomSheet(true);
  //         } else {
  //           navigation.navigate("searchScreen", {
  //             previousScreen: "exercise",
  //           });
  //         }
  //       } else {
  //         // User declined the paywall, handle accordingly
  //         console.log("Paywall declined");
  //       }
  //     } catch (error) {
  //       console.error("Error handling paywall:", error);
  //     }
  //   } else {
  //     // First time free logging logic
  //     if (mealName !== "exercise") {
  //       updateSelectedMeal(mealName.toLowerCase());
  //       updateBottomSheet(true);
  //       await updateUserFlags({ uid: userUid, hasUsedFreeLogging: true });
  //     } else {
  //       navigation.navigate("searchScreen", {
  //         previousScreen: "exercise",
  //       });
  //     }
  //   }
  // };

  const handleUpArrow = useCallback(() => {
    updateOpenedMealName("");
  }, [openedMealName]);

  const handleDownArrow = useCallback(() => {
    updateOpenedMealName(mealName);
  }, [openedMealName]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>{mealName}</Text>
        <View style={styles.headerInnerContainer}>
          <MaterialIcons
            name="add-circle"
            size={40}
            color="#d05b19"
            // onPress={addFood}
            onPress={() => handleAddClick()}
          />
        </View>
      </View>
      {mealName === "exercise" ? (
        <RenderExercise />
      ) : (
        <View style={styles.foodContainer}>
          {mealName === openedMealName ? (
            <>
              {meals[`${mealName?.toLowerCase()}`]?.food_items.map(
                (item, index) => (
                  <RenderFoodItem
                    item={item}
                    meal={meals[`${mealName?.toLowerCase()}`]?.meal_name}
                    date={meals?.date}
                    index={index}
                    key={index}
                  />
                )
              )}
              <Ionicons
                name="chevron-up"
                color="black"
                size={30}
                style={{ alignSelf: "center" }}
                onPress={handleUpArrow}
              />
            </>
          ) : (
            <View>
              {meals[`${mealName?.toLowerCase()}`]?.food_items.length > 0 && (
                <RenderFoodItem
                  item={meals[`${mealName?.toLowerCase()}`]?.food_items[0]}
                  meal={meals[`${mealName?.toLowerCase()}`]?.meal_name}
                  date={meals?.date}
                  index={0}
                />
              )}
              {meals[`${mealName?.toLowerCase()}`]?.food_items.length > 1 && (
                <Ionicons
                  name="chevron-down"
                  color="black"
                  size={30}
                  style={{ alignSelf: "center" }}
                  onPress={handleDownArrow}
                />
              )}
            </View>
          )}
        </View>
      )}
    </View>
  );
};

export default Meals;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    // elevation: 2,
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "lightgrey",
    paddingHorizontal: 15,
    paddingTop: 15,
    overflow: "hidden", // Ensure the container does not expand beyond its bounds
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  heading: {
    fontSize: 18,
    fontWeight: "500",
    color: "black",
  },
  headerInnerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  foodContainer: {
    marginTop: 15,
  },
  exerciseContainer: {
    marginTop: 15,
  },
  foodItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "lightgrey",
    padding: 10,
    overflow: "hidden", // Ensure the item does not expand beyond its bounds
    marginBottom: 15,
  },
  foodImage: {
    width: 60,
    height: 60,
    // resizeMode: "cover",
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "lightgrey",
  },
  foodItemDetail: {
    flex: 1, // Ensure the details container takes up the remaining space
    gap: 3,
    overflow: "hidden", // Ensure the text does not expand beyond the container
  },
  foodItemName: {
    fontSize: 16,
    fontWeight: "600",
    color: "black",
  },
  foodItemCal: {
    fontSize: 14,
    fontWeight: "600",
    color: "black",
  },
  foodItemMicroNutrient: {
    fontSize: 14,
    fontWeight: "600",
    color: "black",
  },
  exerciseItemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "lightgrey",
    paddingVertical: 15,
    paddingHorizontal: 10,
    overflow: "hidden",
    marginBottom: 15,
    gap: 15,
  },
  exerciseName: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: "black",
  },
  exerciseCalorieBurned: {
    fontSize: 16,
    fontWeight: "600",
    color: "black",
  },
});
