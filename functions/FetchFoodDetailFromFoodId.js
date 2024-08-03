import axios from "axios";

export const fetchFoodDetailFromFoodId = async (foodId) => {
  try {
    const response = await axios.get(
      "http://calorify.us-east-1.elasticbeanstalk.com/api/v1/meal/getSavedFoodDetail",
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
