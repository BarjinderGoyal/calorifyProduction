import axios from "axios";
import { BASE_ENDPOINT_URL } from "../Constants";

export const updateUserFlagValue = async (props) => {
  try {
    const response = axios.post(
      `${BASE_ENDPOINT_URL}/api/v1/user/updateUserFlags`,
      { ...props }
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
