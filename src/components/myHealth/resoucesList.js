import React from "react";
import styled from "styled-components";
import { AnalyticsTrack } from "../common/segment/analytics";
import { ANALYTICS_TRACK_TYPE } from "../../constants/segment";
import { ANALYTICS_TRACK_CATEGORY } from "../../constants/segment";
import ExternalSiteLink from "../common/externalSiteLink";
import { useSelector } from "react-redux";

const ResoucesList = ({ content, withBorder }) => {
  const customerInfo = useSelector((state) => state.customerInfo);
  const resourceItemStyles = `
        padding: 12px 12px 12px 16px;
        border-radius: 4px;
        background-color: #fff;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        cursor: pointer;
        ${!withBorder && "box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.1)"};
        ${withBorder && "border: 1px solid #d8d8d8"};

        margin-bottom: 16px;

        &:nth-of-type(3n - 1) {
            margin-right: 16px;
            margin-left: 16px;
        }

        @media only screen and (max-width: 768px) {
            &:nth-of-type(3n - 1) {
                margin-right: 0px;
                margin-left: 0px;
            }
        }

        &:hover {
            text-decoration: none;
        }
    `;
  const handleInternalSiteLinkClick = (
    rawText,
    link,
    label,
    targetMemberId
  ) => {
    // Segment Track
    AnalyticsTrack(
      label ? label + " clicked" : "Internal Site Clicked",
      customerInfo,
      {
        raw_text: rawText,
        destination_url: link,
        description: label,
        category: ANALYTICS_TRACK_CATEGORY.myHealth,
        type: ANALYTICS_TRACK_TYPE.linkClicked,
        targetMemberId: targetMemberId || customerInfo.data.memberId,
        location: {
          desktop: {
            width: 1024,
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
      }
    );

    window.open(link);
  };

  return (
    <ResourcesList>
      {content?.length > 0 &&
        content.map((item, idx) => {
          return (
            <>
              {new URL(item.resource_url)
                .toString()
                .includes("healthfirst.org") ? (
                <InternalSiteLink
                  onClick={(e) => {
                    handleInternalSiteLinkClick(
                      e.target.textContent,
                      item.resource_url,
                      item.title,
                      null
                    );
                  }}
                >
                  <ResourceIcon alt="" src="/react/images/icn-article.svg" />
                  <ResourceTitle>{item.title}</ResourceTitle>
                  <ResourceChevronIcon
                    alt=""
                    src="/react/images/icn-arrow-right.svg"
                  />
                </InternalSiteLink>
              ) : (
                <ExternalSiteLink
                  key={idx}
                  link={item.resource_url}
                  label={item.title}
                  styles={resourceItemStyles}
                  withBorder={withBorder}
                  segmentPageCategory={ANALYTICS_TRACK_CATEGORY.myHealth}
                  segmentTitle={item.title + " Health Resource Clicked"}
                >
                  <ResourceIcon alt="" src="/react/images/icn-article.svg" />
                  <ResourceTitle>{item.title}</ResourceTitle>
                  <ResourceChevronIcon
                    alt=""
                    src="/react/images/icn-arrow-right.svg"
                  />
                </ExternalSiteLink>
              )}
            </>
          );
        })}
    </ResourcesList>
  );
};

export const ResourcesList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(33%, 1fr));

  @media only screen and (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(100%, 1fr));
  }
`;

export const ResourceIcon = styled.img`
  margin-right: 12px;
  height: 20px;
  width: 20px;
`;

export const ResourceTitle = styled.span`
  font-size: 16px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: normal;
  text-align: left;
  color: #003863;
  flex: 1;
`;

export const ResourceChevronIcon = styled.img`
  height: 20px;
  width: 20px;
`;

const InternalSiteLink = styled.span`
  padding: 12px 12px 12px 16px;
  border-radius: 4px;
  background-color: #fff;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  cursor: pointer;
  border: 1px solid #d8d8d8;
  margin-bottom: 16px;
`;

export default ResoucesList;
