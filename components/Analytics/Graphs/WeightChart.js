import React, { useMemo } from "react";
import { Dimensions, View } from "react-native";
import { LineChart as RNLineChart } from "react-native-chart-kit";
import {
  getFilteredData,
  getXLabels,
} from "../../../functions/WeightGraphFunctions";

const WeightChart = ({ range, data }) => {
  const days = useMemo(() => {
    switch (range) {
      case "Week":
        return 7;
      case "Month":
        return 30;
      case "6 Months":
        return 180;
      case "Year":
        return 365;
      default:
        return 7;
    }
  }, [range]);

  const maxLabels = useMemo(() => {
    switch (range) {
      case "Week":
        return 7;
      case "Month":
        return 6;
      case "6 Months":
        return 9;
      case "Year":
        return 4;
      default:
        return 7;
    }
  }, [range]);

  const filteredData = useMemo(() => getFilteredData(days, data), [days, data]);
  const weights = useMemo(
    () => filteredData.map((item) => item.weight),
    [filteredData]
  );
  const labels = useMemo(
    () => getXLabels(filteredData, maxLabels),
    [filteredData, maxLabels]
  );

  const screenWidth = Dimensions.get("window").width;

  return (
    <View>
      <RNLineChart
        data={{
          labels,
          datasets: [{ data: weights }],
        }}
        width={screenWidth}
        height={300}
        yAxisInterval={1}
        chartConfig={{
          backgroundColor: "white",
          backgroundGradientFrom: "white",
          backgroundGradientTo: "white",
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(208, 91, 25, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: { borderRadius: 16 },
          propsForDots: {
            r: "0", // Remove circles
          },
        }}
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />
    </View>
  );
};

export default WeightChart;
