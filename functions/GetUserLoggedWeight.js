import axios from "axios";

export const getUserLoggedWeight = async (uid) => {
  try {
    const response = await axios.get(
      "http://192.168.31.209:8000/api/v1/weight/getUserWeight",
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
