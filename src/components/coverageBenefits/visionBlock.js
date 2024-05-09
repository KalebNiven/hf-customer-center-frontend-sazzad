import React from "react";
import { useSelector } from "react-redux";
import {
  MainCard,
  InnerCard,
  Icon,
  BlueHeader,
  Row,
  HorizontalDivider,
  Category,
  SubCategory,
  DataBlock,
  CostData,
} from "./styles";
import { getFormattedCopay } from "./utils";

const VisionBlock = () => {
  const coverageBenefits = useSelector((state) => state.coverageBenefits);
  const { coverage } = coverageBenefits;

  return (
    coverage.showVisionCC &&
    coverage.visionEligible && (
      <MainCard>
        <InnerCard>
          <Icon alt="" src="/react/images/icn-eye-care.svg" />
          <BlueHeader>Vision Coverage</BlueHeader>
          <Row extra>
            <DataBlock>
              <Category>
                {coverage.dentalPediatric && "Pediatric"} Vision Visit
              </Category>
              {coverage.visionExamCopay !== null ? (
                getFormattedCopay({
                  isPercent: coverage.visionExamCopayPercentage,
                  total: coverage.visionExamCopay,
                  coinsurance: coverage.visionExamCoins,
                  hasDeductible: coverage.visionExamCopayAfterDeductible,
                })
              ) : (
                <CostData>N/A</CostData>
              )}
            </DataBlock>
          </Row>
          {coverage.showVisionLensesCC && <HorizontalDivider />}
          {coverage.showVisionLensesCC && (
            <>
              <Row extra>
                <DataBlock>
                  <Category>Vision Lenses</Category>
                  {coverage.visionLensesEctCopay !== null ? (
                    getFormattedCopay({
                      isPercent: coverage.visionLensesEctCopayPercentage,
                      total: coverage.visionLensesEctCopay,
                      coinsurance: coverage.visionLensesEctCoins,
                      hasDeductible:
                        coverage.visionLensesEctCopayAfterDeductible,
                    })
                  ) : (
                    <CostData>N/A</CostData>
                  )}
                </DataBlock>
              </Row>
            </>
          )}
        </InnerCard>
      </MainCard>
    )
  );
};

export default VisionBlock;
