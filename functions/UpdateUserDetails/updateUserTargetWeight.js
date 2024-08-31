import axios from "axios";
import { BASE_ENDPOINT_URL } from "../../Constants";

export const updateUserTargetWeight = async (uid, weight) => {
  try {
    console.log("wwwwwwwwwwwwwwwwwwwwwwwwwwwwwww", uid, weight);
    if (!uid || !weight) {
      return;
    }
    const response = await axios.post(
      `${BASE_ENDPOINT_URL}/api/v1/user/updateTargetWeight`,
      { uid, weight }
    );
    console.log(
      "respoeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
      response?.data?.data
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
