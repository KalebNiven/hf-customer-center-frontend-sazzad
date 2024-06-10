import React, { useEffect, useMemo, useRef } from "react";
import styled from "styled-components";
import {
  ANALYTICS_TRACK_TYPE,
  ANALYTICS_TRACK_CATEGORY,
} from "../../constants/segment";
import Spinner from "../common/spinner";
import { useDispatch, useSelector } from "react-redux";
import useWindowDimensions from "../../libs/useWindowDimensions";
import {
  AnalyticsPage,
  AnalyticsTrack,
} from "../../components/common/segment/analytics";
import { useContainerDimensions } from "../../hooks/useContainerDimensions";

const PhysicalIdCard = (props) => {
  const customerInfo = useSelector((state) => state.customerInfo);
  const idCard = useSelector((state) => state.physicalIdCard.idCard);
  const idCardLoading = useSelector((state) => state.physicalIdCard.loading);
  const componentRef = useRef();
  const { containerWidth } = useContainerDimensions(componentRef);

  const print = () => {
    try {
      let documentPrinted = document.execCommand("print", false, null); // Safari
      if (!documentPrinted) throw new Error("print failed");
    } catch {
      window.print();
    }
  };
  const handleSegmentBtn = (label) => {
    AnalyticsPage();
    // Segment Track
    AnalyticsTrack(label + " " + "link clicked", customerInfo, {
      raw_text: label,
      destination_url: window.location.pathname,
      description: label,
      category: ANALYTICS_TRACK_CATEGORY.memberIdCard,
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

  useEffect(() => {
    // dispatch(requestIdCard(props.memberId));
  }, []);

  let front;
  const { width } = useWindowDimensions();
  const { frontImage = "", backImage = "" } = useMemo(() => {
    if (idCard[props.memberId]) {
      const { physicalIdCard } = idCard[props.memberId];
      return {
        frontImage: physicalIdCard?.frontImage,
        backImage: physicalIdCard?.backImage,
      };
    }
    return {};
  }, [idCard]);
  const dispatch = useDispatch();
  return (
    <>
      {idCardLoading ? (
        <Container>
          <ProgressWrapper>
            <Spinner />
          </ProgressWrapper>
        </Container>
      ) : (
        <Container>
          <Label className="no-print">Physical ID Card</Label>
          <Description className="no-print">
            {" "}
            This is your official Healthfirst insurance ID card. Share this card
            with your doctors at any time using our{" "}
            <LinkToMobile
              onClick={() => handleSegmentBtn("Mobile App")}
              href={"https://apps.apple.com/us/app/healthfirst-ny/id1464792066"}
              target="_blank"
              segment-track="Link Clicked"
              segment-props={JSON.stringify({
                location: "ID Card ",
                raw_text: "Mobile App",
                destination_url:
                  "https://apps.apple.com/us/app/healthfirst-ny/id1464792066",
              })}
            >
              Mobile App
            </LinkToMobile>
          </Description>
          <SVGContainerWrapper ref={componentRef}>
            <SVGContainerFront containerWidth={containerWidth}>
              <FrontIDcard
                src={`data:image/svg+xml,${encodeURIComponent(frontImage)}`}
                alt=""
                align={"vertical"}
                windowWidth={width}
                containerWidth={containerWidth}
              />
            </SVGContainerFront>
            <SVGContainerBack containerWidth={containerWidth}>
              <BackIdCard
                src={`data:image/svg+xml,${encodeURIComponent(backImage)}`}
                alt=""
                align={"vertical"}
                windowWidth={width}
                containerWidth={containerWidth}
              />
            </SVGContainerBack>
          </SVGContainerWrapper>
          <PrintAndEmailContainer className="py-2 no-print">
            <PrintContainer>
              <PrintButton
                onClick={(event) => {
                  AnalyticsTrack(
                    "Physical ID Card Print Button Clicked",
                    customerInfo,
                    {
                      raw_text: "Print",
                      destination_url: "N/A",
                      category: ANALYTICS_TRACK_CATEGORY.memberIdCard,
                      type: ANALYTICS_TRACK_TYPE.linkClicked,
                      targetMemberId: props.memberId,
                      location: {
                        desktop: {
                          width: 1024,
                          value: "right",
                        },
                        tablet: {
                          width: 768,
                          value: "right",
                        },
                        mobile: {
                          width: 0,
                          value: "bottom right",
                        },
                      },
                    },
                  );
                  print();
                }}
              >
                <PrintIcon
                  alt=""
                  src={`${window.location.origin}/react/images/iconography-icn-print.svg`}
                />
                <PrintLabel>Print</PrintLabel>
              </PrintButton>
            </PrintContainer>
          </PrintAndEmailContainer>
        </Container>
      )}
    </>
  );
};

const PrintButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  display: flex;
  height: 40px;
  background-color: #ffffff;
  border-radius: 8px;
  border: 1px solid #ffffff;
  padding: 1rem;
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.1);
  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }
  &:hover p {
    color: #2a6a9e;
  }
  @media (max-width: 480px) {
    width: 100%;
  }
`;

const PrintIcon = styled.img`
  width: 20px;
  height: 20px;
  flex-grow: 0;
  object-fit: contain;
  margin-right: 0.4rem;
`;

const PrintLabel = styled.p`
  flex-grow: 0;
  font-size: 14px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #008bbf;
  margin-left: 2px;
`;

const SVGContainerWrapper = styled.div`
  width: 100%;
  display: flex;
  flex: 1;
  flex-direction: row;
  margin-left: 15px;
  @media (max-width: 820px) {
    margin: 0;
  }
  @media only screen and (max-width: 480px) {
    flex-direction: column;
  }
`;
const SVGContainerFront = styled.div`
  margin: 4px 0px;
  position: relative;
  width: 50%;
  height: calc(((${(props) => props.containerWidth} / 1024) / 2) * 632px);
  @media (max-width: 480px) {
    height: calc(0.61 * 100vw);
    width: 100%;
    margin-left: -1.1rem;
  }
`;
const SVGContainerBack = styled.div`
  margin: 4px 0px;
  position: relative;
  width: 50%;
  height: calc(((${(props) => props.containerWidth} / 1024) / 2) * 632px);
  @media (max-width: 480px) {
    height: calc(0.61 * 100vw);
    width: 100%;
    margin-left: -1.1rem;
  }
`;
const FrontIDcard = styled.img`
  width: 1036px;
  height: 632px;
  transform: scale(
    calc(((${(props) => props.containerWidth} - 28) / 1024) / 2)
  );
  transform-origin: top left;
  position: absolute;
  top: 0;
  left: 0;
  @media (max-width: 820px) {
    transform: scale(calc((${(props) => props.containerWidth} / 1024) / 2));
  }
  @media (max-width: 480px) {
    transform: scale(calc((${(props) => props.containerWidth} / 1024)));
    margin-left: 1rem;
  }
  display: block;
`;
const BackIdCard = styled.img`
  width: 1036px;
  height: 632px;
  transform: scale(
    calc(((${(props) => props.containerWidth} - 28) / 1024) / 2)
  );
  transform-origin: top left;
  position: absolute;
  top: 0;
  left: 0;
  @media (max-width: 820px) {
    transform: scale(calc((${(props) => props.containerWidth} / 1024) / 2));
  }
  @media (max-width: 480px) {
    transform: scale(calc((${(props) => props.containerWidth} / 1024)));
    margin-left: 1rem;
  }
  display: block;
`;

const Label = styled.div`
  text-align: left;
  width: 100%;
  @media only screen and (min-width: 820px) {
  }
  font-size: 24px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  padding-top: 2rem;
  letter-spacing: normal;
  color: #003863;
  margin: 0px 15px;
`;
const Container = styled.div`
  font-family: museo-sans;
  @media only screen and (max-width: 820px) {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;

const Description = styled.div`
  text-align: left;
  width: 100%;
  @media only screen and (min-width: 820) {
  }
  font-size: 16px;
  color: #474b55;
  line-height: 25px;
  font-weight: 400;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  margin: 8px 16px 16px;
`;
const LinkToMobile = styled.a`
  font-weight: bold;
  color: #008bbf;
  cursor: pointer;
`;
const PrintAndEmailContainer = styled.div`
  display: flex;
  justify-content: end;
  gap: 16px;
  @media only screen and (max-width: 820px) {
    width: 100%;
    margin: auto;
    margin-top: 8px;
    margin-bottom: 16px;
    float: right;
  }
`;
const PrintContainer = styled.div`
  display: flex;
  gap: 6px;
  align-items: flex-start;
  @media (max-width: 480px) {
    width: 100%;
  }
`;
const EmailContainer = styled.div`
  display: flex;
  gap: 8px;
`;
const ProgressWrapper = styled.div`
  width: 100%;
  margin-top: 10px;
  margin-bottom: 10px;
`;

export default PhysicalIdCard;
