import axios from "axios";
import { BASE_ENDPOINT_URL } from "../../Constants";

export const updateUserAge = async (uid, age, calories) => {
  try {
    if (!uid || !age || !calories) {
      return;
    }
    const response = await axios.post(
      `${BASE_ENDPOINT_URL}/api/v1/user/updateAge`,
      {
        uid,
        age,
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
