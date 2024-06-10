import React, { useEffect, useState } from "react";
import styled from "styled-components";
import RegistrationSuccess from "./registrationSuccess";
import RegistrationOnlySuccess from "./registrationOnlySuccess";
import useQuery from "../../../hooks/useQuery";
import { passwordIsValid } from "../../../utils/formValidation";
import FormSuccessMedicareCard from "./formSuccessMedicaid";
import { Link, useHistory } from "react-router-dom";

import {
  FormGrid,
  InputWrapper,
  InputHeader,
  Input,
  VerifyButton,
  InputErrorMsg,
  FormButtonWrapper,
  StyledButton,
  Header,
  MemberIdInput,
  Tooltip,
  InfoIcon,
  ToolTipText,
  ProgressWrapper,
  Spinner,
} from "../styles";
import { handleSegmentClick } from "../../../libs/segment";
import { useDispatch, useSelector } from "react-redux";
import { requestCreateUserNamePassword } from "../../../store/actions";
import { useToaster } from "../../../hooks/useToaster";

const USERNAME_REQUIRED = "Username is required";
const USERNAME_SHOULD_BE_MORE_CHAR = "Please enter at least 3 characters";
const INVALID_USERNAME = "Invalid Username";
const PASSWORD_REQUIRED = "Password is required";
const INVALID_PASSWORD = "Password does not meet requirement";
const CONFIRM_PASSWORD_ERROR = "Password does not match";
const ERROR = "error";

const CreateUserCredentials = (props) => {
  const initialState = {
    UserName: {
      value: "",
      error: null,
    },
    Password: {
      value: "",
      error: null,
    },
    ConfirmPassword: {
      value: "",
      error: null,
    },
  };
  const { addToast } = useToaster();
  const [memberInfo, setMemberInfo] = useState(initialState);
  const [submitClicked, setSubmitClicked] = useState(false);
  const [isContinue, setIsContinue] = useState(false);
  const [varient, setVarient] = useState("");
  const [isError, setIsError] = useState(false);
  const [isHover, setIsHover] = useState(false);
  const accountInfo = { ...memberInfo };

  const dispatch = useDispatch();
  const history = useHistory();
  const createUsernamePassword = useSelector(
    (state) => state.createUsernamePassword
  );

  const validationRequired = useSelector(
    (state) => state.memberRegister.data.validationRequired
  );

  // const registrationOnlyValue = useQuery().get("registrationOnly")
  const [registrationOnlyValue, setregistrationOnlyValue] = useState(
    useQuery().get("registrationOnly")
  );

  useEffect(() => {
    if (!createUsernamePassword.loading && isContinue) {
      if (createUsernamePassword?.data !== null) {
        setSubmitClicked(true);
      } else {
        addToast({
          timeout: 5000,
          notificationText: createUsernamePassword?.error?.message,
          notificationType: ERROR,
        });
      }
    }
  }, [createUsernamePassword]);

  const mfaVerify = useSelector((state) => state.mfaVerify);
  const mfaVerifiedToken = mfaVerify.data?.mfaAuthorization;

  const handleAccountInfo = (key, label, value) => {
    accountInfo[key] = {
      value: value,
      error: label,
    };
    if (accountInfo[key].error) {
      setIsError(true);
    }
  };

  const checkValidations = () => {
    for (const [key, value] of Object.entries(accountInfo)) {
      switch (key) {
        case "UserName":
          if (value.value.length === 0) {
            handleAccountInfo(key, USERNAME_REQUIRED, value.value);
          } else if (value.value.length < 3) {
            handleAccountInfo(key, USERNAME_SHOULD_BE_MORE_CHAR, value.value);
          } else if (value.value.length > 0) {
            if (!isNaN(value.value)) {
              handleAccountInfo(key, INVALID_USERNAME, value.value);
            } else {
              handleAccountInfo(key, null, value.value);
            }
          }
          break;

        case "Password":
          if (value.value.length === 0) {
            handleAccountInfo(key, PASSWORD_REQUIRED, value.value);
            setMemberInfo(accountInfo);
          } else if (value.value.length > 0) {
            if (
              passwordIsValid(value.value) &&
              !value.value.includes(accountInfo["UserName"].value)
            ) {
              handleAccountInfo(key, null, value.value);
            } else {
              handleAccountInfo(key, INVALID_PASSWORD, value.value);
              setMemberInfo(accountInfo);
            }
          }
          break;

        case "ConfirmPassword":
          if (value?.value.length >= 2) {
            if (accountInfo["Password"].value === value.value) {
              handleAccountInfo(key, null, value.value);
            } else {
              handleAccountInfo(key, CONFIRM_PASSWORD_ERROR, value.value);
            }
          }
          break;
      }
    }
  };

  const checkUsernameValidation = () => {
    checkAllFields();
    for (const [key, value] of Object.entries(accountInfo)) {
      if (key == "UserName") {
        if (value.value.length === 0) {
          handleAccountInfo(key, USERNAME_REQUIRED, value.value);
        } else if (value.value.length < 3) {
          handleAccountInfo(key, USERNAME_SHOULD_BE_MORE_CHAR, value.value);
        } else if (value.value.length > 0) {
          if (!isNaN(value.value)) {
            handleAccountInfo(key, INVALID_USERNAME, value.value);
          } else {
            handleAccountInfo(key, null, value.value);
          }
        }
      }
    }
    if (accountInfo["UserName"].error != null) {
      setMemberInfo(accountInfo);
    }
  };

  const handleSubmit = (trigger) => {
    if (trigger) {
      checkValidations();
      if (
        accountInfo["UserName"].error === null &&
        accountInfo["Password"].error === null &&
        accountInfo["ConfirmPassword"].error === null
      ) {
        const data = {
          username: accountInfo.UserName.value,
          password: accountInfo.Password.value,
          confirmPassword: accountInfo.ConfirmPassword.value,
        };
        handleSegmentClick(
          null,
          "Finish Registration",
          "Finish Registration",
          "button",
          "bottom",
          "",
          "registration"
        );
        dispatch(requestCreateUserNamePassword(data, mfaVerifiedToken));
        setIsContinue(true);
      } else {
        setMemberInfo(accountInfo);
      }
    }
  };

  const handleMemberInfo = (e, label) => {
    if (submitClicked) {
      setMemberInfo({
        ...memberInfo,
        [label]: {
          value: e.target.value,
          error: null,
        },
      });
      setSubmitClicked(false);
    } else {
      setMemberInfo({
        ...memberInfo,
        [label]: {
          value: e.target.value,
          error: null,
        },
      });
    }
  };

  const handleSuccess = () => {
    history.push("/login");
  };

  const checkAllFields = () => {
    if (
      accountInfo["Password"].value.length > 1 &&
      accountInfo["ConfirmPassword"].value.length > 1 &&
      accountInfo["UserName"].value.length > 2
    ) {
      setVarient("primary");
    } else {
      setVarient("");
    }
  };

  return (
    <>
      <MemberCardsContainer>
        {submitClicked ? (
          registrationOnlyValue ? (
            <RegistrationOnlySuccess />
          ) : validationRequired ? (
            <FormSuccessMedicareCard handleCloseCallback={handleSuccess} />
          ) : (
            <RegistrationSuccess />
          )
        ) : (
          <MemberCard>
            {isHover && (
              <CustomToolTip>
                <CustomToolTipText>
                  Must contain: <br />
                  - At least 9 characters
                  <br />
                  - 1 upper case letter <br />
                  - 1 lower case letter
                  <br />
                  - 1 number
                  <br />
                  - 1 special character
                  <br />- Should NOT contain part of your username, first, or
                  last name
                </CustomToolTipText>
              </CustomToolTip>
            )}
            <CustomHeader>Set Username and Password</CustomHeader>
            <FormGrid>
              <InputWrapper>
                <InputHeader htmlFor="firstName" name="firstName">
                  UserName
                </InputHeader>
                <MemberIdInput>
                  <Image src="/react/images/account_normal.png"></Image>
                  <CustomInput
                    autoFocus
                    type="text"
                    name="firstName"
                    data-type="firstName"
                    onClick={() => checkAllFields()}
                    autocomplete="given-name"
                    placeholder="Enter a UserName"
                    value={memberInfo["UserName"].value}
                    onChange={(e) => {
                      checkAllFields();
                      if (e.target.value.length > 0) {
                        handleMemberInfo(e, "UserName");
                      } else {
                        setMemberInfo({
                          ...memberInfo,
                          UserName: {
                            value: e.target.value,
                            error: null,
                          },
                        });
                      }
                    }}
                    error={memberInfo["UserName"].error}
                  />
                  {memberInfo["UserName"].error && (
                    <InputErrorMsg>
                      {memberInfo["UserName"].error}
                    </InputErrorMsg>
                  )}
                </MemberIdInput>
              </InputWrapper>
              <InputWrapper>
                <InputHeader>Password</InputHeader>
                <MemberIdInput>
                  <Image src="/react/images/lock-icon-grey.svg"></Image>
                  <CustomInput
                    type="password"
                    placeholder="Enter a Password"
                    value={memberInfo["Password"].value}
                    onClick={() => checkUsernameValidation()}
                    onChange={(e) => {
                      checkUsernameValidation();
                      checkAllFields();
                      if (e.target.value.length > 0) {
                        handleMemberInfo(e, "Password");
                      } else {
                        setMemberInfo({
                          ...memberInfo,
                          Password: {
                            value: e.target.value,
                            error: null,
                          },
                        });
                      }
                    }}
                    error={memberInfo["Password"].error}
                  />
                  {memberInfo["Password"].error && (
                    <InputErrorMsg>
                      {memberInfo["Password"].error}
                    </InputErrorMsg>
                  )}
                  <InfoIcon
                    src="/react/images/ico-info.png"
                    onMouseLeave={() => setIsHover(false)}
                    onMouseOver={() => setIsHover(true)}
                  ></InfoIcon>
                </MemberIdInput>
              </InputWrapper>
              <InputWrapper>
                <InputHeader>Confirm Password</InputHeader>
                <MemberIdInput>
                  <Image src="/react/images/lock-icon-grey.svg"></Image>
                  <CustomInput
                    type="password"
                    placeholder="Confirm Password"
                    onClick={() => checkAllFields()}
                    value={memberInfo["ConfirmPassword"].value}
                    onSelect={(e) => {
                      checkValidations();
                    }}
                    onChange={(e) => {
                      checkAllFields();
                      checkValidations();
                      if (e.target.value.length > 0) {
                        handleMemberInfo(e, "ConfirmPassword");
                      } else {
                        setMemberInfo({
                          ...memberInfo,
                          ConfirmPassword: {
                            value: e.target.value,
                            error: null,
                          },
                        });
                      }
                    }}
                    error={memberInfo["ConfirmPassword"].error}
                  />
                  {memberInfo["ConfirmPassword"].error && (
                    <InputErrorMsg>
                      {memberInfo["ConfirmPassword"].error}
                    </InputErrorMsg>
                  )}
                </MemberIdInput>
              </InputWrapper>
            </FormGrid>
            <CustomFormWrapper>
              {!createUsernamePassword.loading ? (
                <FinishButton
                  variant={varient}
                  onClick={() =>
                    varient === "primary"
                      ? handleSubmit(true)
                      : handleSubmit(false)
                  }
                >
                  Finish Registration
                </FinishButton>
              ) : (
                <ProgressWrapper>
                  <Spinner width="20px" height="20px" />
                </ProgressWrapper>
              )}
            </CustomFormWrapper>
          </MemberCard>
        )}
      </MemberCardsContainer>
    </>
  );
};

export default CreateUserCredentials;

const FinishButton = styled(StyledButton)`
  margin-top: 8px;
  color: #ffffff;
  background-color: ${({ variant }) =>
    variant === "primary" ? "#3e7128" : "#D3D3D3"};
  &:hover {
    background-color: ${({ variant }) =>
      variant === "primary" ? "#3e7128" : "#D3D3D3"};
  }
`;

const CustomInput = styled(Input)`
  padding: 8px 16px 8px 40px;
`;

const MemberCard = styled.div`
  overflow: hidden;
  padding: 16px 16px 12px 16px;
  border-radius: 4px;
  // border: solid 2px #d8d8d8;
  background: #ffffff;
`;

const LogoImg = styled.img`
  height: 47px;
  margin: auto;
  margin-top: 15px;
  margin-bottom: 47px;
}
`;

const CustomToolTip = styled(Tooltip)`
  width: 166px;
  height: 177px;
  margin-top: 30px;
  margin-left: 120px;
  z-index: 1;
`;

const CustomToolTipText = styled(ToolTipText)`
  align-items: start;
  text-align: start;
  font-weight: 400;
  font-size: 12px;
  line-height: 18px;
  color: #ffffff;
  height: 159px;
  padding: 8px 9px 10px 8px;
`;

const MemberCardsContainer = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 8px;
  width: 320px;
  left: 0px;
  top: 0px;
  border-radius: 4px;
  margin: auto;
  font-family: "museo-sans" !important;
`;

const CustomFormWrapper = styled(FormButtonWrapper)`
  margin-top: 118px;
  @media only screen and (max-width: 768px) {
    margin-top: 90px;
  }
`;

const CustomHeader = styled(Header)`
  margin: 32px 16px 24px 16px;
`;

const Image = styled.img`
  position: absolute;
  margin-top: 9px;
  margin-left: 11px;
`;
