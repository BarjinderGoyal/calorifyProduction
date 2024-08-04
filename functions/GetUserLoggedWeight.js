import axios from "axios";
import { BASE_ENDPOINT_URL } from "../Constants";

export const getUserLoggedWeight = async (uid) => {
  try {
    const response = await axios.get(
      `${BASE_ENDPOINT_URL}/api/v1/weight/getUserWeight`,
      {
        params: {
          uid,
        },
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
