import React, { useEffect, useState } from "react";
import styled from "styled-components";
import EnterCode from "./enterCode";
import {
  MemberCardsContainer,
  MemberCard,
  Header,
  FormButtonWrapper,
  StyledButton,
  ProgressWrapper,
  Spinner,
} from "../styles";
import { useDispatch, useSelector } from "react-redux";
import { requestMFAFactors, requestMFACode } from "../../../store/actions";
import { useToaster } from "../../../hooks/useToaster";
import { handleSegmentClick } from "../../../libs/segment";
import { useHistory } from "react-router";
import LanguageSelection from "../login/languageSelection";

//update these later, need to refactor selection proccessing for readability.
const SEND_TO_EMAIL = "text";
const SEND_TO_SMS = "email";

const VerifyAccount = (props) => {
  const [submitClicked, setSubmitClicked] = useState(false);
  const [selection, setSelection] = useState("email");
  const [sendCodeTo, setSendCodeTo] = useState("");
  const [preferedSelectedItem, setPreferedSelectedItem] = useState("");
  const dispatch = useDispatch();
  const mfaFactors = useSelector((state) => state.mfaFactors);
  const memberRegister = useSelector((state) => state.memberRegister);
  const mfaCode = useSelector((state) => state.mfaCode);
  const [firstCodeSent, setFirstCodeSent] = useState(false);
  const [isTextSelection, setIsTextSelection] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userMobileNumber, setMobileNumber] = useState("");
  const { addToast } = useToaster();
  const history = useHistory();
  const [verfifiedChannels, setVerifiedChannels] = useState([]);

  // csrf will comes from selector
  const { memberInfomation, unauthorizedToken } = props;
  const mfaUnverifiedToken = unauthorizedToken
    ? unauthorizedToken
    : memberRegister?.data?.mfaToken;

  useEffect(() => {
    if (mfaFactors?.data) {
      verifiedChannelCheck();
    } else dispatch(requestMFAFactors(mfaUnverifiedToken));
  }, []);

  useEffect(() => {
    if (!mfaFactors?.loading) {
      if (
        mfaFactors.data?.channels[0].displayInfo !== undefined ||
        mfaFactors.data?.channels[1].displayInfo !== undefined
      ) {
        setUserEmail(mfaFactors.data?.channels[1]?.displayInfo);
        setMobileNumber(mfaFactors.data?.channels[0]?.displayInfo);
        if (mfaFactors.data?.channels[0]?.displayInfo === undefined) {
          handleSubmitClick();
        }
      }
    }
  }, [mfaFactors]);

  useEffect(() => {
    if (!mfaCode.loading && mfaCode?.data?.data?.status === "Success") {
      addToast({
        timeout: 5000,
        notificationText: `We sent you ${firstCodeSent ? "another" : "a"} code`,
        notificationType: "success",
      });
      setFirstCodeSent(true);
    }
  }, [mfaCode]);

  const verifiedChannelCheck = () => {
    const verfiedChannels = mfaFactors?.data?.channels.filter(
      (channel) => channel.verificationStatus,
    );
    if (verfiedChannels.length === 1) {
      let reqData = {
        val: verfiedChannels[0].displayInfo,
        type: verfiedChannels[0].method,
      };
      setSubmitClicked(true);
      setSendCodeTo(verfiedChannels[0].displayInfo);
      setPreferedSelectedItem(
        verfiedChannels[0].method === "sms" ? SEND_TO_SMS : SEND_TO_EMAIL,
      );
      dispatch(requestMFACode(reqData, mfaUnverifiedToken));
    }
  };
  //for test purpose
  const handleSubmitClick = () => {
    handleSegmentClick(
      null,
      "Submit",
      "Verify Account",
      "button",
      "bottom",
      "",
      "registration",
    );
    setSubmitClicked(true);

    if (userMobileNumber !== undefined) {
      setIsTextSelection(true);
    }
    if (selection === "text") {
      let reqData = { val: userMobileNumber, type: "sms" };
      dispatch(requestMFACode(reqData, mfaUnverifiedToken));
      setSendCodeTo(userMobileNumber);
      setPreferedSelectedItem("email");
    } else if (selection === "email") {
      setSendCodeTo(userEmail);
      let reqData = { val: userMobileNumber, type: "email" };
      dispatch(requestMFACode(reqData, mfaUnverifiedToken));
      setPreferedSelectedItem("text");
    }
  };

  const handleRadio = (value) => {
    setSelection(value);
  };

  const handleHealthFirstLogoClick = () => {
    let path = "/login";
    history.push(path);
  };
  return (
    <>
      <CustomMemberCardContainer>
        {submitClicked ? (
          <EnterCode
            submit={setSubmitClicked}
            info={sendCodeTo}
            selectionMode={preferedSelectedItem}
            memberInfo={props.memberInfomation}
            preferTextSelection={isTextSelection}
            unauthorizedToken={mfaUnverifiedToken}
          />
        ) : (
          <MemberCard>
            <CustomHeader>Verify Your Account</CustomHeader>

            {!mfaFactors.loading ? (
              <>
                <RadioButtonContainer
                  onClick={() => handleRadio("email")}
                  active={selection === "email"}
                  className="hello"
                >
                  <RadioImg
                    src={
                      selection === "email"
                        ? "/react/images/icn-radio-active.svg"
                        : "/react/images/icn-radio-inactive.svg"
                    }
                  />
                  <CustomText>
                    Email<Span> me a code at </Span>
                    <Span>{userEmail}</Span>
                  </CustomText>
                </RadioButtonContainer>
                {userMobileNumber !== undefined && (
                  <RadioButtonContainer
                    onClick={() => handleRadio("text")}
                    active={selection === "text"}
                  >
                    <RadioImg
                      src={
                        selection === "text"
                          ? "/react/images/icn-radio-active.svg"
                          : "/react/images/icn-radio-inactive.svg"
                      }
                    />
                    <CustomText>
                      Text
                      <Span> me a code at {userMobileNumber} </Span>
                      <Span>Message and data rates may apply.</Span>
                    </CustomText>
                  </RadioButtonContainer>
                )}
              </>
            ) : (
              <Spinner />
            )}
            <CustomFormButtonWrapper>
              {!mfaFactors.loading ? (
                <StyledButton
                  variant="primary"
                  onClick={() => handleSubmitClick()}
                >
                  Send Code
                </StyledButton>
              ) : (
                <ProgressWrapper>
                  <Spinner width="20px" height="20px" />
                </ProgressWrapper>
              )}
            </CustomFormButtonWrapper>
          </MemberCard>
        )}
      </CustomMemberCardContainer>
    </>
  );
};

export default VerifyAccount;

export const LanguageSelectionWrapper = styled.div`
  position: absolute;
  right: 20px;
  top: 20px;
`;

const CustomMemberCardContainer = styled(MemberCardsContainer)`
  margin-bottom: 0px;
`;

const BackgroundDiv = styled.div`
  height: 650px;
  background-image: url(/react/images/background-image.png);
`;

const CustomHeader = styled(Header)`
  margin-top: 75px;
  margin-bottom: 40px;
`;

const LogoImg = styled.img`
  height: 47px;
  margin: auto;
  margin-top: 15px;
  margin-bottom: 47px;
}
`;
const CustomText = styled.div`
  font-weight: 400;
  font-size: 18px;
  line-height: 24px;
  text-align: center;
  color: #003f6b;
  margin-bottom: 12px;
  margin-top: -4px;
  text-align: start;
`;

const RadioImg = styled.img`
  align-self: flex-start;
  margin-top: 4px;
`;

const CustomFormButtonWrapper = styled(FormButtonWrapper)`
  margin-top: 116px;
`;

const Span = styled.span`
  width: 232px;
  height: 80px;
  font-family: "museo-sans", sans-serif !important;
  font-weight: 100;
  color: #474b55;
  font-size: 14px;
  line-height: 20px;
  align-items: flex-start;
  gap: 8px;
`;

const RadioButtonContainer = styled.div`
  display: flex;
  gap: 12px;
  height: 64px;
  width: 288px;
  border: 1px solid #d8d8d8;
  background: #ffffff;
  padding: 12px 12px 12px 14px;
  border-radius: 6px;
  margin-bottom: 8px;
  &:last-child {
    margin-bottom: 0px;
  }
  border: ${(props) => props.active && "2px solid #003863"};
  user-select: none;
  cursor: pointer;
  &:hover {
    background: #f3f3f3;
  }
`;
