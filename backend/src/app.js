import express from "express";

const app = express();

app.use(express.json({ limit: "20kb" }));

// import user router
import userRouter from "./routes/user.route.js";
import mealRouter from "./routes/meal.routes.js";
import userWeightRouter from "./routes/userWeight.routes.js";
import openAIRouter from "./routes/openAi.routes.js";
import exerciseRouter from "./routes/exercise.routes.js";
import saveFoodRouter from "./routes/saveFood.routes.js";
app.use("/api/v1/user", userRouter);
app.use("/api/v1/meal", mealRouter);
app.use("/api/v1/weight", userWeightRouter);
app.use("/api/v1/openAi", openAIRouter);
app.use("/api/v1/exercise", exerciseRouter);
app.use("/api/v1/food", saveFoodRouter);

export { app };
