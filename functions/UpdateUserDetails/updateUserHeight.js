import axios from "axios";
import { BASE_ENDPOINT_URL } from "../../Constants";

export const updateUserHeight = async (uid, height, calories) => {
  try {
    if (!uid || !height || !calories) {
      return;
    }
    const response = await axios.post(
      `${BASE_ENDPOINT_URL}/api/v1/user/updateHeight`,
      { uid, height, calories }
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
