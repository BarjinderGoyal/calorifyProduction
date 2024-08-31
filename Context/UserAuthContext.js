import { createContext, useContext, useState } from "react";
import Toast from "react-native-simple-toast";
import { getUserLoggedWeight } from "../functions/GetUserLoggedWeight";
import { userWeightLog } from "../functions/UserWeightLog";
import { format } from "date-fns";
import { dailyMacroIntake } from "../functions/DailyMacroIntake";
import { updateUserFlagValue } from "../functions/UpdateUserFlagsValue";
import { updateUserCalories } from "../functions/UpdateUserDetails/updateUserCalories";
import { updateUserHeight } from "../functions/UpdateUserDetails/updateUserHeight";
import { calculateDailyCalorieIntake } from "../functions/CalculateDailyCalorieIntake";
import { updateUserTargetWeight } from "../functions/UpdateUserDetails/updateUserTargetWeight";
import { updateUserAge } from "../functions/UpdateUserDetails/updateUserAge";
const UserAuthCreateContext = createContext();

export default UserAuthContext = ({ children }) => {
  const [userUid, setUserUid] = useState(null);
  const [userDetail, setUserDetail] = useState(null);
  const [userLoggedWeight, setUserLoggedWeight] = useState([]);
  const [userDailyMacroValue, setUserDailyMacroValue] = useState();

  const fetchUserLoggedWeight = async (uid) => {
    try {
      const response = await getUserLoggedWeight(uid);
      if (response) {
        setUserLoggedWeight(response?.data?.data?.weights);
      }
    } catch (e) {
      Toast.show("Something went wrong", Toast.LONG);

      console.log("error while fetching weight from database", e);
    }
  };

  const calculateDailyMacroIntake = () => {
    const dailyMacroValue = dailyMacroIntake(
      Number(userDetail?.age),
      Number(userDetail?.weight),
      Number(userDetail?.height),
      userDetail?.gender,
      Number(userDetail?.activityLevel),
      userDetail?.goal,
      userDetail?.weeklyGoal
    );
    const protein = dailyMacroValue?.protein.toFixed(2);
    const fat = dailyMacroValue?.fat.toFixed(2);
    const carbs = dailyMacroValue?.carbs.toFixed(2);
    setUserDailyMacroValue({ protein, fat, carbs });
  };

  const weightLog = async (uid, weight) => {
    try {
      const date = new Date();
      const currentDate = format(date, "yyyy-MM-dd");
      const response = await userWeightLog(uid, weight, currentDate);
      if (response) {
        setUserLoggedWeight([
          ...userLoggedWeight,
          { date: currentDate, weight: weight },
        ]);
        return response;
      } else {
        return null;
      }
    } catch (e) {
      Toast.show("Something went wrong", Toast.LONG);

      console.log("error while logging user weight", e);
    }
  };

  const setUid = (uid) => {
    setUserUid(uid);
  };
  const handleUserDetail = (user) => {
    setUserDetail(user);
  };

  const updateCalories = async (calories) => {
    try {
      const response = await updateUserCalories(userDetail?.uid, calories);
      console.log("response aftr calories get updated ", response);
      if (response) {
        setUserDetail(response);
      }
    } catch (e) {
      Toast.show("Something went wrong", Toast.SHORT);
    }
  };

  const updateHeight = async (height) => {
    try {
      const calories = calculateDailyCalorieIntake(
        Number(userDetail?.weight),
        Number(userDetail?.weeklyGoal),
        userDetail?.gender,
        Number(userDetail?.age),
        Number(height),
        Number(userDetail?.activityLevel),
        userDetail?.goal
      );
      const response = await updateUserHeight(
        userDetail?.uid,
        height,
        calories
      );
      console.log("response aftr height get updated ", response);
      if (response) {
        setUserDetail(response);
      }
    } catch (e) {
      Toast.show("Something went wrong", Toast.SHORT);
    }
  };

  const updateTargetWeight = async (weight) => {
    try {
      console.log(weight, "weight of the used is ");
      const response = await updateUserTargetWeight(userDetail?.uid, weight);
      console.log("response aftr target weight get updated ", response);
      if (response) {
        setUserDetail(response);
      }
    } catch (e) {
      Toast.show("Something went wrong", Toast.SHORT);
    }
  };

  const updateAge = async (age) => {
    try {
      const calories = calculateDailyCalorieIntake(
        Number(userDetail?.weight),
        Number(userDetail?.weeklyGoal),
        userDetail?.gender,
        Number(age),
        Number(userDetail?.height),
        Number(userDetail?.activityLevel),
        userDetail?.goal
      );
      const response = await updateUserAge(userDetail?.uid, age, calories);
      console.log("response aftr age get updated ", response);
      if (response) {
        setUserDetail(response);
      }
    } catch (e) {
      Toast.show("Something went wrong", Toast.SHORT);
    }
  };

  const updateUserFlags = async (props) => {
    try {
      const response = await updateUserFlagValue(props);
      setUserDetail(response?.data?.data);
    } catch (e) {
      Toast.show("Something went wrong", Toast.SHORT);
    }
  };

  return (
    <UserAuthCreateContext.Provider
      value={{
        userUid,
        handleUserDetail,
        setUid,
        userDetail,
        fetchUserLoggedWeight,
        userLoggedWeight,
        weightLog,
        calculateDailyMacroIntake,
        userDailyMacroValue,
        updateUserFlags,
        updateCalories,
        updateHeight,
        updateTargetWeight,
        updateAge,
      }}
    >
      {children}
    </UserAuthCreateContext.Provider>
  );
};

export const userAuthUseContext = () => useContext(UserAuthCreateContext);
