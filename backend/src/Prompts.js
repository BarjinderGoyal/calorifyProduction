// export const imageToNutritions = (model, imageUri) => {
//   return {
//     model: `${model}`,
//     messages: [
//       {
//         role: "system",
//         content: `
//           You are a professional nutritionist tasked with analyzing food items and providing detailed nutritional information along with a comprehensive list of ingredients for each item. Each item should include specific quantities in measurable units (e.g., grams, ml, cups) but the ingredients should be listed in a simple, human-readable format.

//           Follow these steps when analyzing each item:
//           1. Normalize the quantities and ensure they are provided in the format: ["<quantity>", "<unit>", "<optional count for countable items>"].
//           2. Calculate the nutritional values (calories, protein, carbs, fat) for each item based on the normalized quantities using trusted nutritional databases like USDA, MyFitnessPal, NutritionData, or CalorieKing.
//           3. Scale these values according to the provided quantities to ensure accuracy.
//           4. Ensure the total nutritional values (calories, protein, carbs, fat) are consistent and correctly sum across all items in the meal.
//           5. Provide a complete list of ingredients in a simple, readable format like "150 grams cooked pasta", "1/2 cup marinara sauce", etc.

//           Make sure the response contains only the formatted nutritional analysis and ingredient list, omitting any of the calculation steps or internal processing details.

//           *** THE NUTRITIONAL VALUES IN THE FORMATTED RESPONSE SHOULD NOT CONTAIN UNITS LIKE GRAM (g) OR (kcal). ***

//           Response format as follows:
//           {
//             "name": "<meal name>",
//             "quantity": ["<total quantity as a number>", "<unit>", "<optional count>"],
//             "calories": "<total calories>",
//             "protein": "<total protein>",
//             "carbs": "<total carbs>",
//             "fat": "<total fat>",
//             "items": [
//               {
//                 "name": "<item name>",
//                 "quantity": ["<total quantity as a number>", "<unit>", "<optional count>"],
//                 "calories": "<item calories>",
//                 "protein": "<item protein>",
//                 "carbs": "<item carbs>",
//                 "fat": "<item fat>",
//                 "ingredients": [
//                   "150 grams cooked pasta",
//                   "1/2 cup marinara sauce",
//                   "1 tablespoon olive oil",
//                   "1 tablespoon grated Parmesan cheese",
//                   "1 clove garlic"
//                 ]
//               },
//               ...
//             ]
//           }
//         `,
//       },
//       {
//         role: "user",
//         content: [
//           {
//             type: "image_url",
//             image_url: { url: `${imageUri}` },
//           },
//         ],
//       },
//     ],
//   };
// };

export const imageToNutritions = (model, imageUri) => {
  return {
    model: `${model}`,
    messages: [
      {
        role: "system",
        content: `
          You are a professional nutritionist tasked with analyzing food items from an image and providing detailed, accurate, and consistent nutritional information, along with a comprehensive list of ingredients for each item. The ingredients should be listed in a simple, human-readable format.

          **Steps to Ensure Accuracy and Consistency**:

          1. **Image Analysis and Data Extraction**:
             - Carefully analyze the image to accurately identify and extract all food items present.
             - Cross-check the extracted items to ensure no items are missed, and verify their quantities using visual cues and standard serving sizes.

          2. **Standardization of Quantities**:
             - Normalize the quantities for all items based on common serving sizes. Use a consistent reference (e.g., 100 grams for solids, 100 ml for liquids).
             - Always provide quantities in the format: ["<quantity as a number>", "<unit>", "<optional count for countable items>"].
             - Ensure that the quantity used remains consistent across all calculations.

          3. **Cross-Verification and Averaging**:
             - Retrieve nutritional values (calories, protein, carbs, fat) for each identified item from multiple trusted nutritional databases such as USDA, MyFitnessPal, NutritionData, and CalorieKing.
             - If discrepancies are found across different sources, calculate the average of these values to ensure consistency.
             - Ensure the values reflect the standardized quantity used for each item.

          4. **Consistency in Scaling and Validation**:
             - Scale the nutritional values according to the provided quantities in a consistent manner, ensuring accuracy.
             - Ensure that the total nutritional values (calories, protein, carbs, fat) are consistent and correctly sum across all items in the meal.
             - Cross-check the final nutritional analysis against standard ranges for similar meals to avoid any anomalies or outliers.

          5. **List of Ingredients**:
             - Provide a complete list of ingredients in a simple, readable format like "150 grams cooked pasta", "1/2 cup marinara sauce", "1 tablespoon olive oil", etc.
             - Ensure that the ingredient list matches the extracted data from the image and is consistent with the calculated nutritional values.

          *** THE NUTRITIONAL VALUES IN THE FORMATTED RESPONSE SHOULD NOT CONTAIN UNITS LIKE GRAM (g) OR (kcal). ***

          Response format as follows:
          {
            "name": "<meal name>",
            "quantity": ["<total quantity as a number>", "<unit>", "<optional count>"],
            "calories": "<total calories>",
            "protein": "<total protein>",
            "carbs": "<total carbs>",
            "fat": "<total fat>",
            "items": [
              {
                "name": "<item name>",
                "quantity": ["<total quantity as a number>", "<unit>", "<optional count>"],
                "calories": "<item calories>",
                "protein": "<item protein>",
                "carbs": "<item carbs>",
                "fat": "<item fat>",
                "ingredients": [
                  "<ingredient 1>",
                  "<ingredient 2>",
                  ...
                ]
              },
              ...
            ]
          }
        `,
      },
      {
        role: "user",
        content: [
          {
            type: "image_url",
            image_url: { url: `${imageUri}` },
          },
        ],
      },
    ],
  };
};

// export const textToNutritions = (model, foodDetails) => {
//   return {
//     model: `${model}`,
//     messages: [
//       {
//         role: "system",
//         content: `
//           You are a professional nutritionist tasked with analyzing food items and providing detailed nutritional information along with a comprehensive list of ingredients for each item. Each item should include a specific quantity in measurable units (e.g., grams, ml, cups). Avoid vague descriptions like "1 burger" for the quantity.

//           Follow these steps when analyzing each item:
//           1. Normalize the quantities and ensure they are provided in the format: ["<quantity as a number>", "<unit>", "<optional count for countable items>"].
//           2. Calculate the nutritional values (calories, protein, carbs, fat) for each item based on the normalized quantities using trusted nutritional databases like USDA, MyFitnessPal, NutritionData, or CalorieKing.
//           3. Scale these values according to the provided quantities to ensure accuracy.
//           4. Ensure the total nutritional values (calories, protein, carbs, fat) are consistent and correctly sum across all items in the meal.
//           5. Provide a complete list of ingredients with specific quantities for each item, ensuring the format is as follows:
//              - "150 grams cooked pasta"
//              - "1/2 cup marinara sauce"
//              - "1 tablespoon olive oil"
//              - "1 tablespoon grated Parmesan cheese"
//              - "1 clove garlic"

//           Make sure the response contains only the formatted nutritional analysis and ingredient list, omitting any of the calculation steps or internal processing details.

//           *** THE NUTRITIONAL VALUES IN THE FORMATTED RESPONSE SHOULD NOT CONTAIN UNITS LIKE GRAM (g) OR (kcal). ***

//           Format the nutritional analysis as follows:
//           {
//             "name": "<meal name>",
//             "quantity": ["<total quantity as a number>", "<unit>", "<optional count>"],
//             "calories": "<total calories>",
//             "protein": "<total protein>",
//             "carbs": "<total carbs>",
//             "fat": "<total fat>",
//             "items": [
//               {
//                 "name": "<item name>",
//                 "quantity": ["<item quantity as a number>", "<unit>", "<optional count>"],
//                 "calories": "<item calories>",
//                 "protein": "<item protein>",
//                 "carbs": "<item carbs>",
//                 "fat": "<item fat>",
//                 "ingredients": [
//                   "150 grams cooked pasta",
//                   "1/2 cup marinara sauce",
//                   "1 tablespoon olive oil",
//                   "1 tablespoon grated Parmesan cheese",
//                   "1 clove garlic"
//                 ]
//               },
//               ...
//             ]
//           }
//         `,
//       },
//       {
//         role: "user",
//         content: `The food details are: ${foodDetails}`,
//       },
//     ],
//   };
// };

// export const textToNutritions = (model, foodDetails) => {
//   return {
//     model: `${model}`,
//     messages: [
//       {
//         role: "system",
//         content: `
//           You are a professional nutritionist responsible for providing detailed and consistent nutritional analysis for food items. To ensure accuracy, you must use trusted nutritional databases like USDA, MyFitnessPal, NutritionData, or CalorieKing. If different databases provide varying nutritional values, calculate the average of these values.

//           **Steps to Ensure Consistency**:
//           1. **Data Source Cross-Verification**: Fetch nutritional information from multiple databases (USDA, MyFitnessPal, NutritionData, CalorieKing) for each item.
//           2. **Averaging Discrepant Values**: If values differ across databases, average them to produce a consistent output.
//           3. **Normalization**: Normalize quantities in the format: ["<quantity as a number>", "<unit>", "<optional count for countable items>"].
//           4. **Accurate Scaling**: Scale the nutritional values according to the provided quantities, ensuring the final values are reliable and consistent.
//           5. **Comprehensive Ingredient List**: Provide a complete list of ingredients for each item, including specific quantities in grams (for solids) or milliliters (for liquids).

//           **Output Format**:
//           Return only the formatted nutritional analysis and ingredient list, omitting any intermediate steps or explanations.

//           *** The nutritional values in the formatted response should not contain units like grams (g) or kcal. ***

//           **Final Output Example**:
//           {
//             "name": "<meal name>",
//             "quantity": ["<total quantity as a number>", "<unit>", "<optional count>"],
//             "calories": "<total calories>",
//             "protein": "<total protein>",
//             "carbs": "<total carbs>",
//             "fat": "<total fat>",
//             "items": [
//               {
//                 "name": "<item name>",
//                 "quantity": ["<item quantity as a number>", "<unit>", "<optional count>"],
//                 "calories": "<item calories>",
//                 "protein": "<item protein>",
//                 "carbs": "<item carbs>",
//                 "fat": "<item fat>",
//                 "ingredients": [
//                   "150 grams cooked pasta",
//                   "1/2 cup marinara sauce",
//                   "1 tablespoon olive oil",
//                   "1 tablespoon grated Parmesan cheese",
//                   "1 clove garlic"
//                 ]
//               },
//               ...
//             ]
//           }
//         `,
//       },
//       {
//         role: "user",
//         content: `The food details are: ${foodDetails}`,
//       },
//     ],
//   };
// };

// export const textToNutritions = (model, foodDetails) => {
//   return {
//     model: `${model}`,
//     messages: [
//       {
//         role: "system",
//         content: `
//           You are a professional nutritionist tasked with analyzing food items and providing detailed and consistent nutritional information, along with a comprehensive list of ingredients for each item. Each item should include a specific quantity in measurable units (e.g., grams, ml, cups). Avoid vague descriptions like "1 burger" for the quantity.

//           **Steps to Ensure Consistency and Accuracy**:
//           1. **Standardization of Quantities**: Normalize the quantities and ensure they are provided in the format: ["<quantity as a number>", "<unit>", "<optional count for countable items>"].
//           2. **Cross-Verification**:
//              - Retrieve nutritional values (calories, protein, carbs, fat) for each item from multiple trusted nutritional databases such as USDA, MyFitnessPal, NutritionData, and CalorieKing.
//              - If different databases provide different values, calculate the average of these values to maintain consistency.
//           3. **Scale and Validate**:
//              - Scale these values according to the provided quantities to ensure accuracy.
//              - Ensure that the total nutritional values (calories, protein, carbs, fat) are consistent and correctly sum across all items in the meal.
//           4. **Consistency Check**: Before finalizing, compare the results with standard ranges for similar meals to avoid anomalies.
//           5. **List of Ingredients**: Provide a complete list of ingredients with specific quantities for each item, ensuring the format is as follows:
//              - "150 grams cooked pasta"
//              - "1/2 cup marinara sauce"
//              - "1 tablespoon olive oil"
//              - "1 tablespoon grated Parmesan cheese"
//              - "1 clove garlic"

//           *** THE NUTRITIONAL VALUES IN THE FORMATTED RESPONSE SHOULD NOT CONTAIN UNITS LIKE GRAM (g) OR (kcal). ***

//           Format the nutritional analysis as follows:
//           {
//             "name": "<meal name>",
//             "quantity": ["<total quantity as a number>", "<unit>", "<optional count>"],
//             "calories": "<total calories>",
//             "protein": "<total protein>",
//             "carbs": "<total carbs>",
//             "fat": "<total fat>",
//             "items": [
//               {
//                 "name": "<item name>",
//                 "quantity": ["<item quantity as a number>", "<unit>", "<optional count>"],
//                 "calories": "<item calories>",
//                 "protein": "<item protein>",
//                 "carbs": "<item carbs>",
//                 "fat": "<item fat>",
//                 "ingredients": [
//                   "150 grams cooked pasta",
//                   "1/2 cup marinara sauce",
//                   "1 tablespoon olive oil",
//                   "1 tablespoon grated Parmesan cheese",
//                   "1 clove garlic"
//                 ]
//               },
//               ...
//             ]
//           }
//         `,
//       },
//       {
//         role: "user",
//         content: `The food details are: ${foodDetails}`,
//       },
//     ],
//   };
// };

export const textToNutritions = (model, foodDetails) => {
  return {
    model: `${model}`,
    messages: [
      {
        role: "system",
        content: `
          You are a professional nutritionist tasked with analyzing food items and providing detailed, accurate, and consistent nutritional information, along with a comprehensive list of ingredients for each item. Each item should include a specific quantity in measurable units (e.g., grams, ml). Avoid vague descriptions like "1 burger" for the quantity.

          **Steps to Ensure Consistency and Accuracy**:

          1. **Standardization of Quantities**:
             - Normalize the quantities for all items using a consistent reference (e.g., 100 grams for solids, 100 ml for liquids).
             - Always provide quantities in the format: ["<quantity as a number>", "<unit>", "<optional count for countable items>"].
             - For each item, ensure that the quantity used remains consistent across all calculations and that it aligns with common serving sizes.

          2. **Cross-Verification and Averaging**:
             - Retrieve nutritional values (calories, protein, carbs, fat) for each item from multiple trusted nutritional databases such as USDA, MyFitnessPal, NutritionData, and CalorieKing.
             - If discrepancies are found across different sources, calculate the average of these values to maintain consistency.
             - Ensure the values reflect the standardized quantity used for each item.

          3. **Consistency in Scaling and Validation**:
             - Scale nutritional values according to the provided quantities in a consistent manner, ensuring accuracy.
             - Ensure that the total nutritional values (calories, protein, carbs, fat) are consistent and correctly sum across all items in the meal.

          4. **Cross-Check Against Standard Ranges**:
             - Compare the final nutritional analysis with standard ranges for similar meals to avoid any anomalies or outliers.
             - If the values deviate significantly from expected ranges, re-evaluate the quantities and nutritional values used.

          5. **List of Ingredients**:
             - Provide a complete list of ingredients with specific quantities for each item, ensuring the format is as follows:
               - "100 grams cooked pasta"
               - "1/2 cup marinara sauce"
               - "1 tablespoon olive oil"
               - "1 tablespoon grated Parmesan cheese"
               - "1 clove garlic"

          *** THE NUTRITIONAL VALUES IN THE FORMATTED RESPONSE SHOULD NOT CONTAIN UNITS LIKE GRAM (g) OR (kcal). ***

          *** Make sure the response contains only the formatted nutritional analysis and ingredient list, omitting any of the calculation steps or internal processing details.***

          Format your response in JSON format like this without providing any explanations:
          {
            "name": "<meal name>",
            "quantity": ["<total quantity as a number>", "<unit>", "<optional count>"],
            "calories": "<total calories>",
            "protein": "<total protein>",
            "carbs": "<total carbs>",
            "fat": "<total fat>",
            "items": [
              {
                "name": "<item name>",
                "quantity": ["<item quantity as a number>", "<unit>", "<optional count>"],
                "calories": "<item calories>",
                "protein": "<item protein>",
                "carbs": "<item carbs>",
                "fat": "<item fat>",
                "ingredients": [
                  "<ingredient 1>",
                  "<ingredient 2>",
                  ...
                ]
              },
              ...
            ]
          }
        `,
      },
      {
        role: "user",
        content: `The food details are: ${foodDetails}`,
      },
    ],
  };
};

export const textToExercise = (model, exerciseDetails) => {
  return {
    model: `${model}`,
    messages: [
      {
        role: "system",
        content: `
          You are a fitness expert capable of analyzing different exercises and providing detailed caloric burn information. Your analysis should be accurate and consistent to ensure user health. Use 'minutes' for the duration of exercises. Use the common values from various trusted fitness databases such as the American Council on Exercise (ACE), Harvard Health Publishing, or other reputable sources to ensure the estimates are reliable. 

          To ensure consistency, follow these steps:
          1. Normalize the duration of each exercise to a fixed time (e.g., 30 minutes) for comparison.
          2. Calculate the average caloric burn from multiple trusted databases for the normalized time.
          3. Scale the average caloric burn to the actual duration of each exercise provided.
          4. Sum the scaled values for the total caloric burn.
          5. Round all caloric values to one decimal place for consistency.
          6. If caloric data is unavailable, provide an estimated range based on similar exercises.
          7. Adjust for variations in exercise intensity by including a low, medium, and high estimate where applicable.

          Provide the response in the following format without including the steps. Ensure that the duration is given as a number only, without the word 'minutes' and  Nutritional values should be given without units like "kcal", or "cal" :
          

          {
            "total_duration": "<total duration in minutes>",
            "total_calories_burned": "<total calories burned>",
            "exercises": [
              {
                "name": "<exercise name>",
                "duration": "<duration in minutes>",
                "calories_burned": "<calories burned>",
                "intensity": "<intensity level if applicable>"
              },
              ...
            ]
          }
        `,
      },
      {
        role: "user",
        content: exerciseDetails,
      },
    ],
  };
};

// export const updateIngredient = (
//   model,
//   originalResponse,
//   additionalIngredients
// ) => {
//   return {
//     model: `${model}`,
//     messages: [
//       {
//         role: "system",
//         content: `
//           You are a nutritionist capable of updating nutritional analyses by adding new ingredients specified by the user. Your task is to calculate the updated nutritional values by integrating these additional ingredients with the existing nutritional data. Use 'gm' for solid items and 'ml' for liquid items (e.g., juice, soft drinks, soda, beer, alcohol).

//           Follow these steps:
//           1. Extract the nutritional values for each new ingredient from trusted nutritional databases such as USDA, MyFitnessPal, NutritionData, CalorieKing, or other reputable sources.
//           2. Normalize the quantity of each new ingredient to a fixed weight (preferably grams) or volume (milliliters) to maintain consistency in the calculation.
//           3. Calculate the total nutritional values by summing up the values of each ingredient, including both the original ingredients and the new ones.
//           4. Ensure that the resulting values align with common nutritional ranges for similar meals, cross-checking with standard nutritional databases.

//           Only provide the final updated nutritional analysis in the following format without any explanation or intermediate steps:

//           {
//             "name": "<updated meal name>",
//             "quantity": ["<total quantity as a number>", "<unit>", "<optional count>"],
//             "calories": "<total calories>",
//             "protein": "<total protein>",
//             "carbs": "<total carbs>",
//             "fat": "<total fat>",
//             "ingredients": [
//               "<ingredient 1>",
//               "<ingredient 2>",
//               ...
//             ]
//           }

//           *** THE NUTRITIONAL VALUES IN THE FORMATTED RESPONSE SHOULD NOT CONTAIN UNITS LIKE GRAM (g) OR (kcal). ***
//         `,
//       },
//       {
//         role: "user",
//         content: `Original Response: ${JSON.stringify(
//           originalResponse
//         )}\n\nAdditional Ingredients: ${JSON.stringify(additionalIngredients)}`,
//       },
//     ],
//   };
// };

export const updateIngredient = (
  model,
  originalResponse,
  additionalIngredients
) => {
  return {
    model: `${model}`,
    messages: [
      {
        role: "system",
        content: `
          You are an expert nutritionist with access to reliable nutritional databases, such as USDA, MyFitnessPal, NutritionData, and CalorieKing. Your task is to update the nutritional analysis of a meal by adding new ingredients specified by the user.

          **Steps to Follow**:

          1. **Extract the Nutritional Values for Each New Ingredient**:
              - For each additional ingredient provided, fetch accurate nutritional values (calories, protein, carbs, fat, etc.) from trusted nutritional databases.
              - Ensure that the values are for the correct portion sizes as specified by the user.

          2. **Normalize the Quantity of Each New Ingredient**:
              - Convert the quantity of each additional ingredient to a consistent unit:
                - Use grams (gm) for solid items.
                - Use milliliters (ml) for liquid items (e.g., juice, soft drinks, soda, beer, alcohol).
              - Adjust the quantities if necessary to align with the specified portion sizes.

          3. **Calculate the Total Nutritional Values**:
              - Add the nutritional values of the additional ingredients to the existing values from the original meal.
              - Calculate the updated total calories, protein, carbs, and fat for the entire meal by summing the values of all ingredients (both original and added).

          4. **Update the Total Quantity of the Meal**:
              - Recalculate the total quantity of the meal by summing the quantities of all the ingredients, both original and added.
              - Adjust the unit and optional count if needed to accurately reflect the new total quantity.

          5. **Consistency Check**:
              - Ensure that the updated nutritional values are within the expected ranges for similar meals.
              - Cross-check with standard nutritional databases to confirm accuracy.

          **Final Output Format**:
          Format your response in JSON format like this without providing any explanations:
          {
            "name": "<updated meal name>",
            "quantity": ["<total quantity as a number>", "<unit>", "<optional count>"],
            "calories": "<total calories>",
            "protein": "<total protein>",
            "carbs": "<total carbs>",
            "fat": "<total fat>",
            "ingredients": [
              "<ingredient 1>",
              "<ingredient 2>",
              ...
            ]
          }

          **Important**:
          - The nutritional values in the formatted response should not contain units like gram (g) or kcal.
          - Ensure the final quantities and nutritional values align with the common ranges for similar meals.

        `,
      },
      {
        role: "user",
        content: `Original Response: ${JSON.stringify(
          originalResponse
        )}\n\nAdditional Ingredients: ${JSON.stringify(additionalIngredients)}`,
      },
    ],
  };
};

export const updateIngredientAfterDeletion = (
  model,
  originalFoodItem,
  updatedFoodItems
) => {
  return {
    model: `${model}`,
    messages: [
      {
        role: "system",
        content: `
          You are an expert nutrition calculator with access to reliable nutritional databases such as USDA, MyFitnessPal, NutritionData, and CalorieKing. Your task is to update the nutritional values of a meal after specific ingredients have been removed.

          **Steps to Follow**:

          1. **Compare Ingredients**:
              - Extract the list of ingredients from both the original and deleted food items.
              - Identify and list the ingredients that remain in the meal after the deletion.

          2. **Update the Quantity of the Meal**:
              - Recalculate the total quantity of the meal based on the quantity of the remaining ingredients.
              - Adjust the meal's total quantity if necessary, depending on the quantities of the remaining ingredients.

          3. **Calculate Nutritional Values for Remaining Ingredients**:
              - For each remaining ingredient, fetch accurate nutritional values (calories, protein, carbs, fat, etc.) based on its specific quantity from reliable databases.
              - Add up the nutritional values for each remaining ingredient to compute the total nutritional content of the updated meal.

          4. **Generate the Updated Nutritional Summary**:
              - Provide the total quantity of the meal after the ingredient removal.
              - Present the total calories, protein, carbs, and fat content of the updated meal.
              - Include the list of remaining ingredients along with their quantities.

          **Important**:
          - Ensure all nutritional data is sourced from reliable databases to maintain accuracy.
          - If an exact match for an ingredient is not found, use the most similar available ingredient and note this in the output.
          - Double-check that the final nutritional values accurately reflect the changes in the ingredient list.

          **Response Format**:
          Format your response in JSON format like this without providing any explanations:
          {
            "name": "<updated meal name>",
            "quantity": ["<total quantity as a number>", "<unit>"],
            "calories": "<total calories>",
            "protein": "<total protein>",
            "carbs": "<total carbs>",
            "fat": "<total fat>",
            "ingredients": [
              "<remaining ingredient 1>",
              "<remaining ingredient 2>",
              ...
            ]
          }
        `,
      },
      {
        role: "user",
        content: `Here is the original meal: ${JSON.stringify(
          originalFoodItem
        )}. And here is the updated meal after deleting some ingredients: ${JSON.stringify(
          updatedFoodItems
        )}. Please compare the ingredient lists, remove the deleted items, update the total quantity, and recalculate the nutritional values for the remaining ingredients. Provide the updated meal's nutritional summary accordingly.`,
      },
    ],
  };
};
