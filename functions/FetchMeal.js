import axios from "axios";
import { BASE_ENDPOINT_URL } from "../Constants";

export const fetchMeal = async (uid, date) => {
  try {
    const response = await axios.get(
      `${BASE_ENDPOINT_URL}/api/v1/meal/getMeal`,
      {
        params: {
          uid,
          date,
        },
      }
    );
    if (response && response?.data?.data) {
      return response?.data?.data;
    }
    return null;
  } catch (e) {
    throw new Error(e);
  }
};
