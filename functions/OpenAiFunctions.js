import axios from "axios";
import { BASE_ENDPOINT_URL } from "../Constants";

export const fetchNutritionsFromImage = async (foodImage) => {
  const formData = new FormData();
  if (foodImage) {
    const filename = foodImage?.split("/")?.pop();
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : `image`;
    formData.append("foodImage", { uri: foodImage, name: filename, type });
  }

  try {
    const response = await axios.post(
      `${BASE_ENDPOINT_URL}/api/v1/openAi/imageNutrition`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
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

export const fetchNutritionsFromText = async (foodDetails) => {
  try {
    const response = await axios.post(
      `${BASE_ENDPOINT_URL}/api/v1/openAi/textNutrition`,
      {
        foodDetails,
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

export const fetchExerciseData = async (exerciseDetails) => {
  try {
    const response = await axios.post(
      `${BASE_ENDPOINT_URL}/api/v1/openAi/exercise`,
      {
        exerciseDetails,
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

//deletionIngredient

export const updateIngredientAfterDeletion = async (updatedFoodItem) => {
  try {
    //updateIngredient
    const response = await axios.post(
      `${BASE_ENDPOINT_URL}/api/v1/openAi/deletionIngredient`,
      {
        updatedFoodItem,
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

export const updateIngredient = async (
  originalResponse,
  additionalIngredients
) => {
  try {
    //updateIngredient
    const response = await axios.post(
      `${BASE_ENDPOINT_URL}/api/v1/openAi/updateIngredient`,
      {
        originalResponse,
        additionalIngredients,
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

// export const AddExercise = async (response, ingredient) => {
//   try {
//     const response = await axios.post(
//       "http://192.168.31.209:8000/api/v1/openAi/exercise",
//       {
//         response,
//         ingredient,
//       }
//     );
//     if (response) {
//       return response;
//     } else {
//       return null;
//     }
//   } catch (e) {
//     throw new Error(e);
//   }
// };
