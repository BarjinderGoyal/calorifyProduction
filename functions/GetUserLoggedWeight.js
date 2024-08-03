import axios from "axios";

export const getUserLoggedWeight = async (uid) => {
  try {
    const response = await axios.get(
      "http://calorify.us-east-1.elasticbeanstalk.com/api/v1/weight/getUserWeight",
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
