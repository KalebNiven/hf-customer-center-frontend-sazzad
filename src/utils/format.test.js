import { numberWithCommas } from "./format";

describe("format", () => {
  it("makes number have commas", () => {
    const result = numberWithCommas("1234");

    expect(result).toEqual("1,234");
  });
});
