import axios from "axios";
import { startOfWeek, endOfToday, format } from "date-fns";

export const getWeeklyNutritionValues = async (uid) => {
  try {
    const startOfWeekDate = startOfWeek(new Date(), { weekStartsOn: 1 });
    const endOfTodayDate = endOfToday();

    const response = await axios.get(
      "http://192.168.31.209:8000/api/v1/meal/getWeeklyNutritions",
      {
        params: {
          uid,
          startDate: startOfWeekDate.toISOString(),
          endDate: endOfTodayDate.toISOString(),
        },
      }
    );

    if (response && response.data) {
      console.log("WEEKLY RESPINSE IS ==>   ", response.data);
      const formattedData = response.data.data.map((item) => ({
        label: format(new Date(item.date), "EEE"),
        calories: isNaN(item.calories) ? 0 : item?.calories?.toFixed(0),
        protein: isNaN(item.protein)
          ? 0
          : Number.isInteger(item.protein)
          ? item.protein
          : item?.protein?.toFixed(2),
        fats: isNaN(item.fats)
          ? 0
          : Number.isInteger(item.fats)
          ? item.fats
          : item?.fats?.toFixed(2),
        carbs: isNaN(item?.carbs)
          ? 0
          : Number.isInteger(item?.carbs)
          ? item?.carbs
          : item?.carbs?.toFixed(2),
      }));

      console.log(formattedData, "Formatted Nutrition Data");
      return formattedData;
    }
  } catch (e) {
    console.error(e);
    throw new Error(e);
  }
};
