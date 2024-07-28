import { createContext, useContext, useState } from "react";

const BottomSheetCreateContext = createContext();

const BottomSheetProvider = ({ children }) => {
  const [bottomSheetIsOpen, setBottomSheetIsOpen] = useState(false);
  const updateBottomSheet = (isOpen) => {
    setBottomSheetIsOpen(isOpen);
  };
  return (
    <BottomSheetCreateContext.Provider
      value={{ bottomSheetIsOpen, updateBottomSheet }}
    >
      {children}
    </BottomSheetCreateContext.Provider>
  );
};

export default BottomSheetProvider;

export const bottomSheetUseContext = () => useContext(BottomSheetCreateContext);
