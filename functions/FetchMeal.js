import axios from "axios";

export const fetchMeal = async (uid, date) => {
  try {
    const response = await axios.get(
      "http://192.168.31.209:8000/api/v1/meal/getMeal",
      {
        params: {
          uid,
          date,
        },
      }
    );
    if (response && response?.data?.data) {
      return response?.data?.data;
    }
    return null;
  } catch (e) {
    throw new Error(e);
  }
};
