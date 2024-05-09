import { getCarouselDetails } from "./apis";
import { LOFLv2 } from "../../utils/api/loflv2";
jest.mock("../../utils/api/loflv2", () => ({
  __esModule: true,
  default: "mockedDefaultExport",
  LOFLv2: jest.fn(),
}));

// Partial mock example
// jest.mock('./apis', () => ({
//   __esModule: true,
//   ...jest.requireActual('./apis'),
//   sendErrorLog: jest.fn(),
// }));

describe("apis", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    console = {
      error: jest.fn(),
    };
  });

  describe("getCarouselDetails", () => {
    it("should return value if we receive a successful response", async () => {
      const mockGet = jest.fn().mockReturnValue({ data: "success" });
      LOFLv2.mockReturnValue({ get: mockGet });
      const result = await getCarouselDetails({
        memberships: "lotsOfMemberships",
      });

      expect(LOFLv2).toHaveBeenCalledTimes(1);
      expect(LOFLv2).toHaveBeenCalledWith(true);
      expect(mockGet).toHaveBeenCalledTimes(1);
      expect(mockGet).toHaveBeenCalledWith("carousel", {
        params: { memberships: "lotsOfMemberships" },
      });
      expect(result).toEqual("success");
    });

    it("should send error log and console log error if request fails", async () => {
      LOFLv2.mockImplementation(() => throw new Error("oops"));
      const result = await getCarouselDetails({
        memberships: "lotsOfMemberships",
      });

      expect(result).toBeUndefined();
      expect(console.error).toBeCalled();
      // expect(sendErrorLog).toBeCalled() // TODO: sendErrorLog to another file for easier mocking
    });
  });
});
