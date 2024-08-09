import axios from "axios";
import { BASE_ENDPOINT_URL } from "../Constants";

export const getUserFromDatabase = async (uid) => {
  try {
    const response = axios.get(`${BASE_ENDPOINT_URL}/api/v1/user/login`, {
      params: {
        uid,
      },
    });
    if (response) {
      return response;
    } else {
      return null;
    }
  } catch (e) {
    throw new Error(e);
  }
};
