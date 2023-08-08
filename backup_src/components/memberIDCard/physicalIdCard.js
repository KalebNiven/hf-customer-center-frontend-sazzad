import React, { useEffect, useMemo } from "react";
import styled from "styled-components";
import { ANALYTICS_TRACK_TYPE, ANALYTICS_TRACK_CATEGORY } from "../../constants/segment";
import Spinner from "../common/spinner";
import { useDispatch, useSelector } from "react-redux";
import useWindowDimensions from "../../libs/useWindowDimensions";
import {AnalyticsPage, AnalyticsTrack } from "../../components/common/segment/analytics";
// import { SHOW_MAIL_ID_CARD } from "./constants/splits";
// import { FeatureTreatment } from "./libs/featureFlags";
// import store from "./store/store";
// import { Provider, useSelector, useDispatch } from "react-redux";
// import { FeatureFactory } from "./libs/featureFlags";
// import { getFeatureFlagList } from "./constants/splits";


const PhysicalIdCard = (props) => {

    const customerInfo = useSelector((state) => state.customerInfo);
    const idCard = useSelector((state) => state.physicalIdCard.idCard);
    const idCardLoading = useSelector((state) => state.physicalIdCard.loading);

    const print = () => {
        window.print();
    }
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
          "targetMemberId": customerInfo?.data?.memberId,
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


    useEffect(() => {
       // dispatch(requestIdCard(props.memberId));
    }, []);

    let front
    const { width } = useWindowDimensions();
    const { frontImage = "", backImage = "" } = useMemo(() => {
        if (idCard[props.memberId]) {
            const { physicalIdCard } = idCard[props.memberId]
            return { frontImage: physicalIdCard?.frontImage, backImage: physicalIdCard?.backImage };
        }
        return {}
    }, [idCard]) 
    const dispatch = useDispatch();
    return (
        <>
        {
        idCardLoading ?
        <Container>
            <ProgressWrapper>
                <Spinner />
            </ProgressWrapper>
        </Container> : (
        <Container>
            <Label className="no-print">Physical ID Card</Label>
            <Description className="no-print"> This is your official Healthfirst insurance ID card. Share this card with your doctors at any time using our
                {" "}
                <LinkToMobile
                onClick={()=> handleSegmentBtn("Mobile App")}
                    href={"https://apps.apple.com/us/app/healthfirst-ny/id1464792066"}
                    target="_blank"
                    segment-track="Link Clicked"
                    segment-props={JSON.stringify({ "location": "ID Card ", "raw_text": "Mobile App", "destination_url": 'https://apps.apple.com/us/app/healthfirst-ny/id1464792066' })}>
                    Mobile App
                </LinkToMobile>
                <PrintAndEmailContainer className="py-2 no-print">
                    <PrintContainer>
                        <PrintIcon alt="" src={`${window.location.origin}/react/images/iconography-icn-print.svg`} />
                        <PrintButton
                            onClick={
                                (event)=>{
                                    AnalyticsTrack(
                                        "Physical ID Card Print Button Clicked", 
                                        customerInfo, 
                                        {
                                            "raw_text": "Print", 
                                            "destination_url": "N/A", 
                                            "category": ANALYTICS_TRACK_CATEGORY.memberIdCard, 
                                            "type": ANALYTICS_TRACK_TYPE.linkClicked, 
                                            "targetMemberId": props.memberId,
                                            "location": {
                                                "desktop":{
                                                    "width": 1024,
                                                    "value": "right"
                                                },
                                                "tablet":{
                                                    "width": 768,
                                                    "value": "right"
                                                },
                                                "mobile":{
                                                    "width": 0,
                                                    "value": "bottom right"
                                                }
                                            }
                                        }
                                    );
                                    print(); 
                                }
                            }>
                            Print
                        </PrintButton>
                    </PrintContainer>
                </PrintAndEmailContainer>
            </Description>
            <SVGContainerWrapper align={"vertical"}>
                <SVGContainerFront align={"vertical"}s>
                    <FrontIDcard src={`data:image/svg+xml,${encodeURIComponent(frontImage)}`} alt="" align={"vertical"} windowWidth={width}/>
                </SVGContainerFront>
                <SVGContainerBack align={"vertical"}>
                    <BackIdCard src={`data:image/svg+xml,${encodeURIComponent(backImage)}`} alt="" align={"vertical"} windowWidth={width}/>
                </SVGContainerBack>
            </SVGContainerWrapper>
        </Container>
        )}
        </>
    )
}

const PrintIcon = styled.img`

`;

const PrintButton = styled.div`
    color: #008bbf;
    cursor: pointer;
    font-size:12px;
    font-weight:bold;
    &:hover{
      text-decoration: underline;
      color: #2A6A9E
    }
`;

const SVGContainerWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: ${(props) => (props.align === "vertical" ? "column" : "row")};
`;
const SVGContainerFront = styled.div`
margin: 4px 0px;
  position: relative;
  width: 295px;
  height: 196.5px;
  @media (max-width: 768px) {
    width: ${(props) => (props.align === "vertical" ? "100vw" : "50vw")};
    height: calc(
      0.61 * ${(props) => (props.align === "vertical" ? "100vw" : "50vw")}
    );
  }
`;
const SVGContainerBack = styled.div`
margin: 4px 0px;
  position: relative;
  width: 295px;
  height: 175.5px;
  @media (max-width: 768px) {
    width: ${(props) => (props.align === "vertical" ? "100vw" : "50vw")};
    height: calc(
      0.61 * ${(props) => (props.align === "vertical" ? "100vw" : "50vw")}
    );
  }
`;
const FrontIDcard = styled.img`
width: 1036px;
  height: 632px;
  transform: scale(calc(295 / 1036));
  transform-origin: top left;
  position: absolute;
  top: 0;
  left: 0;
  @media (max-width: 768px) {
    transform: scale(
      ${(props) =>
        props.align === "vertical"
          ? props.windowWidth / 1036
          : props.windowWidth / 2 / 1036}
    );
  }
  display: block;
`;
const BackIdCard = styled.img`
width: 1036px;
  height: 632px;
  transform: scale(calc(295 / 1036));
  transform-origin: top left;
  position: absolute;
  top: 0;
  left: 0;
  @media (max-width: 768px) {
    transform: scale(
      ${(props) =>
        props.align === "vertical"
          ? props.windowWidth / 1036
          : props.windowWidth / 2 / 1036}
    );
  }
  display: block;
`;

const Label = styled.div`
   {
    width: 136px;
    height: 24px;
    margin: 0 51px 8px 0;
    font-size: 18px;
    font-weight: 500;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.33;
    letter-spacing: normal;
  }
@media only screen and (max-width: 768px) {
  font-size: 16px;
  align-self: start;
}

`;
const Container = styled.div`
    font-family: museo-sans;
    @media only screen and (max-width: 768px) {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
`;


const Description = styled.div`
    width: 100%; 
`;
const LinkToMobile = styled.a`
    font-weight:bold;
    color:#008bbf;
    cursor:pointer
`;
const PrintAndEmailContainer = styled.div`
    display:flex;
    justify-content:end;
    gap: 16px;
    @media only screen and (max-width: 768px) {
        width:290px;
        margin:auto;
        margin-top: 8px;
        margin-bottom: 16px;
        float: right;
    }
`
const PrintContainer = styled.div`
    display:flex;
    gap:6px;
    align-items:flex-start;
`
const EmailContainer = styled.div`
    display:flex;
    gap:8px
`
const ProgressWrapper = styled.div`
  width:100%;
  margin-top: 10px;
  margin-bottom: 10px;
`

export default PhysicalIdCard;


