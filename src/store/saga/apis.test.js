import { getCarouselDetails, getSplitFeatures } from "./apis";
import { LOFLv2 } from "../../utils/api/loflv2";
import axios from "axios";
import {
  AUTHORIZATIONS_PAGE,
  RUN_RISK_ASSESSMENT,
} from "../../constants/splits";
jest.mock("../../utils/api/loflv2", () => ({
  __esModule: true,
  default: "mockedDefaultExport",
  LOFLv2: jest.fn(),
}));

jest.mock("axios", () => ({
  __esModule: true,
  ...jest.requireActual("axios"),
  get: jest.fn(),
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

  describe("getSplitFeatures", () => {
    it("should return single split key with treatment", async () => {
      const mockGet = jest.fn().mockReturnValue({
        data: {
          till: 1728483898129,
          since: -1,
          splits: [
            {
              changeNumber: 1728483898129,
              trafficTypeName: "user",
              name: "CustomerCenter_Run_Risk_Assessment",
              trafficAllocation: 100,
              trafficAllocationSeed: 932820567,
              seed: -1311081212,
              status: "ACTIVE",
              killed: false,
              defaultTreatment: "off",
              algo: 2,
              conditions: [
                {
                  conditionType: "ROLLOUT",
                  matcherGroup: {
                    combiner: "AND",
                    matchers: [
                      {
                        keySelector: {
                          trafficType: "user",
                          attribute: null,
                        },
                        matcherType: "ALL_KEYS",
                        negate: false,
                        userDefinedSegmentMatcherData: null,
                        whitelistMatcherData: null,
                        unaryNumericMatcherData: null,
                        betweenMatcherData: null,
                        dependencyMatcherData: null,
                        booleanMatcherData: null,
                        stringMatcherData: null,
                        betweenStringMatcherData: null,
                      },
                    ],
                  },
                  partitions: [
                    {
                      treatment: "on",
                      size: 100,
                    },
                    {
                      treatment: "off",
                      size: 0,
                    },
                  ],
                  label: "default rule",
                },
              ],
              configurations: {},
              sets: [],
            },
          ],
        },
      });
      axios.get = mockGet;
      const result = await getSplitFeatures(RUN_RISK_ASSESSMENT);

      expect(mockGet).toHaveBeenCalledTimes(1);
      expect(mockGet).toHaveBeenCalledWith(
        "https://sdk.split.io/api/splitChanges",
        {
          headers: {
            authorization: "Bearer dummykey",
            "cache-control": "no-cache",
            "content-type": "application/json",
          },
          params: {
            names: "CustomerCenter_Run_Risk_Assessment",
            since: -1,
          },
        },
      );
      expect(result).toEqual([
        {
          name: "CustomerCenter_Run_Risk_Assessment",
          treatment: "on",
        },
      ]);
    });

    it("should return multiple split keys with treatments", async () => {
      const mockGet = jest.fn().mockReturnValue({
        data: {
          till: 1728483898129,
          since: -1,
          splits: [
            {
              changeNumber: 1728483898129,
              trafficTypeName: "user",
              name: "CustomerCenter_Run_Risk_Assessment",
              trafficAllocation: 100,
              trafficAllocationSeed: 932820567,
              seed: -1311081212,
              status: "ACTIVE",
              killed: false,
              defaultTreatment: "off",
              algo: 2,
              conditions: [
                {
                  conditionType: "ROLLOUT",
                  matcherGroup: {
                    combiner: "AND",
                    matchers: [
                      {
                        keySelector: {
                          trafficType: "user",
                          attribute: null,
                        },
                        matcherType: "ALL_KEYS",
                        negate: false,
                        userDefinedSegmentMatcherData: null,
                        whitelistMatcherData: null,
                        unaryNumericMatcherData: null,
                        betweenMatcherData: null,
                        dependencyMatcherData: null,
                        booleanMatcherData: null,
                        stringMatcherData: null,
                        betweenStringMatcherData: null,
                      },
                    ],
                  },
                  partitions: [
                    {
                      treatment: "on",
                      size: 100,
                    },
                    {
                      treatment: "off",
                      size: 0,
                    },
                  ],
                  label: "default rule",
                },
              ],
              configurations: {},
              sets: [],
            },
            {
              changeNumber: 1728417412961,
              trafficTypeName: "user",
              name: "CustomerCenter_Authorizations_Page",
              trafficAllocation: 100,
              trafficAllocationSeed: 963526877,
              seed: 2145046031,
              status: "ACTIVE",
              killed: false,
              defaultTreatment: "off",
              algo: 2,
              conditions: [
                {
                  conditionType: "ROLLOUT",
                  matcherGroup: {
                    combiner: "AND",
                    matchers: [
                      {
                        keySelector: {
                          trafficType: "user",
                          attribute: null,
                        },
                        matcherType: "ALL_KEYS",
                        negate: false,
                        userDefinedSegmentMatcherData: null,
                        whitelistMatcherData: null,
                        unaryNumericMatcherData: null,
                        betweenMatcherData: null,
                        dependencyMatcherData: null,
                        booleanMatcherData: null,
                        stringMatcherData: null,
                        betweenStringMatcherData: null,
                      },
                    ],
                  },
                  partitions: [
                    {
                      treatment: "on",
                      size: 100,
                    },
                    {
                      treatment: "off",
                      size: 0,
                    },
                    {
                      treatment: "legacy",
                      size: 0,
                    },
                  ],
                  label: "default rule",
                },
              ],
              configurations: {},
              sets: [],
            },
          ],
        },
      });
      axios.get = mockGet;
      const result = await getSplitFeatures(
        `${RUN_RISK_ASSESSMENT},${AUTHORIZATIONS_PAGE}`,
      );

      expect(mockGet).toHaveBeenCalledTimes(1);
      expect(mockGet).toHaveBeenCalledWith(
        "https://sdk.split.io/api/splitChanges",
        {
          headers: {
            authorization: "Bearer dummykey",
            "cache-control": "no-cache",
            "content-type": "application/json",
          },
          params: {
            names:
              "CustomerCenter_Run_Risk_Assessment,CustomerCenter_Authorizations_Page",
            since: -1,
          },
        },
      );
      expect(result).toEqual([
        {
          name: "CustomerCenter_Run_Risk_Assessment",
          treatment: "on",
        },
        {
          name: "CustomerCenter_Authorizations_Page",
          treatment: "on",
        },
      ]);
    });

    it("should send error log and console log error if request fails", async () => {
      const mockGet = jest
        .fn()
        .mockImplementation(() => throw new Error("oops"));
      axios.get = mockGet;
      const result = await getSplitFeatures(RUN_RISK_ASSESSMENT);

      expect(result).toBeUndefined();
      expect(console.error).toBeCalled();
      // expect(sendErrorLog).toBeCalled() // TODO: sendErrorLog to another file for easier mocking
    });
  });
});
