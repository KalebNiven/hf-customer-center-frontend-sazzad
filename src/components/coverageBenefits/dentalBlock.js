import React from 'react'
import { useSelector } from "react-redux";
import { MainCard, InnerCard, Icon, BlueHeader, Row, HorizontalDivider, Category, DataBlock, CostData } from './styles';
import { getFormattedCopay } from './utils';

const DentalBlock = () => {
    const coverageBenefits = useSelector((state) => state.coverageBenefits);
    const { coverage } = coverageBenefits;

    return (
        coverage.dentalEligible &&
        <MainCard>
          <InnerCard>
            <Icon alt="" src="/react/images/icn-dentistry.svg" />
            <BlueHeader>Dental Coverage</BlueHeader>
            <Row extra>
              <DataBlock>
                <Category>{coverage.dentalPediatric && 'Pediatric'} Dental Visit</Category>
                {coverage.dentalRoutineCopay !== null ? getFormattedCopay({ isPercent: coverage.dentalRoutineCopayPercentage, total: coverage.dentalRoutineCopay, coinsurance: coverage.dentalRoutineCoins, hasDeductible: coverage.dentalRoutineCopayAfterDeductible }) : <CostData>N/A</CostData>}
              </DataBlock>
            </Row>
            { coverage.showDentalPreventativeCC && coverage.preventativeCareEligible && coverage.dentalPreventativeCopay && <HorizontalDivider /> }
            {
              coverage.showDentalPreventativeCC && coverage.preventativeCareEligible && coverage.dentalPreventativeCopay &&
              <>
                <Row extra>
                  <DataBlock>
                    <Category>Preventative</Category>
                    {getFormattedCopay({ isPercent: false, total: coverage.dentalPreventativeCopay, coinsurance: coverage.dentalPreventativeCoins, hasDeductible: coverage.dentalPreventativeCopayAfterDeductible })}
                  </DataBlock>
                </Row>
                { coverage.showDentalRoutineCC && <HorizontalDivider /> }
              </>
            }
            {
              coverage.showDentalRoutineCC &&
              <>
                <Row extra>
                  <DataBlock>
                    <Category>Routine</Category>
                    {getFormattedCopay({ isPercent: coverage.dentalRoutineCopayPercentage, total: coverage.dentalRoutineCopay, coinsurance: coverage.dentalRoutineCoins, hasDeductible: coverage.dentalRoutineCopayAfterDeductible })}
                  </DataBlock>
                </Row>
                <HorizontalDivider />
              </>
            }
            {
              coverage.showDentalMajorCC &&
              <>
                <Row extra>
                  <DataBlock>
                    <Category>Major</Category>
                    {getFormattedCopay({ isPercent: coverage.dentalMajorCopayPercentage, total: coverage.dentalMajorCopay, coinsurance: coverage.dentalMajorCoins, hasDeductible: coverage.dentalMajorCopayAfterDeductible })}
                  </DataBlock>
                </Row>
                <HorizontalDivider />
              </>
            }
            {
              coverage.showDentalOrthodonticsCC &&
              <>
                <Row extra>
                  <DataBlock>
                    <Category>Orthodontics</Category>
                    {getFormattedCopay({ isPercent: coverage.dentalOrthodonticsCopayPercentage, total: coverage.dentalOrthodonticsCopay, coinsurance: coverage.dentalOrthodonticsCoins, hasDeductible: coverage.dentalOrthodonticsCopayAfterDeductible })}
                  </DataBlock>
                </Row>
              </>
            }
          </InnerCard>  
        </MainCard>
    )
}

export default DentalBlock
