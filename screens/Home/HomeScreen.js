import {
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
  BackHandler,
  Alert,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import CircularProgressBar from "../../components/CircularProgressBar";

import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isToday,
  parseISO,
  isBefore,
  startOfDay,
} from "date-fns";

import Toast from "react-native-simple-toast";
import { useNavigationState } from "@react-navigation/native";

import MealDropDownContext from "../../Context/MealDropDownContext";
import { useNavigation } from "@react-navigation/native";
import { useMealsContext } from "../../Context/MealsContext";
import { userAuthUseContext } from "../../Context/UserAuthContext";
import { Superwall } from "@superwall/react-native-superwall";
import LogMealBottomSheet from "../../components/Meals/LogMealBottomSheet";
import { bottomSheetUseContext } from "../../Context/BottomSheetContext";
import Meals from "../../components/Meals";

const { width } = Dimensions.get("window");

const HomeScreen = () => {
  const { calculatedNutrition, updateSelectedMeal, calorieBurned } =
    useMealsContext();
  const { bottomSheetIsOpen } = bottomSheetUseContext();
  const { userDetail, userDailyMacroValue } = userAuthUseContext();
  const navigation = useNavigation();
  const start = startOfMonth(new Date());
  const end = endOfMonth(new Date());
  const dates = eachDayOfInterval({ start, end });
  const flatListRef = useRef(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const navState = useNavigationState((state) => state);

  useEffect(() => {
    const todayIndex = dates.findIndex((date) => isToday(date));
    if (todayIndex !== -1 && flatListRef?.current) {
      flatListRef.current.scrollToIndex({
        index: todayIndex,
        animated: true,
      });
    }
  }, []);

  console.log("navigation index is ", navState.index);

  useEffect(() => {
    const backAction = () => {
      if (navState.index === 0) {
        Alert.alert("Hold on!", "Are you sure you want to exit the app?", [
          {
            text: "Cancel",
            onPress: () => null,
            style: "cancel",
          },
          { text: "YES", onPress: () => BackHandler.exitApp() },
        ]);
      }
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [navigation]);

  const RenderDate = React.memo(({ item }) => {
    const isSelected =
      selectedDate &&
      selectedDate.getTime() === item.getTime() &&
      !isToday(item);

    const handlePress = (date) => {
      const today = startOfDay(new Date());
      const selectedDate = startOfDay(date);

      if (isBefore(selectedDate, today)) {
        const day = format(date, "d");
        const month = format(date, "M");
        const year = format(date, "yyyy");

        navigation.navigate("previousDateReportScreen", {
          day,
          month: month - 1,
          year,
        });
        console.log(date);
      } else {
        Toast.show("Meal is not logged yet", Toast.SHORT);
      }

      setSelectedDate(null);
    };

    return (
      <Pressable
        onPress={() => {
          handlePress(item);
        }}
        style={[
          styles.calendarItemContainer,
          {
            backgroundColor: isSelected ? "#d05b19" : "white",
            borderColor: isSelected ? "black" : "lightgrey",
          },
        ]}
      >
        <Text
          style={[
            styles.calendarDayText,
            {
              color: isToday(item)
                ? "#d05b19"
                : isSelected
                ? "white"
                : "lightgrey",
            },
          ]}
        >
          {format(item, "EEE")}
        </Text>
        <Text
          style={[
            styles.calendarDateText,
            {
              color: isToday(item)
                ? "#d05b19"
                : isSelected
                ? "white"
                : "lightgrey",
            },
          ]}
        >
          {format(item, "d")}
        </Text>
      </Pressable>
    );
  });

  console.log(
    userDailyMacroValue,
    "USER DAILY MACRO VALUE IS THIS AND THE VALUE IS IN HOME SCREEN"
  );

  return (
    <MealDropDownContext>
      <View style={styles.container}>
        <SafeAreaView style={styles.innerContainer}>
          <View style={styles.header}>
            <Text style={styles.date}>{format(new Date(), "EEEE, d.MM")}</Text>
            {/* <Ionicons
              name="bookmark-outline"
              size={30}
              color="black"
              onPress={() => navigation.navigate("savedFoodScreen")}
            /> */}
          </View>
          <View style={[styles.calendarContainer]}>
            <FlatList
              ref={flatListRef}
              data={dates}
              keyExtractor={(item) => item.toISOString()}
              renderItem={({ item }) => (
                <RenderDate
                  item={item}
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate}
                />
              )}
              horizontal
              contentContainerStyle={{ gap: 10 }}
              showsHorizontalScrollIndicator={false}
              getItemLayout={(data, index) => ({
                length: 50,
                offset: 50 * index,
                index,
              })}
            />
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View>
              <View style={styles.calorieContainer}>
                <View style={styles.calorieDailyGoalContainer}>
                  <View style={styles.calorieDailyGoalInnerContainer}>
                    <Text style={styles.dailyCalorieGoalHaeding}>
                      Calorie Goal:{" "}
                    </Text>
                    <Text style={styles.dailyCalorieValue}>
                      {userDetail?.dailyCalorieValue?.toFixed(0)} cal
                    </Text>
                  </View>
                  <View style={styles.calorieConsumerContainer}>
                    <View style={styles.calorieBurnedContainer}>
                      <Text style={styles.calorieBurnedHeading}>
                        Exercise:{" "}
                      </Text>
                      <Text style={styles.calorieBurnedNumber}>
                        {Number(calorieBurned)?.toFixed(2) || 0}
                      </Text>
                    </View>
                    <View style={styles.consumedClaorieContainer}>
                      <Text style={styles.calorieBurnedHeading}>Food: </Text>
                      <Text style={styles.calorieConsumedNumber}>
                        {Number(calculatedNutrition?.calorie)?.toFixed(2) || 0}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={styles.calorieTopContainer}>
                  <View style={styles.calorieTopRightContainer}>
                    {userDetail?.dailyCalorieValue -
                      calculatedNutrition?.calorie +
                      calorieBurned >
                    0 ? (
                      <View style={styles.calorieInnerContainer}>
                        <Text
                          style={[styles.leftCalorieText, { color: "#BEC6A0" }]}
                        >
                          {Number(
                            userDetail?.dailyCalorieValue?.toFixed(0) -
                              calculatedNutrition?.calorie +
                              calorieBurned
                          )?.toFixed(0)}
                        </Text>
                        <Text style={styles.leftCalorieHeading}>
                          Calorie Left
                        </Text>
                      </View>
                    ) : (
                      <View style={styles.calorieInnerContainer}>
                        <Text
                          style={[styles.leftCalorieText, { color: "#C63C51" }]}
                        >
                          {Number(
                            Math.abs(
                              userDetail?.dailyCalorieValue?.toFixed(0) -
                                calculatedNutrition?.calorie +
                                calorieBurned
                            )
                          )?.toFixed(0)}
                        </Text>
                        <Text
                          style={[
                            styles.leftCalorieHeading,
                            { color: "#C63C51" },
                          ]}
                        >
                          Calorie Over
                        </Text>
                      </View>
                    )}
                  </View>
                  <CircularProgressBar
                    radius={width / 5}
                    strokeWidth={15}
                    color={
                      userDetail?.dailyCalorieValue -
                        calculatedNutrition?.calorie +
                        calorieBurned <
                      0
                        ? "#C63C51"
                        : "#BEC6A0"
                    }
                    max={userDetail?.dailyCalorieValue?.toFixed(0) || 2000}
                    percentage={
                      calculatedNutrition?.calorie - calorieBurned > 0
                        ? calculatedNutrition?.calorie - calorieBurned
                        : 0
                    }
                    // textColor={"black"}
                    type="calorie"
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
                      percentage={calculatedNutrition?.protein}
                    />
                    <Text style={styles.nutrientDetail}>
                      {/* {calculatedNutrition?.protein} /{" "} */}
                      {Number(userDailyMacroValue?.protein).toFixed(2) || 250}g
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
                      percentage={calculatedNutrition?.fat}
                    />
                    <Text style={styles.nutrientDetail}>
                      {/* {calculatedNutrition?.fat} /{" "} */}
                      {Number(userDailyMacroValue?.fat)?.toFixed(2) || 250}g
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
                      percentage={calculatedNutrition?.carbs}
                    />
                    <Text style={styles.nutrientDetail}>
                      {/* {calculatedNutrition?.carbs} /{" "} */}
                      {Number(userDailyMacroValue?.carbs).toFixed(2) || 250}g
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.mealContainer}>
                <Meals mealName={"Breakfast"} />
                <Meals mealName={"Lunch"} />
                <Meals mealName={"Snack"} />
                <Meals mealName={"Dinner"} />
              </View>
              <View style={styles.exerciseLogContainer}>
                <Text style={styles.exerciselogHeading}>Exercise Burn</Text>
                <Meals mealName={"exercise"} />
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
        {bottomSheetIsOpen && <LogMealBottomSheet navigation={navigation} />}
      </View>
    </MealDropDownContext>
  );
};

export default HomeScreen;

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
  header: {
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  innerHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  date: {
    fontSize: 22,
    fontWeight: "600",
    color: "black",
  },
  calorieContainer: {
    paddingVertical: 15,
    // elevation: 2,
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "lightgrey",
    // alignItems: "center",
    gap: 15,
    backgroundColor: "white",
  },
  calorieDailyGoalContainer: {
    // justifyContent: "center",
    // flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  calorieDailyGoalInnerContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  calorieConsumerContainer: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    gap: 50,
  },
  calorieBurnedContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  calorieBurnedNumber: {
    fontSize: 16,
    fontWeight: "600",
    color: "black",
  },
  calorieBurnedHeading: {
    fontSize: 16,
    fontWeight: "600",
    color: "black",
  },
  consumedClaorieContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  calorieConsumedNumber: { fontSize: 16, fontWeight: "600", color: "black" },
  dailyCalorieGoalHaeding: {
    fontSize: 20,
    fontWeight: "600",
    color: "normal",
  },
  dailyCalorieValue: {
    fontSize: 22,
    fontWeight: "600",
    color: "tomato",
  },
  calorieTopContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: width * 0.1,
    // marginVertical: 5,
  },
  calorieTopRightContainer: {
    gap: 10,
    backgroundColor: "white",
  },

  calorieInnerContainer: {
    alignItems: "center",
  },
  leftCalorieText: {
    fontSize: 40,
    fontWeight: "600",
    color: "black",
  },
  leftCalorieHeading: {
    fontSize: 16,
    fontWeight: "600",
    color: "black",
  },
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
    fontWeight: "normal",
    color: "black",
  },
  nutrientParentContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    // gap: 15,
    paddingHorizontal: 10,
  },
  mealContainer: {
    marginVertical: 15,
    gap: 15,
  },
  calendarContainer: {
    marginVertical: 10,
    paddingRight: 25,
    padding: 5,
    width: width,
  },
  calendarItemContainer: {
    backgroundColor: "white",
    // elevation: 2,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "lightgrey",
    width: 50,
    gap: 5,
    borderRadius: 10,
    alignItems: "center",
    padding: 5,
  },
  calendarDateText: {
    fontSize: 18,
    fontWeight: "600",
    color: "black",
  },
  calendarDayText: {
    fontSize: 18,
    fontWeight: "600",
    color: "black",
  },
  exerciseLogContainer: {
    marginBottom: 15,
    borderRadius: 20,
    gap: 10,
    marginTop: 10,
    // backgroundColor: "#F6F5F2",
    // borderWidth: StyleSheet.hairlineWidth,
    // borderColor: "lightgrey",
  },
  exerciselogHeading: {
    fontSize: 18,
    fontWeight: "500",
    color: "black",
  },
});
