import axios from "axios";

export const getUserFromDatabase = async (uid) => {
  try {
    const response = axios.get(
      "http://calorify.us-east-1.elasticbeanstalk.com/api/v1/user/login",
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
