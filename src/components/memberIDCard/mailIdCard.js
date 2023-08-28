import React, { useEffect, useState,useMemo } from "react";
import styled from "styled-components";
import { ANALYTICS_TRACK_TYPE, ANALYTICS_TRACK_CATEGORY } from "../../constants/segment";
import { requestCustomerDemographicsInfo } from '../../store/actions/index';
import Spinner from "../common/spinner";
import { useDispatch, useSelector } from "react-redux";
import {AnalyticsPage, AnalyticsTrack } from "../../components/common/segment/analytics";
import MailIdCardButton from './mailIdCardButton'
import MailMemberIDCardForm from './mailMemberIDCardForm'
import moment from "moment";


const MailIdCard = (props) => {

    const customerInfo = useSelector((state) => state.customerInfo);
    const mailMemberIDCardStatus = useSelector((state) => state.correspondenceStatus);
    const customerDemographicsInfo = useSelector( (state) => state.customerDemographicsInfo.data);
    const [renderIdCardForm, setRenderIdCardForm] = useState(false);
    const [latestStatusRecord, setLatestStatusRecord] = useState(null);

    const handleSegmentBtn = (label) => { 
 
      AnalyticsPage()
      // Segment Track
      AnalyticsTrack(
        label + " " + "link clicked",
        customerInfo,
        {
          "raw_text": label,
          "destination_url": window.location.pathname,
          "description": label,
          "category": ANALYTICS_TRACK_CATEGORY.memberIdCard,
          "type": ANALYTICS_TRACK_TYPE.linkClicked,
          "targetMemberId": props?.memberSelection?.memberId,
          "location": {
            "desktop": {
              "width": 960,
              "value": "left"
            },
            "tablet": {
              "width": 768,
              "value": "right"
            },
            "mobile": {
              "width": 0,
              "value": "right"
            }
          }
        }
      );
     
    }

    const handleClickToCarrierSite = (url) => { 
      // TODO Segment
    }

    useEffect(() => {
       // dispatch(requestIdCard(props.memberId));
       dispatch(requestCustomerDemographicsInfo(customerInfo.data.memberId));
    }, []);
    useEffect(() => {
      if(!mailMemberIDCardStatus.loading && (typeof(mailMemberIDCardStatus.data) !== "undefined" && mailMemberIDCardStatus.data !== null && mailMemberIDCardStatus.data.length != 0 ? true : false)){
        setLatestStatusRecord(getLatestStatus(mailMemberIDCardStatus.data[1], mailMemberIDCardStatus.data[0].status, mailMemberIDCardStatus.data[0][mailMemberIDCardStatus.data[1]], mailMemberIDCardStatus.data[0].IMBbarcode, mailMemberIDCardStatus.data[0].SLA, mailMemberIDCardStatus.data[0].mailingAddress, mailMemberIDCardStatus.data[0].newAddress));
      }
   }, [mailMemberIDCardStatus]);

    const openForm = () => {
      setRenderIdCardForm(true);
    };

    const standardizeAddress = (address, type) => {
      switch (type) {
        case "mailingAddress":
          return {
            'addr1': address.addressLn1 ?? '',
            'addr2': address.addressLn2 ?? '',
            'city': address.city ?? '',
            'state': address.state ?? '',
            'zip': address.zip ?? '',
          };
        case "newAddress":
          return {
            'addr1': address.newAddressLn ?? '',
            'addr2': address.newAddressLn2 ?? '', // Honestly complete guess that this is the identifier... contract is still incredibly unclear. Fingers crossed ¯\_(ツ)_/¯
            'city': address.newCity ?? '',
            'state': address.newState ?? '',
            'zip': address.newZip ?? '',
          };
          default:
          return null;
      }
    };

    const formatDate = (date) => {
      try{
        return moment(date, "YYYY-MM-DD").format(
          "MM-DD-YYYY"
        );
      }
      catch(e){
        console.log(e);
        return date;
      }
    };

    const resolveTrackingCodeURL = (trackingCode, carrier) => {
      switch (carrier) {
        case "FedEx":
          return 'https://www.fedex.com/fedextrack/?trknbr='+trackingCode;
        case "USPS":
          return 'https://tools.usps.com/go/TrackConfirmAction?tLabels='+trackingCode;
        default:
          return null;
      }
    };

    const getLatestStatus = (statusDateId, status, statusDate, trackingCode, sla, mailingAddress, newAddress) => {
      let carrier = (sla === 'Next day' ? 'FedEx' : 'USPS'); // Honestly not sure what responses this is gonna return either... contract isnt clear regarding this. Oh well hopefully this gets figured out during QA testing since that will hopefully involve stepping through the whole process if done right... Then again if done right we'd have good contracts... fingers crossed ¯\_(ツ)_/¯
      switch (status) {
        case "Request initiated":
          return {
            'title': 'Processing',
            'description': 'Your New Member ID Card request is currently being processed.',
            'lastUpdateDate': formatDate(statusDate),
            'carrier': carrier,
            'trackingCode': trackingCode, // Conflicting responses regarding what this can represent and when... were going to base it off the supposed 'You can differentiate it based on SLA, if it is 1day then it is FedEx rest USPS'
            'trackingCodeURL': resolveTrackingCodeURL(trackingCode, carrier),
            'currAddr': (newAddress?.newAddressLn != null ? standardizeAddress(newAddress, 'newAddress') : standardizeAddress(mailingAddress, 'mailingAddress')),
            'prevAddr': (newAddress?.newAddressLn != null ? standardizeAddress(mailingAddress, 'mailingAddress') : null)
          };
        case "In progress":
          return {
            'title': 'Preparing to Ship',
            'description': 'Your New Member ID Card is getting ready to ship to your address.',
            'lastUpdateDate': formatDate(statusDate),
            'carrier': carrier,
            'trackingCode': trackingCode,
            'trackingCodeURL': resolveTrackingCodeURL(trackingCode, carrier),
            'currAddr': (newAddress?.newAddressLn != null ? standardizeAddress(newAddress, 'newAddress') : standardizeAddress(mailingAddress, 'mailingAddress')),
            'prevAddr': (newAddress?.newAddressLn != null ? standardizeAddress(mailingAddress, 'mailingAddress') : null)
          };
        case "Printed":
          return {
            'title': 'Preparing to Ship',
            'description': 'Your New Member ID Card is getting ready to ship to your address.',
            'lastUpdateDate': formatDate(statusDate),
            'carrier': carrier,
            'trackingCode': trackingCode,
            'trackingCodeURL': resolveTrackingCodeURL(trackingCode, carrier),
            'currAddr': (newAddress?.newAddressLn != null ? standardizeAddress(newAddress, 'newAddress') : standardizeAddress(mailingAddress, 'mailingAddress')),
            'prevAddr': (newAddress?.newAddressLn != null ? standardizeAddress(mailingAddress, 'mailingAddress') : null)
          };
        case 'Mailed':
          return {
            'title': 'Shipped',
            'description': 'Your New Member ID Card has been shipped.',
            'lastUpdateDate': formatDate(statusDate),
            'carrier': carrier,
            'trackingCode': trackingCode,
            'trackingCodeURL': resolveTrackingCodeURL(trackingCode, carrier),
            'currAddr': (newAddress?.newAddressLn != null ? standardizeAddress(newAddress, 'newAddress') : standardizeAddress(mailingAddress, 'mailingAddress')),
            'prevAddr': (newAddress?.newAddressLn != null ? standardizeAddress(mailingAddress, 'mailingAddress') : null)
          };
        case "Delivered by Fedex":
          return {
            'title': 'Delivered',
            'description': 'Your Member ID was delivered successfully.',
            'lastUpdateDate': formatDate(statusDate),
            'carrier': carrier,
            'trackingCode': trackingCode,
            'trackingCodeURL': resolveTrackingCodeURL(trackingCode, carrier),
            'currAddr': (newAddress?.newAddressLn != null ? standardizeAddress(newAddress, 'newAddress') : standardizeAddress(mailingAddress, 'mailingAddress')),
            'prevAddr': (newAddress?.newAddressLn != null ? standardizeAddress(mailingAddress, 'mailingAddress') : null)
          };
        case 'Scanned at USPS': // Honestly not sure what this one is supposed to represent... contract pretty unclear on what condition tree this status could be reprentative of by itself or paired with other conditions. Basically it sounds like there are no guarantees as to what this means from conversations had with correspondence team... Processing seems fine for now
          return {
            'title': 'Processing',
            'description': 'Your New Member ID Card request is currently being processed.',
            'lastUpdateDate': formatDate(statusDate),
            'carrier': carrier,
            'trackingCode': trackingCode,
            'trackingCodeURL': resolveTrackingCodeURL(trackingCode, carrier),
            'currAddr': (newAddress?.newAddressLn != null ? standardizeAddress(newAddress, 'newAddress') : standardizeAddress(mailingAddress, 'mailingAddress')),
            'prevAddr': (newAddress?.newAddressLn != null ? standardizeAddress(mailingAddress, 'mailingAddress') : null)
          };
        case "Forwarded":
          return {
            'title': 'Forwarded',
            'description': 'Your Member ID has been forwarded to your new address.',
            'lastUpdateDate': formatDate(statusDate),
            'carrier': carrier,
            'trackingCode': trackingCode,
            'trackingCodeURL': resolveTrackingCodeURL(trackingCode, carrier),
            'currAddr': (newAddress?.newAddressLn != null ? standardizeAddress(newAddress, 'newAddress') : standardizeAddress(mailingAddress, 'mailingAddress')),
            'prevAddr': (newAddress?.newAddressLn != null ? standardizeAddress(mailingAddress, 'mailingAddress') : null)
          };
        case "Returned":
          return {
            'title': 'Returned to Sender',
            'description': 'Your Member ID was returned due to Change of Address.',
            'lastUpdateDate': formatDate(statusDate),
            'carrier': carrier,
            'trackingCode': trackingCode,
            'trackingCodeURL': resolveTrackingCodeURL(trackingCode, carrier),
            'currAddr': (newAddress?.newAddressLn != null ? standardizeAddress(newAddress, 'newAddress') : standardizeAddress(mailingAddress, 'mailingAddress')),
            'prevAddr': (newAddress?.newAddressLn != null ? standardizeAddress(mailingAddress, 'mailingAddress') : null)
          };
        default:
          // TODO Call Segment to inform no clear status
          return null;
      }
    };

    const dispatch = useDispatch();
    return (
        <>
        {
        false ? // This will be replaced with status loading
        <Container>
            <ProgressWrapper>
                <Spinner />
            </ProgressWrapper>
        </Container> : (
        <Container>
            {(latestStatusRecord != null) ?
              <>
                <Label className="no-print">Mail ID Card Status</Label>
                <br />
                <AltDescription className="no-print">Order Status</AltDescription>
                <MailIdCardContainer>
                  <Card>
                    <StatusLabel>{latestStatusRecord['title']}</StatusLabel>
                    <StatusDate>Last Updated {latestStatusRecord['lastUpdateDate']}</StatusDate>
                    <StatusDescription>Your New Member ID Card has been shipped.</StatusDescription>
                    {(latestStatusRecord['trackingCodeURL'] != null && latestStatusRecord['trackingCode'] != null) ?
                      <TrackingContainer>
                        <TrackingIcon alt="" src="/react/images/delivery.svg" />
                        <TrackingVerbiage>Tracking # <TrackingLink href={latestStatusRecord['trackingCodeURL']} target='_blank' rel='noreferrer noopener' onClick={() => handleClickToCarrierSite(latestStatusRecord['trackingCodeURL'])}>{latestStatusRecord['trackingCode']}</TrackingLink></TrackingVerbiage>
                      </TrackingContainer>
                    : null
                    }
                    <DeliveryAddressesContainer>
                      {latestStatusRecord['currAddr'] != null ?
                      <DeliveryAddressContainer>
                        <DeliveryAddressTitle>Mailing ID Card to:</DeliveryAddressTitle>
                        <DeliveryAddress>{latestStatusRecord['currAddr']['addr1']+' '+latestStatusRecord['currAddr']['addr2']}</DeliveryAddress>
                        <DeliveryAddress>{latestStatusRecord['currAddr']['city']+', '+latestStatusRecord['currAddr']['state']+' '+latestStatusRecord['currAddr']['zip']}</DeliveryAddress>
                      </DeliveryAddressContainer>
                      :
                      null
                      }
                      {latestStatusRecord['prevAddr'] != null ?
                      <DeliveryAddressContainer>
                        <DeliveryAddressTitle>Previous Address:</DeliveryAddressTitle>
                        <DeliveryAddress>{latestStatusRecord['prevAddr']['addr1']+' '+latestStatusRecord['prevAddr']['addr2']}</DeliveryAddress>
                        <DeliveryAddress>{latestStatusRecord['prevAddr']['city']+', '+latestStatusRecord['prevAddr']['state']+' '+latestStatusRecord['prevAddr']['zip']}</DeliveryAddress>
                      </DeliveryAddressContainer>
                      :
                      null
                      }
                    </DeliveryAddressesContainer>
                  </Card>
                </MailIdCardContainer>
              </>
              :
              <>
                <Label className="no-print">Need a New ID Card?</Label>
                <Description className="no-print">Order a new Member ID Card and have it send directly to you home address.</Description>
                <MailIdCardContainer>
                  <MailIdCardButton handleClick={openForm} disableBtn={typeof(mailMemberIDCardStatus.data) !== "undefined" && mailMemberIDCardStatus.data !== null && mailMemberIDCardStatus.data[0] !== null ? true : false} memberId={props?.memberSelection?.memberId} />
                  {(typeof(mailMemberIDCardStatus.data) !== "undefined" && mailMemberIDCardStatus.data !== null && mailMemberIDCardStatus.data.length != 0 ? true : false) ?
                  <RecentRequestText className="no-print">A physical Member ID Card was recently requested. A new request can be made after 14 days.</RecentRequestText>
                  :
                  null}
                </MailIdCardContainer>
              </>
            }
            <MailMemberIDCardForm showForm={renderIdCardForm} member={props?.memberSelection} customerDemographicsInfo = {customerDemographicsInfo} unmountMe={() => setRenderIdCardForm(false)}/>
        </Container>
        )}
        </>
    )
}

const Container = styled.div`
    font-family: museo-sans;
    @media only screen and (max-width: 820px) {
        display: flex;
        flex-direction: column;
        align-items: left;
    }
`;

const MailIdCardContainer = styled.div`
margin-left:15px;
margin-right:15px;
@media (max-width: 480px) {
  margin-left:0;
  margin-right:0;
  width: 100%;
}
`

const Label = styled.div`
text-align: left;
width: 100%;
@media only screen and (max-width: 480px) {
  margin: 0px 0px;
}
  font-size: 24px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  padding-top: 2rem;
  letter-spacing: normal;
  color:#003863;
  margin: 0px 15px;
`;


const Description = styled.div`
text-align: left;
width: 100%;
@media only screen and (max-width: 480px) {
  margin: 8px 0px 16px;
}
  font-size: 16px;
  color: #474B55;
  line-height: 25px;
  font-weight: 400;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  margin: 8px 15px 16px;
`;

const RecentRequestText = styled.p`
  margin-top: .5rem;
  font-size: 14px;
  color: #474b55;
  line-height: 1.43;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
`;

const ProgressWrapper = styled.div`
  width:100%;
  margin-top: 10px;
  margin-bottom: 10px;
`

const AltDescription = styled.div`
text-align: left;
width: 100%;
@media only screen and (max-width: 480px) {
  margin: 8px 0px 16px;
}
  color: #003863;
  font-size: 1.125rem;
  font-style: normal;
  font-weight: 600;
  line-height: 1.5rem;
  letter-spacing: normal;
  margin: 8px 15px 16px;
`;

const Card = styled.div`
  width:100%;
  flex-grow: 0;
  margin: 16px 0 32px;
  padding: 1.5rem;
  border-radius: 4px;
  background-color: #ffffff;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
`;

const StatusLabel = styled.div`
  font-size: 1.125rem;
  font-style: normal;
  font-weight: 600;
  line-height: 1.5rem;
  color: #003863;
`;
const StatusDate = styled.div`
  font-size: 0.75rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1rem;
  color: #757575;
  margin-top: .3rem;
`;
const StatusDescription = styled.div`
  font-size: 0.875rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.5rem;
  color: #474B55;
  margin-top: 1rem;
`;
const TrackingContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: .3rem;
`;
const TrackingIcon = styled.img`
margin-right: .2rem;
`;
const TrackingVerbiage = styled.p`
  display: inline;
  font-size: 0.875rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.5rem;
  color: #474B55;
`;
const TrackingLink = styled.a`
  display: inline;
  font-size: 0.875rem;
  font-style: normal;
  font-weight: 600;
  line-height: 1.5rem;
  color: #008BBF;
  &:hover{
    cursor:pointer;
    text-decoration:underline;
    color:#2A6A9E
  }
`;
const DeliveryAddressesContainer = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;
`;
const DeliveryAddressContainer = styled.div`
  margin-top: 1.5rem;
`;
const DeliveryAddressTitle = styled.div`
  font-size: 0.875rem;
  font-style: normal;
  font-weight: 600;
  line-height: 1.25rem;
  color: #474B55;
`;
const DeliveryAddress = styled.div`
  font-size: 0.875rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.5rem;
  color: #474B55;
`;

export default MailIdCard;


