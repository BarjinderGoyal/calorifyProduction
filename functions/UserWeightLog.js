import axios from "axios";
import { format } from "date-fns";

export const userWeightLog = async (uid, weight, date) => {
  try {
    const response = await axios.post(
      "http://calorify.us-east-1.elasticbeanstalk.com/api/v1/weight/addUserWeight",
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
