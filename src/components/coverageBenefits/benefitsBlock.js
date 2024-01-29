import React from 'react'
import { useSelector } from "react-redux";
import { MainCard, InnerCard, Icon, BlueHeader, Row, HorizontalDivider, CostData, DataBlock, Benefits } from './styles';
import { getFormattedCopay } from './utils';

const BenefitsBlock = () => {
    const coverageBenefits = useSelector((state) => state.coverageBenefits);
    const { coverage } = coverageBenefits;

    return (
        <MainCard>
        <InnerCard>
          <Icon alt="" src="/react/images/icn-benefits.svg" />
          <BlueHeader>Benefits</BlueHeader>
          {
            (coverage.preventativeCareEligible && coverage.preventativeCareEligible) &&
            <>
              <Row>
                <DataBlock>
                  <Benefits>Preventative Care</Benefits>
                  <CostData moreWidth extraSpace customFlex={.6} customFlexMobile={.8}>No deductible or cost sharing applies to services as defined in section 2713 of the ACA</CostData> 
                </DataBlock>
              </Row>
              <HorizontalDivider />
            </>
          }
          {
            (coverage.showPcpCC && coverage.pcpEligible) &&
            <>
              <Row>
                <DataBlock>
                  <Benefits>Primary Care Physician</Benefits>
                  {getFormattedCopay({ isPercent: coverage.pcpPercentage, total: coverage.pcpCopay, coinsurance: coverage.pcpCoins, hasDeductible: coverage.pcpCopayAfterDeductible, hasFirst3Visits: coverage.showFirst3VisitsCC  })}
                </DataBlock>
              </Row>
              <HorizontalDivider />
            </>
          }
          {
            coverage.showSpecialistCC &&
            <>
              <Row>
                <DataBlock>
                  <Benefits>Specialist</Benefits>
                  {getFormattedCopay({ isPercent: coverage.specialistPercentage, total: coverage.specialistCopay, coinsurance: coverage.specialistCoins, hasDeductible: coverage.specialistCopayAfterDeductible, hasFirst3Visits: coverage.showFirst3VisitsCC  })}
                </DataBlock>
              </Row>
              <HorizontalDivider />
            </>
          }
          {
            (coverage.showRehabCC && coverage.rehabServicesEligible) &&
            <>
              <Row>
                <DataBlock>
                  <Benefits textWrap>PT/OT/ST: Rehabilitative & Habiliative Services</Benefits>
                  {getFormattedCopay({ isPercent: coverage.rehabServicesCopayPercentage, total: coverage.rehabServicesCopay, coinsurance: coverage.rehabServicesCoins, hasDeductible: coverage.rehabServicesCopyAfterDeductible })}
                </DataBlock>
              </Row>
              <HorizontalDivider />
            </>
          }
          
          {
            coverage.showUrgentCC &&
            <>
              <Row>
                <DataBlock>
                  <Benefits>Urgent Care</Benefits>
                  {getFormattedCopay({ isPercent: coverage.urgentCarePercentage, total: coverage.urgentCareCopay, coinsurance: coverage.urgentCareCoins, hasDeductible: coverage.urgentCareCopayAfterDeductible })}
                </DataBlock>
              </Row>
              <HorizontalDivider />
            </>
          }
          { coverage.showEmergencyRoomCC &&
            <>
              <Row>
                <DataBlock> 
                  <Benefits>Emergency Room</Benefits>
                  {getFormattedCopay({ isPercent: coverage.emergencyRoomPercentage, total: coverage.emergencyRoomCopay, coinsurance: coverage.emergencyRoomCoins, hasDeductible: coverage.emergencyRoomCopayAfterDeductible })}
                </DataBlock>
              </Row>
              <HorizontalDivider />
            </>
          }
          {
            (coverage.showAmbulanceCC && coverage.ambulanceEligible) &&
            <>
              <Row>
                <DataBlock>
                  <Benefits>Ambulance</Benefits>
                  {getFormattedCopay({ isPercent: coverage.ambulanceCopayPercentage, total: coverage.ambulanceCopay, coinsurance: coverage.ambulanceCoins, hasDeductible: coverage.ambulanceCopayAfterDeductible })}
                </DataBlock>
              </Row>
              <HorizontalDivider />
            </>
          }
          {
            (coverage.showSurgeonCC && coverage.surgeonEligible) &&
            <>
              <Row>
                <DataBlock>
                  <Benefits>Surgeon</Benefits>
                  {getFormattedCopay({ isPercent: coverage.surgeonCopayPercentage, total: coverage.surgeonCopay, coinsurance: coverage.surgeonCoins, hasDeductible: coverage.surgeonCopayAfterDeductible })}
                </DataBlock>
              </Row>
              <HorizontalDivider />
            </>
          }
          {
            (coverage.showOutpatientCC && coverage.outpatientEligible) &&
            <>
              <Row>
                <DataBlock>
                  <Benefits>Outpatient Facility</Benefits>
                  {getFormattedCopay({ isPercent: coverage.outpatientCopayPercentage, total: coverage.outpatientCopay, coinsurance: coverage.outpatientCoins, hasDeductible: coverage.outpatientCopayAfterDeductible })}
                </DataBlock>
              </Row>
              <HorizontalDivider />
            </>
          }
          {
            coverage.showInpatientCC &&
            <>
              <Row>
                <DataBlock>
                  <Benefits textWrap>Inpatient Facility / Skilled Nursing Facility</Benefits>
                  {getFormattedCopay({ isPercent: coverage.inpatientPercentage, total: coverage.inpatientCopay, coinsurance: coverage.inpatientCoins, hasAdmission: coverage.inpatientAdmission, hasDeductible: coverage.inpatientCopayAfterDeductible })}
                </DataBlock>
              </Row>
              <HorizontalDivider />
            </>
          }
          {
            (coverage.showTeladocCC && coverage.teladocEligible) &&
            <Row>
              <DataBlock>
                <Benefits>Telemedicine</Benefits>
                {getFormattedCopay({ isPercent: coverage.teladocPercentage, total: coverage.teladocCopay, coinsurance: null, hasDeductible: coverage.teladocCopayAfterDeductible })}
              </DataBlock>
            </Row>
          }
        </InnerCard>
      </MainCard>
    )
}

export default BenefitsBlock