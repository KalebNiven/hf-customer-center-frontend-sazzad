import React from "react";
import { sendErrorLog } from "../store/saga/apis";

// useLogError returns { logError } which accepts native Error object.
const useLogError = () => {
  const logError = async (error) => {
    try {
      await sendErrorLog(error);
    } catch (err) {
      console.error("Error caught (inside error logging func): ", err.message);
    }
  };

  return { logError };
};

export default useLogError;
