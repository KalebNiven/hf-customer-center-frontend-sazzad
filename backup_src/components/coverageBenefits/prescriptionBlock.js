import React from 'react'
import { useSelector } from "react-redux";
import { MainCard, InnerCard, Icon, BlueHeader, Row, HorizontalDivider, Category, SubCategory, DataBlock } from './styles';
import { getFormattedCopay } from './utils';

const PrescriptionBlock = () => {
    const coverageBenefits = useSelector((state) => state.coverageBenefits);
    const { coverage } = coverageBenefits;

    return (
        coverage.prescriptionEligible &&
        <MainCard>
          <InnerCard>
            <Icon alt="" src="/react/images/icn-pharmacy.svg" />
            <BlueHeader>Prescription Drugs</BlueHeader>
            {coverage.showPrescriptionTier1CC && <>
              <Row extra>
                <DataBlock> 
                  <Category>Generic</Category>
                  {getFormattedCopay({ isPercent: coverage[`prescriptionTier1Percentage`], total: coverage[`prescriptionTier1Total`], coinsurance: coverage.prescriptionTier1Coins, hasDeductible: coverage.prescriptionCopayAfterDeductible  })}
                </DataBlock>
              </Row>
            </>}
            { (coverage.showPrescriptionTier2CC && coverage.showPrescriptionTier1CC) && <HorizontalDivider /> }
            {coverage.showPrescriptionTier2CC && <>
              <Row extra>
                <DataBlock>
                  <Category>Brand Name (prefered)</Category>
                  {getFormattedCopay({ isPercent: coverage[`prescriptionTier2Percentage`], total: coverage[`prescriptionTier2Total`], coinsurance: coverage.prescriptionTier2Coins, hasDeductible: coverage.prescriptionCopayAfterDeductible  })}
                </DataBlock>
              </Row>
            </>}
            { (coverage.showPrescriptionTier3CC && (coverage.showPrescriptionTier1CC || coverage.showPrescriptionTier2CC)) && <HorizontalDivider /> }
            {coverage.showPrescriptionTier3CC && <>
              <Row extra>
                <DataBlock>
                  <Category>Brand Name (non-prefered)</Category>
                  {getFormattedCopay({ isPercent: coverage[`prescriptionTier3Percentage`], total: coverage[`prescriptionTier3Total`], coinsurance: coverage.prescriptionTier3Coins, hasDeductible: coverage.prescriptionCopayAfterDeductible  })}
                </DataBlock>
              </Row>
            </>}
          </InnerCard>
        </MainCard>
    )
}

export default PrescriptionBlock
