import axios from "axios";
import { BASE_ENDPOINT_URL } from "../../Constants";

export const updateUserCalories = async (uid, calories) => {
  try {
    if (!uid || !calories) {
      return;
    }
    const response = await axios.post(
      `${BASE_ENDPOINT_URL}/api/v1/user/updateCalories`,
      {
        uid,
        calories,
      }
    );
    if (response?.data?.data) {
      return response?.data?.data;
    } else {
      return null;
    }
  } catch (e) {
    throw new Error(e);
  }
};
