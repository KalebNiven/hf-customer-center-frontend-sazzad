import React from 'react'
import { SHOW_OTC_BENEFITS_CENTER_BUTTON } from '../../../../constants/splits'
import { FeatureTreatment } from "../../../../libs/featureFlags";
import styled from 'styled-components';
import { useSelector } from 'react-redux'
const { MIX_REACT_APP_OTC_NETWORK_HREF_V2 } = process.env;
import ExternalSiteLinkSSO from '../../../common/externalSiteLinkSSO'
import { generateCardType } from '../../../overTheCounter/utils';

const OTCBenefitsCenterButton = () => {
    const customerInfo = useSelector((state) => state.customerInfo);
    const { hohPlans } = customerInfo?.data;

    return (
        <>
            <FeatureTreatment
                treatmentName={SHOW_OTC_BENEFITS_CENTER_BUTTON}
                onLoad={() => { }}
                onTimedout={() => { }}
                attributes={{
                    planCode: customerInfo.data.planCode,
                    companyCode: customerInfo.data.companyCode,
                    benefitPackage: customerInfo.data.hohPlans?.map(plan => plan.BenefitPackage),
                    membershipStatus: customerInfo.data.membershipStatus,
                }}
            >
                {
                    <ExternalSiteLinkSSO link={MIX_REACT_APP_OTC_NETWORK_HREF_V2} label="OTC Benefits Center" target="_blank">
                        <ActiveButton>{generateCardType(hohPlans)} Benefits Center</ActiveButton>
                    </ExternalSiteLinkSSO>
                }
            </FeatureTreatment>
        </>
    )
}

export const ActiveButton = styled.span`
  font-size: 14px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: right;
  color: #008bbf;
  cursor: pointer;
`;

export default OTCBenefitsCenterButton
