import axios from "axios";

export const getUserFromDatabase = async (uid) => {
  try {
    const response = axios.get("http://192.168.31.209:8000/api/v1/user/login", {
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
