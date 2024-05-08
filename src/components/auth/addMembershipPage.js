import React, { useEffect, useState } from "react";
import moment from "moment";
import {
  FormGrid,
  InputWrapper,
  InputHeader,
  MemberIdInput,
  Input,
  InputErrorMsg,
  FormButtonWrapper,
  AdditionalInfo,
  CenterInfo,
  SubHeader,
  Link,
  Header,
  ProgressWrapper,
  Spinner,
} from "./styles";
import { useSelector, useDispatch } from "react-redux";
import { handleSegmentForAuth } from "./utils";
import { requestAddMembership, requestCustomerInfo } from "../../store/actions";
import FooterBox from "./common/footerBox";
import {
  Container,
  Footer,
  FooterMenuWrapper,
  Form,
  LanguageSelectionWrapper,
  Logo,
  LogoWrapper,
  SubmitButton,
  Wrapper,
} from "./login";
import LanguageSelection from "./login/languageSelection";
import FooterMenu from "./login/footerMenu";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { useToaster } from "../../hooks/useToaster";
import FormSuccessCard from "./registration/formSuccess";
import FormSuccessMedicareCard from "./registration/formSuccessMedicaid";
import { useRefreshOktaToken } from "../../hooks/useRefreshOktaToken";
import { useLogout } from "../../hooks/useLogout";

const NO_MATCHES_FOUND_ERROR =
  "We didn't find any matches. Please check your entries and try again, or contact us for assistance.";
const MEMBER_TAKEN_ERROR =
  "This membership is already associated with another account. Please contact us for assistance.";

const AddMemberPage = () => {
  const initialState = {
    memberId: {
      value: "",
      error: null,
    },
    firstName: {
      value: "",
      error: null,
    },
    lastName: {
      value: "",
      error: null,
    },
    dateofBirth: {
      value: "",
      error: null,
    },
    zipcode: {
      value: "",
      error: null,
    },
  };

  const dispatch = useDispatch();
  const addMembership = useSelector((state) => state.addMembership);
  const [membershipInfo, setMembershipInfo] = useState(initialState);
  const [submitClicked, setSubmitClicked] = useState(false);
  const [isError, setIsError] = useState(false);
  const accountInfo = { ...membershipInfo };
  const customerInfo = useSelector((state) => state.customerInfo);
  const { accountStatus } = customerInfo.data;
  const [step, setStep] = useState("addMember");
  const [disableSubmit, setDisableSubmit] = useState(true);
  const history = useHistory();
  const { addToast } = useToaster();
  const refreshOktaToken = useRefreshOktaToken();
  const logoutApi = useLogout();

  useEffect(() => {
    if (accountStatus === "MEMBER") {
      history.push("/permissionDenied");
    }
  }, [accountStatus]);

  useEffect(() => {
    if (!addMembership.loading) {
      if (addMembership.error === "no_matches_found") {
        addToast({
          notificationText: NO_MATCHES_FOUND_ERROR,
          notificationType: "error",
          timeout: 5000,
          notificationLink: "https://healthfirst.org/contact",
          notificationLinkText: "contact us",
        });
      }
      if (addMembership.error === "already_taken") {
        addToast({
          notificationText: MEMBER_TAKEN_ERROR,
          notificationType: "error",
          timeout: 5000,
          notificationLink: "https://healthfirst.org/contact",
          notificationLinkText: "contact us",
        });
      }
      if (addMembership.success === "success_medicare") {
        setStep("success_medicare");
      } else if (addMembership.success === "success") {
        setStep("success");
      }
    }
  }, [addMembership]);

  useEffect(() => {
    if (
      accountInfo["memberId"].value.length > 0 &&
      accountInfo["firstName"].value.length > 0 &&
      accountInfo["lastName"].value.length > 0 &&
      accountInfo["zipcode"].value.length > 0 &&
      accountInfo["dateofBirth"].value.length > 0
    ) {
      setDisableSubmit(false);
    } else setDisableSubmit(true);
  }, [accountInfo]);

  const handleAccountInfo = (key, label, value) => {
    accountInfo[key] = {
      value: value,
      error: label,
    };
    if (accountInfo[key].error) {
      setIsError(true);
    }
  };

  const handleSkip = () => {
    sessionStorage.setItem("skipAddMembership", "true");
    history.push("/home");
    return;
  };

  const handleClick = (e) => {
    e.preventDefault();
    for (const [key, value] of Object.entries(accountInfo)) {
      switch (key) {
        case "memberId":
          if (value.value.length === 0) {
            {
              handleAccountInfo(key, "Member ID is Required", value.value);
            }
          } else if (value.value.length < 8) {
            handleAccountInfo(
              key,
              "Your Member ID does not meet our minimum requirements.",
              value.value
            );
          }
          break;

        case "firstName":
          if (value.value.length === 0) {
            handleAccountInfo(key, "First Name is Required", value.value);
          }
          break;
        case "lastName":
          if (value.value.length === 0) {
            handleAccountInfo(key, "Last Name is Required", value.value);
          }
          break;

        case "zipcode":
          if (value.value.length === 0) {
            handleAccountInfo(key, "Zipcode is Required", value.value);
          } else if (value.value.length < 5) {
            handleAccountInfo(
              key,
              "Zipcode should contains 5 Digits",
              value.value
            );
          }
          break;

        case "dateofBirth":
          if (!moment(value.value, "MM/DD/YYYY").isValid()) {
            handleAccountInfo(
              key,
              "Your Date of Birth is not correct. Please enter it again.",
              value.value
            );
          } else if (
            moment().diff(moment(value.value, "MM/DD/YYYY"), "years") < 18
          ) {
            handleAccountInfo(
              key,
              "Sorry! You must be 18 years of age or older to create an account",
              value.value
            );
          }
          break;
      }
    }
    if (
      accountInfo["memberId"].error === null &&
      accountInfo["firstName"].error === null &&
      accountInfo["lastName"].error === null &&
      accountInfo["zipcode"].error === null &&
      accountInfo["dateofBirth"].error === null
    ) {
      const data = {
        memberId: accountInfo.memberId.value,
        firstName: accountInfo.firstName.value,
        lastName: accountInfo.lastName.value,
        DOBFULL: accountInfo.dateofBirth.value,
        zipCode: accountInfo.zipcode.value,
      };

      dispatch(requestAddMembership(data, customerInfo.csrf));
      handleSegmentForAuth("HDB", "addMemberForm", customerInfo);
    } else {
      setMembershipInfo(accountInfo);
      setSubmitClicked(true);
    }
  };

  // We are validating the values entered in the fields before we click on Submit- Eg: DateOfBirth & LastName
  const handleMemberInfo = (e, label) => {
    if (label === "dateofBirth") {
      if (submitClicked) {
        setMembershipInfo({
          ...membershipInfo,
          [label]: {
            value: e,
            error: null,
          },
        });
        setSubmitClicked(false);
      } else {
        setMembershipInfo({
          ...membershipInfo,
          [label]: {
            value: e,
            error: null,
          },
        });
      }
    } else {
      if (submitClicked) {
        setMembershipInfo({
          ...membershipInfo,
          [label]: {
            value: e.target.value,
            error: null,
          },
        });
        setSubmitClicked(false);
      } else {
        setMembershipInfo({
          ...membershipInfo,
          [label]: {
            value: e.target.value,
            error: null,
          },
        });
      }
    }
  };

  const handleSuccess = () => {
    logoutApi();
    setTimeout(() => {
      history.push("/login");
    }, 3000);
  };

  const renderStep = (step) => {
    switch (step) {
      case "addMember":
        return (
          <FormWrapper>
            <AddMemberForm onSubmit={(e) => handleClick(e)}>
              <Header>
                Welcome Back,
                <br />
                Please Enter Your Member ID
              </Header>
              <SubHeader>
                A Member ID is required to get the most out of your Healthfirst
                account.
              </SubHeader>
              <CenterInfo>
                {"Don't have a Member ID yet? "}
                <Link role="button" onClick={handleSkip}>
                  Skip for now
                </Link>
              </CenterInfo>
              <FormGrid>
                <InputWrapper>
                  <InputHeader>Member ID</InputHeader>
                  <MemberIdInput>
                    <Input
                      type="text"
                      placeholder="00000000"
                      value={membershipInfo["memberId"].value}
                      onChange={(e) => {
                        handleMemberInfo(e, "memberId");
                      }}
                      error={membershipInfo["memberId"].error}
                      autoFocus
                    />
                    {membershipInfo["memberId"].error && (
                      <InputErrorMsg>
                        {membershipInfo["memberId"].error}
                      </InputErrorMsg>
                    )}
                    <AddMembershipToolTip>
                      <AddMembershipToolTipText className="addMembershipToolTip">
                        This can be found on your Healthfirst Member ID card.
                      </AddMembershipToolTipText>
                    </AddMembershipToolTip>
                  </MemberIdInput>
                </InputWrapper>
                <AdditionalInfo>Additional Info</AdditionalInfo>
                <InputWrapper>
                  <InputHeader>First Name</InputHeader>
                  <Input
                    type="text"
                    placeholder="Enter First Name"
                    value={membershipInfo["firstName"].value}
                    onChange={(e) => {
                      if (e.target.value.length > 0) {
                        const nameRegex = new RegExp("[A-Za-z]");
                        if (!nameRegex.test(e.target.value)) {
                          setMembershipInfo({
                            ...membershipInfo,
                            firstName: {
                              value: e.target.value,
                              error: "Invalid Name Format",
                            },
                          });
                        } else {
                          handleMemberInfo(e, "firstName");
                        }
                      } else {
                        setMembershipInfo({
                          ...membershipInfo,
                          firstName: {
                            value: e.target.value,
                            error: null,
                          },
                        });
                      }
                    }}
                    error={membershipInfo["firstName"].error}
                  />
                  {membershipInfo["firstName"].error && (
                    <InputErrorMsg>
                      {membershipInfo["firstName"].error}
                    </InputErrorMsg>
                  )}
                </InputWrapper>
                <InputWrapper>
                  <InputHeader>Last Name</InputHeader>
                  <Input
                    type="text"
                    placeholder="Enter Last Name"
                    value={membershipInfo["lastName"].value}
                    onChange={(e) => {
                      if (e.target.value.length > 0) {
                        const nameRegex = new RegExp("[A-Za-z]");
                        if (!nameRegex.test(e.target.value)) {
                          setMembershipInfo({
                            ...membershipInfo,
                            lastName: {
                              value: e.target.value,
                              error: "Invalid Name Format",
                            },
                          });
                        } else {
                          handleMemberInfo(e, "lastName");
                        }
                      } else {
                        setMembershipInfo({
                          ...membershipInfo,
                          lastName: {
                            value: e.target.value,
                            error: null,
                          },
                        });
                      }
                    }}
                    error={membershipInfo["lastName"].error}
                  />
                  {membershipInfo["lastName"].error && (
                    <InputErrorMsg>
                      {membershipInfo["lastName"].error}
                    </InputErrorMsg>
                  )}
                </InputWrapper>
                <InputWrapper>
                  <InputHeader>Date of Birth</InputHeader>
                  <Input
                    type="text"
                    placeholder="MM/DD/YYYY"
                    value={membershipInfo["dateofBirth"].value}
                    onChange={(e) => {
                      if (
                        e.target.value.length >
                        membershipInfo["dateofBirth"].value.length
                      ) {
                        let input = e.target.value;
                        input = input.replace(/\D/g, "");
                        input = input.substring(0, 10);
                        let size = input.length;
                        if (size < 2) {
                          input = input;
                        } else if (size < 4) {
                          input =
                            input.substring(0, 2) +
                            "/" +
                            input.substring(2, input.length);
                        } else {
                          input =
                            input.substring(0, 2) +
                            "/" +
                            input.substring(2, 4) +
                            "/" +
                            input.substring(4, 8);
                        }
                        handleMemberInfo(input, "dateofBirth");
                      } else {
                        if (submitClicked) {
                          setMembershipInfo({
                            ...membershipInfo,
                            dateofBirth: {
                              value: e.target.value,
                              error: null,
                            },
                          });
                          setSubmitClicked(false);
                        } else {
                          setMembershipInfo({
                            ...membershipInfo,
                            dateofBirth: {
                              value: e.target.value,
                              error: null,
                            },
                          });
                        }
                      }
                    }}
                    error={membershipInfo["dateofBirth"].error}
                  />
                  {membershipInfo["dateofBirth"].error && (
                    <InputErrorMsg>
                      {membershipInfo["dateofBirth"].error}
                    </InputErrorMsg>
                  )}
                </InputWrapper>
                <InputWrapper>
                  <InputHeader>Zip Code</InputHeader>
                  <Input
                    type="text"
                    placeholder="00000"
                    value={membershipInfo["zipcode"].value}
                    maxLength={5}
                    onChange={(e) => {
                      if (!e.target.value.match(/^\d+$/)) {
                        setMembershipInfo({
                          ...membershipInfo,
                          zipcode: {
                            value: e.target.value,
                            error: "Zipcode must be a number",
                          },
                        });
                      } else {
                        handleMemberInfo(e, "zipcode");
                      }
                    }}
                    error={membershipInfo["zipcode"].error}
                  />
                  {membershipInfo["zipcode"].error && (
                    <InputErrorMsg>
                      {membershipInfo["zipcode"].error}
                    </InputErrorMsg>
                  )}
                </InputWrapper>
              </FormGrid>
              <FormButtonWrapper>
                {!addMembership.loading ? (
                  <SubmitButton disabled={disableSubmit}>Continue</SubmitButton>
                ) : (
                  <ProgressWrapper>
                    <Spinner width="20px" height="20px" />
                  </ProgressWrapper>
                )}
              </FormButtonWrapper>
            </AddMemberForm>
            <FooterBox />
          </FormWrapper>
        );
      case "success":
        return (
          <FormSuccessCard
            message="Membership added successfully!"
            delayedCallback={handleSuccess}
          />
        );
      case "success_medicare":
        return <FormSuccessMedicareCard handleCloseCallback={handleSuccess} />;
    }
  };

  return (
    <Wrapper>
      <LanguageSelectionWrapper>
        <LanguageSelection />
      </LanguageSelectionWrapper>
      <AddMembershipContainer>
        <LogoWrapper>
          <Logo src="/react/images/logo-white.svg" />
        </LogoWrapper>
        {renderStep(step)}
        <Footer>
          <FooterMenuWrapper>
            <FooterMenu />
          </FooterMenuWrapper>
        </Footer>
      </AddMembershipContainer>
    </Wrapper>
  );
};
export default AddMemberPage;

const AddMemberForm = styled(Form)`
  padding-top: 16px;
  margin-top: 10px;
`;

const FormWrapper = styled.div`
  width: 320px;
`;
const AddMembershipContainer = styled(Container)`
  margin-top: 3.75rem;
`;

const AddMembershipToolTip = styled.div`
  position: absolute;
  right: 14px;
  top: 9px;
  z-index: 3;
  display: inline-block;
  background: url(/react/images/ico-info.png) no-repeat center;
  min-width: 25px;
  min-height: 25px;
  &:hover .addMembershipToolTip {
    visibility: visible;
  }
`;
const AddMembershipToolTipText = styled.span`
  visibility: hidden;
  text-align: left;
  padding: 10px;
  position: absolute;
  z-index: 1;
  bottom: 130%;
  margin-left: -155px;
  min-width: 196px;
  width: 196px;
  background-color: #003863;
  color: #fff;
  border-radius: 4px;
  width: 145px;
  min-width: 145px;
  margin-left: -111px;
  text-align: center;
  &:after {
    content: "";
    position: absolute;
    top: 100%;
    left: 85%;
    margin-left: -10px;
    border-width: 10px;
    border-style: solid;
    border-color: #003863 transparent transparent transparent;
  }
`;
