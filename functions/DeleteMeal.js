import axios from "axios";
import { BASE_ENDPOINT_URL } from "../Constants";

export const deleteFoodFromMeal = async (uid, meal, foodItemId, date) => {
  try {
    const response = await axios.delete(
      `${BASE_ENDPOINT_URL}/api/v1/meal/deleteMeal`,
      {
        params: {
          uid,
          meal,
          foodItemId,
          date,
        },
      }
    );
    if (response) {
      console.log(response);
      return response;
    }
    return null;
  } catch (e) {
    console.log(e, "while deleting food");
    throw new Error(e);
  }
};
