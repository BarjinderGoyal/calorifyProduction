import axios from "axios";
import { BASE_ENDPOINT_URL } from "../Constants";

export const logFood = async (uid, meal, mealData, foodImage) => {
  const date = getTodayDate();
  console.log(meal, mealData, date, foodImage);
  try {
    const response = await axios.post(
      `${BASE_ENDPOINT_URL}/api/v1/meal/addMeal`,
      {
        uid,
        meal,
        date,
        mealData,
        foodImage,
      }
    );
    if (response && response?.data?.data) {
      return response?.data?.data;
    }
  } catch (e) {
    console.error(e);
    throw new Error(e);
  }
};

function getTodayDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
