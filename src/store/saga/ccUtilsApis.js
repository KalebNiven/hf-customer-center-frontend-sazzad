import { ccUtils } from "../../utils/api/ccUtils";
import { sendErrorLog } from "./apis";

/**
 * Posts user data to Lexis Nexis when called
 *
 * @returns {Promise<void>}
 */
export const postRiskAssessment = async () => {
  try {
    console.info("Running postRiskAssessment function");
    await ccUtils(true).post(`/risk-assessment`);
  } catch (err) {
    try {
      console.error("Error caught: ", err.message);
      await sendErrorLog(err);
    } catch (error) {
      console.error("Error caught: ", error.message);
    }
  }
};
