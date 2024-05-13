import { getSplitAttributes } from "./misc";

describe("Miscellaneous utils functions", () => {
  describe("getSplitAttributes", () => {
    const sampleCustomerInfoDataObject = {
      data: {
        memberId: "140210715",
        customerId: "CUST-144992779",
        sessLobCode: "MPPO",
        companyCode: "45",
        benefitPackage: "PPOM",
        membershipStatus: "active",
        accountStatus: "MEMBER",
      },
    };
    it("Get split attributes when values are present", () => {
      const splitAttributes = getSplitAttributes(
        sampleCustomerInfoDataObject.data,
      );

      expect(splitAttributes).toEqual({
        memberId: "140210715",
        customerId: "CUST-144992779",
        lob: "MPPO",
        companyCode: "45",
        benefitPackage: "PPOM",
        membershipStatus: "active",
        accountStatus: "MEMBER",
      });
    });

    it("Get split attributes when one value is missing, it shouldn't break the code", () => {
      const updatedDataObj = {
        data: {
          ...sampleCustomerInfoDataObject.data,
          sessLobCode: "",
        },
      };
      const splitAttributes = getSplitAttributes(updatedDataObj.data);

      expect(splitAttributes).toEqual({
        memberId: "140210715",
        customerId: "CUST-144992779",
        lob: "",
        companyCode: "45",
        benefitPackage: "PPOM",
        membershipStatus: "active",
        accountStatus: "MEMBER",
      });
    });
  });
});
