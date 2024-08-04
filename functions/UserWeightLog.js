import axios from "axios";
import { format } from "date-fns";
import { BASE_ENDPOINT_URL } from "../Constants";

export const userWeightLog = async (uid, weight, date) => {
  try {
    const response = await axios.post(
      `${BASE_ENDPOINT_URL}/api/v1/weight/addUserWeight`,
      {
        uid,
        weight,
        date,
      }
    );
    if (response) {
      return response;
    } else {
      return null;
    }
  } catch (e) {
    throw new Error(e);
  }
};
