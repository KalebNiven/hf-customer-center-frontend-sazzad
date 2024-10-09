import { postRiskAssessment } from "./ccUtilsApis";
import { ccUtils } from "../../utils/api/ccUtils";
import { getSplitFeatures } from "./apis";
import { RUN_RISK_ASSESSMENT } from "../../constants/splits";
jest.mock("../../utils/api/ccUtils", () => ({
  __esModule: true,
  default: "mockedDefaultExport",
  ccUtils: jest.fn(),
}));

jest.mock("./apis", () => ({
  __esModule: true,
  default: "mockedDefaultExport",
  sendErrorLog: jest.fn(),
  getSplitFeatures: jest.fn(),
}));

describe("ccUtilsApis", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    console = {
      error: jest.fn(),
      info: jest.fn(),
      log: jest.fn(),
    };
  });

  describe("postRiskAssessment", () => {
    it("should call the correct endpoint", async () => {
      const mockPost = jest.fn().mockReturnValue({ message: "success" });
      ccUtils.mockReturnValue({ post: mockPost });
      getSplitFeatures.mockReturnValue([
        { name: RUN_RISK_ASSESSMENT, treatment: "on" },
      ]);
      const result = await postRiskAssessment();

      expect(ccUtils).toHaveBeenCalledTimes(1);
      expect(ccUtils).toHaveBeenCalledWith(true);
      expect(mockPost).toHaveBeenCalledTimes(1);
      expect(mockPost).toHaveBeenCalledWith("/risk-assessment");
      expect(result).toEqual(undefined);
    });

    it("should not call risk-assessment endpoint if flag off", async () => {
      const mockPost = jest.fn().mockReturnValue({ message: "success" });
      ccUtils.mockReturnValue({ post: mockPost });
      getSplitFeatures.mockReturnValue({
        name: RUN_RISK_ASSESSMENT,
        treatment: "off",
      });
      await postRiskAssessment();

      expect(ccUtils).not.toHaveBeenCalled();
    });

    it("should send error log and console log error if request fails", async () => {
      ccUtils.mockImplementation(() => throw new Error("oops"));
      const result = await postRiskAssessment();

      expect(result).toBeUndefined();
      expect(console.error).toBeCalled();
    });
  });
});
