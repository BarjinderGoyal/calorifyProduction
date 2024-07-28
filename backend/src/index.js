import dotenv from "dotenv";
import ConnectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({ path: "./.env" });
console.log(process.env.PORT);

ConnectDB()
  .then(() => {
    app.on("error", (e) => {
      throw e;
    });
    app.listen(process.env.PORT || 8000, () =>
      console.log("SERVER IS RUNNING ON PORT", process.env.PORT || 8000)
    );
  })
  .catch((e) => console.log("MongoDB connection error", e));
