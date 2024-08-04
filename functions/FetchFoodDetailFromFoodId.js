import axios from "axios";
import { BASE_ENDPOINT_URL } from "../Constants";

export const fetchFoodDetailFromFoodId = async (foodId) => {
  try {
    const response = await axios.get(
      `${BASE_ENDPOINT_URL}/api/v1/meal/getSavedFoodDetail`,
      {
        params: {
          foodId,
        },
      }
    );
    console.log(
      "fetched food from foodIdiddididdidididididididiidididididididi",
      response,
      "    ",
      response?.data?.data
    );
    if (response?.data?.data) {
      return response?.data?.data;
    } else {
      return {};
    }
  } catch (e) {
    throw new Error(e);
  }
};
