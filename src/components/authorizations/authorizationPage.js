import React, { useEffect } from "react";
import TableContent from "../common/tableContent";
import Spinner from "../common/spinner";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { requestAuthorizationList } from "../../store/actions/index";
import { useHistory } from "react-router-dom";
import { SHOW_AUTHS } from "../../constants/splits";
import { FeatureTreatment } from "../../libs/featureFlags";

import { AnalyticsTrack } from "../../components/common/segment/analytics";
import {
  ANALYTICS_TRACK_TYPE,
  ANALYTICS_TRACK_CATEGORY,
} from "./../../constants/segment";
import GlobalError from "../common/globalErrors/globalErrors";

const AuthorizationPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    dispatch(requestAuthorizationList());
    sessionStorage.setItem("longLoad", false);
  }, []);

  const authorizationList = useSelector(
    (state) => state.authorization.authorizationList,
  );
  const authorizationListLoading = useSelector(
    (state) => state.authorization.loading,
  );
  const customerInfo = useSelector((state) => state.customerInfo);

  const splitAttributes = {
    lob: customerInfo.data.sessLobCode,
    companyCode: customerInfo.data.companyCode,
    benefitPackage: customerInfo.data.benefitPackage,
    membershipStatus: customerInfo.data.membershipStatus,
    accountStatus: customerInfo.data.accountStatus,
  };

  const columns = [
    {
      id: "authorizationId",
      selector: "authorizationId",
      name: "AUTHORIZATION #",
      sortable: true,
      cell: (row) => (
        <AuthorizationNbr data-tag="allowRowEvents">
          {row.authorizationId}
        </AuthorizationNbr>
      ),
    },
    {
      id: "memberName",
      selector: "memberName",
      name: "MEMBER",
      sortable: true,
    },
    {
      id: "providerName",
      selector: "providerName",
      name: "PROVIDER",
      sortable: true,
    },
    {
      id: "startDate",
      selector: "startDate",
      name: "START DATE",
      sortable: true,
      sortFunction: (rowA, rowB) => {
        const aField = new Date(rowA.startDate);
        const bField = new Date(rowB.startDate);

        if (aField > bField) {
          return 1;
        } else if (aField < bField) {
          return -1;
        }
      },
    },
    {
      id: "endDate",
      selector: "endDate",
      name: "END DATE",
      sortable: true,
      sortFunction: (rowA, rowB) => {
        const aField = new Date(rowA.endDate);
        const bField = new Date(rowB.endDate);

        if (aField > bField) {
          return 1;
        } else if (aField < bField) {
          return -1;
        }
      },
    },
    {
      id: "authorizationStatus",
      selector: "authorizationStatus",
      name: "STATUS",
      sortable: true,
      cell: (row) => (
        <div
          onClick={() =>
            history.push({
              pathname: "/authorizationDetails",
              state: row,
            })
          }
          style={{ display: "inline-flex" }}
        >
          {row.authorizationStatus === "Approve" ? (
            <ProcessedStatus>Approved</ProcessedStatus>
          ) : row.authorizationStatus === "Pend" ? (
            <PendingStatus>Pending</PendingStatus>
          ) : row.authorizationStatus === "Partial Deny" ||
            row.authorizationStatus === "Partial Approve" ? (
            <PartiallyApprovedStatus>
              Partially Approved
            </PartiallyApprovedStatus>
          ) : row.authorizationStatus === "Void" ? (
            <VoidStatus>Void</VoidStatus>
          ) : row.authorizationStatus === "Deny" ? (
            <DeniedStatus>Denied</DeniedStatus>
          ) : (
            <PendingStatus>Pending</PendingStatus>
          )}
        </div>
      ),
    },
    {
      cell: (row) => (
        <img
          src="/react/images/icn-arrow-right.svg"
          onClick={() =>
            history.push({
              pathname: "/authorizationDetails",
              state: row,
            })
          }
        />
      ),
      button: true,
    },
  ];

  // Remove MEMBER column if no dependents
  if (
    customerInfo.data.dependents === undefined ||
    customerInfo.data.dependents.length == 0
  ) {
    if (customerInfo.data.hohPlans && customerInfo.data.hohPlans.length <= 1) {
      columns.splice(1, 1);
    }
  }

  const Mobilecolumns = [
    {
      cell: (row) => (
        <Paper
          onClick={() =>
            history.push({
              pathname: "/authorizationDetails",
              state: row,
            })
          }
        >
          <Content>
            <AuthorizationTxt>AUTHORIZATION </AuthorizationTxt>{" "}
            <Authorization>{row.authorizationId}</Authorization>
            <span style={{ float: "right" }}>
              <img
                src="/react/images/icn-arrow-right.svg"
                style={{ float: "right", marginRight: "15px" }}
                onClick={() =>
                  history.push({
                    pathname: "/authorizationDetails",
                    state: row,
                  })
                }
              />
            </span>
          </Content>
          {!(
            customerInfo.data.dependents === undefined ||
            customerInfo.data.dependents.length == 0
          ) ? (
            <Content>
              <ProviderTxt>MEMBER</ProviderTxt>{" "}
              <Member>{row.memberName}</Member>
            </Content>
          ) : null}
          <Content>
            <ProviderTxt>PROVIDER</ProviderTxt>{" "}
            <Provider>{row.providerName}</Provider>
          </Content>
          <Content>
            <DateTxt>START DATE</DateTxt> <DateValue>{row.startDate}</DateValue>
          </Content>
          <Content>
            <EndDateTxt>END DATE</EndDateTxt>{" "}
            <DateValue>{row.endDate}</DateValue>
          </Content>
          <Content>
            <StatusTxt>STATUS</StatusTxt>{" "}
            {row.authorizationStatus === "Approve" ? (
              <MobileProcessedStatus>Approved</MobileProcessedStatus>
            ) : row.authorizationStatus === "Pend" ? (
              <MobilePendingStatus>Pending</MobilePendingStatus>
            ) : row.authorizationStatus === "Partial Deny" ||
              row.authorizationStatus === "Partial Approve" ? (
              <MobilePartiallyApprovedStatus>
                Partially Approved
              </MobilePartiallyApprovedStatus>
            ) : row.authorizationStatus === "Void" ? (
              <MobileVoidStatus>Void</MobileVoidStatus>
            ) : row.authorizationStatus === "Deny" ? (
              <MobileDeniedStatus>Denied</MobileDeniedStatus>
            ) : null}
          </Content>
        </Paper>
      ),
    },
  ];
  const handleSegmentBtn = (row) => {
    // Segment Track
    const { authorizationId } = row;
    AnalyticsTrack("Authorization Link Clicked", customerInfo, {
      raw_text: "Authorization Link Clicked",
      destination_url: window.location.origin,
      category: ANALYTICS_TRACK_CATEGORY.authorizations,
      type: ANALYTICS_TRACK_TYPE.linkClicked,
      targetMemberId: customerInfo?.data?.memberId,
      description: `Authorization # ${authorizationId} Clicked`,
      location: {
        desktop: {
          width: 968,
          value: "center",
        },
        tablet: {
          width: 768,
          value: "center",
        },
        mobile: {
          width: 0,
          value: "center",
        },
      },
    });
  };
  return (
    <AuthorizationPageContainer>
      <FeatureTreatment
        treatmentName={SHOW_AUTHS}
        onLoad={() => {}}
        onTimedout={() => {}}
        attributes={splitAttributes}
      >
        {authorizationListLoading == false ? (
          <Container>
            <AuthorizationText>Authorizations</AuthorizationText>
            <AuthorizationContent>
              At this time, certain Authorizations may not be up-to-date in your
              account. If you have any questions, please call the phone number
              listed on your Member ID card or on the Contact Us tab. 
            </AuthorizationContent>
            <TableContent
              tab="authorization"
              searchPlaceHolder="Search authorization #'s, providers, etc."
              data={authorizationList}
              customerInfo={customerInfo["data"]}
              columns={columns}
              mobileColumns={Mobilecolumns}
              defaultSortFieldId="startDate"
              defaultSortAsc={false}
              pathName="/authorizationDetails"
              handleSegmentBtn={(row) => handleSegmentBtn(row)}
              displayInactiveMembers={true}
            />
          </Container>
        ) : (
          <Container>
            <AuthorizationText>Authorizations</AuthorizationText>
            <AuthorizationContent>
              At this time, certain Authorizations may not be up-to-date in your
              account. If you have any questions, please call the phone number
              listed on your Member ID card or on the Contact Us tab.
            </AuthorizationContent>
            <ProgressWrapper>
              <Spinner />
            </ProgressWrapper>
          </Container>
        )}
      </FeatureTreatment>
      <FeatureTreatment
        treatmentName={SHOW_AUTHS}
        onLoad={() => {}}
        onTimedout={() => {}}
        attributes={splitAttributes}
        invertBehavior
      >
        <GlobalError />
      </FeatureTreatment>
    </AuthorizationPageContainer>
  );
};

const AuthorizationPageContainer = styled.div`
  height: 100%;
`;

const Container = styled.div`
  background-color: #f4f4f4;
  max-width: 1024px;
  position: relative;
  margin: auto;
  height: 100%;
  margin-bottom: 1rem;
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
  margin: 42px 16px 8px;
`;

const AuthorizationContent = styled.div`
  @media only screen and (min-width: 769px) {
  }
  font-size: 16px;
  font-weight: 300;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: normal;
  color: #474b55;
  margin: 8px 16px 16px;
`;

const PendingStatus = styled.span`
  height: 15px;
  padding: 3px 0px;
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
`;

const MobilePendingStatus = styled.span`
  margin-left: 25px;
  height: 15px;
  padding: 3px 31px;
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
`;

const MobilePartiallyApprovedStatus = styled.span`
  margin-left: 25px;
  height: 15px;
  padding: 3px 4px;
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
  margin: 4px 0px 5px 24px;
`;

const VoidStatus = styled.span`
  height: 15px;
  padding: 3px 0px;
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
`;

const MobileVoidStatus = styled.span`
  margin-left: 25px;
  height: 15px;
  padding: 3px 31px;
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
`;

const ProcessedStatus = styled.p`
  height: 15px;
  padding: 3px 0px;
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
`;

const MobileProcessedStatus = styled.span`
  margin-left: 25px;
  height: 15px;
  padding: 3px 31px;
  background-color: #3e7128;
  border-radius: 5px;
  font-size: 12px;
  font-weight: bold;
  text-align: center;
  color: #ffffff;
  text-transform: uppercase;
  margin-top: 0px;
  margin-right: -15px;
  box-sizing: initial;
  line-height: normal;
  letter-spacing: 1.5px;
`;

const DeniedStatus = styled.p`
  height: 15px;
  padding: 3px 0px;
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
`;

const MobileDeniedStatus = styled.span`
  margin-left: 25px;
  margin-right: 10px;
  margin-top: 0px;
  height: 15px;
  padding: 3px 31px;
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
`;

const AuthorizationTxt = styled.span`
  margin: 0 8px 4px 0;
  font-size: 12px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 2.33;
  letter-spacing: 0.2px;
  color: #757575;
`;
const Authorization = styled.span`
  margin: 0 62px 4px 24px;
  font-size: 14px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.14;
  letter-spacing: normal;
  color: #474b55;
`;

const ProviderTxt = styled.span`
  margin: 1px 47px 4px 0;
  font-size: 12px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 2.33;
  letter-spacing: 0.2px;
  color: #757575;
`;

const Provider = styled.span`
  margin: 4px 0px 5px 24px;
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.14;
  letter-spacing: normal;
  color: #474b55;
  text-transform: capitalize;
`;

const Member = styled.span`
  margin: 4px 0px 5px 34px;
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.14;
  letter-spacing: normal;
  color: #474b55;
  text-transform: capitalize;
`;

const DateTxt = styled.span`
  margin: 5px 38px 4px 0;
  font-size: 12px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 2.33;
  letter-spacing: 0.2px;
  color: #757575;
`;

const EndDateTxt = styled.span`
  margin: 5px 49px 4px 0;
  font-size: 12px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 2.33;
  letter-spacing: 0.2px;
  color: #757575;
`;

const DateValue = styled.span`
  margin: 4px 0px 5px 24px;
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.14;
  letter-spacing: normal;
  color: #474b55;
`;

const StatusTxt = styled.span`
  margin: 6px 64px 2px 0;
  font-size: 12px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 2.33;
  letter-spacing: 0.2px;
  color: #757575;
`;

const Content = styled.div``;

const Paper = styled.div`
  width: 100%;
  margin-top: 10px;
  margin-bottom: 10px;
`;

const AuthorizationNbr = styled.p`
  font-size: 14px;
  font-weight: bold;
  color: #474b55;
`;

const ProgressWrapper = styled.div`
  width: 100%;
  margin-top: 10px;
  margin-bottom: 10px;
`;

export default AuthorizationPage;
