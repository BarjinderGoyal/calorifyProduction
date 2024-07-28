import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Image,
  ScrollView,
  FlatList,
  Dimensions,
  Platform,
  ToastAndroid,
} from "react-native";
import Toast from "react-native-simple-toast";
import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "react-native-vector-icons";
import { useNavigation } from "@react-navigation/native";
import { format } from "date-fns";
import CircularProgressBar from "../../components/CircularProgressBar";
import { ActivityIndicator } from "react-native-paper";
import { useMealsContext } from "../../Context/MealsContext";
import { userAuthUseContext } from "../../Context/UserAuthContext";

const { width } = Dimensions.get("window");
const placeholderImage = require("../../assets/placeholder.png");

const RenderFoodItem = React.memo(({ item, date, meal, index }) => {
  const navigation = useNavigation();
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
      {item?.image !== "" && item?.image !== undefined ? (
        <Image
          source={{
            uri: "https://www.jollibeefoods.com/cdn/shop/files/29351737_2152446668377854_356570745477300982_o_2152446668377854.jpg",
          }}
          style={styles.foodImage}
        />
      ) : (
        <Image source={placeholderImage} style={styles.foodImage} />
      )}
      <View style={styles.foodItemDetail}>
        <Text
          style={styles.foodItemName}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {item?.name}
        </Text>
        <Text style={styles.foodItemCal}>{item?.calories} Kcal </Text>
        <Text style={styles.foodItemMicroNutrient}>
          <Text style={{ color: "#d96e6b" }}>P </Text>
          {item?.protein}g .<Text style={{ color: "#e09c63" }}> F </Text>
          {item?.fat}g .<Text style={{ color: "#8aa9ce" }}> C </Text>
          {item?.carbs}g
        </Text>
      </View>
    </Pressable>
  );
});

const PreviousDateReportScreen = ({ route }) => {
  const navigation = useNavigation();
  const { userUid, userDetail, userDailyMacroValue } = userAuthUseContext();
  const { day, month, year } = route.params;
  const {
    specificDateMeal,
    specificDateNutritions,
    fetchMeals,
    specificDateCalorieBurned,
  } = useMealsContext();
  console.log(day, month, year);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState("");
  const [selectedMeal, setSelectedMeal] = useState("Breakfast");
  const mealNames = ["Breakfast", "Lunch", "Snack", "Dinner"];
  // const data = [...new Array(5)].map((_, index) => index);

  const getFormattedDate = (day, month, year) => {
    const customDate = new Date(year, month, day);
    const formattedDate = format(customDate, "EEEE, d.MM");
    return formattedDate;
  };

  const fetchMeal = async () => {
    try {
      await fetchMeals(userUid, day, month, year);
    } catch (e) {
      Toast.show("Something went wrong", Toast.LONG);

      console.log("something went wrong while fetching specific date meal", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);

    fetchMeal();
    console.log(`${year}-${month}-${day}`);
    const currentDate = getFormattedDate(day, month, year);
    setDate(currentDate);
  }, []);

  // useEffect(() => {
  //   if (specificDateMeal === null) {
  //     setLoading(true);
  //   } else {
  //     setLoading(false);
  //   }
  // }, [specificDateMeal]);

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
            size={30}
            color="black"
            onPress={() => navigation.goBack()}
          />
          <Text style={styles.date}>{date}</Text>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
        >
          <View style={styles.calorieContainer}>
            <View style={styles.calorieTopContainer}>
              <View style={styles.calorieDetailContainer}>
                <View style={styles.calorieDetailInnerContainer}>
                  <Text style={styles.calorieDetailHeading}>Food: </Text>
                  <Text style={styles.calorieDetailNumber}>
                    {specificDateNutritions?.calorie || 0} Kcal
                  </Text>
                </View>
                <View style={styles.calorieDetailInnerContainer}>
                  <Text style={styles.calorieDetailHeading}>Exercise: </Text>
                  <Text style={styles.calorieDetailNumber}>
                    {specificDateCalorieBurned || 0} Kcal
                  </Text>
                </View>
              </View>
              <CircularProgressBar
                radius={width / 5}
                strokeWidth={15}
                max={userDetail?.CalorieValue || 2000}
                percentage={
                  specificDateNutritions?.calorie - specificDateCalorieBurned >
                  0
                    ? specificDateNutritions?.calorie -
                      specificDateCalorieBurned
                    : 0
                }
                // textColor={"black"}
              />
            </View>
            <View style={styles.nutrientParentContainer}>
              <View style={styles.nutrientContainer}>
                <Text style={styles.nutrientHeading}>Protein</Text>
                <CircularProgressBar
                  radius={width / 10}
                  color="#d96e6b"
                  textColor={"#d96e6b"}
                  max={userDailyMacroValue?.protein || 250}
                  type={"pfc"}
                  percentage={specificDateNutritions?.protein}
                />
                <Text style={styles.nutrientDetail}>
                  {/* {specificDateNutritions?.protein} /{" "} */}
                  {userDailyMacroValue?.protein || 250}g
                </Text>
              </View>
              <View style={styles.nutrientContainer}>
                <Text style={styles.nutrientHeading}>Fats</Text>
                <CircularProgressBar
                  radius={width / 10}
                  color="#e09c63"
                  textColor={"#e09c63"}
                  max={userDailyMacroValue?.fat || 250}
                  type={"pfc"}
                  percentage={specificDateNutritions?.fat}
                />
                <Text style={styles.nutrientDetail}>
                  {/* {specificDateNutritions?.fat} /{" "} */}
                  {userDailyMacroValue?.fat || 250}g
                </Text>
              </View>
              <View style={styles.nutrientContainer}>
                <Text style={styles.nutrientHeading}>Carbs</Text>
                <CircularProgressBar
                  radius={width / 10}
                  color="#8aa9ce"
                  textColor={"#8aa9ce"}
                  max={userDailyMacroValue?.carbs || 250}
                  type={"pfc"}
                  percentage={specificDateNutritions?.carbs}
                />
                <Text style={styles.nutrientDetail}>
                  {/* {specificDateNutritions?.carbs} /{" "} */}
                  {userDailyMacroValue?.carbs || 250}g
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.mealParentContainer}>
            <View style={styles.mealNameContainer}>
              {mealNames.map((item, index) => {
                console.log(item);
                return (
                  <Text
                    style={[
                      styles.mealName,
                      {
                        backgroundColor:
                          selectedMeal === item ? "lightblue" : "white",
                      },
                    ]}
                    onPress={() => setSelectedMeal(item)}
                    key={index}
                  >
                    {item}
                  </Text>
                );
              })}
            </View>

            {specificDateMeal?.[
              `${selectedMeal.toLowerCase()}`
            ]?.food_items?.map((item, index) => (
              <RenderFoodItem
                item={item}
                meal={
                  specificDateMeal?.[`${selectedMeal?.toLowerCase()}`]
                    ?.meal_name
                }
                date={specificDateMeal?.date}
                index={index}
                key={index}
              />
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default PreviousDateReportScreen;

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
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  date: {
    fontSize: 22,
    fontWeight: "600",
    color: "black",
  },
  mealParentContainer: {
    gap: 10,
    flex: 1,
  },
  mealNameContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "lightgrey",
    // elevation: 2,
    backgroundColor: "white",
  },
  mealName: {
    fontSize: 16,
    fontWeight: "600",
    color: "black",
    padding: 10,
    borderRadius: 20,
  },
  mealContainer: {
    paddingHorizontal: 10,
    paddingTop: 15,
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "lightgrey",
    // elevation: 2,
    backgroundColor: "white",
  },
  foodItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "lightgrey",
    padding: 10,
    overflow: "hidden",
    marginBottom: 15,
  },
  foodImage: {
    width: 60,
    height: 60,
    resizeMode: "cover",
    borderRadius: 10,
  },
  foodItemDetail: {
    flex: 1,
    gap: 3,
    overflow: "hidden",
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
  calorieContainer: {
    marginVertical: 20,
    paddingVertical: 15,
    // elevation: 2,
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "lightgrey",

    gap: 15,
    backgroundColor: "white",
  },
  calorieTopContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  calorieDetailContainer: {
    gap: 10,
    // alignItems: "center",
  },
  calorieDetailInnerContainer: {
    // gap: 10,
    // alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  calorieDetailHeading: {
    fontSize: 18,
    colro: "black",
  },
  calorieDetailNumber: { fontSize: 18, colro: "black" },

  nutrientContainer: {
    alignItems: "center",
  },
  nutrientHeading: {
    fontSize: 16,
    fontWeight: "normal",
    color: "black",
  },
  nutrientDetail: {
    fontSize: 16,
    fontWeight: "600",
    color: "black",
  },
  nutrientParentContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    // gap: 15,
    paddingHorizontal: 10,
  },
});
