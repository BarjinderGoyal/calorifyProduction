import axios from "axios";

export const fetchNutritionsFromImage = async (foodImage) => {
  const formData = new FormData();
  if (foodImage) {
    const filename = foodImage?.split("/")?.pop();
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : `image`;
    formData.append("foodImage", { uri: foodImage, name: filename, type });
  }
  console.log("FORMFORMFORMFOFRMOFMFOFFOMFFOFMFOMFOFFFOFFFMFFOF00", formData);
  try {
    const response = await axios.post(
      "http://192.168.31.209:8000/api/v1/openAi/imageNutrition",
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
      "http://192.168.31.209:8000/api/v1/openAi/textNutrition",
      {
        foodDetails,
      }
    );
    if (response) {
      console.log("response of the openai = > ", response);
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
      "http://192.168.31.209:8000/api/v1/openAi/exercise",
      {
        exerciseDetails,
      }
    );
    if (response) {
      console.log("response of the openai = > ", response);
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
      "http://192.168.31.209:8000/api/v1/openAi/deletionIngredient",
      {
        updatedFoodItem,
      }
    );
    if (response) {
      console.log("response updated of the openai = > ", response);
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
      "http://192.168.31.209:8000/api/v1/openAi/updateIngredient",
      {
        originalResponse,
        additionalIngredients,
      }
    );
    if (response) {
      console.log("response updated of the openai = > ", response);
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
