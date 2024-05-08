import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import styled, { keyframes } from "styled-components";
import { Provider, useSelector, useDispatch } from "react-redux";
import {
  requestSubmitMailMemberIDCardForm,
  requestVerifyAddress,
} from "../../store/actions/index";
import { RESET_VERIFY_ADDRESS } from "../../store/actions/actionTypes";
import { useHistory } from "react-router-dom";
import Cookies from "js-cookie";
import {
  ModalWrapper,
  ModalInnerWrapper,
  ModalContent,
  Header,
  Text,
  CloseIcon,
  Button,
  ButtonWrapper,
} from "../../styles/commonStyles";
import DropdownSelect from "../common/dropdownSelect";
import SuccessModal from "../common/successModal";
import TryAgainModal from "../common/tryAgainModal";
import ErrorModal from "../common/errorModal";
import * as CONSTANTS from "../../constants/common";
import { AnalyticsTrack } from "../common/segment/analytics";
import {
  ANALYTICS_TRACK_TYPE,
  ANALYTICS_TRACK_CATEGORY,
} from "../../constants/segment";
import { useSurveyContext } from "../../context/surveyContext";

const MailMemberIDCardForm = (props) => {
  const useComponentDidMount = () => {
    const ref = useRef();
    useEffect(() => {
      ref.current = true;
    }, []);
    return ref.current;
  };

  const { unmountMe, member, showForm, customerDemographicsInfo } = props;
  const dispatch = useDispatch();
  const history = useHistory();
  const visible = showForm;
  const [isValid, setIsValid] = useState(null);
  const customerInfo = useSelector((state) => state.customerInfo);
  const submitMailMemberIDCardFormResponse = useSelector(
    (state) => state.correspondence
  );
  const isComponentMounted = useComponentDidMount();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [streetAddressTwo, setStreetAddressTwo] = useState("");
  const [city, setCity] = useState("");
  const [stateCd, setStateCd] = useState({ label: "", code: "" });
  const [zipCode, setZipCode] = useState("");
  const [step, setStep] = useState(0);
  const [firstNameError, setFirstNameError] = useState(null);
  const [lastNameError, setLastNameError] = useState(null);
  const [streetAddressError, setStreetAddressError] = useState(null);
  const [streetAddressTwoError, setStreetAddressTwoError] = useState(null);
  const [cityError, setCityError] = useState(null);
  const [stateError, setStateError] = useState(null);
  const [zipCodeError, setZipCodeError] = useState(null);
  const [addressOnFile, setAddressOnFile] = useState(null);
  const [fullName, setFullName] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [radioSelectAddressError, setRadioSelectAddressError] = useState("");
  const verifyAddress = useSelector((state) => state.verifyAddress);

  const [timesSubmitted, setTimesSubmitted] = useState(0);

  const {
    digitalSurveyWidget,
    triggerDigitalSurveyByEventName,
    DIGITAL_SURVEY_EVENTS,
  } = useSurveyContext();

  useEffect(() => {
    return () => {
      dispatch({ type: RESET_VERIFY_ADDRESS });
    };
  }, []);

  useEffect(() => {}, [step]);

  useEffect(() => {
    if (customerDemographicsInfo?.hoh !== undefined) {
      customerDemographicsInfo?.hoh.forEach((hoh) => {
        if (member.memberId === hoh.memberId) {
          setFullName(hoh.info.contact.fullName);
          setAddressValue(hoh.info.addresses);
        } else {
          customerDemographicsInfo?.dependents.forEach((dependent) => {
            if (member.memberId === dependent.memberId) {
              setFullName(dependent.info.contact.fullName);
              setAddressValue(dependent.info.addresses);
            }
          });
        }
      });
    }
  }, [customerDemographicsInfo]);

  useEffect(() => {
    if (isComponentMounted && !submitMailMemberIDCardFormResponse.loading) {
      if (submitMailMemberIDCardFormResponse.error) {
        setStep("SomeError");
        AnalyticsTrack("Mail Order ID Card Submission Failed", customerInfo, {
          raw_text: null,
          destination_url: null,
          category: ANALYTICS_TRACK_CATEGORY.memberIdCard,
          type: ANALYTICS_TRACK_TYPE.eventFail,
          targetMemberId: props.member.memberId,
        });
      } else {
        setStep("Success");
        resetFormState();
        setTimesSubmitted(1);
        AnalyticsTrack(
          "Mail Order ID Card Submission Successful",
          customerInfo,
          {
            raw_text: null,
            destination_url: null,
            category: ANALYTICS_TRACK_CATEGORY.memberIdCard,
            type: ANALYTICS_TRACK_TYPE.eventSuccess,
            targetMemberId: props.member.memberId,
          }
        );
      }
    }
  }, [submitMailMemberIDCardFormResponse]);

  useEffect(() => {
    if (!verifyAddress.loading) {
      if (verifyAddress.address) {
        setSelectedAddress(
          addAddress(
            firstName,
            lastName,
            verifyAddress.address.addr1,
            verifyAddress.address.addr2,
            verifyAddress.address.city,
            verifyAddress.address.state,
            verifyAddress.address.zip,
            "suggested"
          )
        );
        setStep("Suggested");
      } else {
        //console.log('verifyAddress call did not succeed');
      }
    }
  }, [verifyAddress]);

  const setAddressValue = (addresses) => {
    for (let addressVal of addresses) {
      if (["Home"].some((type) => type === addressVal.addressType)) {
        setAddressOnFile(addressVal);
        setStep(1);
        return;
      } else if (
        ["Alternate", "Responsible Party"].some(
          (type) => type === addressVal.addressType
        )
      ) {
        setAddressOnFile(addressVal);
        setStep(1);
        return;
      }
    }
    setStep(0);
  };

  const handleFirstNameChange = (event) => {
    setFirstName(event.target.value);
  };
  const handleFirstNameBlur = (event) => {
    if (event.target.value !== "") {
      setFirstNameError(null);
    }
  };
  const handleLastNameChange = (event) => {
    setLastName(event.target.value);
  };
  const handleLastNameBlur = (event) => {
    if (event.target.value !== "") {
      setLastNameError(null);
    }
  };
  const handleStreetAddressChange = (event) => {
    setStreetAddress(event.target.value);
  };
  const handleStreetAddressBlur = (event) => {
    if (event.target.value !== "") {
      setStreetAddressError(null);
    }
  };
  const handleStreetAddressTwoChange = (event) => {
    setStreetAddressTwo(event.target.value);
  };
  const handleCityChange = (event) => {
    setCity(event.target.value);
  };
  const handleCityBlur = (event) => {
    if (event.target.value !== "") {
      setCityError(null);
    }
  };
  const handleStateChange = (event) => {
    if (event.code !== "") {
      setStateError(false);
    }
    setStateCd(event);
  };
  const handleZipCodeChange = (event) => {
    setZipCode(event.target.value);
  };
  const handleZipCodeBlur = (event) => {
    if (event.target.value !== "") {
      setZipCodeError(null);
    }
  };

  const addAddress = (
    firstName,
    lastName,
    streetAddress,
    streetAddressTwo,
    city,
    state,
    zip,
    sourceType
  ) => {
    let address = {
      firstName: firstName,
      lastName: lastName,
      streetAddress: streetAddress,
      streetAddressTwo: streetAddressTwo,
      city: city,
      state: state,
      zip: zip,
      sourceType: sourceType,
    };
    setAddresses([...addresses, address]);
    return address;
  };

  const resetFormFields = () => {
    setFirstName("");
    setFirstNameError(null);
    setLastName("");
    setLastNameError(null);
    setStreetAddress("");
    setStreetAddressError(false);
    setStreetAddressTwo("");
    setCity("");
    setCityError(null);
    setStateCd({ label: "", code: "" });
    setStateError(false);
    setZipCode("");
    setZipCodeError(false);
  };

  const resetFormState = () => {
    resetFormFields();
    setAddresses([]);
    setSelectedAddress(null);
  };

  const closeForm = (data) => {
    //setVisible(false);
    goToFirstStep();
    resetFormState();
    unmountMe();
    Cookies.set("MailMeIdCard", "true", { expires: 1 });
    setTimeout(() => {
      history.push("/idcard?survey=true");
    }, 1000);

    setTimeout(() => {
      if (digitalSurveyWidget)
        triggerDigitalSurveyByEventName(
          digitalSurveyWidget,
          DIGITAL_SURVEY_EVENTS.MAIL_ID_CARD
        );
    }, 3000);
  };

  const submitForm = () => {
    //submit form and if get back an error, then increment.
    if (timesSubmitted >= 3) {
      setStep("Error");
    } else if (addressOnFile && !selectedAddress) {
      let formData = {
        ZipCode: addressOnFile.zip,
        State: addressOnFile.state,
        Representative: "CustomerCenter",
        MemberId: member.memberId,
        LOB: member.lob,
        GroupNumber: member.groupNumber,
        CompanyNumber: member.companyCode,
        City: addressOnFile.city,
        BenefitPackage: member.benefitPackage,
        ApplicationName: "LOFL", //Not sure what we should be setting here
        AddressType: "Temporary", //Not sure if this is supposed to be null or Primary
        Address1: addressOnFile.addressLine1,
        Address2: addressOnFile.addressLine2,
        ActionDate: null, //Not sure what this is
        ActionCode: null, //Not sure what this is
      };

      let filteredFormData = Object.fromEntries(
        Object.entries(formData).filter(([_, v]) => v != null)
      );
      dispatch(requestSubmitMailMemberIDCardForm(filteredFormData));
    } else {
      let formData = {
        ZipCode: selectedAddress.zip,
        State: selectedAddress.state,
        Representative: "CustomerCenter",
        MemberId: member.memberId,
        LOB: member.lob,
        GroupNumber: member.groupNumber,
        CompanyNumber: member.companyCode,
        City: selectedAddress.city,
        BenefitPackage: member.benefitPackage,
        ApplicationName: "LOFL", //Not sure what we should be setting here
        AddressType: "Temporary", //Not sure if this is supposed to be null or Primary
        Address1: selectedAddress.streetAddress,
        Address2: selectedAddress.streetAddressTwo,
        ActionDate: null, //Not sure what this is
        ActionCode: null, //Not sure what this is
      };

      let filteredFormData = Object.fromEntries(
        Object.entries(formData).filter(([_, v]) => v != null)
      );
      dispatch(requestSubmitMailMemberIDCardForm(filteredFormData));
    }
    setTimesSubmitted(timesSubmitted + 1);
  };

  const validateForm = () => {
    if (step == "Error") {
      goToFirstStep();
      return false;
    }
    let isValid = true;
    if (firstName === "") {
      setFirstNameError("This field is required.");
      isValid = false;
    } else setFirstNameError(null);
    if (lastName === "") {
      setLastNameError("This field is required.");
      isValid = false;
    } else setLastNameError(null);
    if (streetAddress === "") {
      setStreetAddressError("This field is required.");
      isValid = false;
    } else setStreetAddressError(null);
    /* We are not going to require this one currently 
        if(streetAddressTwo === ""){
            setStreetAddressTwoError("This field is required.");
            isValid = false;
        } else (setStreetAddressTwoError(null));
        */
    if (city === "") {
      setCityError("This field is required.");
      isValid = false;
    } else setCityError(null);
    if (stateCd.label === "" || stateCd.code === "") {
      setStateError("This field is required.");
      isValid = false;
    } else setStateError(null);
    if (zipCode === "") {
      setZipCodeError("This field is required.");
      isValid = false;
    } else setZipCodeError(null);

    if (!isValid) setIsValid(false);
    return isValid;
  };

  const setNotValid = () => {
    setIsValid(false);
  };

  const handleManualSubmit = () => {
    const isValid = validateForm();

    // check if the questions is the last one
    if (isValid) {
      setSelectedAddress(
        addAddress(
          firstName,
          lastName,
          streetAddress,
          streetAddressTwo,
          city,
          stateCd.code,
          zipCode,
          "userInput"
        )
      );
      dispatch(
        requestVerifyAddress(
          streetAddress,
          streetAddressTwo,
          city,
          stateCd.code,
          zipCode
        )
      );
    } else {
      //goToFirstStep();
    }
  };

  const handleBack = () => {
    const isValid = validateForm();

    // check if the questions is the last one
    if (isValid) {
      setAddresses([]);
      setStep(0);
    } else {
      goToFirstStep();
    }
  };

  const goToFirstStep = () => {
    if (addressOnFile != null) {
      setStep(1);
    } else {
      setStep(0);
    }
  };

  const renderSwitch = (step) => {
    switch (step) {
      case 0:
        return (
          <div>
            <FormModalHeader>Mail Me a New ID Card</FormModalHeader>
            <Text>
              This address will not be saved to your account and will only be
              used once to mail your ID card.
            </Text>
            <SubHeader>Enter Mailing Address</SubHeader>
            <FormGrid>
              <FullWrapper>
                <InputHeader>First Name</InputHeader>
                <Input
                  placeholder="Enter First Name"
                  value={firstName}
                  onChange={handleFirstNameChange}
                  onBlur={handleFirstNameBlur}
                  error={firstNameError}
                />
                {firstNameError && (
                  <InputErrorMsg>{firstNameError}</InputErrorMsg>
                )}
              </FullWrapper>
              <FullWrapper>
                <InputHeader>Last Name</InputHeader>
                <Input
                  placeholder="Enter Last Name"
                  value={lastName}
                  onChange={handleLastNameChange}
                  onBlur={handleLastNameBlur}
                  error={lastNameError}
                />
                {lastNameError && (
                  <InputErrorMsg>{lastNameError}</InputErrorMsg>
                )}
              </FullWrapper>
              <FullWrapper>
                <InputHeader>Street Address</InputHeader>
                <Input
                  placeholder="Enter Street Address"
                  value={streetAddress}
                  onChange={handleStreetAddressChange}
                  onBlur={handleStreetAddressBlur}
                  error={streetAddressError}
                />
                {streetAddressError && (
                  <InputErrorMsg>{streetAddressError}</InputErrorMsg>
                )}
              </FullWrapper>
              <FullWrapper>
                <InputHeader>Address Line #2 (Optional)</InputHeader>
                <Input
                  placeholder="Enter Street Address"
                  value={streetAddressTwo}
                  onChange={handleStreetAddressTwoChange}
                  error={streetAddressTwoError}
                />
                {streetAddressTwoError && (
                  <InputErrorMsg>{streetAddressTwoError}</InputErrorMsg>
                )}
              </FullWrapper>
              <FullWrapper>
                <InputHeader>City</InputHeader>
                <Input
                  placeholder="Enter City"
                  value={city}
                  onChange={handleCityChange}
                  onBlur={handleCityBlur}
                  error={cityError}
                />
                {cityError && <InputErrorMsg>{cityError}</InputErrorMsg>}
              </FullWrapper>
              <HalfWrapper>
                <InputHeader>State</InputHeader>
                <DropdownSelect
                  placeholder={"Select State"}
                  selected={
                    stateCd.label === "" ? null : { label: stateCd.label }
                  }
                  selectedHighlight={true}
                  heightPixels={211}
                  values={CONSTANTS.StateLabelValues}
                  onSelect={handleStateChange}
                  error={stateError}
                  onInvalidateError={setNotValid}
                  errorMessage={"This field is required."}
                  fullWidth={true}
                  showImage={false}
                />
              </HalfWrapper>
              <HalfWrapper>
                <InputHeader>Zip Code</InputHeader>
                <Input
                  placeholder="Enter Zip Code"
                  value={zipCode}
                  onChange={handleZipCodeChange}
                  onBlur={handleZipCodeBlur}
                  error={zipCodeError}
                />
                {zipCodeError && <InputErrorMsg>{zipCodeError}</InputErrorMsg>}
              </HalfWrapper>
            </FormGrid>
            <FormButtonWrapper>
              {verifyAddress.loading ? (
                <FormButton green={true}>
                  <ProgressSpinner></ProgressSpinner>
                </FormButton>
              ) : (
                <FormButton green={true} onClick={handleManualSubmit}>
                  Continue
                </FormButton>
              )}
              <FormButton green={false} onClick={() => closeForm()}>
                Cancel
              </FormButton>
            </FormButtonWrapper>
          </div>
        );
      case 1:
        return (
          <>
            {
              <div>
                <FormModalHeader>Mail Me a New ID Card</FormModalHeader>
                <FormModalSubHeader>
                  The new ID card will be mailed to the address below.
                </FormModalSubHeader>
                <br />
                {addressOnFile && !streetAddress ? (
                  <InfoWrapper>
                    <MemberDetailsFullName>{fullName}</MemberDetailsFullName>
                    {addressOnFile ? (
                      <AddressField>
                        <MemberDetailField>
                          {addressOnFile.addressLine1}
                        </MemberDetailField>
                        <MemberDetailField>
                          {addressOnFile.city}, {addressOnFile.state},{" "}
                          {addressOnFile.zip}
                        </MemberDetailField>
                      </AddressField>
                    ) : (
                      <MemberDetailField>
                        Currently we do not have your address on file
                      </MemberDetailField>
                    )}
                  </InfoWrapper>
                ) : (
                  <InfoWrapper>
                    <MemberDetailsFullName>
                      {firstName || lastName ? firstName + " " + lastName : ""}
                    </MemberDetailsFullName>
                    <AddressField>
                      <MemberDetailField>
                        {streetAddress ? streetAddress : ""}
                      </MemberDetailField>
                      {streetAddressTwo ? (
                        <MemberDetailField>
                          {streetAddressTwo ? streetAddressTwo : ""}
                        </MemberDetailField>
                      ) : null}
                      <MemberDetailField>
                        {city}, {stateCd?.label}, {zipCode}
                      </MemberDetailField>
                    </AddressField>
                  </InfoWrapper>
                )}
                <br style={{ clear: "both" }} />
                <br />
                <EditAddrressButton onClick={() => setStep(0)}>
                  <EditAddrressButtonImg src="/react/images/other/ico-pencil.svg" />
                  <EditAddrressButtonTxt>
                    Send to Different Mailing Address
                  </EditAddrressButtonTxt>
                </EditAddrressButton>
                <br />
                {addressOnFile ? (
                  <FormButtonWrapper>
                    {!submitMailMemberIDCardFormResponse.loading ? (
                      <FormButton
                        green={true}
                        onClick={(event) => {
                          submitForm();
                          AnalyticsTrack(
                            "Mail Order ID Card Submit Button Clicked",
                            customerInfo,
                            {
                              raw_text: "Confirm Address",
                              destination_url: null,
                              category: ANALYTICS_TRACK_CATEGORY.memberIdCard,
                              type: ANALYTICS_TRACK_TYPE.linkClicked,
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
                        }}
                      >
                        Confirm Address
                      </FormButton>
                    ) : (
                      <FormButton green={true}>
                        <ProgressSpinner></ProgressSpinner>
                      </FormButton>
                    )}
                    <FormButton green={false} onClick={() => closeForm()}>
                      Cancel
                    </FormButton>
                  </FormButtonWrapper>
                ) : (
                  <FormButtonWrapper>
                    <FormButton green={true} onClick={() => closeForm()}>
                      Close
                    </FormButton>
                  </FormButtonWrapper>
                )}
              </div>
            }
          </>
        );
      case "Suggested":
        return (
          <div>
            <FormModalHeader>Confirm Mailing Address</FormModalHeader>
            <ConfirmationSubHeader>
              We were unable to verify your address. Please select the address
              you’d like to use to ensure a timely delivery.
            </ConfirmationSubHeader>
            <br />
            <>
              {addresses.map((address) => (
                <>
                  {address?.sourceType === "userInput" && (
                    <RadioHeader>You Entered</RadioHeader>
                  )}
                  {address?.sourceType === "suggested" && (
                    <RadioHeader>We Suggest</RadioHeader>
                  )}
                  <AddressCard
                    key={address.streetAddress + address.sourceType}
                    onClick={() => setSelectedAddress(address)}
                    status={
                      radioSelectAddressError
                        ? "error"
                        : selectedAddress &&
                          selectedAddress.sourceType === address.sourceType
                        ? "selected"
                        : ""
                    }
                  >
                    <RadioButtonContainer>
                      <RadioAddressWrapper>
                        <MemeberDetailFieldWrapper>
                          <MemeberDetailField>
                            {firstName} {lastName}
                          </MemeberDetailField>
                        </MemeberDetailFieldWrapper>
                        <div>
                          {
                            <MemeberDetailFieldWrapper>
                              <MemeberDetailField>
                                {address.streetAddress
                                  ? address.streetAddress
                                  : ""}{" "}
                                {address.streetAddressTwo
                                  ? address.streetAddressTwo
                                  : ""}
                              </MemeberDetailField>
                              <MemeberDetailField>
                                {address.city}, {address.state}, {address.zip}
                              </MemeberDetailField>
                            </MemeberDetailFieldWrapper>
                          }
                        </div>
                      </RadioAddressWrapper>
                      <RadioImgWrapper>
                        {selectedAddress &&
                        selectedAddress.sourceType === address.sourceType ? (
                          <RadioImg
                            alt=""
                            src="/react/images/icn-radio-active.svg"
                          />
                        ) : (
                          <RadioImg
                            alt=""
                            src="/react/images/icn-radio-inactive.svg"
                          />
                        )}
                      </RadioImgWrapper>
                    </RadioButtonContainer>
                  </AddressCard>
                  <br />
                </>
              ))}
            </>
            <FormButtonWrapper>
              {!submitMailMemberIDCardFormResponse.loading ? (
                <FormButton
                  green={true}
                  onClick={(event) => {
                    submitForm();
                    AnalyticsTrack(
                      "Mail Order ID Card Submit Button Clicked",
                      customerInfo,
                      {
                        raw_text: "Confirm Address",
                        destination_url: null,
                        category: ANALYTICS_TRACK_CATEGORY.memberIdCard,
                        type: ANALYTICS_TRACK_TYPE.linkClicked,
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
                  }}
                >
                  Confirm Address
                </FormButton>
              ) : (
                <FormButton green={true}>
                  <ProgressSpinner></ProgressSpinner>
                </FormButton>
              )}
              <FormButton green={false} onClick={() => handleBack()}>
                Back
              </FormButton>
            </FormButtonWrapper>
          </div>
        );
      case "Success":
        return (
          <SuccessModal
            closeButtonClick={() => closeForm()}
            modalHeaderText={"Your new Member ID Card is on its way!"}
            modalBodyText={
              "Thank you for your ID Card request. Your new ID card will arrive at your mailing address in 10-15 days."
            }
          />
        );
      case "Error":
        return <ErrorModal closeButtonClick={() => closeForm()} />;
      default:
        return (
          <TryAgainModal
            tryAgainButtonClick={() => submitForm()}
            backButtonClick={() => handleBack()}
            isLoading={submitMailMemberIDCardFormResponse.loading}
          />
        );
    }
  };
  return (
    <MailMemberIDCardFormWrapper>
      {visible === true ? (
        <FormModalWrapper visible={visible}>
          <ModalInnerWrapper>
            <FormModalContent>
              <CloseIcon
                src="/react/images/icn-close.svg"
                onClick={() => closeForm()}
              />
              {renderSwitch(step)}
            </FormModalContent>
          </ModalInnerWrapper>
        </FormModalWrapper>
      ) : null}
    </MailMemberIDCardFormWrapper>
  );
};

const MailMemberIDCardFormWrapper = styled.div`
  width: 440px;
  height: 376px;
`;

const ContactSpan = styled.span`
  font-size: 14px;
  cursor: pointer;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  color: #008bbf;
  font-weight: 600;
`;

const FormModalWrapper = styled(ModalWrapper)`
  transition: opacity 300ms ease-in-out;
  opacity: ${(props) => (props.visible ? "1" : "0")};
`;

const FormModalContent = styled(ModalContent)`
  transition: opacity 300ms ease-in-out;
`;

const FormModalHeader = styled(Header)`
  font-size: 24px;
  line-height: 1.4;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const FormModalSubHeader = styled.h3`
  font-size: 1rem;
  font-style: normal;
  font-weight: 600;
  line-height: 1.5rem;
  color: #474b55;
`;

const SubHeader = styled.h3`
  margin: 4px 4px 8px 0;
  font-size: 16px;
  font-weight: 700;
  font-stretch: normal;
  font-style: normal;
  line-height: 24px;
  letter-spacing: normal;
  color: #474b55;
`;

const ConfirmationSubHeader = styled(SubHeader)`
  font-weight: 300;
`;

const AddressField = styled.div``;

const AddressInfo = styled.div``;

const ContactText = styled.div`
  font-size: 14px;
  font-stretch: normal;
  font-family: "museo-sans", san-serif;
  font-style: normal;
  line-height: 20px;
  letter-spacing: normal;
  color: #474b55;
  margin-top: 16px;
  font-weight: 400;
`;

const SubHeaderTwo = styled.div`
  margin: 4px 4px 16px 0;
  font-size: 16px;
  font-stretch: normal;
  font-style: normal;
  line-height: 24px;
  letter-spacing: normal;
  color: #474b55;
  font-weight: 400;
`;

const InputHeader = styled.h3`
  margin: 8px 4px 8px 0;
  font-size: 16px;
  font-weight: 300;
  font-stretch: normal;
  font-style: normal;
  line-height: 24px;
  letter-spacing: normal;
  color: #474b55;
`;

const Input = styled.input`
  min-height: 40px;
  width: 100%;
  max-width: 100%;
  font-size: 16px;
  font-weight: 300;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: normal;
  color: #474b55;
  padding: 0 16px;
  border: 1px solid #474b55;
  border-radius: 4px;
  border: solid 1px #a8abac;
  border-color: ${(props) => props.error && "#ad122a"};

  &[type="number"]::-webkit-inner-spin-button,
  &[type="number"]::-webkit-outer-spin-button {
    display: none;
  }

  &:focus {
    border-color: #474b55;
  }
  ::placeholder,
  ::-webkit-input-placeholder {
    color: ${(props) => (props.error ? "#ad122a" : "#a8abac")};
  }
  :-ms-input-placeholder {
    color: ${(props) => (props.error ? "#ad122a" : "#a8abac")};
  }
`;

const InputErrorMsg = styled.div`
  font-size: 12px;
  font-weight: 300;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: normal;
  color: #a0252c;
  padding-top: 4px;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 50% 50%;
  grid-column-gap: 2rem;
  grid-row-gap: 1rem;
  margin-right: 2rem;
`;

const FullWrapper = styled.div`
  grid-column: 1 / 3;
`;

const HalfWrapper = styled.div`
  @media only screen and (max-width: 768px) {
    grid-column: 1 / 3;
  }
`;

const FormButtonWrapper = styled(ButtonWrapper)`
  margin-top: 16px;
  margin-bottom: 48px;
  @media only screen and (max-width: 768px) {
    margin-bottom: 10rem;
  }
`;

const FormButton = styled(Button)`
  @media only screen and (max-width: 768px) {
    width: 100%;
    margin: 4px auto;
  }
`;

const InfoWrapper = styled.div`
  float: left;
  width: 85%;
`;

const FormText = styled.div``;

const EditButton = styled.button`
  margin: 0 0 4px 0px;
  font-size: 14px;
  font-weight: 700;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.14;
  letter-spacing: normal;
  color: #008bbf;
  cursor: pointer;
  width: auto;
  background: white;
  border: 0;
  float: right;
  &:hover {
    color: #1d68a7;
    text-decoration: underline;
  }

  &:focus {
    outline: 0;
    box-shadow: none;
  }
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
  margin-left: 4rem;
  margin-right: 4rem;
  animation-name: ${SpinnerRotate};
  animation-duration: 2s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  @media only screen and (max-width: 768px) {
    margin-left: auto;
    margin-right: auto;
  }
`;

const MemberDetailsFullName = styled.div`
  font-family: "museo-sans", san-serif;
  font-size: 16px;
  font-weight: 600;
  color: #474b55;
`;

const MemberDetailField = styled.div`
  font-family: "museo-sans", san-serif;
  font-size: 14px;
  font-weight: 500;
  color: #474b55;
`;

const EditAddrressButton = styled.button`
  height: 40px;
  justify-content: center;
  align-items: center;
  // margin-top: 16px;
  padding: 8px;
  border-radius: 8px;
  border: solid 1px #d8d8d8;
  background-color: #ffffff;
  display: flex;
  &:hover {
    background-color: rgb(242, 249, 252);
  }
  &:active {
    background-color: rgb(230, 244, 249);
  }
  @media only screen and (max-width: 768px) {
    width: 100%;
  }
`;

const EditAddrressButtonImg = styled.img`
  margin-right: 5px;
`;

const EditAddrressButtonTxt = styled.div`
  font-size: 14px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.14;
  letter-spacing: normal;
  text-align: left;
  color: #008bbf;
`;
const AddressCard = styled.div`
  overflow: hidden;
  padding: 16px 16px 16px 16px;
  border-radius: 6px;
  border: ${({ status }) =>
    status
      ? status === "selected"
        ? "solid 2px #003863"
        : "solid 2px #ad122a"
      : "solid 1px #d8d8d8"};
`;
const RadioButtonContainer = styled.div`
  display: flex;
  gap: 12px;
`;
const RadioImgWrapper = styled.div`
  width: 50%;
  position: relative;
`;
const RadioImg = styled.img`
  position: absolute;
  top: 50%;
  left: 90%;
  transform: translate(-50%, -50%);
`;
const RadioHeader = styled.h2`
  font-size: 1rem;
  font-style: normal;
  font-weight: 600;
  line-height: 1.5rem;
  color: #003863;
  margin-bottom: 0.5rem;
`;
const RadioAddressWrapper = styled.div`
  width: 50%;
`;
const MemeberDetailFieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;
const MemeberDetailFieldImg = styled.img`
  margin-top: 1.5px;
`;
const MemeberDetailField = styled.div`
  font-family: "museo-sans", san-serif;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.43;
  color: #474b55;
`;
export default MailMemberIDCardForm;
