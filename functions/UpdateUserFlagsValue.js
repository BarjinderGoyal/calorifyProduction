import axios from "axios";

export const updateUserFlagValue = async (props) => {
  try {
    const response = axios.post(
      "http://192.168.31.209:8000/api/v1/user/updateUserFlags",
      { ...props }
    );
    if (response) {
      return response;
    } else {
      return null;
    }
  } catch (e) {
    throw new Error(e);
  }
};
