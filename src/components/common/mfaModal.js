import React, { useState, useEffect, useRef } from "react";
import styled, { keyframes } from "styled-components";
import {
  ModalWrapper,
  ModalInnerWrapper,
  ModalContent,
  Text,
  CloseIcon,
  Button,
  ButtonWrapper,
} from "../../styles/commonStyles";
import { Provider, useSelector, useDispatch } from "react-redux";
import store from "../../store/store";
import {
  requestCustomerInfo,
  requestPreferenceCenterInfo,
  requestPreferredContactInfoSubmit,
} from "../../store/actions";
import ErrorModal from "./errorModal";
import { requestUserMFACode, requestUserMFAVerify } from "../../store/actions";
import Toaster from "../common/toaster";
import Spinner from "../common/spinner";

const MFAModal = (props) => {
  const useComponentDidMount = () => {
    const ref = useRef();
    useEffect(() => {
      ref.current = true;
    }, []);
    return ref.current;
  };

  const dispatch = useDispatch();

  const { mfaStatus, targetEmail, targetPhone } = props;
  const isComponentMounted = useComponentDidMount();
  const customerInfo = useSelector((state) => state.customerInfo.data);
  const mfaCode = useSelector((state) => state.userMfaCode);
  const mfaVerify = useSelector((state) => state.userMfaVerify);
  const [step, setStep] = useState(null);
  const [selectedTarget, setSelectedTarget] = useState(null);
  const [selectContactError, setSelectContactError] = useState("");
  const [verificationCodeInput, setVerificationCodeInput] = useState("");
  const [verificationCodeInputError, setVerificationCodeInputError] = useState(
    ""
  );
  const [verificationAttemptsCount, setVerificationAttemptsCount] = useState(0);
  const [renderNotification, setRenderNotification] = useState(false);
  const [initialCodeSent, setInitialCodeSent] = useState(false);
  const [notificationDetails, setNotificationDetails] = useState({
    notificationText: "",
    notificationType: "",
  });
  useEffect(() => {
    getInitialScreenStep();
  }, []);

  useEffect(() => {
    if (isComponentMounted && !mfaCode?.loading) {
      if (mfaCode?.error === "" && mfaCode?.data?.data?.status == "Success") {
        setStep("VerifyStep");
        if (!initialCodeSent) {
          setInitialCodeSent(true);
        }
        setNotificationDetails({
          notificationText: `We sent you ${
            initialCodeSent ? "another" : "a"
          } code!`,
          notificationType: "success",
        });
        setRenderNotification(true);
      } else {
        setNotificationDetails({
          notificationText: "Sorry, something went wrong. Please try again.",
          notificationType: "error",
        });
        setRenderNotification(true);
      }
    }
  }, [mfaCode]);

  useEffect(() => {
    if (isComponentMounted && !mfaVerify?.loading) {
      setVerificationAttemptsCount(verificationAttemptsCount + 1);

      if (mfaVerify?.data?.data?.status == "Success") {
        //Success
        mfaStatus("Success");
      }
      if (mfaVerify?.error?.data?.status == "Failure") {
        //Invalid
        if (verificationAttemptsCount >= 3) {
          mfaStatus("Invalid");
        }
        setVerificationCodeInputError(
          "The value entered is invalid, please ensure the correct value is entered and try again."
        );
      }
      if (mfaVerify?.error?.data?.status == "Failure") {
        //Expired
        if (verificationAttemptsCount >= 3) {
          mfaStatus("Expired");
        }
        setVerificationCodeInputError(
          "The value entered is invalid, please ensure the correct value is entered and try again."
        );
      }
    }
  }, [mfaVerify]);

  const handleSendCode = (data, type) => {
    try {
      let reqData = { channelValue: data, channelType: type };
      dispatch(requestUserMFACode(reqData, customerInfo.csrf));
    } catch (err) {
      console.log(err.response);
      setStep("Error");
    }
  };

  const handleCodeInput = (event) => {
    setVerificationCodeInputError("");
    let tempCode = "";
    tempCode = event.target.value;
    setVerificationCodeInput(tempCode);
    //event.target.value = tempCode;
  };

  function isNumeric(str) {
    if (typeof str != "string") return false;
    return !isNaN(str) && !isNaN(parseFloat(str));
  }

  const handleVerify = (data, type) => {
    setVerificationCodeInputError("");
    if (data.length < 6 || !isNumeric(data)) {
      setVerificationCodeInputError(
        "Please ensure that the value entered is 6 digits and try again."
      );
      return null;
    }
    try {
      let reqData = { verificationCode: data, channelType: type };
      dispatch(requestUserMFAVerify(reqData, customerInfo.csrf));
    } catch (err) {
      console.log(err.response);
      setStep("Error");
    }
  };

  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  const getInitialScreenStep = async () => {
    if (targetEmail && targetPhone) {
      setSelectedTarget({ text: targetEmail, type: "email" });
      setStep("SelectStep");
      return;
    }
    if (targetEmail || targetPhone) {
      if (targetEmail) {
        setSelectedTarget({ text: targetEmail, type: "email" });
        handleSendCode(targetEmail, "email");
      } else if (targetPhone) {
        setStep("Loading");
        await delay(3000);
        setSelectedTarget({ text: targetPhone, type: "phone" });
        handleSendCode(targetPhone, "sms");
      }

      setStep("VerifyStep");
      return;
    }
    setStep("unknown");
  };

  const formatPhone = (phone, format) => {
    switch (format) {
      // ex: (917) 111 - 2323
      case 1:
        // Strip all characters from the input except digits
        phone = phone.replace(/\D/g, "");

        // Trim the remaining input to ten characters, to preserve phone number format
        phone = phone.substring(0, 10);

        // Based upon the length of the string, we add formatting as necessary
        if (phone.length === 0) {
          phone = `${phone}`;
        } else if (phone.length < 4) {
          phone = `(${phone}`;
        } else if (phone.length < 7) {
          phone = `(${phone.substring(0, 3)}) ${phone.substring(3, 6)}`;
        } else {
          phone = `(${phone.substring(0, 3)}) ${phone.substring(
            3,
            6
          )} - ${phone.substring(6, 10)}`;
        }

        break;
      // ex: 917-111-2323
      case 2:
      default:
        phone = phone.replace(/\D/g, "");
        phone = phone.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
    }
    return phone;
  };

  const formatEmail = (email, format) => {
    return email;
  };

  const renderSwitch = (step) => {
    switch (step) {
      case "SelectStep":
        return (
          <div>
            <Header>Verify Your Account</Header>
            <ContactCardsContainer>
              <ContactCard
                key={targetEmail}
                onClick={() =>
                  setSelectedTarget({ text: targetEmail, type: "email" })
                }
                status={
                  selectContactError
                    ? "error"
                    : selectedTarget && selectedTarget?.text === targetEmail
                    ? "selected"
                    : ""
                }
              >
                <RadioButtonContainer>
                  {selectedTarget && selectedTarget.text === targetEmail ? (
                    <RadioImg src="/react/images/icn-radio-active.svg" />
                  ) : (
                    <RadioImg src="/react/images/icn-radio-inactive.svg" />
                  )}
                  <ContactValueWrapper>
                    <ContactValue className="mt-0">
                      <b>Email</b> me a code at {formatEmail(targetEmail, 1)}
                    </ContactValue>
                  </ContactValueWrapper>
                </RadioButtonContainer>
              </ContactCard>
              <ContactCard
                key={targetPhone}
                onClick={() =>
                  setSelectedTarget({ text: targetPhone, type: "phone" })
                }
                status={
                  selectContactError
                    ? "error"
                    : selectedTarget && selectedTarget?.text === targetPhone
                    ? "selected"
                    : ""
                }
              >
                <RadioButtonContainer>
                  {selectedTarget && selectedTarget.text === targetPhone ? (
                    <RadioImg src="/react/images/icn-radio-active.svg" />
                  ) : (
                    <RadioImg src="/react/images/icn-radio-inactive.svg" />
                  )}
                  <ContactValueWrapper>
                    <ContactValue className="mt-0">
                      <b>Text</b> me a code at {formatPhone(targetPhone, 1)}
                      <br />
                      <RatesNoticeText>
                        Message and data rates may apply
                      </RatesNoticeText>
                    </ContactValue>
                  </ContactValueWrapper>
                </RadioButtonContainer>
              </ContactCard>
            </ContactCardsContainer>
            <br />
            <br />
            <br />
            <FormButtonWrapper>
              {!mfaCode.loading ? (
                <FormButton
                  green={true}
                  onClick={() =>
                    handleSendCode(
                      selectedTarget?.text,
                      selectedTarget?.type == "email"
                        ? "email"
                        : selectedTarget?.type == "phone"
                        ? "sms"
                        : "unknown"
                    )
                  }
                >
                  Send Code
                </FormButton>
              ) : (
                <FormButton green={true}>
                  <ProgressSpinner></ProgressSpinner>
                </FormButton>
              )}
            </FormButtonWrapper>
          </div>
        );
      case "VerifyStep":
        return (
          <div>
            <Header>Enter Code</Header>
            <SubHeader>
              Please provide the six digit verification code we sent to{" "}
              <VerifyTargetAddress>
                {selectedTarget?.text
                  ? selectedTarget.text
                  : targetEmail
                  ? targetEmail
                  : targetPhone}
              </VerifyTargetAddress>
            </SubHeader>
            {mfaCode.loading ? (
              <ProgressWrapper>
                <Spinner />
              </ProgressWrapper>
            ) : (
              <>
                <InputWrapper>
                  <Input maxLength={6} onChange={(e) => handleCodeInput(e)} />
                  {verificationCodeInputError && (
                    <ErrorLabel>{verificationCodeInputError}</ErrorLabel>
                  )}
                </InputWrapper>
                <br />
                <ResendCodeText>
                  Didn't get the code?{" "}
                  <ResendCodeButton
                    onClick={() =>
                      handleSendCode(
                        selectedTarget?.text,
                        selectedTarget?.type == "email"
                          ? "email"
                          : selectedTarget?.type == "phone"
                          ? "sms"
                          : "unknown"
                      )
                    }
                  >
                    Send code again
                  </ResendCodeButton>
                </ResendCodeText>
                {/*
                            <AlternateVerifyText>
                                Prefer a {alternateAddressType ? alternateAddressType : alternateAddressTypeTemp}? <AlternateVerifyButton>Send code via {alternateAddressType ? alternateAddressType : alternateAddressTypeTemp}</AlternateVerifyButton>
                            </AlternateVerifyText>
                            */}
                <br />
                <br />
                <br />
                <FormButtonWrapper>
                  {!mfaVerify.loading ? (
                    <FormButton
                      green={true}
                      onClick={() =>
                        handleVerify(
                          verificationCodeInput,
                          selectedTarget?.type == "email"
                            ? "email"
                            : selectedTarget?.type == "phone"
                            ? "sms"
                            : "unknown"
                        )
                      }
                    >
                      Verify
                    </FormButton>
                  ) : (
                    <FormButton green={true}>
                      <ProgressSpinner></ProgressSpinner>
                    </FormButton>
                  )}
                </FormButtonWrapper>
              </>
            )}
          </div>
        );
      case "Error":
        return <ErrorModal closeButtonClick={() => mfaStatus("Error")} />;
      case "Loading":
        return (
          <ProgressWrapper>
            <Spinner />
          </ProgressWrapper>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      {renderSwitch(step)}
      {renderNotification && (
        <Toaster
          toasterTop={".35in"}
          unmountMe={() => setRenderNotification(false)}
          timeout={5000}
          notificationText={notificationDetails.notificationText}
          notificationType={notificationDetails.notificationType}
        />
      )}
    </div>
  );
};

export default MFAModal;

const FormModalWrapper = styled(ModalWrapper)`
  transition: opacity 300ms ease-in-out;
  opacity: ${(props) => (props.visible ? "1" : "0")};
`;

const FormModalContent = styled(ModalContent)`
  transition: opacity 300ms ease-in-out;
`;
const Header = styled.h1`
  margin: 2.5rem 5% 1.5rem;
  font-size: 18px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: normal;
  text-align: center;
  color: #003863;
`;
const SubHeader = styled.h3`
  margin: 0 5% 2rem 5%;
  font-size: 16px;
  font-weight: 300;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: normal;
  text-align: center;
  color: #474b55;
`;
const ContactCardsContainer = styled.div`
  margin: 0 5% 8px;
  display: flex;
  flex-direction: column;
  row-gap: 8px;
`;
const ContactCard = styled.div`
  overflow: hidden;
  padding: 16px 16px 12px 16px;
`;
const RadioButtonContainer = styled.div`
  display: flex;
  gap: 12px;
`;
const RadioImg = styled.img`
  align-self: flex-start;
  margin-bottom: auto;
`;
const ContactValueWrapper = styled.div`
  width: 100%;
`;
const ContactValue = styled.h1`
  cursor: default;
  font-size: 18px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: normal;
  text-align: left;
  color: #003863;
  margin-right: 3rem;
`;
const RatesNoticeText = styled.span`
  font-weight: 300;
`;
const ContactInputValue = styled.div`
  cursor: default;
  font-size: 18px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: normal;
  text-align: center;
  color: #003863;
`;
const VerifyTargetAddress = styled.b`
  font-weight: bold;
`;
const InputWrapper = styled.div`
  margin-right: 1rem;
  margin-left: 1rem;
`;
const Input = styled.input`
  color: #474b55;
  height: 40px;
  border: 1px solid #a8abac;
  border-radius: 4px;
  -webkit-border-radius: 4px;
  font-size: 16px;
  font-weight: 300;
  width: 100%;
  padding-left: 1rem;
  padding-right: 1rem;
`;
const ErrorLabel = styled.div`
  font-size: 12px;
  font-weight: 500;
  line-height: 1.33;
  color: #a0252c;
  margin-top: 0.3rem;
`;
const ResendCodeText = styled.div`
  margin-right: 1rem;
  margin-left: 1rem;
`;
const ResendCodeButton = styled.a`
  font-weight: bold;
  color: #008bbf !important;
  cursor: pointer;
  margin-right: 1rem;
  margin-left: 1rem;
`;
const AlternateVerifyText = styled.div`
  margin-right: 1rem;
  margin-left: 1rem;
`;
const AlternateVerifyButton = styled.a`
  margin-right: 1rem;
  margin-left: 1rem;
`;
const FormButtonWrapper = styled(ButtonWrapper)`
  margin-top: 2rem;
  margin-bottom: 0rem;
  text-align: center;
`;
const FormButton = styled(Button)`
  float: none !important;
  margin-left: 0;
  width: 90%;
`;
const SpinnerRotate = keyframes`
  from {transform: rotate(0deg);}
  to {transform: rotate(360deg);}
`;
const ProgressSpinner = styled.div`
  text-align: center;
  margin: auto;
  border: 0.2rem solid #375225;
  border-top: 0.2rem solid white;
  border-radius: 50%;
  height: 1.5rem;
  width: 1.5rem;
  margin-left: auto;
  margin-right: auto;
  animation-name: ${SpinnerRotate};
  animation-duration: 2s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  @media only screen and (max-width: 768px) {
    margin-left: auto;
    margin-right: auto;
  }
`;

const ProgressWrapper = styled.div`
  width: 100%;
`;
