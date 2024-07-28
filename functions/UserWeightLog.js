import axios from "axios";
import { format } from "date-fns";

export const userWeightLog = async (uid, weight, date) => {
  try {
    const response = await axios.post(
      "http://192.168.31.209:8000/api/v1/weight/addUserWeight",
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
