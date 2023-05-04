import React from 'react'
import { useSelector } from "react-redux";
import { Hidden } from "@material-ui/core";
import VisionBlock from './visionBlock';
import DentalBlock from './dentalBlock';
import PrescriptionBlock from './prescriptionBlock';
import BenefitsBlock from './benefitsBlock';
import PlanDetailsBlock from './planDetailsBlock';
import { CardContainer, CardBlock, Icon, ButtonsWrapper, DownloadButton, ButtonText, CoversageBenefitsHeaderWrapper, ValidLOBBlockWrapper, MainHeader } from './styles';
import { SHOW_FORMS_AND_DOCS, SHOW_BENEFIT_GRID } from "../../constants/splits";
import { FeatureTreatment } from "../../libs/featureFlags";
import Spinner from "../common/spinner";
import DependentBlock from './dependentBlock' 
import { useHistory } from 'react-router-dom'

const ValidLOBBlock = ({ memberSelection, setMemberSelection }) => {
    const customerInfo = useSelector((state) => state.customerInfo);
    const { data: { dob, dependents } } = customerInfo;
    const coverageBenefits = useSelector((state) => state.coverageBenefits);
    const { coverage, loading } = coverageBenefits;
    const history = useHistory();
    const splitAttributes = { 
      lob: customerInfo.data.sessLobCode,
    companyCode: customerInfo.data.companyCode,
    benefitPackage: customerInfo.data.benefitPackage,
    membershipStatus: customerInfo.data.membershipStatus,
    accountStatus: customerInfo.data.accountStatus,
    }

    const handleFormAndDocsAchorButton = () => {
      window.location.href = "#forms-and-documents"
    }

    return (
        <FeatureTreatment
              treatmentName={SHOW_BENEFIT_GRID}
              onLoad={() => {}}
              onTimedout={() => {}}
              attributes = {splitAttributes}
            >  
        <ValidLOBBlockWrapper>
          <MainHeader hasDependents={dependents.length > 0} noTopMargin>Coverage & Benefits</MainHeader>
          <CoversageBenefitsHeaderWrapper>
            <DependentBlock memberSelection={memberSelection} setMemberSelection={setMemberSelection} />
            <FeatureTreatment
              treatmentName={SHOW_FORMS_AND_DOCS}
              onLoad={() => {}}
              onTimedout={() => {}}
              attributes = {splitAttributes}
            >
            <ButtonsWrapper hasDependents={dependents.length > 0}>
              {/* <DownloadButton href="#" firstItem>
                <Icon src="/react/images/icn-download-blue.svg" />
                <ButtonText>Download Summary of Benefits</ButtonText>
              </DownloadButton> */}
              <DownloadButton onClick={handleFormAndDocsAchorButton} firstItem>
                <Icon alt="" src="/react/images/icn-outline-document.svg" />
                <ButtonText>Forms & Documents</ButtonText>
              </DownloadButton>
            </ButtonsWrapper>
          </FeatureTreatment>
          </CoversageBenefitsHeaderWrapper>
          { loading ? <Spinner/> : <CardContainer>
            <Hidden only = {["xs"]}>
              <CardBlock left>
                <PlanDetailsBlock memberSelection={memberSelection} />
                { coverage.prescriptionEligible && <PrescriptionBlock /> }
                { coverage.dentalEligible && <DentalBlock /> }
                { coverage.visionEligible && <VisionBlock /> }
              </CardBlock>
              <CardBlock>
                { coverage.dentalEligible && <BenefitsBlock /> }
              </CardBlock>
            </Hidden>
            <Hidden only = {["sm", "md", "xl", "lg"]}>
              <PlanDetailsBlock memberSelection={memberSelection} />
              { coverage.prescriptionEligible && <PrescriptionBlock /> }
              { coverage.dentalEligible && <DentalBlock /> }
              { coverage.visionEligible && <VisionBlock /> }
              <BenefitsBlock />
            </Hidden>
          </CardContainer> }
        </ValidLOBBlockWrapper>
        </FeatureTreatment>
    )
}

export default ValidLOBBlock
