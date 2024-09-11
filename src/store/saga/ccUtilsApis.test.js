import { postRiskAssessment } from "./ccUtilsApis";
import { ccUtils } from "../../utils/api/ccUtils";
jest.mock("../../utils/api/ccUtils", () => ({
  __esModule: true,
  default: "mockedDefaultExport",
  ccUtils: jest.fn(),
}));

describe("ccUtilsApis", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    console = {
      error: jest.fn(),
    };
  });

  describe("postRiskAssessment", () => {
    it("should call the correct endpoint", async () => {
      const mockPost = jest.fn().mockReturnValue({ message: "success" });
      ccUtils.mockReturnValue({ post: mockPost });
      const result = await postRiskAssessment();

      expect(ccUtils).toHaveBeenCalledTimes(1);
      expect(ccUtils).toHaveBeenCalledWith(true);
      expect(mockPost).toHaveBeenCalledTimes(1);
      expect(mockPost).toHaveBeenCalledWith("/risk-assessment");
      expect(result).toEqual(undefined);
    });

    it("should send error log and console log error if request fails", async () => {
      ccUtils.mockImplementation(() => throw new Error("oops"));
      const result = await postRiskAssessment();

      expect(result).toBeUndefined();
      expect(console.error).toBeCalled();
    });
  });
});
