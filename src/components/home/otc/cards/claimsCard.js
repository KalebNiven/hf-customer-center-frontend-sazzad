import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
  ModalWrapper,
  ModalInnerWrapper,
} from "../../../../styles/commonStyles";
import { useSelector, useDispatch } from "react-redux";
import { requestOTCClaimReimbursementData } from "../../../../store/actions";
import { AnalyticsTrack } from "../../../common/segment/analytics";
import {
  ANALYTICS_TRACK_TYPE,
  ANALYTICS_TRACK_CATEGORY,
} from "../../../../constants/segment";
import { generateCardType } from "../../../overTheCounter/utils";
import { cardTypes } from "../../../overTheCounter/const";

const FlexClaimsCardBody = () => {
  return (
    <>
      <TitleText>Flex Card Reimbursement</TitleText>
      <SubText>
        Forget your Flex card while at your dental, vision, or hearing provider?
      </SubText>
      <ContentText>
        Please, make sure your purchases meet the following criteria before
        requesting a reimbursement:
      </ContentText>
      <Wrapper>
        <NumberText>1</NumberText>
        <Text>
          You have an <b>itemized receipt.</b>
        </Text>
      </Wrapper>
      <Wrapper>
        <NumberText>2</NumberText>
        <Text>
          The purchases are from a participating vision, dental, or hearing
          provider and are <b>eligible Flex card</b> out-of-pocket costs.
        </Text>
      </Wrapper>
      <Wrapper>
        <NumberText>3</NumberText>
        <Text>
          You were an active <b>Healthfirst Member with the Flex benefit</b> at
          the time of the purchase.
        </Text>
      </Wrapper>
    </>
  );
};

const OTCClaimsCardBody = () => {
  return (
    <>
      <TitleText>OTC Reimbursement</TitleText>
      <SubText>
        Forget your OTC card while making a purchase at the store?
      </SubText>
      <ContentText>
        Please, make sure your purchases meet the following criteria before
        requesting a reimbursement:
      </ContentText>
      <Wrapper>
        <NumberText>1</NumberText>
        <Text>
          You have an <b>itemized receipt.</b>
        </Text>
      </Wrapper>
      <Wrapper>
        <NumberText>2</NumberText>
        <Text>
          The purchases are from a <b>participating retailer</b> and are{" "}
          <b>eligible OTC items.</b>
        </Text>
      </Wrapper>
      <Wrapper>
        <NumberText>3</NumberText>
        <Text>
          You were an active <b>Healthfirst Member with the OTC benefit</b> at
          the time of the purchase.
        </Text>
      </Wrapper>
    </>
  );
};

const OTCPlusClaimsCardBody = () => {
  return (
    <>
      <TitleText>OTC Plus Reimbursement</TitleText>
      <SubText>
        Forget your OTC Plus card while making a purchase at the store, or had
        problems making a utility payment?
      </SubText>
      <ContentText>
        Please, make sure your purchases meet these following criteria before
        requesting a reimbursement:
      </ContentText>
      <Wrapper>
        <NumberText>1</NumberText>
        <Text>
          You have an <b>itemized receipt and/or proof of utility payment.</b>
        </Text>
      </Wrapper>
      <Wrapper>
        <NumberText>2</NumberText>
        <Text>
          The purchases are from a <b>participating retailer</b> and are{" "}
          <b>eligible OTC Plus items, foods, utility, or medical services.</b>
        </Text>
      </Wrapper>
      <Wrapper>
        <NumberText>3</NumberText>
        <Text>
          You were an active <b>Healthfirst Member with the OTC Plus benefit</b>{" "}
          at the time of the purchase.
        </Text>
      </Wrapper>
    </>
  );
};

const ClaimsCard = ({ isVisible }) => {
  const dispatch = useDispatch();
  const customerInfo = useSelector((state) => state.customerInfo);
  const otcClaimReimbursementData = useSelector(
    (state) => state.otcCard.reimbursementForm.data
  );
  const [isDownloadClick, setIsDownloadClick] = useState(false);
  const cardType = generateCardType(customerInfo?.data.hohPlans);
  const [externalWindow, setExternalWindow] = useState();

  useEffect(() => {
    try {
      if (
        JSON.parse(JSON.stringify(otcClaimReimbursementData))?.[
          customerInfo?.data?.language
        ] !== undefined &&
        isDownloadClick
      ) {
        externalWindow.location = JSON.parse(
          JSON.stringify(otcClaimReimbursementData)
        )?.[customerInfo.data?.language];
      }
    } catch (e) {
      console.log("Error caught: ", err.message);
    }
  }, [otcClaimReimbursementData]);

  const handleCloseCard = () => isVisible(false);

  const handleDownloadForm = (label) => {
    //segment
    setIsDownloadClick(true);
    AnalyticsTrack(label + " " + "Clicked", customerInfo, {
      raw_text: label,
      destination_url: label,
      description: label + " in Homepage",
      category: ANALYTICS_TRACK_CATEGORY.settings,
      type: ANALYTICS_TRACK_TYPE.buttonClicked,
      targetMemberId: customerInfo?.data?.memberId,
      location: {
        desktop: {
          width: 960,
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
    dispatch(requestOTCClaimReimbursementData());
    setExternalWindow(window.open("", "_blank"));
  };

  const getCardBody = (cardType) => {
    switch (cardType) {
      case cardTypes.otc:
        return <OTCClaimsCardBody />;
      case cardTypes.otcPlus:
        return <OTCPlusClaimsCardBody />;
      case cardTypes.flex:
        return <FlexClaimsCardBody />;
      default:
        return null;
    }
  };

  return (
    <FormModalWrapper>
      <ModalInnerWrapperCustom>
        <Image
          src="/react/images/icn-close.svg"
          onClick={handleCloseCard}
        ></Image>
        <Logo alt="" src="/react/images/healthfirstlogo.svg"></Logo>
        {getCardBody(cardType)}
        <ButtonsWrapper>
          <Button
            margin="0 16px"
            type="cancel"
            outlined
            onClick={handleCloseCard}
          >
            Close
          </Button>
          <Button
            onClick={() => handleDownloadForm("Download OTC Reimbursement")}
          >
            Download Form
          </Button>
        </ButtonsWrapper>
      </ModalInnerWrapperCustom>
    </FormModalWrapper>
  );
};

export default ClaimsCard;

const FormModalWrapper = styled(ModalWrapper)`
  transition: opacity 300ms ease-in-out;
  background: rgba(0, 42, 74, 0.72);
`;

const ModalInnerWrapperCustom = styled(ModalInnerWrapper)`
  width: 440px;
  height: fit-content;
  overflow-y: hidden;
  background: #ffffff;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.23);
  border-radius: 4px;

  @media only screen and (max-width: 480px) {
    width: 344px;
    height: 758px;
    overflow-y: auto;
  }
`;

const Image = styled.img`
  width: 14.73px;
  height: 14.73px;
  margin-right: 28.22px;
  position: relative;
  cursor: pointer;
  float: right;

  @media only screen and (max-width: 480px) {
    // margin-top: 20px;
  }
`;

const TitleText = styled.div`
  color: #003863;

  font-weight: 600;
  font-size: 24px;
  line-height: 32px;
  text-align: center;
  margin: auto;
  margin-top: 24px;
`;

const Logo = styled.img`
  margin: auto;
  margin-top: 24px;
`;

const SubText = styled.div`
  font-style: normal;
  font-weight: 600;
  font-size: 18px;
  line-height: 24px;
  color: #003863;
  margin: 24px 24px 0px 24px;
`;

const ContentText = styled.div`
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: #474b55;
  margin: 24px 24px 0px 24px;
`;

const Wrapper = styled.div`
  display: flex;
`;

const NumberText = styled.div`
  width: 32px;
  height: 32px;
  background: #003863;
  border-radius: 50%;
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 30px;
  text-align: center;
  color: #ffffff;
  margin: 24px 0px 0px 24px;

  @media only screen and (max-width: 480px) {
    width: 40px;
  }
`;

const ButtonsWrapper = styled.div`
  display: flex;
  justify-content: end;
  flex-wrap: wrap;
  margin-top: 40px;
  margin-right: 24px;

  @media only screen and (max-width: 480px) {
    flex-direction: column-reverse;
    justify-content: center;
    flex: 1;
    margin-left: 24px;
  }
`;

const Button = styled.button`
  height: 40px;
  margin: ${(props) => props.margin && props.margin};
  padding: 8px 16px;
  border-radius: 4px;
  border: 1px solid #3e7128;
  background: ${(props) => (props.outlined ? "#fff" : "#3e7128")};
  color: ${(props) => (props.outlined ? "#3e7128" : "#fff")};
  text-transform: capitalize;
  cursor: pointer;
  font-size: 18px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: ${(props) => (props.type === "cancel" ? "400" : "600")};

  @media only screen and (max-width: 480px) {
    margin: 0 0 8px 0;

    &:first-child {
      margin: 0;
    }
  }

  &:hover {
    background-color: ${(props) =>
      props.outlined ? "rgba(62, 113, 40, 0.05)" : "#517f3d"};
  }
`;

const Text = styled.div`
  width: 344px;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: #474b55;
  margin: 24px 24px 0px 16px;
`;
