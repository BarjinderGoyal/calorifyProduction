import axios from "axios";

export const fetchExerciseFromDatabase = async (uid, date) => {
  try {
    const response = await axios.get(
      "http://calorify.us-east-1.elasticbeanstalk.com/api/v1/exercise/getExercises",
      {
        params: {
          uid,
          date,
        },
      }
    );

    if (response && response?.data?.data) {
      return response?.data?.data;
    } else {
      return null;
    }
  } catch (e) {
    throw new Error(e);
  }
};
