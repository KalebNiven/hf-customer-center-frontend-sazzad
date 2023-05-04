import React, { useState, useEffect } from "react";
import { requestCoverageDetails } from "../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import GlobalStyle from "../../styles/GlobalStyle";
import Spinner from "../common/spinner"; 
import {
    Container,
    MainHeader,
    InnerContainer,
    DependentBlockWrapper,
} from "./styles";
import FormsAndDocuments from "./formsAndDocuments";
import ValidLOBBlock from "./validLOBBlock";
import {
    SHOW_FORMS_AND_DOCS,
    SHOW_COVERAGE_AND_BENEFITS,
    SHOW_COVERAGE_AND_BENEFITS_VIDEOS,
} from "../../constants/splits";
import { FeatureTreatment } from "../../libs/featureFlags";
import DependentBlock from "./dependentBlock";
import styled from "styled-components";
import GlobalError from "../common/globalErrors/globalErrors";
import CoverageBenefitsVideoCards from "./coverageBenefitsVideos";

const CoverageBenefitsPage = () => {
    const dispatch = useDispatch();
    const customerInfo = useSelector((state) => state.customerInfo);
    const validLOBs = ["42", "45"];
    const [memberSelection, setMemberSelection] = useState({});
    const { memberId } = memberSelection;
    useEffect(() => {
        sessionStorage.setItem("longLoad", false);
    }, []);
    // set default memberId on initial load
    useEffect(() => {
        if (!memberSelection.memberId) {
            setMemberSelection({
                ...memberSelection,
                memberId: customerInfo.data.memberId,
                planName: customerInfo.data.planName,
                membershipStatus: customerInfo.data.membershipStatus,
                membershipEffectiveDate:
                    customerInfo.data.membershipEffectiveDate,
                membershipExpirationDate:
                    customerInfo.data.membershipExpirationDate,
                companyCode: customerInfo.data.companyCode,
                firstName: customerInfo.data.firstName,
                lastName: customerInfo.data.lastName,
                benefitPackage: customerInfo.data.benefitPackage
            });
        }
    }, [customerInfo]);

    // update coverage and benefits data if member has been changed
    useEffect(() => {
        if (memberId) {
            dispatch(requestCoverageDetails(memberId));
        }
    }, [memberId]);

    const isValidLOB = (code) => {
        return validLOBs.includes(code);
    };

    const splitAttributes = {
        lob: customerInfo.data.sessLobCode,
        companyCode: customerInfo.data.companyCode,
        benefitPackage: customerInfo.data.benefitPackage,
        membershipStatus: customerInfo.data.membershipStatus,
        accountStatus: customerInfo.data.accountStatus,
    };

    return customerInfo.loading && Object.keys(memberSelection).length === 0 ? (
        <Spinner />
    ) : (
        <CoverageContainer>
            <FeatureTreatment
                treatmentName={SHOW_COVERAGE_AND_BENEFITS}
                onLoad={() => {}}
                onTimedout={() => {}}
                attributes={splitAttributes}
            >
                <GlobalStyle />
                <InnerContainer>
                    {!isValidLOB(memberSelection.companyCode) && (
                        <DependentBlockWrapper>
                            <DependentBlock
                                memberSelection={memberSelection}
                                setMemberSelection={setMemberSelection}
                            />
                        </DependentBlockWrapper>
                    )}
                    {/* { isValidLOB(memberSelection.companyCode) ? <ValidLOBBlock memberSelection={memberSelection} setMemberSelection={setMemberSelection} /> : <NotValidLOBBlock memberSelection={memberSelection} setMemberSelection={setMemberSelection} /> } */}
                    {isValidLOB(memberSelection.companyCode) ? (
                        <ValidLOBBlock
                            memberSelection={memberSelection}
                            setMemberSelection={setMemberSelection}
                        />
                    ) : null}
                    <Wrapper>
                        <FeatureTreatment
                            treatmentName={SHOW_COVERAGE_AND_BENEFITS_VIDEOS}
                            onLoad={() => {}}
                            onTimedout={() => {}}
                            attributes={splitAttributes}
                        >
                            <CoverageBenefitsVideoCards 
                            companyCode={memberSelection.companyCode}
                            membershipStatus={memberSelection.membershipStatus}
                            benefitPackage={memberSelection.benefitPackage}
                            >
                            </CoverageBenefitsVideoCards>
                        </FeatureTreatment>
                        <FeatureTreatment
                            treatmentName={SHOW_FORMS_AND_DOCS}
                            onLoad={() => {}}
                            onTimedout={() => {}}
                            attributes={splitAttributes}
                        >
                            <StyledHeader>Forms & Documents</StyledHeader>
                            <FormsAndDocuments selectedMemberId={memberId} />
                        </FeatureTreatment>
                    </Wrapper>
                </InnerContainer>
            </FeatureTreatment>
            <FeatureTreatment
                treatmentName={SHOW_COVERAGE_AND_BENEFITS}
                onLoad={() => {}}
                onTimedout={() => {}}
                attributes={splitAttributes}
                invertBehavior
            >
                <GlobalError />
            </FeatureTreatment>
        </CoverageContainer>
    );
};

export default CoverageBenefitsPage;

const CoverageContainer = styled(Container)`
    width: 100%;
    margin: 0 auto auto auto;
`;

const Wrapper = styled.div``;

const StyledHeader = styled(MainHeader)`
    font-size: 24px;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.33;
    padding:0px;
    letter-spacing: normal;
    color: #003863;
    margin-bottom: 0px;
    margin-top: 40px;
    @media only screen and (max-width: 480px) {
        padding-left: 16px;
        margin-top: 10px;
    }
    @media only screen and (max-width: 768px) {
        padding-left: 16px;
        margin-top: 10px;
    }
`;
