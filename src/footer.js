import React from "react";
import styled from "styled-components";
import {
  AnalyticsPage,
  AnalyticsTrack,
} from "./components/common/segment/analytics";
import {
  ANALYTICS_TRACK_TYPE,
  ANALYTICS_TRACK_CATEGORY,
} from "./constants/segment";
import { useSelector } from "react-redux";
import { useLocation } from "react-router";

const Footer = () => {
  const { MIX_REACT_APP_FOOTER_WEB_PRIVACY } = process.env;
  const { MIX_REACT_APP_FOOTER_NY_PRIVACY } = process.env;
  const { MIX_REACT_APP_FOOTER_HIPAA } = process.env;
  const customerInfo = useSelector((state) => state.customerInfo);
  const location = useLocation();

  const handleSegmentBtn = (label, link) => {
    AnalyticsTrack(label + " " + "link clicked", customerInfo, {
      raw_text: label,
      destination_url: link,
      description: `${label} link clicked`,
      category: ANALYTICS_TRACK_CATEGORY.footer,
      type: ANALYTICS_TRACK_TYPE.linkClicked,
      targetMemberId: customerInfo?.data?.memberId,
      location: {
        desktop: {
          width: 960,
          value: "left",
        },
        tablet: {
          width: 768,
          value: "right",
        },
        mobile: {
          width: 0,
          value: "right",
        },
      },
    });
  };

  return (
    !customerInfo.loading && (
      <div className="footer no-print">
        <FooterContainer>
          <Left>
            <FooterTxt
              target="_blank"
              onClick={() =>
                handleSegmentBtn(
                  "Contact Us",
                  "https://healthfirst.org/contact"
                )
              }
              href="https://healthfirst.org/contact"
            >
              Contact Us
            </FooterTxt>
            <FooterTxt
              target="_blank"
              onClick={() =>
                handleSegmentBtn(
                  "Web Privacy Statement",
                  MIX_REACT_APP_FOOTER_WEB_PRIVACY
                )
              }
              href={MIX_REACT_APP_FOOTER_WEB_PRIVACY}
            >
              Web Privacy Statement
            </FooterTxt>
            <FooterTxt
              target="_blank"
              onClick={() =>
                handleSegmentBtn(
                  "New York Privacy Notice",
                  MIX_REACT_APP_FOOTER_NY_PRIVACY
                )
              }
              href={MIX_REACT_APP_FOOTER_NY_PRIVACY}
            >
              New York Privacy Notice
            </FooterTxt>
            <FooterTxt
              target="_blank"
              onClick={() =>
                handleSegmentBtn(
                  "HIPAA Privacy Notices",
                  MIX_REACT_APP_FOOTER_HIPAA
                )
              }
              href={MIX_REACT_APP_FOOTER_HIPAA}
            >
              HIPAA Privacy Notices
            </FooterTxt>
          </Left>
          <Right>
            <RightFooterTxt>
              ©{new Date().getFullYear()} Healthfirst
            </RightFooterTxt>
          </Right>
        </FooterContainer>
      </div>
    )
  );
};

export default Footer;

const Left = styled.div`
  width: 825px;
  @media only screen and (max-width: 960px) {
    width: 100%;
  } ;
`;
const Right = styled.div`
  width: 175px;
  text-align: right;
  @media only screen and (max-width: 960px) {
    text-align: left;
    width: 100%;
  } ;
`;
const FooterContainer = styled.div`
  display: flex;
  flex: 1 1 auto;
  justify-content: center;
  align-items: flex-start;
  box-sizing: border-box;
  margin: 0 144px;
  width: calc(100% - 288px);
  @media only screen and (max-width: 1200px) {
    margin: 0 86px;
    width: calc(100% - 172px);
  }
  @media only screen and (max-width: 960px) {
    display: contents;
    margin: 0 16px;
    width: calc(100% - 32px);
  } ;
`;

const FooterTxt = styled.a`
  @media only screen and (max-width: 960px) {
    display: block;
    margin: 0 88px 20.2px 0;
  }
  font-size: 14px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: left;
  color: #ffffff;
  padding-right: 20px;

  &:hover {
    color: white;
  }
`;

const RightFooterTxt = styled.span`
  font-size: 14px;
  font-weight: 500;
  opacity: 0.75;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: left;
  color: #ffffff;
`;
