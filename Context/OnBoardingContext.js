import { createContext, useContext, useState } from "react";

const OnBoardingContext = createContext();

const OnBoardingProvider = ({ children }) => {
  const [user, setUser] = useState({
    uid: null,
    userName: null,
    email: null,
    goal: null,
    gender: null,
    age: null,
    height: null,
    weight: null,
    goalWeight: null,
    activityLevel: null,
    weeklyGoal: null,
  });

  const setUserInfo = (key, value) => {
    console.log(key, value, "setuserInfo");
    setUser((prevUser) => ({ ...prevUser, [key]: value }));
  };

  return (
    <OnBoardingContext.Provider value={{ user, setUserInfo }}>
      {children}
    </OnBoardingContext.Provider>
  );
};

export { OnBoardingProvider, OnBoardingContext };

export const useOnBoardingContext = () => useContext(OnBoardingContext);
