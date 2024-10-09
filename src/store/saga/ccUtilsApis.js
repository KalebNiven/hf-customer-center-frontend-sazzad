import { ccUtils } from "../../utils/api/ccUtils";
import { getSplitFeatures, sendErrorLog } from "./apis";
import { RUN_RISK_ASSESSMENT } from "../../constants/splits";

/**
 * Posts user data to Lexis Nexis when called
 *
 * @returns {Promise<void>}
 */
export const postRiskAssessment = async () => {
  try {
    const response = await getSplitFeatures(RUN_RISK_ASSESSMENT);
    const riskAssessmentFeatureFlag = response.find(
      (split) => split.name === RUN_RISK_ASSESSMENT,
    );

    console.log(`Risk assessment feature ${riskAssessmentFeatureFlag}`);

    if (riskAssessmentFeatureFlag.treatment === "on") {
      console.info("Running postRiskAssessment function");
      await ccUtils(true).post(`/risk-assessment`);
    }
  } catch (err) {
    try {
      console.error("Error caught: ", err.message);
      await sendErrorLog(err);
    } catch (error) {
      console.error("Error caught: ", error.message);
    }
  }
};
