import React, { useState, useEffect } from "react";
import TableContent from "../common/tableContent";
import Spinner from "../common/spinner";
import YearToDatePage from "./yearToDate";
import styled from "styled-components";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { useDispatch, useSelector } from "react-redux";
import { requestClaimList, requestCustomerDemographicsInfo } from '../../store/actions/index';
import GlobalStyle from "../../styles/GlobalStyle";
import { useHistory } from "react-router-dom";
import { SHOW_CLAIMS , SHOW_YEARTODATE_CLAIMS} from "../../constants/splits";
import { FeatureTreatment } from "../../libs/featureFlags";
import SubmitClaimButton from './submitClaimButton'
import { Box } from "@material-ui/core";
import SubmitClaimModal from "./submitClaimModal";

import { AnalyticsTrack } from "../../components/common/segment/analytics";
import { ANALYTICS_TRACK_TYPE, ANALYTICS_TRACK_CATEGORY } from "./../../constants/segment";
import { useMediaQuery,useTheme } from "@material-ui/core";
import { MainContentContainer } from "../common/styles";
import GlobalError from "../common/globalErrors/globalErrors";

const ClaimsPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"))
  const [selectedTab, setSelectedTab] = useState(0);
  const [showSubmitClaimModal, setShowSubmitClaimModal] = useState(false)
  const history = useHistory();
  const claimList = useSelector((state) => state.claim.claimList);
  const claimListLoading = useSelector((state) => state.claim.loading);
  const customerInfo = useSelector((state) => state.customerInfo);
  const { membershipStatus } = customerInfo.data;

  const splitAttributes = {
    memberId: customerInfo.data.memberId,
    customerId: customerInfo.data.customerId,
    lob: customerInfo.data.sessLobCode,
    companyCode: customerInfo.data.companyCode,
    benefitPackage: customerInfo.data.benefitPackage,
    membershipStatus: customerInfo.data.membershipStatus,
    accountStatus: customerInfo.data.accountStatus,
  }

  const handleTabChange = (e, selection) => {
    setSelectedTab(selection);
  };

  const dispatch = useDispatch();

  useEffect(() => {
    if(!customerInfo.data?.access_token || !customerInfo.data?.id_token) return;
    dispatch(requestClaimList());
    dispatch(requestCustomerDemographicsInfo(customerInfo.data.customerId));
    sessionStorage.setItem("longLoad", false)
  }, [customerInfo?.data]);

  const columns = [
    { id: "claimId", selector: row => row.claimId, name: 'CLAIM', sortable: true, cell: row => <ClaimNbr data-tag="allowRowEvents">{row.claimId}</ClaimNbr> },
    { id: "memberName", selector: row => row.memberName, name: 'MEMBER', sortable: true },
    { id: "providerName", selector: row => row.providerName, name: 'PROVIDER', sortable: true },
    {
      id: "serviceDate",
      selector: "serviceDate", name: 'SERVICE DATE', sortable: true,
      sortFunction: (rowA, rowB) => {
        const aField = new Date(rowA.serviceDate)
        const bField = new Date(rowB.serviceDate)
      
        if (aField > bField) {
         return 1;
        } else {
         return -1;
        }
      }
    },
    {
      id: "claimStatus", selector: row => row.claimStatus, name: 'STATUS', sortable: true, cell: row => (row.claimStatus === "Processed") ?
        <ProcessedStatus data-tag="allowRowEvents">
          Processed
        </ProcessedStatus> :
        <PendingStatus data-tag="allowRowEvents">
          Pending
        </PendingStatus>
    },
    , {
      id: "claimDetailsBtn",
      cell: (row) => <img alt = "" src="/react/images/icn-arrow-right.svg" onClick={() =>
        history.push({
          pathname: "/claimDetails",
          state: row
        })} />,
      button: true
    }
  ];

  


  // Remove MEMBER column if no dependents
  if (customerInfo.data.dependents === undefined || customerInfo.data.dependents.length == 0) {
    if (customerInfo.data.hohPlans && customerInfo.data.hohPlans.length <= 1) {
      columns.splice(1,1)
    }
  }

  const Mobilecolumns = [{
    cell: (row) => <Paper id = {row.claimId} onClick={() => history.push({
      pathname: "/claimDetails",
      state: row
    })}>
      <Content>
        <ClaimTxt>CLAIM </ClaimTxt> <Claim>{row.claimId}</Claim>
        <span style={{ float: "right" }}><img alt = "" src="/react/images/icn-arrow-right.svg" style={{ float: 'right', marginRight: '15px' }} onClick={() =>
          history.push({
            pathname: "/claimDetails",
            state: row
          })} /></span></Content>
      <Content><ProviderTxt>PROVIDER</ProviderTxt> <Provider>{row.providerName}</Provider></Content>
      {
        !(customerInfo.data.dependents === undefined || customerInfo.data.dependents.length == 0) ?
          <Content><ProviderTxt>MEMBER</ProviderTxt> <Member>{row.memberName}</Member></Content>
          :
          null
      }
      <Content><ServiceTxt>SERVICE DATE</ServiceTxt> <Service>{row.serviceDate}</Service></Content>
      <Content><StatusTxt>STATUS</StatusTxt>
        {
          (row.claimStatus === "Processed" ?
            <MobileProcessedStatus>
              Processed
            </MobileProcessedStatus> : (row.claimStatus === "Denied") ?
              <MobileRejectedStatus>
                Denied
              </MobileRejectedStatus> :
              <MobilePendingStatus>
                Pending
              </MobilePendingStatus>
          )
        }
      </Content>
    </Paper>
  }];

  const tabStyle = {
    default: {
      fontSize: "14px",
      fontWeight: "bold",
      fontStretch: "normal",
      fontStyle: "normal",
      fontFamily: "museo-sans",
      lineHeight: 1.45,
      letterSpacing: "1px",
      textAlign: "center",
      color: "#474b55",
      textTransform: "none",
      minWidth: "80px",
      padding: "0 20px"
    },
    active: {
      fontSize: "14px",
      fontWeight: "bold",
      fontStretch: "normal",
      fontStyle: "normal",
      lineHeight: 1.45,
      letterSpacing: "1px",
      textAlign: "center",
      color: "#3e7128",
      textTransform: "none",
      fontFamily: "museo-sans",
      minWidth: "80px",
      padding: "0 20px"
    },
  };

  const isValidLOB = (code) => {
    return code == "42" || code == "45";
  }
  const handleSegmentBtn  = (row) => {
 
    // Segment Track
    const {claimId } = row;
    AnalyticsTrack( 
      'Claim Link Clicked', 
      customerInfo, 
      {
          "raw_text": 'Claim Link Clicked',
          "destination_url":  window.location.origin + '/claimsDetail',
          "category": ANALYTICS_TRACK_CATEGORY.claims, 
          "type": ANALYTICS_TRACK_TYPE.linkClicked,  
          "targetMemberId":row?.targetMemberId,
          "description": `Claim # ${claimId} Clicked`,
          "location": {
              "desktop":{
                  "width": 968,
                  "value": "center"
              },
              "tablet":{
                  "width": 768,
                  "value": "center"
              },
              "mobile":{
                  "width": 0,
                  "value": "center"
              }
          }
      }
    );
  }
  return (
    <Container>
    <FeatureTreatment
      treatmentName={SHOW_CLAIMS}
      onLoad={() => { }}
      onTimedout={() => { }}
      attributes={splitAttributes}
    >
      <>
        <GlobalStyle />
        <Box margin="40px 16px 8px 16px" display="flex" justifyContent="space-between">
          <ClaimText>Claims</ClaimText>
          {!isMobile && (
            <SubmitClaimButton handleClick={() => setShowSubmitClaimModal(true)} isMobile={isMobile}/>
          )}
          
        </Box>
        <Box margin="8px 16px 24px 16px" display="flex" justifyContent="space-between">
        <ClaimContent>
          Your Healthfirst account lets you access important information about your health plan. Here you can see the status of your claims.
          <br /><br />
          <ClaimContentSmallPrint>Keep in mind that due to sensitive health information, you may not able to view all your claims. If you have any questions, please call the Member Services phone number on your Member ID card for assistance.</ClaimContentSmallPrint>
          </ClaimContent>
          <ClaimButtonHidden isMobile={isMobile}><SubmitClaimButton  /></ClaimButtonHidden>
        </Box>
        
          
          {isMobile && (
            <Box margin="10px 16px 8px 16px" display="flex" justifyContent="space-between"><SubmitClaimButton isMobile={isMobile} handleClick={() => setShowSubmitClaimModal(true)} /></Box>
            
          )}
        {!customerInfo.loading && isValidLOB(customerInfo.data.companyCode) && membershipStatus === "active" && <TabsWrapper>
          <TabsContainer>
            <Tabs
              value={selectedTab}
              onChange={handleTabChange}
              TabIndicatorProps={{
                style: { background: "#3e7128" },
              }}
            >
              <Tab
                onClick={() => handleTabChange(0,0)}
                style={selectedTab === 0 ? tabStyle.active : tabStyle.default}
                label="Claims"
              />
              <FeatureTreatment
              treatmentName={SHOW_YEARTODATE_CLAIMS}
              onLoad={() => { }}
              onTimedout={() => { }}
              attributes={splitAttributes}
        >  
              <Tab
                onClick={() => handleTabChange(1,1)}
                style={selectedTab === 1 ? tabStyle.active : tabStyle.default}
                label="Year to Date"
              />
             </FeatureTreatment> 
            </Tabs>
          </TabsContainer>
          <HorizontalDivider />
        </TabsWrapper>
        }
        {
         ( selectedTab === 1 ) ?   
           <YearToDatePage /> :  null
        }
        {
          (selectedTab === 0 && claimListLoading != true ) ?
            <TableContent
              tab="claim"
              searchPlaceHolder="Search claims #'s, providers, etc."
              data={claimList}
              customerInfo={customerInfo["data"]}
              columns={columns}
              mobileColumns={Mobilecolumns}
              defaultSortFieldId="serviceDate"
              pathName="/claimDetails"
              defaultSortAsc={false}
              handleSegmentBtn={(row)=>handleSegmentBtn(row)}
          
            />
            :
            (selectedTab === 0) ?
              <ProgressWrapper>
                <Spinner />
              </ProgressWrapper>
              :
              null
        }
      </>
      <SubmitClaimModal unmountMe={() => setShowSubmitClaimModal(false)} showModal={showSubmitClaimModal} />
    </FeatureTreatment>
    <FeatureTreatment
      treatmentName={SHOW_CLAIMS}
      onLoad={() => { }}
      onTimedout={() => { }}
      attributes={splitAttributes}
      invertBehavior
    >
      <GlobalError/>
      </FeatureTreatment>
    </Container>
  );
};
const SubmitClaimButtonMobile = styled(SubmitClaimButton)`
width:100%`
const Container = styled(MainContentContainer)`
  background-color:#f4f4f4;
  max-width: 1024px;
  position: relative;
  // margin: auto;
  align-self: center;
  width: 100%;
  margin-bottom:1rem;
`;

const HorizontalDivider = styled.div`
  height: 1px;
  background-color: #d8d8d8  ;
  @media only screen and (min-width: 769px) {
  }
  margin: 0px 16px 0px;
  min-width: 600px;
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
  color:#003863;
  display: flex;
  align-self: flex-end;
`;
const ClaimButtonHidden = styled.div`
${({isMobile}) => !isMobile ? `visibility : hidden` : `display:none`};
`;
const ClaimContent = styled.div`
@media only screen and (min-width: 769px) {
}
  font-size: 16px;
  font-weight: 300;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: normal;
  color:#474b55;
  margin-right: 73px;
  
`;

const ClaimContentSmallPrint = styled.div`
  font-size: 12px;
  font-weight: 500;
`;

const TabsWrapper = styled.div`
`;

const TabsContainer = styled.div`
@media only screen and (min-width: 769px) {
}
margin: 0px 16px 0px;
`;

const PendingStatus = styled.span`
  
  padding: 5px;
  background-color:#a8abac;
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

const MobilePendingStatus = styled.span`
  margin-left: 25px;
  
  padding: 3px 31px;
  background-color:#a8abac;
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
  
  padding: 5px;
  background-color:#003863;
  border-radius: 5px;
  font-size: 12px;
  font-weight: bold;
  text-align: center;
  color: #ffffff;
  text-transform: uppercase;
  box-sizing: initial;
  line-height: normal;
  box-sizing: initial;
  line-height: normal;
  letter-spacing: 1.5px;
`;

const MobileProcessedStatus = styled.span`
  margin-left: 25px;
  
  padding: 3px 31px;
  background-color:#003863;
  border-radius: 5px;
  font-size: 12px;
  font-weight: bold;
  text-align: center;
  color: #ffffff;
  text-transform: uppercase;
  margin-top:0px;
  margin-right: -15px;
  box-sizing: initial;
  line-height: normal;
  letter-spacing: 1.5px;
`;

const RejectedStatus = styled.p`
  
  padding: 5px;
  background-color:#ad122a;
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

const MobileRejectedStatus = styled.span`
  margin-left: 25px;
  margin-right: 10px;
  margin-top:0px;
  
  padding: 3px 31px;
  background-color:#ad122a;
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

const UnknownStatus = styled.p`
  
  padding: 5px;
  background-color:#a8abac;
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

const MobileUnknownStatus = styled.span`
  margin-left: 25px;
  margin-right: 10px;
  margin-top:0px;
  
  padding: 3px 31px;
  background-color:#a8abac;
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

const ClaimTxt = styled.span`
  margin: 0 70px 4px 0;
  font-size: 12px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 2.33;
  letter-spacing: 0.2px;
  color: #757575;`
  ;


const Claim = styled.span`
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

const ServiceTxt = styled.span`
  margin: 5px 24px 4px 0;
  font-size: 12px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 2.33;
  letter-spacing: 0.2px;
  color: #757575;
`;


const Service = styled.span`
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
  width:100%;
  margin-top: 10px;
  margin-bottom: 10px;
`;

const ClaimNbr = styled.p`
  font-size: 14px;
  font-weight: bold;
  color:#474b55;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ProgressWrapper = styled.div`
  width:100%;
  margin-top: 10px;
  margin-bottom: 10px;
`;

export default ClaimsPage;