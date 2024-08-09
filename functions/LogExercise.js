import axios from "axios";
import { BASE_ENDPOINT_URL } from "../Constants";

export const logExerciseToDatabase = async (uid, exercises) => {
  const date = getTodayDate();
  console.log(exercises, date, uid, "UID OF THE USER INSIDE LOG EXERCIESEESS");

  try {
    const response = await axios.post(
      `${BASE_ENDPOINT_URL}/api/v1/exercise/addExercises`,
      { uid, exercises, date }
    );
    if (response) {
      console.log(response?.data, "log exercise date");
      return response;
    }
  } catch (e) {
    console.error(e);
    throw new Error(e);
  }
};

function getTodayDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
