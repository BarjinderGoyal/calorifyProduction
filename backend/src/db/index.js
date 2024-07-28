import { mongoose } from "mongoose";

const ConnectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGO_DB_URI}`).then((result) => {
      console.log("MONGODB connected MOngoDB HOST", result.connection.host);
    });
  } catch (e) {
    console.log("error while connecting with database", e);
    process.exit(1);
  }
};

export default ConnectDB;
