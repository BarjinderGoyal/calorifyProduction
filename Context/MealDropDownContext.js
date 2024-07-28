import { createContext, useCallback, useContext, useState } from "react";

const DropDownCreateContext = createContext();

export default MealDropDownContext = ({ children }) => {
  const [openedMealName, setOpenedMealName] = useState("");
  const updateOpenedMealName = useCallback(
    (mealName) => {
      setOpenedMealName(mealName);
    },
    [openedMealName]
  );
  return (
    <DropDownCreateContext.Provider
      value={[openedMealName, updateOpenedMealName]}
    >
      {children}
    </DropDownCreateContext.Provider>
  );
};

export const mealDropDownUseContext = () => useContext(DropDownCreateContext);
