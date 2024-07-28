// const express = require("express");
// const axios = require("axios");
// const bodyParser = require("body-parser");

// const app = express();
// const PORT = process.env.PORT || 3000;

// app.use(bodyParser.json());

// const API_KEY = "324a3ffd431d489aa4fb29c2beab0df3";
// const API_SECRET = "fef36730f6b74dcfa618b3175c7f35a7";
// const TOKEN_URL = "https://oauth.fatsecret.com/connect/token";
// const BASE_URL = "https://platform.fatsecret.com/rest/server.api";

// let accessToken = null;

// const getToken = async () => {
//   const params = new URLSearchParams();
//   params.append("grant_type", "client_credentials");
//   params.append("client_id", API_KEY);
//   params.append("client_secret", API_SECRET);

//   try {
//     const response = await axios.post(TOKEN_URL, params, {
//       headers: {
//         "Content-Type": "application/x-www-form-urlencoded",
//       },
//     });
//     accessToken = response.data.access_token;
//   } catch (error) {
//     console.error("Error fetching token:", error);
//   }
// };

// app.use(async (req, res, next) => {
//   if (!accessToken) {
//     await getToken();
//   }
//   next();
// });

// app.get("/foods/search", async (req, res) => {
//   const { query } = req.query;

//   try {
//     const response = await axios.get(BASE_URL, {
//       params: {
//         method: "foods.search",
//         format: "json",
//         search_expression: query,
//       },
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     });
//     res.json(response.data);
//   } catch (error) {
//     console.error("Error fetching food data:", error);
//     res.status(500).send("Internal Server Error");
//   }
// });

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

// const express = require("express");
// const axios = require("axios");
// const bodyParser = require("body-parser");

// const app = express();
// const PORT = process.env.PORT || 3000;

// app.use(bodyParser.json());

// const API_KEY = "324a3ffd431d489aa4fb29c2beab0df3";
// const API_SECRET = "fef36730f6b74dcfa618b3175c7f35a7";
// const TOKEN_URL = "https://oauth.fatsecret.com/connect/token";
// const BASE_URL = "https://platform.fatsecret.com/rest/server.api";

// let accessToken = null;

// // Function to get a new access token
// const getToken = async () => {
//   const params = new URLSearchParams();
//   params.append("grant_type", "client_credentials");
//   params.append("client_id", API_KEY);
//   params.append("client_secret", API_SECRET);

//   try {
//     const response = await axios.post(TOKEN_URL, params, {
//       headers: {
//         "Content-Type": "application/x-www-form-urlencoded",
//       },
//     });
//     accessToken = response.data.access_token;
//   } catch (error) {
//     console.error("Error fetching token:", error);
//   }
// };

// // Middleware to ensure we have a valid access token
// app.use(async (req, res, next) => {
//   if (!accessToken) {
//     await getToken();
//   }
//   next();
// });

// // Generic function to call FatSecret APIs
// const callFatSecretApi = async (params) => {
//   try {
//     const response = await axios.get(BASE_URL, {
//       params: {
//         ...params,
//         format: "json",
//       },
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Error calling FatSecret API:", error);
//     throw error;
//   }
// };

// // Endpoint to search for foods
// app.get("/foods/search", async (req, res) => {
//   const { query } = req.query;

//   try {
//     const data = await callFatSecretApi({
//       method: "foods.search",
//       search_expression: query,
//     });
//     res.json(data);
//   } catch (error) {
//     res.status(500).send("Internal Server Error");
//   }
// });

// // Endpoint to autocomplete food search
// app.get("/foods/autocomplete", async (req, res) => {
//   const { query } = req.query;

//   try {
//     const data = await callFatSecretApi({
//       method: "foods.autocomplete",
//       expression: query,
//     });
//     res.json(data);
//   } catch (error) {
//     res.status(500).send("Internal Server Error");
//   }
// });

// // Endpoint to search for food by barcode
// app.get("/foods/barcode", async (req, res) => {
//   const { barcode } = req.query;

//   try {
//     const data = await callFatSecretApi({
//       method: "food.find_id_for_barcode",
//       barcode: barcode,
//     });
//     res.json(data);
//   } catch (error) {
//     res.status(500).send("Internal Server Error");
//   }
// });

// // Example: Endpoint to get food by ID
// app.get("/food", async (req, res) => {
//   const { food_id } = req.query;

//   try {
//     const data = await callFatSecretApi({
//       method: "food.get",
//       food_id: food_id,
//     });
//     res.json(data);
//   } catch (error) {
//     res.status(500).send("Internal Server Error");
//   }
// });

// // Example: Endpoint to get exercises
// app.get("/exercises", async (req, res) => {
//   try {
//     const data = await callFatSecretApi({
//       method: "exercises.get",
//     });
//     res.json(data);
//   } catch (error) {
//     res.status(500).send("Internal Server Error");
//   }
// });

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

// const express = require("express");
// const axios = require("axios");
// const bodyParser = require("body-parser");

// const app = express();
// const PORT = process.env.PORT || 3000;

// app.use(bodyParser.json());

// const API_KEY = "324a3ffd431d489aa4fb29c2beab0df3";
// const API_SECRET = "fef36730f6b74dcfa618b3175c7f35a7";
// const TOKEN_URL = "https://oauth.fatsecret.com/connect/token";
// const BASE_URL = "https://platform.fatsecret.com/rest/server.api";

// let accessToken = null;

// const getToken = async () => {
//   const params = new URLSearchParams();
//   params.append("grant_type", "client_credentials");
//   params.append("client_id", API_KEY);
//   params.append("client_secret", API_SECRET);

//   try {
//     const response = await axios.post(TOKEN_URL, params, {
//       headers: {
//         "Content-Type": "application/x-www-form-urlencoded",
//       },
//     });
//     accessToken = response.data.access_token;
//   } catch (error) {
//     console.error("Error fetching token:", error);
//   }
// };

// app.use(async (req, res, next) => {
//   if (!accessToken) {
//     await getToken();
//   }
//   next();
// });

// app.get("/foods/search", async (req, res) => {
//   const { query } = req.query;

//   try {
//     const response = await axios.get(BASE_URL, {
//       params: {
//         method: "foods.search",
//         format: "json",
//         search_expression: query,
//       },
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     });
//     res.json(response.data);
//   } catch (error) {
//     console.error("Error fetching food data:", error);
//     res.status(500).send("Internal Server Error");
//   }
// });

// app.get("/foods/autocomplete", async (req, res) => {
//   const { expression } = req.query;

//   try {
//     const response = await axios.get(BASE_URL, {
//       params: {
//         method: "foods.autocomplete",
//         format: "json",
//         expression: expression,
//       },
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     });
//     res.json(response.data);
//   } catch (error) {
//     console.error("Error fetching autocomplete data:", error);
//     res.status(500).send("Internal Server Error");
//   }
// });

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

// const express = require("express");
// const axios = require("axios");
// const bodyParser = require("body-parser");

// const app = express();
// const PORT = process.env.PORT || 3000;

// app.use(bodyParser.json());

// const API_KEY = "324a3ffd431d489aa4fb29c2beab0df3";
// const API_SECRET = "fef36730f6b74dcfa618b3175c7f35a7";
// const TOKEN_URL = "https://oauth.fatsecret.com/connect/token";
// const BASE_URL = "https://platform.fatsecret.com/rest/server.api";

// let accessToken = null;

// const getToken = async () => {
//   const params = new URLSearchParams();
//   params.append("grant_type", "client_credentials");
//   params.append("client_id", API_KEY);
//   params.append("client_secret", API_SECRET);

//   try {
//     const response = await axios.post(TOKEN_URL, params, {
//       headers: {
//         "Content-Type": "application/x-www-form-urlencoded",
//       },
//     });
//     accessToken = response.data.access_token;
//   } catch (error) {
//     console.error("Error fetching token:", error);
//   }
// };

// app.use(async (req, res, next) => {
//   if (!accessToken) {
//     await getToken();
//   }
//   next();
// });

// app.get("/foods/search", async (req, res) => {
//   const { query, page } = req.query;

//   try {
//     const response = await axios.get(BASE_URL, {
//       params: {
//         method: "foods.search",
//         format: "json",
//         search_expression: query,
//         page_number: page,
//       },
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     });
//     res.json(response.data);
//   } catch (error) {
//     console.error("Error fetching food data:", error);
//     res.status(500).send("Internal Server Error");
//   }
// });

// app.get("/food/details", async (req, res) => {
//   const { food_id } = req.query;
//   console.log("food id in backend", food_id);
//   try {
//     const response = await axios.get(BASE_URL, {
//       params: {
//         method: "food.get.v2",
//         format: "json",
//         food_id: food_id,
//       },
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     });
//     res.json(response.data);
//   } catch (error) {
//     console.error("Error fetching food details:", error);
//     res.status(500).send("Internal Server Error");
//   }
// });

// app.get("/foods/autocomplete", async (req, res) => {
//   const { expression } = req.query;

//   try {
//     const response = await axios.get(BASE_URL, {
//       params: {
//         method: "foods.autocomplete",
//         format: "json",
//         expression: expression,
//       },
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     });
//     res.json(response.data);
//   } catch (error) {
//     console.error("Error fetching autocomplete data:", error);
//     res.status(500).send("Internal Server Error");
//   }
// });

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

import express from "express";
import axios from "axios";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "16 kb" }));

const API_KEY = "324a3ffd431d489aa4fb29c2beab0df3";
const API_SECRET = "fef36730f6b74dcfa618b3175c7f35a7";
const TOKEN_URL = "https://oauth.fatsecret.com/connect/token";
const BASE_URL = "https://platform.fatsecret.com/rest/server.api";

let accessToken = null;

const getToken = async () => {
  const params = new URLSearchParams();
  params.append("grant_type", "client_credentials");
  params.append("client_id", API_KEY);
  params.append("client_secret", API_SECRET);

  try {
    const response = await axios.post(TOKEN_URL, params, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    accessToken = response.data.access_token;
  } catch (error) {
    console.error("Error fetching token:", error);
  }
};

app.use(async (req, res, next) => {
  if (!accessToken) {
    await getToken();
  }
  next();
});

app.get("/food/search", async (req, res) => {
  const { query, page } = req.query;
  console.log(query, page, req.query, " at backend");

  try {
    const response = await axios.get(BASE_URL, {
      params: {
        method: "foods.search",
        format: "json",
        search_expression: query,
        page_number: page,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching food data:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/food/details", async (req, res) => {
  const { food_id } = req.query;
  console.log("food id in backend", food_id);
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        method: "food.get.v2",
        format: "json",
        food_id: food_id,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching food details:", error);
    res.status(500).send("Internal Server Error");
  }
});

// app.get("/foods/autocomplete", async (req, res) => {
//   const { expression } = req.query;

//   try {
//     const response = await axios.get(BASE_URL, {
//       params: {
//         method: "foods.autocomplete",
//         format: "json",
//         expression: expression,
//       },
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     });
//     res.json(response.data);
//   } catch (error) {
//     console.error("Error fetching autocomplete data:", error);
//     res.status(500).send("Internal Server Error");
//   }
// });

// // New endpoint to fetch exercise data
// app.get("/exercises/all", async (req, res) => {
//   const { query, page } = req.query;

//   try {
//     const response = await axios.get(BASE_URL, {
//       params: {
//         method: "exercises.get",
//         format: "json",
//         search_expression: query,
//         page_number: page,
//       },
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     });
//     res.json(response.data);
//   } catch (error) {
//     console.error("Error fetching exercise data:", error);
//     res.status(500).send("Internal Server Error");
//   }
// });

// New endpoint to fetch food data using barcode
app.get("/food/barcode", async (req, res) => {
  const { barcode } = req.query;

  try {
    const response = await axios.get(BASE_URL, {
      params: {
        method: "food.find_id_for_barcode",
        format: "json",
        barcode: barcode,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching food data by barcode:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
