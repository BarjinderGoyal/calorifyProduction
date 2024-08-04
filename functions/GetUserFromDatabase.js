import axios from "axios";
import { BASE_ENDPOINT_URL } from "../Constants";

export const getUserFromDatabase = async (uid) => {
  console.log("UID", uid)
  try {
    const response = await axios.get(
      `${BASE_ENDPOINT_URL}/api/v1/user/login`,
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
    console.log("ERROR", e.response.data, e.response.status)
    throw new Error(e);
  }
};
