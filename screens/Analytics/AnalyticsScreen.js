import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState, useEffect, useMemo, lazy, Suspense } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { useNavigation } from "@react-navigation/native";
import { useMealsContext } from "../../Context/MealsContext";
import { userAuthUseContext } from "../../Context/UserAuthContext";

const BarGraph = lazy(() => import("../../components/Analytics/BarGraph"));
const WeightChart = lazy(() =>
  import("../../components/Analytics/Graphs/WeightChart")
);

const TabContent = ({ heading, color, data, maxValue }) => {
  return (
    <Suspense
      fallback={
        <View style={styles.calorieChart}>
          <View style={{ height: 220, width, backgroundColor: "white" }}></View>
        </View>
      }
    >
      <BarGraph
        heading={heading}
        color={color}
        data={data}
        maxValue={maxValue}
      />
    </Suspense>
  );
};

const { width } = Dimensions.get("window");

const AnalyticsScreen = () => {
  const { weeklyNutritionData } = useMealsContext();
  const {
    userUid,
    userLoggedWeight,
    fetchUserLoggedWeight,
    userDetail,
    userDailyMacroValue,
  } = userAuthUseContext();
  const [selected, setSelected] = useState("Week");
  const navigation = useNavigation();

  const chartOptions = ["Week", "Month", "6 Months", "Year"];

  console.log(
    "anaannananaannanananannananaanananananananannanananannanananannannaananananaanaannanananananaa",
    weeklyNutritionData
  );

  useEffect(() => {
    if (!userLoggedWeight.length && userUid) {
      fetchUserLoggedWeight(userUid);
    }
  }, [userUid, userLoggedWeight.length, fetchUserLoggedWeight]);

  const currentWeight = useMemo(() => {
    if (userLoggedWeight.length) {
      return userLoggedWeight[userLoggedWeight.length - 1].weight;
    }
    return null;
  }, [userLoggedWeight]);

  const currentBMR = useMemo(() => {
    let weight = null;
    if (userLoggedWeight.length) {
      weight = userLoggedWeight[userLoggedWeight.length - 1].weight;
    }

    if (userDetail?.gender === "Male") {
      return (
        10 * (weight || userDetail?.weight) +
        6.25 * userDetail?.height -
        5 * userDetail?.age +
        5
      );
    } else {
      return (
        10 * (weight || userDetail?.weight) +
        6.25 * userDetail?.height -
        5 * userDetail?.age -
        161
      );
    }
  }, [userDetail, userLoggedWeight]);

  const currentBMI = useMemo(() => {
    let weight = null;
    if (userLoggedWeight.length) {
      weight = userLoggedWeight[userLoggedWeight.length - 1].weight;
    }

    const heightInMeters = userDetail?.height / 100; // convert height from cm to meters

    return (weight || userDetail?.weight) / (heightInMeters * heightInMeters);
  }, [userDetail, userLoggedWeight]);

  const memoizedCharts = useMemo(() => {
    return [
      {
        heading: "calories",
        color: "#BEC6A0",
        data: weeklyNutritionData.calories,
      },
      {
        heading: "protein",
        color: "#d96e6b",
        data: weeklyNutritionData.protein,
      },
      { heading: "fats", color: "#e09c63", data: weeklyNutritionData.fats },
      { heading: "carbs", color: "#8aa9ce", data: weeklyNutritionData.carbs },
    ].map((item) => {
      return (
        <View style={styles.calorieChart} key={item.heading}>
          <TabContent
            heading={
              item.heading.charAt(0).toUpperCase() + item.heading.slice(1)
            }
            color={item.color}
            data={item.data}
            maxValue={
              item.heading !== "calories"
                ? userDailyMacroValue[`${item.heading}`] || 250
                : userDetail?.dailyCalorieValue
            }
          />
        </View>
      );
    });
  }, [weeklyNutritionData]);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.innerContainer}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.topContainer}>
            {[
              { value: `${currentWeight || 0}Kg`, heading: "Current weight" },
              { value: `${userDetail?.goalWeight}Kg`, heading: "Goal weight" },
              { value: `${currentBMR.toFixed(2)}`, heading: "Current BMR" },
            ].map((item, index) => (
              <View key={index} style={styles.topInnerContainer}>
                <Text style={styles.value}>{item.value}</Text>
                <Text style={styles.heading}>{item.heading}</Text>
              </View>
            ))}
          </View>
          <View style={styles.weightChartContainer}>
            <View style={styles.chartOptionContainer}>
              {chartOptions.map((option) => (
                <Text
                  key={option}
                  style={[
                    styles.chartOptionName,
                    {
                      backgroundColor:
                        selected === option ? "#d05b19" : "white",
                    },
                  ]}
                  onPress={() => setSelected(option)}
                >
                  {option}
                </Text>
              ))}
            </View>
          </View>
          <View style={styles.weightChart}>
            <Suspense
              fallback={
                <View
                  style={{ height: 300, width, backgroundColor: "white" }}
                ></View>
              }
            >
              <WeightChart range={selected} data={userLoggedWeight} />
            </Suspense>
          </View>
          <TouchableOpacity
            style={styles.addWeightContainer}
            onPress={() => navigation.navigate("WeightLogScreen")}
          >
            <Text style={styles.buttonText}>Log Weight</Text>
          </TouchableOpacity>
          {memoizedCharts}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default AnalyticsScreen;

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
  topContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#d05b19",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "lightgrey",
    marginHorizontal: 20,
    marginTop: 15,
  },
  topInnerContainer: {
    gap: 5,
    alignItems: "center",
  },
  value: {
    fontSize: 22,
    fontWeight: "600",
    color: "black",
  },
  heading: {
    fontSize: 16,
    color: "black",
  },
  chartOptionContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "white",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "lightgrey",
    borderRadius: 10,
    marginHorizontal: 20,
    justifyContent: "space-between",
  },
  weightChartContainer: {
    gap: 10,
    marginVertical: 20,
  },
  weightChart: {
    backgroundColor: "white",
    overflow: "hidden",
    borderRadius: 20,
  },
  chartOptionName: {
    fontSize: 18,
    fontWeight: "600",
    color: "black",
    borderRadius: 5,
    padding: 10,
    textAlign: "center",
  },
  weightChartInnerContainer: {
    backgroundColor: "white",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "lightgrey",
    padding: 5,
  },
  addWeightContainer: {
    padding: 15,
    borderRadius: 20,
    backgroundColor: "#d05b19",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 15,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "600",
    color: "black",
  },
  calorieChart: {
    backgroundColor: "white",
    overflow: "hidden",
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "lightgrey",
    marginBottom: 15,
  },
});
