import axios from "axios";

export const saveFood = async (uid, foodId) => {
  console.log(uid, foodId);
  try {
    const response = await axios.post(
      "http://192.168.31.209:8000/api/v1/food/saveFood",
      {
        uid,
        foodId,
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

export const deletFoodFromSavedFood = async (uid, foodId) => {
  console.log(uid, foodId);
  try {
    const response = await axios.post(
      "http://192.168.31.209:8000/api/v1/food/deleteSavedFood",
      {
        uid,
        foodId,
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

export const getSavedFoodFromBackend = async (uid) => {
  try {
    const response = await axios.get(
      "http://192.168.31.209:8000/api/v1/food/getSavedFood",
      {
        params: {
          uid,
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
