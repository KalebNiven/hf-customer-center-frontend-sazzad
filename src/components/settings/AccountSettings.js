import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import HealthPlans from "./HealthPlans";
import Paperless from "./Paperless";
import LoginSecurity from "./LoginSecurity";
import ContactInformation from './ContactInformation';

import { AnalyticsTrack } from "../../components/common/segment/analytics";
import { ANALYTICS_TRACK_TYPE, ANALYTICS_TRACK_CATEGORY } from "../../constants/segment";
import UpdatedContactInformation from "./UpdatedContactInformation";
import { SHOW_CONTACT_INFO, SHOW_CONTACT_INFO_PM_WIDGET, SHOW_PAPERLESS_WIDGET } from "../../constants/splits";
import { useLocation } from "react-router-dom";
import { FeatureTreatment } from "../../libs/featureFlags";
import { useAppContext } from '../../AppContext'

const AccountSettings = () => {
  const [selectIndex, setSelectIndex] = useState(0);
  const [activeTabForPrevPlan, SetActiveTabForPrevPlan] = useState("active");
  const [selectedLeafIndex, setSelectedLeafIndex] = useState(0);
  const [showRight, setShowRight] = useState(false);
  const customerInfoData = useSelector(state => state.customerInfo)
  const customerInfo = useSelector(state => state.customerInfo.data);
  const { openPaperLess, setOpenPaperLess } = useAppContext()
  const splitAttributes = {
    lob: customerInfo?.sessLobCode,
    companyCode: customerInfo?.companyCode,
    benefitPackage: customerInfo?.benefitPackage,
    membershipStatus: customerInfo?.membershipStatus,
    accountStatus: customerInfo?.accountStatus
  };
  const location = useLocation();

  useEffect(() => {
    setSelectIndex(location?.state?.sideBarIndex || 0)
    if(location?.state?.sideBarIndex === 3){
    SetActiveTabForPrevPlan("inactive")
    setShowRight(true);
    }
  }, [location]);

  const [sideBarItems, setSideBarItems] = useState([{
    leafTitle: "Account",
    items: [
      {
        label: "Login & Security",
        imgContentSrc: "react/images/SecurityIcon.svg",
        imgIconSrc: "react/images/icn-arrow-right.svg",
        backgroundColor: "#eaeaea",
        destination_url: null
      },
      {
        label: "Contact Information",
        imgContentSrc: "react/images/iconography__nav_user.svg",
        imgIconSrc: "react/images/icn-arrow-right.svg",
        backgroundColor: "#eaeaea",
        destination_url: null
      },
      {
        label: "Paperless",
        imgContentSrc: "react/images/paperless.svg",
        imgIconSrc: "react/images/icn-arrow-right.svg",
        backgroundColor: "#eaeaea",
        destination_url: null
      },
      {
        label: "Your Healthfirst Plans",
        imgContentSrc: "/img/dark/ico-id.svg",
        imgIconSrc: "react/images/icn-arrow-right.svg",
        backgroundColor: "#eaeaea",
        destination_url: null
      }
    ]
  }, {
    leafTitle: "Support",
    items: [
      {
        label: "About Healthfirst",
        imgContentSrc: "/img/light/ico-leaf.svg",
        imgIconSrc: "react/images/icn-arrow-right.svg",
        backgroundColor: "#529535",
        destination_url: "https://healthfirst.org/about-us/"
      },
      {
        label: "Understand Your Health Data",
        imgContentSrc: "/img/other/ico-medical-shield.svg",
        imgIconSrc: "react/images/icn-arrow-right.svg",
        backgroundColor: "#ab3291",
        backgroundPosition: "0",
        destination_url: "https://healthfirst.org/faqs#tab1-7"
      },
      {
        label: "Terms & Conditions",
        imgContentSrc: "/img/light/ico-check.svg",
        imgIconSrc: "react/images/icn-arrow-right.svg",
        backgroundColor: "#002a4a",
        destination_url: process.env.MIX_TERMS_CONDITIONS,
      }, {
        label: "Privacy Statements",
        imgContentSrc: "/img/light/ico-lock.svg",
        imgIconSrc: "react/images/icn-arrow-right.svg",
        backgroundColor: "#f7911d",
        destination_url: process.env.MIX_PRIVACY_STMTS
      }, {
        label: "Contact Us",
        imgContentSrc: "/img/light/ico-phone.svg",
        imgIconSrc: "react/images/icn-arrow-right.svg",
        backgroundColor: "#008bbf",
        destination_url: "https://healthfirst.org/contact"
      }
    ]
  }
  ])
  const handleNavClick = (index) => {
    setSelectIndex(index);
    SetActiveTabForPrevPlan("active");
    setShowRight(true);
  }
  const handleSegmentBtn = (eachItem) => {
    const { destination_url, label } = eachItem;
    // Segment Track
    AnalyticsTrack(
      label + " " + "link clicked",
      customerInfoData,
      {
        "raw_text": label,
        "destination_url": destination_url,
        "description": label,
        "category": ANALYTICS_TRACK_CATEGORY.settings,
        "type": ANALYTICS_TRACK_TYPE.linkClicked,
        "targetMemberId": customerInfoData?.data?.memberId,
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
  const displayRightPanel = () => {
    const getContactInfoScreen = () => {

      return (
        <>
          <FeatureTreatment
            treatmentName={SHOW_CONTACT_INFO}
            onLoad={() => { }}
            onTimedout={() => { }}
            attributes={splitAttributes}
          >
            <ContactInformation />
          </FeatureTreatment>

          <FeatureTreatment
            treatmentName={SHOW_CONTACT_INFO_PM_WIDGET}
            onLoad={() => { }}
            onTimedout={() => { }}
            attributes={splitAttributes}
          >
            <UpdatedContactInformation />
          </FeatureTreatment>
        </>
      )
    }

    switch (selectIndex) {
      case 0:
        return <LoginSecurity />;
      case 1:
        return getContactInfoScreen();
      case 2:
        return <Paperless customerInfo={customerInfo} />
      case 3:
        return <HealthPlans customerInfo={customerInfo}  activeTabForPrevPlan = {activeTabForPrevPlan} />
    }
  }

  const handleBack = () => {
    setShowRight(false);
  }

  useEffect(() => {
    if (openPaperLess) {
      setOpenPaperLess(false)
      handleNavClick(2)
    }

  }, []);
  const navItemClick = (eachItem, itemIndex, leafindex) => {



    if (leafindex === 0) {
      handleNavClick(itemIndex)
    }
    else {
      window.open(eachItem.destination_url, "_blank")
    }
    handleSegmentBtn(eachItem)
    setSelectedLeafIndex(leafindex)

  }
  return (
    <Container>
      <TitleName>{customerInfo.firstName} {customerInfo.lastName}</TitleName>
      <SubTitle>{customerInfo?.hohPlans?.[0]?.PlanName?.toLowerCase()}</SubTitle>
      <HorizontalDivider />
      <Section>
        <LeftPanel hide={showRight}>
          {
            sideBarItems.map((leafItem, leafindex) => {
             
              return (
                  <>
                    <LeftTitle>{leafItem.leafTitle}</LeftTitle>
                    {
                      leafItem.items.map((eachItem, itemIndex, items) => {
                        return (
                          eachItem.label ==="Paperless"?(
                            <FeatureTreatment
                            treatmentName={SHOW_PAPERLESS_WIDGET}
                            onLoad={() => { }}
                            onTimedout={() => { }}
                            attributes={splitAttributes}
                          >
                             <NavWrapper borderRadius={itemIndex === 0 ? "4px 4px 0 0" : itemIndex === items.length - 1 ? "0 0 4px 4px" : ""} onClick={() => navItemClick(eachItem, itemIndex, leafindex)} active={selectIndex === itemIndex && selectedLeafIndex === leafindex}>
                            <ImgBlock><ImgContent src={eachItem.imgContentSrc} background={eachItem.backgroundColor} backgroundPosition={eachItem.backgroundPosition} /></ImgBlock>
                            <Option>{eachItem.label}</Option>
                            <InlineInnerFixedContainer>
                              <IconImg src={eachItem.imgIconSrc} />
                            </InlineInnerFixedContainer>
                          </NavWrapper>                          
                          </FeatureTreatment>
                          ):(
                          <NavWrapper borderRadius={itemIndex === 0 ? "4px 4px 0 0" : itemIndex === items.length - 1 ? "0 0 4px 4px" : ""} onClick={() => navItemClick(eachItem, itemIndex, leafindex)} active={selectIndex === itemIndex && selectedLeafIndex === leafindex}>
                            <ImgBlock><ImgContent src={eachItem.imgContentSrc} background={eachItem.backgroundColor} backgroundPosition={eachItem.backgroundPosition} /></ImgBlock>
                            <Option>{eachItem.label}</Option>
                            <InlineInnerFixedContainer>
                              <IconImg src={eachItem.imgIconSrc} />
                            </InlineInnerFixedContainer>
                          </NavWrapper>
                          )
                        )
                      })

                    }

                  </>
                

              )
            })
          }

        </LeftPanel>
        <RightPanel show={showRight}>
          <MainDiv onClick={handleBack}>
            <BackImg src="/img/dark/ico-back.svg" />
            <BackText>BACK</BackText>
          </MainDiv>
          {displayRightPanel()}
        </RightPanel>
      </Section>
    </Container>

  )
};

export default AccountSettings;

const Container = styled.div`
  max-width: 1024px;
  position: relative;
  // margin: auto;
  align-self:center;
  height: 100%;
  width: 100%;
  margin-bottom: 5rem;
  @media only screen and (min-width: 768px) and (max-width: 1024px){
    margin: initial;
    margin-bottom: 5rem;
  }
`;

const TitleName = styled.div`
  font-size: 24px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: normal;
  text-align: left;
  color: #003863;
  margin-top: 30px;
  
  @media only screen and (max-width: 767px) {
    margin-left: 16px;
  }
  @media only screen and (min-width: 768px) and (max-width: 1024px) {
    margin-left: 60px;
  }
`;

const SubTitle = styled.div`
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.29;
  letter-spacing: normal;
  text-align: left;
  color: var(--text-grey);
  margin-top : 5px;
  text-transform: capitalize;

  @media only screen and (max-width: 767px) {
    margin-left: 16px;
  }
  @media only screen and (min-width: 768px) and (max-width: 1024px) {
    margin-left: 60px;
  }
`;

const HorizontalDivider = styled.div`
  height: 1px;
  background-color: #d8d8d8;
  width:100%;
  margin-top : 20px;

  @media only screen and (min-width: 768px) and (max-width: 1024px) {
    margin: 20px 60px 0px;
  }
`;

const Section = styled.div`
  display: flex;
  margin: 0px;

  @media only screen and (min-width: 768px) and (max-width: 1024px) {
    margin: 0px 60px;
  }
`;

const LeftPanel = styled.div`
  display: ${props => props.hide ? 'none' : 'block'};
  width: 100%;

  @media only screen and (min-width: 1025px) {
    width: 30%;
    display: block;
  }

`;

const RightPanel = styled.div`
  display: ${props => props.show ? 'block' : 'none'};
  width: 100%;
  margin: 15px 0px 5px;

  @media only screen and (min-width: 1025px) {
    width: 70%;
    display: block;
    margin: 15px 0px 5px 32px;
  }
`;

const LeftTitle = styled.div`
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.71;
  letter-spacing: normal;
  text-align: left;
  color: #003863;
  padding-left: 16px;
  margin: 15px 0px 8px;
`;

const NavWrapper = styled.div`
  padding: 14px 24px 14px 14px;
  display: flex;
  box-shadow: 0 2px 8px 0 #d8d8d8;
  background-color: #ffffff;
  border-left: ${(props) => props.active ? '4px solid #529535' : '4px solid #ffffff'};
  border-bottom: 1px solid #d8d8d8;
  cursor: pointer;
  border-radius:${({ borderRadius }) => borderRadius ? borderRadius : ""};

  &:hover {
    background-color: #f3f3f3;
    border-left: ${(props) => props.active ? '4px solid #529535' : '4px solid #f3f3f3'};
  }

  &:focus {
    border: solid 2px #008bbf;
  }
`;

const Option = styled.div`
  width: 80%;
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.29;
  letter-spacing: normal;
  text-align: left;
  color: #474b55;
  margin: 2px 12px;

  @media only screen and (max-width: 1024px) {
    width: 90%;
  }
`;

const IconImg = styled.img`
  width: 24px;
  height: 24px;
  display: list-item;
  object-fit: scale-down;
  position: relative;
  overflow: hidden;
  padding-left: 5px;
`;

const ImgContent = styled.div`
  width: 24px;
  height: 24px;
  background: ${(props) => props.background ? `url(${props.src}) no-repeat ${props.background} ${props.backgroundPosition ? props.backgroundPosition : "4px"}`
    : `url(${props.src}) no-repeat #ffffff`};
  border-radius: 4px;
  padding: 4px;
`;

const InlineInnerFixedContainer = styled.div`
  width: 5%;
`;

const ImgBlock = styled.span`
  display: flex;
`;

const MainDiv = styled.div`
  display: none;
  
  @media only screen and (max-width: 767px) {
    margin: 0px 16px;
  }

  @media only screen and (max-width: 1024px) {
    display: flex;
    cursor: pointer;
  }
`;

const BackImg = styled.img`
  padding: 10px 2px 10px 0;
`;

const BackText = styled.div`
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.14;
  letter-spacing: normal;
  color: #474b55;
  margin-top: 11px;
`;