import React, { useEffect } from "react";
import styled from "styled-components";
import GlobalStyle from "../../styles/GlobalStyle";
import { useLocation, useHistory } from "react-router-dom";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import { requestAuthorizationDetails } from "../../store/actions/index";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../common/spinner";
import ExternalSiteLink from "../common/externalSiteLink";
import { MainContentContainer } from "../common/styles";
import { SHOW_AUTHS, SHOW_GLOBAL_ERROR } from "../../constants/splits";
import { FeatureTreatment } from "../../libs/featureFlags";
import GlobalError from "../common/globalErrors/globalErrors";
import { AnalyticsTrack } from "../common/segment/analytics";

const AuthorizationDetailsPage = () => {
  const location = useLocation();
  const history = useHistory();
  const dispatch = useDispatch();

  const authorizationId = location.state;

  const authorizationDetails = useSelector(
    (state) => state.authorizationDetails.authorizationDetails,
  );
  const authorizationDetailsLoading = useSelector(
    (state) => state.authorizationDetails.loading,
  );

  const customerInfo = useSelector((state) => state.customerInfo);

  const splitAttributes = {
    lob: customerInfo.data.sessLobCode,
    companyCode: customerInfo.data.companyCode,
    benefitPackage: customerInfo.data.benefitPackage,
    membershipStatus: customerInfo.data.membershipStatus,
    accountStatus: customerInfo.data.accountStatus,
  };

  const handleSegmentBtn = (label) => {
    // Segment Track
    AnalyticsTrack(label, customerInfo, {
      raw_text: label,
      description: label,
      destination_url: window.location.origin + "/AuthorizationDetailsPage",
      category: ANALYTICS_TRACK_CATEGORY.authorizations,
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

  useEffect(() => {
    dispatch(requestAuthorizationDetails(authorizationId));
  }, []);

  return (
    <Container>
      {authorizationDetails !== "" && authorizationDetailsLoading == false ? (
        <FeatureTreatment
          treatmentName={SHOW_AUTHS}
          onLoad={() => {}}
          onTimedout={() => {}}
          attributes={splitAttributes}
        >
          <GlobalStyle />
          <BreadcrumbNavigation>
            <Breadcrumbs
              separator={
                <NavigationIcon src="/react/images/icn-arrow-right.svg" />
              }
            >
              <BreadcrumbsAuthorization
                onClick={() =>
                  history.push({
                    pathname: "/authorizations",
                  })
                }
              >
                Authorizations
              </BreadcrumbsAuthorization>
              <AuthorizationDetailsText>
                Authorization #:{" "}
                {authorizationDetails.authorizationHeader.authorizationId}
              </AuthorizationDetailsText>
            </Breadcrumbs>
          </BreadcrumbNavigation>
          <AuthorizationText>
            Authorization #:{" "}
            {authorizationDetails.authorizationHeader.authorizationId}
          </AuthorizationText>
          <IndividualCnt>
            <LeftContainer>
              <Paper first>
                <Patient>PATIENT</Patient>
                <PatientName>
                  {authorizationDetails.patient.firstName.concat(
                    " ",
                    authorizationDetails.patient.lastName,
                  )}
                </PatientName>
                <MemberIdTxt>MEMBER ID</MemberIdTxt>
                <MemberId>{authorizationDetails.patient.id}</MemberId>
                <Section>
                  <TypeTxt>TYPE</TypeTxt>
                  <Type>{authorizationDetails.patient.type}</Type>
                </Section>
                <Section>
                  <StatusTxt>STATUS</StatusTxt>
                  {authorizationDetails.authorizationHeader
                    .authorizationStatus === "Approve" ? (
                    <ProcessedStatus>Approved</ProcessedStatus>
                  ) : authorizationDetails.authorizationHeader
                      .authorizationStatus === "Pend" ? (
                    <PendingStatus>Pending</PendingStatus>
                  ) : authorizationDetails.authorizationHeader
                      .authorizationStatus === "Partial Deny" ||
                    authorizationDetails.authorizationHeader
                      .authorizationStatus === "Partial Approve" ? (
                    <PartiallyApprovedStatus>
                      Partially Approved
                    </PartiallyApprovedStatus>
                  ) : authorizationDetails.authorizationHeader
                      .authorizationStatus === "Void" ? (
                    <VoidStatus>Void</VoidStatus>
                  ) : authorizationDetails.authorizationHeader
                      .authorizationStatus === "Deny" ? (
                    <DeniedStatus>Denied</DeniedStatus>
                  ) : (
                    <PendingStatus>Pending</PendingStatus>
                  )}
                </Section>
                <Section>
                  <StartDateTxt>START DATE</StartDateTxt>
                  <StartDate>
                    {authorizationDetails.authorizationHeader.startDate}
                  </StartDate>
                </Section>
                <Section>
                  <EndDateTxt>END DATE</EndDateTxt>
                  <EndDate>
                    {authorizationDetails.authorizationHeader.endDate || "—"}
                  </EndDate>
                </Section>
              </Paper>
              {authorizationDetails.address.addressLine1 === "" &&
              authorizationDetails.phonenumber === null &&
              authorizationDetails.renderingProvider.name ===
                undefined ? null : (
                <Paper>
                  <ServiceProviderTxt>SERVICE PROVIDER</ServiceProviderTxt>
                  <ServiceProvider>
                    {authorizationDetails.renderingProvider.name}
                  </ServiceProvider>
                  {authorizationDetails.address.addressLine1 === "" &&
                  authorizationDetails.phonenumber === null ? (
                    <span>No Contact Information Available</span>
                  ) : (
                    <ServiceProviderContactInfoWrapper>
                      {authorizationDetails.address.addressLine1 !== "" ? (
                        <ExternalSiteLink
                          link={`https://www.google.com/maps?saddr=Current+Location&daddr= ${authorizationDetails.address.addressLine1},
        ${authorizationDetails.address.city}, ${authorizationDetails.address.state}, ${authorizationDetails.address.zip}`}
                          label="GoogleMaps"
                          target="_blank"
                          styles={{ cursor: "pointer" }}
                        >
                          <Address>
                            <span>
                              <LocationIcon src="/react/images/icn-map-blue.svg"></LocationIcon>
                            </span>
                            <AddressTxt>
                              {authorizationDetails.address.addressLine1.concat(
                                " ",
                                authorizationDetails.address.addressLine2,
                                " ",
                                authorizationDetails.address.city,
                                " ",
                                authorizationDetails.address.state,
                                " ",
                                authorizationDetails.address.zip,
                              )}
                            </AddressTxt>
                          </Address>
                        </ExternalSiteLink>
                      ) : null}
                      {authorizationDetails.phonenumber !== null ? (
                        <Section
                          onClick={() => handleSegmentBtn("Mobile Icon")}
                        >
                          <span>
                            <PhoneIcon src="/react/images/icn-call.svg"></PhoneIcon>
                          </span>
                          <PhoneNumber>
                            {authorizationDetails.phonenumber}
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
                {authorizationDetails.authorizationLine.map(
                  (service, index) => (
                    <ServicePaper
                      first={index === 0 ? true : false}
                      key={index}
                    >
                      {index === 0 && (
                        <OverviewTxt>Overview of Services</OverviewTxt>
                      )}
                      <ServiceTypeTxt>SERVICE TYPE</ServiceTypeTxt>
                      <ServiceType>{service.typeofservice}</ServiceType>
                      <Section>
                        <PlaceOfServiceTxt>PLACE OF SERVICE</PlaceOfServiceTxt>
                        <PlaceOfService>
                          {service.serviceOverview.placeOfService}
                        </PlaceOfService>
                      </Section>
                      <Section>
                        <RequestedDateTxt>REQUESTED DATE</RequestedDateTxt>
                        <RequestedDate>
                          {service.serviceOverview.requestedDate}
                        </RequestedDate>
                      </Section>
                      <Section>
                        <ServiceStartDateTxt>START DATE</ServiceStartDateTxt>
                        <ServiceStartDate>
                          {service.serviceOverview.startDate}
                        </ServiceStartDate>
                      </Section>
                      <Section>
                        <ServiceEndDateTxt>END DATE</ServiceEndDateTxt>
                        <ServiceStartDate>
                          {service.serviceOverview.endDate}
                        </ServiceStartDate>
                      </Section>
                      <Section>
                        <ServiceStatusTxt>STATUS</ServiceStatusTxt>
                        {authorizationDetails.authorizationHeader
                          .authorizationStatus === "Approve" ? (
                          <ProcessedStatus>Approved</ProcessedStatus>
                        ) : authorizationDetails.authorizationHeader
                            .authorizationStatus === "Pend" ? (
                          <PendingStatus>Pending</PendingStatus>
                        ) : authorizationDetails.authorizationHeader
                            .authorizationStatus === "Partial Deny" ||
                          authorizationDetails.authorizationHeader
                            .authorizationStatus === "Partial Approve" ? (
                          <PartiallyApprovedStatus>
                            Partially Approved
                          </PartiallyApprovedStatus>
                        ) : authorizationDetails.authorizationHeader
                            .authorizationStatus === "Void" ? (
                          <VoidStatus>Void</VoidStatus>
                        ) : authorizationDetails.authorizationHeader
                            .authorizationStatus === "Deny" ? (
                          <DeniedStatus>Denied</DeniedStatus>
                        ) : (
                          <PendingStatus>Pending</PendingStatus>
                        )}
                      </Section>
                    </ServicePaper>
                  ),
                )}
              </ServicePapers>
            </RightContainer>
          </IndividualCnt>
        </FeatureTreatment>
      ) : authorizationDetailsLoading == true ? (
        <ProgressWrapper>
          <Spinner />
        </ProgressWrapper>
      ) : null}

      <FeatureTreatment
        treatmentName={SHOW_AUTHS}
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
  * {
    box-sizing: content-box;
  }
  max-width: 1024px;
  @media screen and (min-width: 1440px) {
    margin: auto;
  }
  background-color: #f4f4f4;
  margin-top: -16px;
  margin-bottom: 32px;
  height: 100%;
`;

const NavigationIcon = styled.img`
  width: 12px;
  height: 12px;
  object-fit: contain;
`;

const BreadcrumbsAuthorization = styled.p`
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

const AuthorizationDetailsText = styled.p`
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

const AuthorizationText = styled.div`
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
  flex: 1 1 auto;
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
  width: 100%;
  display: block;
  flex: 1 1 auto;
  min-width: 668px;
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
    width: 260px;
    margin: ${(props) =>
      props.first ? "16px 16px 8px 0px" : "1px 16px 8px 0px"};
    border: none;
  }

  margin: 16px 0px 10px 0px;
  padding: 16px 36px 12px 16px;
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

const TypeTxt = styled.span`
  margin: 0 98px 0 0;
  font-size: 12px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: 0.2px;
  color: #757575;
`;

const StatusTxt = styled.span`
  margin: 0 85px 0 0;
  font-size: 12px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: 0.2px;
  color: #757575;
`;

const ServiceStatusTxt = styled.span`
  margin: 0 107px 0 0;
  font-size: 12px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: 0.2px;
  color: #757575;
`;

const Type = styled.span`
  margin: 0 0 0 0px;
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.14;
  letter-spacing: normal;
  color: #474b55;
`;

const StartDateTxt = styled.span`
  margin: 0 57px 0 0;
  font-size: 12px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: 0.2px;
  color: #757575;
`;

const StartDate = styled.span`
  margin: 0 0 0 0;
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.14;
  letter-spacing: normal;
  color: #474b55;
`;

const EndDateTxt = styled.span`
  margin: 0 68px 0 0;
  font-size: 12px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: 0.2px;
  color: #757575;
`;

const EndDate = styled.span`
  margin: 0 0 0 0;
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.14;
  letter-spacing: normal;
  color: #474b55;
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
  margin-top: 1rem;
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

const PhoneNumber = styled.span`
  margin: 0 0 0 4px;
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.14;
  letter-spacing: normal;
  color: #757575;
  display: inline-block;
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

const PendingStatus = styled.span`
  height: 15px;
  padding: 3px 6px;
  background-color: #a8abac;
  border-radius: 5px;
  font-size: 12px;
  font-weight: bold;
  text-align: center;
  color: #ffffff;
  text-transform: uppercase;
  box-sizing: initial;
  line-height: normal;
  letter-spacing: 1.5px;
  width: 96px;
  white-space: nowrap;
`;

const PartiallyApprovedStatus = styled.span`
  height: 14px;
  padding: 4px 3px;
  background-color: #529535;
  border-radius: 5px;
  font-size: 11px;
  font-weight: bold;
  text-align: center;
  color: #ffffff;
  text-transform: uppercase;
  box-sizing: initial;
  line-height: normal;
  letter-spacing: 1.25px;
  width: 160px;
  white-space: nowrap;
`;

const VoidStatus = styled.span`
  height: 15px;
  padding: 3px 6px;
  background-color: #474b55;
  border-radius: 5px;
  font-size: 12px;
  font-weight: bold;
  text-align: center;
  color: #ffffff;
  text-transform: uppercase;
  box-sizing: initial;
  line-height: normal;
  letter-spacing: 1.5px;
  width: 96px;
  white-space: nowrap;
`;

const ProcessedStatus = styled.span`
  height: 15px;
  padding: 3px 5px;
  background-color: #3e7128;
  border-radius: 5px;
  font-size: 12px;
  font-weight: bold;
  text-align: center;
  color: #ffffff;
  text-transform: uppercase;
  box-sizing: initial;
  line-height: normal;
  letter-spacing: 1.5px;
  width: 96px;
  white-space: nowrap;
`;

const DeniedStatus = styled.span`
  height: 15px;
  padding: 3px 6px;
  background-color: #ad122a;
  border-radius: 5px;
  font-size: 12px;
  font-weight: bold;
  text-align: center;
  color: #ffffff;
  text-transform: uppercase;
  box-sizing: initial;
  line-height: normal;
  letter-spacing: 1.5px;
  width: 96px;
  white-space: nowrap;
`;

const PlaceOfServiceTxt = styled.span`
  margin: 0 40px 0 0;
  font-size: 12px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: 0.2px;
  color: #757575;
`;

const PlaceOfService = styled.span`
  margin: 0 0 0 0;
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.14;
  letter-spacing: normal;
  color: #474b55;
`;

const RequestedDateTxt = styled.span`
  margin: 0 45px 0 0;
  font-size: 12px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: 0.2px;
  color: #757575;
`;

const RequestedDate = styled.span`
  margin: 0 0 0 0;
  font-size: 12px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: 0.2px;
  color: #474b55;
`;

const ServiceStartDateTxt = styled.span`
  margin: 0 80px 0 0;
  font-size: 12px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: 0.2px;
  color: #757575;
`;

const ServiceStartDate = styled.span`
  margin: 0 0 0 0;
  font-size: 12px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: 0.2px;
  color: #474b55;
`;

const ServiceEndDateTxt = styled.span`
  margin: 0 91px 0 0;
  font-size: 12px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: 0.2px;
  color: #757575;
`;

const ProgressWrapper = styled.div`
  width: 100%;
  margin-top: 20rem;
  margin-bottom: 15rem;
`;

export default AuthorizationDetailsPage;
