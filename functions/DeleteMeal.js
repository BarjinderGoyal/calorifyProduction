import axios from "axios";

export const deleteFoodFromMeal = async (uid, meal, foodItemId, date) => {
  try {
    const response = await axios.delete(
      "http://calorify.us-east-1.elasticbeanstalk.com/api/v1/meal/deleteMeal",
      {
        params: {
          uid,
          meal,
          foodItemId,
          date,
        },
      }
    );
    if (response) {
      console.log(response);
      return response;
    }
    return null;
  } catch (e) {
    console.log(e, "while deleting food");
    throw new Error(e);
  }
};
