import React, { useEffect } from "react";
import styled from "styled-components";
import GlobalStyle from "../../styles/GlobalStyle";
import { useLocation, useHistory } from "react-router-dom";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import {
  requestClaimDetails,
  requestClaimsEOB,
} from "../../store/actions/index";
import { useDispatch, useSelector } from "react-redux";
import NumberFormat from "react-number-format";
import Spinner from "../common/spinner";
import ExternalSiteLink from "../common/externalSiteLink";
import { AnalyticsTrack } from "../../components/common/segment/analytics";
import {
  ANALYTICS_TRACK_TYPE,
  ANALYTICS_TRACK_CATEGORY,
} from "../../constants/segment";
import { MainContentContainer } from "../common/styles";
import {
  SHOW_CLAIMS,
  SHOW_CLAIMS_EXPLANATION_OF_BENEFITS,
} from "../../constants/splits";
import { FeatureTreatment } from "../../libs/featureFlags";
import GlobalError from "../common/globalErrors/globalErrors";
import { getSplitAttributes } from "../../utils/misc";

const ClaimDetailsPage = () => {
  const location = useLocation();
  const history = useHistory();
  const dispatch = useDispatch();

  const claimId = location.state ? location.state.claimId : "";
  const memberId = location.state ? location.state.memberId : "";

  const claimDetails = useSelector((state) => state.claimDetails.claimDetails);
  const claimDetailsLoading = useSelector(
    (state) => state.claimDetails.loading,
  );
  const claimEOB = useSelector((state) => state.claimDetails.eob);
  const customerInfo = useSelector((state) => state.customerInfo);
  const splitAttributes = getSplitAttributes(customerInfo?.data);

  useEffect(() => {
    dispatch(requestClaimDetails(memberId, claimId));
    if (isValidLOB(customerInfo.data.companyCode)) {
      dispatch(requestClaimsEOB(memberId, claimId));
    }
  }, [history]);

  const isValidLOB = (code) => {
    return code === "42" || code === "45";
  };
  const handleSegmentBtn = (row) => {
    // Segment Track
    AnalyticsTrack(row, customerInfo, {
      raw_text: row,
      description: row,
      destination_url: window.location.origin + "/claimsDetail",
      category: ANALYTICS_TRACK_CATEGORY.claims,
      type: ANALYTICS_TRACK_TYPE.linkClicked,
      targetMemberId: customerInfo?.data?.memberId,
      location: {
        desktop: {
          width: 1024,
          value: "left",
        },
        tablet: {
          width: 768,
          value: "left",
        },
        mobile: {
          width: 0,
          value: "left",
        },
      },
    });
  };
  return (
    <Container>
      {claimDetails !== "" && claimDetailsLoading == false ? (
        <FeatureTreatment
          treatmentName={SHOW_CLAIMS}
          onLoad={() => {}}
          onTimedout={() => {}}
          attributes={splitAttributes}
        >
          <GlobalStyle />
          <BreadcrumbNavigation>
            <Breadcrumbs
              separator={
                <NavigationIcon
                  alt=""
                  src="/react/images/icn-arrow-right.svg"
                />
              }
            >
              <BreadcrumbsClaim
                onClick={() =>
                  history.push({
                    pathname: "/claims",
                  })
                }
              >
                Claims
              </BreadcrumbsClaim>
              <ClaimDetailsText>
                Claim #: {claimDetails.claimHeader.claimId}
              </ClaimDetailsText>
            </Breadcrumbs>
          </BreadcrumbNavigation>
          <ClaimText>Claim #: {claimDetails.claimHeader.claimId}</ClaimText>
          <IndividualCnt>
            <LeftContainer>
              <Paper first>
                <Patient>PATIENT</Patient>
                <PatientName>
                  {claimDetails.patient.firstName.concat(
                    " ",
                    claimDetails.patient.lastName,
                  )}
                </PatientName>
                <PatientCompany>{claimDetails.patient.planName}</PatientCompany>
                <MemberIdTxt>MEMBER ID</MemberIdTxt>
                <MemberId>{claimDetails.patient.id}</MemberId>
              </Paper>
              <Paper>
                {claimDetails.claimHeader.claimStatus === "Processed" ? (
                  <ProcessedStatus>Processed</ProcessedStatus>
                ) : (
                  <PendingStatus>Pending</PendingStatus>
                )}
                <ClaimFlex>
                  <ProcessedOnTxt>PROCESSED ON</ProcessedOnTxt>
                  <LabelValueBox>
                    <ProcessedOnDate>
                      {claimDetails.claimHeader.claimStatusDate}
                    </ProcessedOnDate>
                  </LabelValueBox>
                </ClaimFlex>
                <ClaimFlex>
                  <CareReceivedTxt>CARE RECEIVED ON</CareReceivedTxt>
                  <LabelValueBox>
                    <CareReceivedDate>
                      {claimDetails.claimHeader.serviceFromDate}-
                      {claimDetails.claimHeader.serviceEndDate}
                    </CareReceivedDate>
                  </LabelValueBox>
                </ClaimFlex>
              </Paper>
              <Paper>
                <AmountTxt>AMOUNT OWED TO PROVIDER:</AmountTxt>
                <Amount>
                  <NumberFormat
                    value={claimDetails.payment.totalAmountOwedToProvider}
                    displayType={"text"}
                    thousandSeparator={true}
                    decimalScale={2}
                    decimalSeparator="."
                    fixedDecimalScale
                    prefix={"$"}
                  />
                </Amount>
                {claimEOB && typeof claimEOB.Documents[0] !== "undefined" ? (
                  <FeatureTreatment
                    treatmentName={SHOW_CLAIMS_EXPLANATION_OF_BENEFITS}
                    onLoad={() => {}}
                    onTimedout={() => {}}
                    attributes={splitAttributes}
                  >
                    <ViewEOB
                      href={`/documents/${
                        claimEOB.Documents[0].NodeID
                          ? claimEOB.Documents[0].NodeID
                          : claimEOB.Documents[0].DocumentID
                      }?isNodeId=${
                        claimEOB.Documents[0].NodeID ? "true" : "false"
                      }`}
                      target="_blank"
                      onClick={handleSegmentBtn("View Explanation Of Benefits")}
                    >
                      View Explanation Of Benefits
                    </ViewEOB>
                  </FeatureTreatment>
                ) : null}
              </Paper>
              {claimDetails.address.mailingAddress === "" &&
              claimDetails.phonenumber === null &&
              claimDetails.renderingProvider.firstName === undefined ? null : (
                <Paper>
                  <ServiceProviderTxt>SERVICE PROVIDER</ServiceProviderTxt>
                  <ServiceProvider>
                    {claimDetails.renderingProvider.firstName.concat(
                      " ",
                      claimDetails.renderingProvider.lastName,
                    )}
                  </ServiceProvider>
                  {claimDetails.address.mailingAddress === "" &&
                  claimDetails.phonenumber === null ? (
                    <span>No Contact Information Available</span>
                  ) : (
                    <ServiceProviderContactInfoWrapper>
                      {claimDetails.address.mailingAddress !== "" ? (
                        <ExternalSiteLink
                          link={`https://www.google.com/maps?saddr=Current+Location&daddr= ${claimDetails.address.mailingAddress}`}
                          target="_blank"
                          label="GoogleMaps"
                          styles={{ cursor: "pointer" }}
                        >
                          <Address>
                            <span>
                              <LocationIcon
                                alt=""
                                src="/react/images/icn-map-blue.svg"
                              ></LocationIcon>
                            </span>
                            <AddressTxt>
                              {claimDetails.address.mailingAddress}
                            </AddressTxt>
                          </Address>
                        </ExternalSiteLink>
                      ) : null}
                      {claimDetails.phonenumber !== null ? (
                        <Section
                          onClick={() => handleSegmentBtn("Mobile Icon")}
                        >
                          <span>
                            <PhoneIcon
                              alt=""
                              src="/react/images/icn-call.svg"
                            ></PhoneIcon>
                          </span>
                          <PhoneNumber href={`tel:${claimDetails.phonenumber}`}>
                            {claimDetails.phonenumber}
                          </PhoneNumber>
                        </Section>
                      ) : null}
                    </ServiceProviderContactInfoWrapper>
                  )}
                </Paper>
              )}
            </LeftContainer>
            <RightContainer>
              <ServicePapers>
                {claimDetails.claimLine.map((service, index) => (
                  <ServicePaper key={index}>
                    {index === 0 && (
                      <OverviewTxt>Overview of Services</OverviewTxt>
                    )}
                    <ServiceTypeTxt>SERVICE TYPE</ServiceTypeTxt>
                    <ServiceType>{service.typeofservice}</ServiceType>
                    <Section>
                      <SubmittedChargeTxt>SUBMITTED CHARGE</SubmittedChargeTxt>
                      <SubmittedCharge>
                        <NumberFormat
                          value={service.payment.lineItemChargeAmount}
                          displayType={"text"}
                          thousandSeparator={true}
                          decimalScale={2}
                          decimalSeparator="."
                          fixedDecimalScale
                          prefix={"$"}
                        />
                      </SubmittedCharge>
                    </Section>
                    <Section>
                      <NonCoverageTxt>NOT COVERED BY PLAN</NonCoverageTxt>
                      <NonCoverageAmount>
                        <NumberFormat
                          value={service.payment.nonCovered}
                          displayType={"text"}
                          thousandSeparator={true}
                          decimalScale={2}
                          decimalSeparator="."
                          fixedDecimalScale
                          prefix={"$"}
                        />
                      </NonCoverageAmount>
                    </Section>
                    <Section>
                      <PaidTxt>PAID FOR BY PLAN</PaidTxt>
                      <PaidAmount>
                        <NumberFormat
                          value={service.payment.amount}
                          displayType={"text"}
                          thousandSeparator={true}
                          decimalScale={2}
                          decimalSeparator="."
                          fixedDecimalScale
                          prefix={"$"}
                        />
                      </PaidAmount>
                    </Section>
                    <Section>
                      <ProviderAmountTxt>
                        AMOUNT OWED TO PROVIDER
                      </ProviderAmountTxt>
                      <ProviderAmount>
                        <NumberFormat
                          value={service.payment.amountOwedToProvider}
                          displayType={"text"}
                          thousandSeparator={true}
                          decimalScale={2}
                          decimalSeparator="."
                          fixedDecimalScale
                          prefix={"$"}
                        />
                      </ProviderAmount>
                    </Section>
                    <Section>
                      <MemberCoPayTxt>MEMBER CO-PAY</MemberCoPayTxt>
                      <MemberCoPayAmount>
                        <NumberFormat
                          value={service.payment.copayAmount}
                          displayType={"text"}
                          thousandSeparator={true}
                          decimalScale={2}
                          decimalSeparator="."
                          fixedDecimalScale
                          prefix={"$"}
                        />
                      </MemberCoPayAmount>
                    </Section>

                    <Section>
                      <MemberLineStatusTxt>STATUS</MemberLineStatusTxt>
                      {/* <MemberLineStatus> */}
                      {service.status === "Paid" ? (
                        <PaidStatus>Paid</PaidStatus>
                      ) : service.status === "Denied" ? (
                        <RejectedStatus>Denied</RejectedStatus>
                      ) : (
                        <PendingStatus>Pending</PendingStatus>
                      )}
                      {/* </MemberLineStatus> */}
                    </Section>
                  </ServicePaper>
                ))}
              </ServicePapers>
            </RightContainer>
          </IndividualCnt>
        </FeatureTreatment>
      ) : claimDetailsLoading == true ? (
        <ProgressWrapper>
          <Spinner />
        </ProgressWrapper>
      ) : null}

      <FeatureTreatment
        treatmentName={SHOW_CLAIMS}
        onLoad={() => {}}
        onTimedout={() => {}}
        attributes={splitAttributes}
        invertBehavior
      >
        <GlobalError />
      </FeatureTreatment>
    </Container>
  );
};

const Container = styled(MainContentContainer)`
  max-width: 1024px;
  background-color: #f4f4f4;
  margin: auto;
  margin-top: -16px;
  margin-bottom: 64px;
  width: 100%;
`;

const NavigationIcon = styled.img`
  width: 12px;
  height: 12px;
  object-fit: contain;
`;

const BreadcrumbsClaim = styled.p`
  font-size: 14px;
  font-family: "museo-sans";
  font-weight: 300;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.29;
  letter-spacing: normal;
  color: #474b55;
  cursor: pointer;
`;

const ClaimDetailsText = styled.p`
  font-size: 14px;
  font-family: "museo-sans";
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.29;
  letter-spacing: normal;
  color: #474b55;
`;

const BreadcrumbNavigation = styled.div`
  @media only screen and (min-width: 769px) {
  }
  margin: 42px 16px 8px;
`;

const ClaimText = styled.div`
  @media only screen and (min-width: 769px) {
  }
  font-size: 24px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: normal;
  color: #003863;
  margin: 32px 16px 8px;
`;

const IndividualCnt = styled.div`
  @media only screen and (min-width: 769px) {
    display: flex;
  }
  display: contents;
  flex: 1 1 auto;
  justify-content: space-between;
  align-items: flex-start;
  box-sizing: border-box;
  padding-right: 8px;
  padding-left: 8px;
  width: 100%;
`;

const LeftContainer = styled.div`
  display: block;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  padding-right: 0px;
  padding-left: 8px;
  @media only screen and (max-width: 768px) {
    padding: 0px 10px 0px 10px;
  }
  @media only screen and (min-width: 1400px) {
    flex: 0 0 auto;
  }
`;

const RightContainer = styled.div`
  display: block;
  flex: 1 1 auto;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  padding-right: 8px;
  padding-left: 0px;
  @media only screen and (max-width: 768px) {
    padding: 0px 10px 0px 10px;
  }
`;

const Paper = styled.div`
  @media only screen and (min-width: 769px) {
    width: 308px;
    margin: ${(props) =>
      props.first ? "16px 16px 8px 0px" : "1px 16px 8px 0px"};
    border: none;
  }

  margin: 16px 0px 10px 0px;
  padding: 24px;
  border-radius: 4px;
  border: solid 1px #d8d8d8;
  box-shadow: 0 2px 8px 0 #d8d8d8;
  background-color: #ffffff;
`;

const Patient = styled.div`
  margin: 0 161px 0px 0;
  font-size: 12px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: 0.2px;
  color: #757575;
`;

const PatientName = styled.div`
  margin: 0px;
  font-size: 20px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.6;
  letter-spacing: normal;
  color: #003863;
  text-transform: capitalize;
`;

const PatientCompany = styled.div`
  margin: 0px 74px 0px 0;
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.29;
  letter-spacing: normal;
  color: #474b55;
`;

const MemberIdTxt = styled.span`
  margin: 0 60px 0 0;
  font-size: 12px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: 0.2px;
  color: #757575;
`;

const MemberId = styled.span`
  margin: 0 0 0 0px;
  font-size: 14px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.14;
  letter-spacing: normal;
  color: #474b55;
`;

const PaidStatus = styled.span`
  height: 15px;
  padding: 3px 5px;
  background-color: #3e7128;
  border-radius: 5px;
  font-size: 12px;
  font-weight: bold;
  text-align: center;
  color: #ffffff;
  text-transform: uppercase;
  width: 96px;
  box-sizing: initial;
  line-height: normal;
  letter-spacing: 1.5px;
  margin-bottom: 5px;
`;

const ProcessedStatus = styled.span`
  height: 15px;
  padding: 3px 5px;
  background-color: #003863;
  border-radius: 5px;
  font-size: 12px;
  font-weight: bold;
  text-align: center;
  color: #ffffff;
  text-transform: uppercase;
  width: 96px;
  box-sizing: initial;
  line-height: normal;
  letter-spacing: 1.5px;
  margin-bottom: 5px;
`;

const PendingStatus = styled.span`
  height: 15px;
  padding: 3px 5px;
  background-color: #a8abac;
  border-radius: 5px;
  font-size: 12px;
  font-weight: bold;
  text-align: center;
  color: #ffffff;
  text-transform: uppercase;
  width: 96px;
  box-sizing: initial;
  line-height: normal;
  letter-spacing: 1.5px;
  margin-bottom: 5px;
`;

const UnknownStatus = styled.span`
  height: 15px;
  padding: 3px 5px;
  background-color: #a8abac;
  border-radius: 5px;
  font-size: 12px;
  font-weight: bold;
  text-align: center;
  color: #ffffff;
  text-transform: uppercase;
  width: 96px;
  box-sizing: initial;
  line-height: normal;
  letter-spacing: 1.5px;
  margin-bottom: 5px;
`;

const RejectedStatus = styled.span`
  height: 15px;
  padding: 3px 5px;
  background-color: #ad122a;
  border-radius: 5px;
  font-size: 12px;
  font-weight: bold;
  text-align: center;
  color: #ffffff;
  text-transform: uppercase;
  width: 96px;
  box-sizing: initial;
  line-height: normal;
  letter-spacing: 1.5px;
  margin-bottom: 5px;
`;

const ClaimFlex = styled.div`
  display: flex;
  padding-top: 8px;
`;
const LabelValueBox = styled.div`
  margin-right: auto;
  margin-left: 12px;
`;
const ProcessedOnTxt = styled.div`
  width: 116px;
  font-size: 12px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: 0.2px;
  color: #757575;
  white-space: nowrap;
`;

const ProcessedOnDate = styled.div`
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.14;
  letter-spacing: normal;
  color: #474b55;
`;

const CareReceivedTxt = styled.span`
  font-size: 12px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: 0.2px;
  color: #757575;
  white-space: nowrap;
`;

const CareReceivedDate = styled.div`
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.14;
  letter-spacing: normal;
  color: #474b55;
`;

const AmountTxt = styled.div`
  margin: 0 0 8px;
  font-size: 12px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: 0.2px;
  color: #757575;
`;

const Amount = styled.div`
  margin: 8px 0 4px;
  font-size: 24px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: normal;
  color: #003863;
`;

const ViewEOB = styled.a`
  margin: 4px -5px 0;
  font-family: "museo-sans";
  font-size: 14px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.71;
  letter-spacing: normal;
  color: #008bbf;
  border: none;
  background: none;
  cursor: pointer;
`;

const ServiceProviderTxt = styled.div`
  font-size: 12px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: 0.2px;
  color: #757575;
`;

const ServiceProvider = styled.div`
  font-size: 20px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.6;
  letter-spacing: normal;
  color: #003863;
  text-transform: capitalize;
`;

const ServiceProviderContactInfoWrapper = styled.div``;

const Address = styled.div`
  display: inline-flex;
`;

const LocationIcon = styled.img`
  width: 14px;
  height: 13px;
  margin: 2px 4px 1px 0;
  object-fit: contain;
  cursor: pointer;
  display: inline-block;
`;

const AddressTxt = styled.span`
  margin: 0 0 0 2px;
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.14;
  letter-spacing: normal;
  color: #008bbf;
  cursor: pointer;
  display: inline-block;
  &:hover {
    text-decoration: underline;
    color: #2a6a9e;
  }
`;

const Section = styled.div`
  height: 24px;
`;

const PhoneIcon = styled.img`
  width: 13px;
  height: 12px;
  margin: 3px 4px 1px 0;
  object-fit: contain;
  display: inline-block;
`;

const PhoneNumber = styled.a`
  margin: 0 0 0 4px;
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.14;
  letter-spacing: normal;
  // color: #757575;
  display: inline-block;
  cursor: pointer !important;
  &:hover {
    text-decoration: underline !important;
    color: #2a6a9e !important;
  }
`;

const ServicePapers = styled.div`
  @media only screen and (min-width: 769px) {
    border: none;
  }
  margin: 16px 0px 10px 0px;
  border-radius: 4px;
  border: solid 1px #d8d8d8;
  box-shadow: 0 2px 8px 0 #d8d8d8;
  background-color: #ffffff;
`;

const ServicePaper = styled.div`
  @media only screen and (min-width: 769px) {
    padding: 24px;
  }
  &:last-child {
    border-bottom: 0;
  }
  border-bottom: solid 2px #f4f4f4;
  padding: 16px 36px 32px 16px;
`;

const OverviewTxt = styled.div`
  margin: 0 0 16px 0;
  font-size: 18px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: normal;
  color: #003863;
`;

const ServiceTypeTxt = styled.div`
  height: 16px;
  margin: 0 150px 10px 0;
  font-size: 12px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 2.33;
  letter-spacing: 0.2px;
  color: #757575;
`;

const ServiceType = styled.div`
  margin: 4px 0 15px;
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.14;
  letter-spacing: normal;
  color: #474b55;
  text-transform: uppercase;
`;

const SubmittedChargeTxt = styled.span`
  height: 16px;
  margin: 0 59px 0 0;
  font-size: 12px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 2.33;
  letter-spacing: 0.2px;
  color: #757575;
`;

const SubmittedCharge = styled.span`
  height: 16px;
  margin: 0 0 0 18px;
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.14;
  letter-spacing: normal;
  color: #474b55;
`;

const NonCoverageTxt = styled.span`
  height: 16px;
  margin: 0 37px 0 0;
  font-size: 12px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 2.33;
  letter-spacing: 0.2px;
  color: #757575;
`;

const NonCoverageAmount = styled.span`
  height: 16px;
  margin: 0 0 0 22px;
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.14;
  letter-spacing: normal;
  color: #474b55;
`;

const PaidTxt = styled.span`
  height: 16px;
  margin: 0 75px 0 0;
  font-size: 12px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 2.33;
  letter-spacing: 0.2px;
  color: #757575;
`;

const PaidAmount = styled.span`
  height: 16px;
  margin: 0 0 0 16px;
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.14;
  letter-spacing: normal;
  color: #474b55;
`;

const ProviderAmountTxt = styled.span`
  height: 16px;
  margin: 0 14px 0 0;
  font-size: 12px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 2.33;
  letter-spacing: 0.2px;
  color: #757575;
`;

const ProviderAmount = styled.span`
  height: 16px;
  margin: 0 0 0 5px;
  font-size: 14px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.14;
  letter-spacing: normal;
  color: #474b55;
`;

const MemberCoPayTxt = styled.span`
  height: 16px;
  margin: 0 83px 0 0;
  font-size: 12px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 2.33;
  letter-spacing: 0.2px;
  color: #757575;
`;

const MemberCoPayAmount = styled.span`
  height: 16px;
  margin: 0 0 0 16px;
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.14;
  letter-spacing: normal;
  color: #474b55;
`;

// const MemberLineStatus = styled.span`
// height: 16px;
// margin: 0 0 0 16px;
// font-size: 14px;
// font-weight: 500;
// font-stretch: normal;
// font-style: normal;
// line-height: 1.14;
// letter-spacing: normal;
// color: #474b55;
// `;

const ProgressWrapper = styled.div`
  width: 100%;
  margin-top: 20rem;
  margin-bottom: 15rem;
`;

const MemberLineStatusTxt = styled.span`
  height: 16px;
  margin: 0 155px 0 0;
  font-size: 12px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 2.33;
  letter-spacing: 0.2px;
  color: #757575;
`;

export default ClaimDetailsPage;
