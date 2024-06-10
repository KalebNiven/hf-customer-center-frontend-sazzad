import React, { useState, useEffect, useRef } from "react";
import styled, { keyframes } from "styled-components";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/high-res.css";

import { Provider, useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router";
import {
  ModalWrapper,
  ModalInnerWrapper,
  ModalContent,
  Header,
  CloseIcon,
  Button,
  ButtonWrapper,
} from "../../styles/commonStyles";
import DropdownSelect from "../common/dropdownSelect";
import * as CONSTANTS from "../../constants/common";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { makeStyles } from "@material-ui/core/styles";
import {
  StyledButton,
  MemberDropDownSelect,
  MemberDropDownSelectWrapper,
} from "../common/styles";
import {
  requestSubmitClaimDetails,
  submitAttestationAgreement,
} from "../../store/actions";
import Cookies from "js-cookie";
import { useSurveyContext } from "../../context/surveyContext";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiOutlinedInput-root": {
      marginTop: "0px !important",
    },
    "& .MuiInputBase-input": {
      fontFamily: "museo-sans, san-serif !important",
      fontSize: "16px",
      fontWeight: "300",
      fontStretch: "normal",
      fontStyle: "normal",
      "&::placeholder": {
        color: ({ claimInformationError }) =>
          claimInformationError ? "#ad122a" : "#474b55",
        opacity: ({ claimInformationError }) =>
          claimInformationError ? "1" : "0.5",
      },
    },
    "& .MuiButtonBase-root MuiIconButton-root MuiPickersDay-day MuiPickersDay-current MuiPickersDay-daySelected":
      {
        backgroundColor: "#474b55 !important",
      },
  },
}));
const SubmitClaimModal = ({ unmountMe, showModal }) => {
  const [claimInformation, setClaimInformation] = useState({
    reasonForSubmission: {
      value: "",
      error: null,
    },
    dateOfService: {
      value: null,
      error: null,
    },
    facilityName: {
      value: "",
      error: null,
    },
    phoneNumber: {
      value: "",
      error: null,
    },
    claimAmount: {
      value: "",
      error: null,
    },
    claimNumber: {
      value: "",
      error: null,
    },
    accountNumber: {
      value: "",
      error: null,
    },
    fullName: {
      value: "",
      error: null,
    },
    attestationChecked: {
      value: false,
      error: null,
    },
  });
  const themeProp = {
    claimInformationError: claimInformation["dateOfService"]?.error,
  };
  const dateStyle = useStyles(themeProp);
  const initRender = useRef(true);
  const visible = showModal;
  const dispatch = useDispatch();
  const [selectedMember, setSelectedMember] = useState(null);
  const [selectMemberError, setSelectMemberError] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const [submitClicked, setSubmitClicked] = useState(false);
  //claimInfoObj
  const [claimInformationInit, setClaimInformationInit] = useState({
    reasonForSubmission: {
      value: "",
      error: null,
    },
    dateOfService: {
      value: null,
      error: null,
    },
    facilityName: {
      value: "",
      error: null,
    },
    phoneNumber: {
      value: null,
      error: null,
    },
    claimAmount: {
      value: "",
      error: null,
    },
    claimNumber: {
      value: "",
      error: null,
    },
    accountNumber: {
      value: "",
      error: null,
    },
    fullName: {
      value: "",
      error: null,
    },
    attestationChecked: {
      value: false,
      error: null,
    },
  });
  const [countryData, setCountryData] = useState({});
  const history = useHistory();

  const [datePickerActive, setDatePickerActive] = useState(false);

  const [streetAddress, setStreetAddress] = useState("");
  const [streetAddressTwo, setStreetAddressTwo] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [stateCd, setStateCd] = useState({ label: "", code: "" });
  const [step, setStep] = useState(0);
  const [claimUploadedFiles, setClaimUploadedFiles] = useState([]);
  const [fileLengthError, setFileLengthError] = useState(false);
  const [fileSizeError, setFileSizeError] = useState(false);
  const customerInfo = useSelector((state) => state.customerInfo.data);
  const customerDemographicsInfo = useSelector(
    (state) => state.customerDemographicsInfo.data,
  );
  const submittedAttestationAgreement = useSelector(
    (state) => state.submitAttestationAgreement,
  );
  const [toastr, setToastr] = useState(false);
  const submitClaimDetails = useSelector((state) => state.submitClaimDetails);
  const [loadingSpinner, setLoadingSpinner] = useState(false);
  let { dependents = [], hohPlans } = customerInfo;
  const { hoh, dependents: dependentsAddresses } = customerDemographicsInfo;

  const {
    digitalSurveyWidget,
    triggerDigitalSurveyByEventName,
    DIGITAL_SURVEY_EVENTS,
  } = useSurveyContext();

  const hohAddressObj = Array.isArray(hoh) ? hoh[0].info.addresses[0] : {};
  const getAddressString = (addressObj) => {
    return [
      addressObj?.addressLine1,
      addressObj?.addressLine2,
      addressObj?.city,
      addressObj?.county,
      addressObj?.country,
    ]
      .filter((value) => value)
      .join(",");
  };
  if (dependents?.length && dependentsAddresses?.length) {
    dependents.forEach((dependent) => {
      const dependentAddress = dependentsAddresses.find(
        (value) => value.memberId === dependent.memberId,
      );
      if (dependentAddress) {
        dependent.address = getAddressString(
          dependentAddress.info.addresses[0],
        );
        dependent.phoneNumber = dependentAddress?.info?.addresses[0]?.phones[0]
          ? dependentAddress?.info?.addresses[0]?.phones[0]?.phoneNumber
          : "";
      }
    });
  }
  const getHohPlans = () => {
    const hohPlansArr =
      hohPlans &&
      hohPlans.length > 0 &&
      hohPlans.map((x) => ({
        ...x,
        benefitPackage: x.BenefitPackage,
        groupNumber: x.GroupNumber,
        planName: x.PlanName,
        year: x.MemberYear,
        firstName: x.FirstName,
        lastName: x.LastName,
        pcpId: x.PcpId,
        companyCode: x.CompanyNumber,
        customerId: customerInfo.customerId,
        memberId: x.MemberId,
        disablePcpUpdate: x.membershipStatus === "active" ? false : true,
        phoneNumber:
          (hoh &&
            hoh.length > 0 &&
            hoh.find((y) => y.memberId === x.MemberId)?.info?.contact
              ?.contactAddress?.phones[0]?.phoneNumber) ||
          null,
        address: getAddressString(
          (hoh &&
            hoh.length > 0 &&
            hoh.find((y) => y.memberId === x.MemberId)?.info?.contact
              ?.contactAddress) ||
            null,
        ),
      }));
    if (hohPlansArr == null) {
      return [];
    }
    return hohPlansArr;
  };
  const memberDetails = [
    // {
    // 	memberId: customerInfo.memberId,
    // 	benefitPackage: customerInfo.benefitPackage,
    // 	customerId: customerInfo.customerId,
    // 	companyCode: customerInfo.companyCode,
    // 	groupNumber: customerInfo.groupNumber,
    // 	planName: customerInfo.planName,
    // 	year: customerInfo.memberYear,
    // 	firstName: customerInfo.firstName,
    // 	lastName: customerInfo.lastName,
    // 	pcpId: customerInfo.pcpId,
    // 	disablePcpUpdate: customerInfo.membershipStatus === "active" ? false : true,
    // 	phoneNumber: hohAddressObj != null && hohAddressObj.phones != null ? hohAddressObj.phones[0].phoneNumber : "",
    // 	address: hohAddressObj != null ? getAddressString(hohAddressObj) : ""
    // },
    ...getHohPlans(),
    ...dependents,
  ];
  const closeForm = (data) => {
    //setVisible(false);
    goToFirstStep();
    unmountMe();
    setClaimInformation({ ...claimInformationInit });
    setClaimUploadedFiles([]);
    setClaimInformation({ ...claimInformationInit });
    setRetryCount(0);
    setFileLengthError(false);
    setFileSizeError(false);
  };

  const formSubmit = (data) => {};

  useEffect(() => {
    validateForm();
  }, [selectedMember]);

  const validateForm = () => {
    if (initRender.current) return;
    let isValid = true;
    console.log("*****************running****************");
    switch (step) {
      case 0:
        {
          if (dependents.length && selectedMember === null) {
            setSelectMemberError("Select a member to continue");
            isValid = false;
          } else {
            setSelectMemberError("");
          }
        }
        break;
      case 1:
        {
          const claimInformationCopy = { ...claimInformation };
          for (const [key, value] of Object.entries(claimInformation)) {
            if (["claimNumber", "accountNumber"].every((x) => x !== key)) {
              if (!value.value && key !== "phoneNumber") {
                isValid = false;
                claimInformationCopy[key] = {
                  value: value.value,
                  error: "This field is required.",
                };
              } else if (key === "fullName") {
                if (!value.value || value.value.length == 0) {
                  isValid = false;
                  claimInformationCopy[key] = {
                    value: value.value,
                    error: "This field is required.",
                  };
                } else if (
                  !value.value ||
                  value.value.toUpperCase() !=
                    customerInfo.firstName.toUpperCase() +
                      " " +
                      customerInfo.lastName.toUpperCase()
                ) {
                  isValid = false;
                  claimInformationCopy[key] = {
                    value: value.value,
                    error: "Full name is required.",
                  };
                }
              } else if (key === "attestationChecked") {
              } else if (key === "phoneNumber") {
                const { dialCode } = countryData;
                if (!value.value || value.value == dialCode) {
                  isValid = false;
                  claimInformationCopy[key] = {
                    value: value.value,
                    error: "This field is required.",
                  };
                } else if (!(value.value.length - dialCode.length === 10)) {
                  isValid = false;
                  claimInformationCopy[key] = {
                    value: value.value,
                    error: "10 digits are required.",
                  };
                }
              }
            }
          }
          setClaimInformation(claimInformationCopy);
          if (isValid) {
            let attestationAgreementPayload = {};
            attestationAgreementPayload.targetMemberId =
              memberDetails.length > 1
                ? selectedMember.memberId
                : memberDetails[0].memberId;
            dispatch(submitAttestationAgreement(attestationAgreementPayload));
          }
        }
        break;
      case 2:
        {
          if (claimUploadedFiles.length <= 0) {
            isValid = false;
            setFileLengthError(true);
          } else {
            setSubmitClicked(true);
          }
        }
        break;
    }
    return isValid;
  };

  const handleNext = () => {
    const isValid = validateForm();
    let submitClaimPayload = {};
    // check if the questions is the last one

    //testing scenario /should be replaced when API is ready
    let scenario = "fail";
    if (isValid) {
      if (step < 2) {
        if (step != 1) {
          setStep(step + 1);
        }
      } else {
        submitClaimPayload.memberDetails =
          memberDetails.length > 1 ? selectedMember : memberDetails[0];
        submitClaimPayload.claimInformation = getClaimInformationValueObj();
        submitClaimPayload.claimUploadedFiles = claimUploadedFiles;
        dispatch(requestSubmitClaimDetails(submitClaimPayload));
        if (digitalSurveyWidget)
          triggerDigitalSurveyByEventName(
            digitalSurveyWidget,
            DIGITAL_SURVEY_EVENTS.CLAIM_SUBMITTED,
          );
      }
    }
  };
  useEffect(() => {
    const { loading } = customerDemographicsInfo;
    setLoadingSpinner(loading);
  }, [customerDemographicsInfo]);
  useEffect(() => {
    const { loading } = submittedAttestationAgreement;
    setLoadingSpinner(loading);
    if (
      submittedAttestationAgreement?.submittedAttestationAgreement?.data
        ?.message == "Success" &&
      !submittedAttestationAgreement.loading
    ) {
      setStep(step + 1);
    }
  }, [submittedAttestationAgreement]);
  useEffect(() => {
    const { loading } = submitClaimDetails;
    submitClicked && setLoadingSpinner(loading);
    if (!loading && submitClicked) {
      postDispatchFunc();
    }
  }, [submitClaimDetails]);
  const postDispatchFunc = () => {
    const { error, submittedClaimDetails } = submitClaimDetails;
    if (
      error === "" &&
      submittedClaimDetails &&
      Object.keys(submittedClaimDetails).length > 0
    ) {
      Cookies.set("SubmitAClaim", "true", { expires: 1 });
      closeForm();
      setToastr(true);
      setTimeout(() => {
        history.push("/claims?survey=true");
      }, 1000);
    } else if (error !== "" && retryCount === 0) {
      setStep(step + 1);
    }
  };
  const getClaimInformationValueObj = () => {
    let valueObj = {};
    for (const [key, value] of Object.entries(claimInformation)) {
      valueObj[key] = value.value;
    }
    return valueObj;
  };
  const goToFirstStep = () => {
    setStep(0);
  };

  const renderSubheader = (step) => {
    switch (step) {
      case 0: {
        return dependents.length
          ? "Select a Member"
          : "Review Member Information";
      }
      case 1: {
        return "Enter Claim Information";
      }
      case 2: {
        return "Upload Files";
      }
    }
  };
  useEffect(() => {
    initRender.current = false;
  }, []);

  const handleStyles = (claimInformationCopy) => {
    return {
      style: datePickerStyles(datePickerActive, claimInformationCopy),
      startAdornment: (
        <img
          alt=""
          src={
            claimInformationCopy["dateOfService"].error
              ? "/react/images/icn-calendar-error.svg"
              : "/react/images/icn-calendar.svg"
          }
        />
      ),
    };
  };
  useEffect(() => {}, [claimUploadedFiles]);
  const updateProgress = (
    e,
    x,
    countStart,
    countEnd,
    ind,
    uploadedFilesLength,
  ) => {
    if (
      claimUploadedFiles.findIndex(({ fileName }) => fileName === x.name) > -1
    )
      return null;
    const currentState = {
      status: e.type,
      value: e.loaded / e.total,
      fileName: x.name,
      fileSize: x.size,
      fileType: x.type,
    };
    if (currentState.status === "loadstart") {
      currentState.executionTime = countStart / 1000;
    }
    if (currentState.status === "loadend") {
      currentState.executionTime = (countEnd - countStart) / 1000;
    }
    const claimUploadedFilesCopy3 = [...claimUploadedFiles];
    setClaimUploadedFiles([...claimUploadedFiles, currentState]);
    return currentState;
  };
  const fileReaderFunc = (x, ind, handleFilesCustomCallBack) => {
    let newArr = [...claimUploadedFiles];
    const uploadedFilesLength = claimUploadedFiles.length;
    let finalArr = [];
    const reader = new FileReader();
    let countStart,
      countEnd = 0;
    return new Promise((resolve, reject) => {
      reader.onloadstart = function (e) {
        countStart = performance.now();
        const currentState = updateProgress(
          e,
          x,
          countStart,
          countEnd,
          ind,
          uploadedFilesLength,
        );
        if (!currentState) resolve(null);
      };
      reader.onload = function (e) {
        updateProgress(e, x, countStart, countEnd, ind, uploadedFilesLength);
      };
      reader.onloadend = function (e) {
        countEnd = performance.now();
        const currentState = updateProgress(
          e,
          x,
          countStart,
          countEnd,
          ind,
          uploadedFilesLength,
        );

        const allFiles = [...claimUploadedFiles, ...finalArr];
        if (currentState?.fileSize > Math.pow(10, 6) * 5) {
          currentState.status = "error";
          currentState.value = 0;
          currentState.fileName = "File size too large.";
          setFileSizeError(true);
        }
        if (allFiles.length < 5) {
          currentState.fileDataUrl = e.target.result;
          resolve(currentState);
        } else {
          setFileLengthError(true);
        }
        resolve(currentState);
      };
      reader.onprogress = function (e) {
        updateProgress(e, x, countStart, countEnd, ind, uploadedFilesLength);
      };
      reader.onerror = function (e) {
        updateProgress(e, x, countStart, countEnd, ind, uploadedFilesLength);
      };
      reader.onabort = function (e) {
        updateProgress(e, x, countStart, countEnd, ind, uploadedFilesLength);
      };
      reader.readAsDataURL(x);
    });
  };
  const awaitAll = async (filesCopy) => {
    let promises = [];
    let result;
    filesCopy.map((x, ind) => {
      promises.push(fileReaderFunc(x, ind));
    });
    result = await Promise.all(promises);
    return result.filter((value) => value);
  };
  const handleFiles = async (e) => {
    e.persist();
    setFileLengthError(false);
    const files = e.target.files;
    let filesCopy = [...files];
    const result = await awaitAll(filesCopy);
    const allFiles = [...claimUploadedFiles, ...result];
    if (allFiles.length <= 5) {
      setClaimUploadedFiles(allFiles);
    } else {
      setFileLengthError(true);
      setClaimUploadedFiles(allFiles.splice(0, 5));
    }
    e.target.value = "";
  };
  const getActionIcon = (status) => {
    let iconPath = "";
    if (status !== "loadend" && status !== "error") {
      iconPath = "/react/images/Icons _ Outline _ PDF Copy 5.svg";
    } else if (status === "abort") {
      iconPath = "/react/images/ReUpload.svg";
    } else if (status === "error" || status === "loadend") {
      iconPath = "/react/images/Trash.svg";
    }
    return iconPath;
  };
  const getFileUploadProgressBgColor = (x) => {
    const { status, executionTime } = x;

    let bgColor = "";
    if (
      x?.executionTime >= 0 &&
      ["loadstart", "load", "progress"].some((y) => x?.status === y)
    ) {
      bgColor = "#008bbf";
    } else if (x?.status == "loadend") {
      bgColor = "#529535";
    } else if (x?.status == "error") {
      bgColor = "#ad122a";
    }
    return bgColor;
  };
  const handleReasonSubmission = (value) => {
    const claimInformationCopy = { ...claimInformation };
    setClaimInformation({
      ...claimInformationCopy,
      reasonForSubmission: {
        value: value,
        error: null,
      },
    });
  };
  const renderSwitch = (step) => {
    const claimInformationCopy = { ...claimInformation };
    switch (step) {
      case 0:
        return (
          <MemberCardWrapper>
            {dependents.length || getHohPlans().length > 1 ? (
              <MemberCardsContainer>
                {memberDetails.map((member) => (
                  <MemberCard
                    key={member.memberId}
                    onClick={() => setSelectedMember(member)}
                    status={
                      selectMemberError
                        ? "error"
                        : selectedMember &&
                            selectedMember.memberId === member.memberId
                          ? "selected"
                          : ""
                    }
                  >
                    <RadioButtonContainer>
                      {selectedMember &&
                      selectedMember.memberId === member.memberId ? (
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
                      <div>
                        <Header className="mt-0">
                          {member.firstName} {member.lastName}
                        </Header>
                        <div className="pt-2">
                          <MemeberDetailFieldWrapper>
                            <MemeberDetailFieldImg
                              alt=""
                              src="/react/images/icn-solid-card.svg"
                            />
                            <MemeberDetailField>
                              {member.memberId}
                            </MemeberDetailField>
                          </MemeberDetailFieldWrapper>
                          {member.address && (
                            <MemeberDetailFieldWrapper>
                              <MemeberDetailFieldImg
                                alt=""
                                src="/react/images/icn-solid-location.svg"
                              />
                              <MemeberDetailField>
                                {member.address || ""}
                              </MemeberDetailField>
                            </MemeberDetailFieldWrapper>
                          )}

                          {member.phoneNumber && (
                            <MemeberDetailFieldWrapper>
                              <MemeberDetailFieldImg
                                alt=""
                                src="/react/images/icn-solid-telephone.svg"
                              />
                              <MemeberDetailField>
                                {member.phoneNumber}
                              </MemeberDetailField>
                            </MemeberDetailFieldWrapper>
                          )}
                        </div>
                      </div>
                    </RadioButtonContainer>
                  </MemberCard>
                ))}
                {selectMemberError && (
                  <ErrorLabel>{selectMemberError}</ErrorLabel>
                )}
              </MemberCardsContainer>
            ) : (
              <MemberCard>
                <Header className="mt-0">
                  {memberDetails[0]?.firstName} {memberDetails[0]?.lastName}
                </Header>
                <div className="pt-2">
                  <MemeberDetailFieldWrapper>
                    <MemeberDetailFieldImg
                      alt=""
                      src="/react/images/icn-solid-card.svg"
                    />
                    <MemeberDetailField>
                      {memberDetails[0]?.memberId}
                    </MemeberDetailField>
                  </MemeberDetailFieldWrapper>
                  <MemeberDetailFieldWrapper>
                    <MemeberDetailFieldImg
                      alt=""
                      src="/react/images/icn-solid-location.svg"
                    />
                    <MemeberDetailField>
                      {memberDetails[0]?.address || ""}
                    </MemeberDetailField>
                  </MemeberDetailFieldWrapper>
                  <MemeberDetailFieldWrapper>
                    <MemeberDetailFieldImg
                      alt=""
                      src="/react/images/icn-solid-telephone.svg"
                    />
                    <MemeberDetailField>
                      {memberDetails[0]?.phoneNumber || ""}
                    </MemeberDetailField>
                  </MemeberDetailFieldWrapper>
                </div>
              </MemberCard>
            )}
          </MemberCardWrapper>
        );
      case 1:
        return (
          <FormGrid>
            <InputWrapper>
              <InputHeader>Reason For Submission</InputHeader>
              <DropdownSelect
                placeholder={"Select Reason For Submission"}
                selected={
                  {
                    label: claimInformationCopy["reasonForSubmission"]?.value,
                  } || { label: "Select" }
                }
                values={CONSTANTS.ClaimLabelValues}
                onSelect={handleReasonSubmission}
                error={claimInformationCopy["reasonForSubmission"].error}
                errorMessage={"This field is required."}
                fullWidth={true}
                showImage={false}
              />
            </InputWrapper>
            <InputWrapper>
              <InputHeader>Date of Service (DOS)</InputHeader>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <DatePicker
                  autoOk
                  disableToolbar
                  variant="inline"
                  inputVariant="outlined"
                  format="MM/dd/yyyy"
                  placeholder="MM/DD/YYYY"
                  id="date-of-service-inline"
                  InputProps={handleStyles(claimInformationCopy)}
                  onOpen={() => setDatePickerActive(true)}
                  onClose={() => setDatePickerActive(false)}
                  className={dateStyle.root}
                  value={claimInformationCopy["dateOfService"].value}
                  onChange={(value) =>
                    setClaimInformation({
                      ...claimInformationCopy,
                      dateOfService: {
                        value: value,
                        error: null,
                      },
                    })
                  }
                  PopoverProps={{
                    style: { left: "-35px", zIndex: "9999" },
                  }}
                />
              </MuiPickersUtilsProvider>
              {!claimInformationCopy["dateOfService"].error && (
                <InfoMsg>Only one DOS per submission</InfoMsg>
              )}
              {claimInformationCopy["dateOfService"].error && (
                <InputErrorMsg>
                  {claimInformationCopy["dateOfService"].error}
                </InputErrorMsg>
              )}
            </InputWrapper>
            <InputWrapper>
              <InputHeader>Provider/Facility Name</InputHeader>
              <Input
                type="text"
                placeholder="Enter Provider/Facility Name"
                value={claimInformationCopy["facilityName"].value}
                onChange={(e) => {
                  //if(!!e.target.value.match(/[a-zA-Z]+/g)){
                  setClaimInformation({
                    ...claimInformationCopy,
                    facilityName: {
                      value: e.target.value.replace(/[^a-zA-Z ]+/g, ""),
                      error: null,
                    },
                  });
                }}
                error={claimInformationCopy["facilityName"].error}
              />
              {claimInformationCopy["facilityName"].error && (
                <InputErrorMsg>
                  {claimInformationCopy["facilityName"].error}
                </InputErrorMsg>
              )}
            </InputWrapper>
            <InputWrapper>
              <InputHeader>Provider/Facility Phone Number</InputHeader>
              <PhoneInput
                containerStyle={
                  claimInformationCopy["phoneNumber"]?.error
                    ? { border: "solid 1px #ad122a", borderRadius: "4px" }
                    : {}
                }
                country={"us"}
                value={claimInformationCopy["phoneNumber"]?.value}
                countryCodeEditable={false}
                inputProps={{
                  name: "phoneNumber",
                }}
                inputStyle={{
                  width: "100%",
                  height: "42px",
                  fontSize: "16px",
                }}
                placeholder="(555)-123-5555"
                onChange={(value, data) => {
                  setCountryData(data);
                  setClaimInformation({
                    ...claimInformationCopy,
                    phoneNumber: {
                      value: value,
                      error: null,
                    },
                  });
                }}
              />
              {claimInformationCopy["phoneNumber"]?.error && (
                <InputErrorMsg>
                  {claimInformationCopy["phoneNumber"]?.error}
                </InputErrorMsg>
              )}
            </InputWrapper>
            <InputWrapper>
              <InputHeader>Claim/Bill Amount</InputHeader>
              <Input
                type="number"
                placeholder="Enter Claim/Bill Amount"
                value={claimInformationCopy["claimAmount"].value}
                onChange={(e) =>
                  setClaimInformation({
                    ...claimInformationCopy,
                    claimAmount: {
                      value: e.target.value,
                      error: null,
                    },
                  })
                }
                error={claimInformationCopy["claimAmount"].error}
              />
              {claimInformationCopy["claimAmount"].error && (
                <InputErrorMsg>
                  {claimInformationCopy["claimAmount"].error}
                </InputErrorMsg>
              )}
            </InputWrapper>
            <InputWrapper>
              <InputHeader>Claim Number</InputHeader>
              <Input
                type="number"
                placeholder="Enter Claim Number"
                value={claimInformationCopy["claimNumber"].value}
                onChange={(e) =>
                  setClaimInformation({
                    ...claimInformationCopy,
                    claimNumber: {
                      value: e.target.value,
                      error: null,
                    },
                  })
                }
                error={claimInformationCopy["claimNumber"].error}
              />
              <InfoMsg>If Applicable</InfoMsg>
              {claimInformationCopy["claimNumber"].error && (
                <InputErrorMsg>
                  {claimInformationCopy["claimNumber"].error}
                </InputErrorMsg>
              )}
            </InputWrapper>
            <InputWrapper>
              <InputHeader>Account Number</InputHeader>
              <Input
                type="number"
                placeholder="Enter Account Number"
                value={claimInformationCopy["accountNumber"].value}
                onChange={(e) =>
                  setClaimInformation({
                    ...claimInformationCopy,
                    accountNumber: {
                      value: e.target.value,
                      error: null,
                    },
                  })
                }
                error={claimInformationCopy["accountNumber"].error}
              />
              <InfoMsg>If Applicable</InfoMsg>
              {claimInformationCopy["accountNumber"].error && (
                <InputErrorMsg>
                  {claimInformationCopy["accountNumber"].error}
                </InputErrorMsg>
              )}
            </InputWrapper>
            <AttestationWrapper>
              <AttestationTitle>Member Attestation</AttestationTitle>
              <AttestationBody>
                By signing below, I certify that I have paid the dollar amount
                listed for the specified services received while a Healthfirst
                member. I further certify that the documents attached to this
                form demonstrating proof of payment are accurate, true, and
                complete, in all respects. I also understand that any
                Healthfirst determination for reimbursement will be made subject
                to cost share and coinsurance requirements.
                <br />
                <br />
                Any person who knowingly and with intent to defraud any
                insurance company or other person files an application for
                insurance or statement of claim containing any materially false
                information, or conceals for the purpose of misleading,
                information concerning any fact material thereto, commits a
                fraudulent insurance act, which is a crime, and shall also be
                subject to a civil penalty not to exceed five thousand dollars
                and the stated value of the claim for each such violation.
              </AttestationBody>
              <InputWrapper>
                <InputHeader>Full Name</InputHeader>
                <AttestationInput
                  type="text"
                  placeholder="Enter Full Name"
                  value={claimInformationCopy["fullName"].value}
                  onChange={(e) =>
                    setClaimInformation({
                      ...claimInformationCopy,
                      fullName: {
                        value: e.target.value,
                        error: null,
                      },
                    })
                  }
                  error={claimInformationCopy["fullName"].error}
                />
                {claimInformationCopy["fullName"].error && (
                  <InputErrorMsg>
                    {claimInformationCopy["fullName"].error}
                  </InputErrorMsg>
                )}
              </InputWrapper>
              <AttestationCheckboxWrapper>
                <AttestationCheckboxCustom
                  className="checkbox-container"
                  htmlFor="attestationCheckbox"
                  checked={claimInformationCopy["attestationChecked"].value}
                  onClick={(e) =>
                    setClaimInformation({
                      ...claimInformationCopy,
                      attestationChecked: {
                        value:
                          !claimInformationCopy["attestationChecked"].value,
                        error: null,
                      },
                    })
                  }
                  error={claimInformationCopy["attestationChecked"].error}
                >
                  <p>
                    I certify that all information provided is truthful and
                    authentic.
                  </p>
                  <span>
                    <AttestationCheckChar
                      checked={claimInformationCopy["attestationChecked"].value}
                      error={claimInformationCopy["attestationChecked"].error}
                    ></AttestationCheckChar>
                  </span>
                </AttestationCheckboxCustom>
              </AttestationCheckboxWrapper>
            </AttestationWrapper>
          </FormGrid>
        );
      case 2:
        return (
          <FileUploadContent>
            <FileUploadTipHeading>
              Upload up to 5 of the following:
            </FileUploadTipHeading>
            <FileUploadListContainer>
              {["Itemized Receipt - (Proof of Payment)", "Provider Bill"].map(
                (x, ind) => {
                  return <FileUploadTips key={ind}>{x}</FileUploadTips>;
                },
              )}
            </FileUploadListContainer>
            <FileUploader
              htmlFor="claim-upload"
              fileLengthError={fileLengthError}
            >
              <FileUploadIcon
                alt=""
                src={"/react/images/Icons _ Solid _ Download.svg"}
              />
              <DragDropTxt fileLengthError={fileLengthError}>
                Add your <FileUploadSubTip>PDF or JPEG</FileUploadSubTip> files
                here
              </DragDropTxt>
              <BrowseFiles>Browse Files</BrowseFiles>
              <input
                id="claim-upload"
                type="file"
                accept="image/*,.pdf"
                multiple
                hidden
                onChange={(e) => {
                  handleFiles(e);
                }}
              />
            </FileUploader>
            {!fileLengthError && (
              <FileUploadTipHeading>
                Maximum file size:<FileUploadSubTip> 5 Mbs</FileUploadSubTip>
              </FileUploadTipHeading>
            )}
            {fileLengthError && (
              <MaxUploadedFileText>
                {claimUploadedFiles.length <= 0
                  ? "A document is required to continue."
                  : "Only 5 files can be submitted."}
              </MaxUploadedFileText>
            )}
            {claimUploadedFiles.length > 0 && (
              <UploadedFileText>Uploaded Files</UploadedFileText>
            )}
            {claimUploadedFiles.map((x, ind) => {
              return (
                <UploadedFileContainer key={ind}>
                  <UploadedFileIcon
                    alt=""
                    src={
                      x?.fileType.includes("pdf")
                        ? "/react/images/PDF.svg"
                        : "/react/images/ImageIcon.svg"
                    }
                  />
                  <div
                    style={{
                      width: "100%",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <FileNameText uploadStatus={x?.status}>
                        {x?.fileName}
                      </FileNameText>
                      <div>{`${x?.value * 100}%`}</div>
                    </div>
                    <FileUploadProgressBar
                      bgColor={getFileUploadProgressBgColor(x)}
                      animationTime={x?.executionTime}
                    ></FileUploadProgressBar>
                  </div>
                  <UploadedFileActionIcon
                    alt=""
                    src={getActionIcon(x?.status)}
                    onClick={() => {
                      const claimUploadedFilesCopy = [...claimUploadedFiles];
                      claimUploadedFilesCopy.splice(ind, 1);
                      setClaimUploadedFiles(claimUploadedFilesCopy);
                    }}
                  />
                </UploadedFileContainer>
              );
            })}
          </FileUploadContent>
        );
      default:
        return (
          <DefaultModal>
            <img src="img/ico-alert.svg" />
            <Header>Something went wrong</Header>
            <SubHeader>
              {retryCount <= 3
                ? `The claim failed to submit. Please try again.`
                : "System is currently down. Please contact System Administrator."}
            </SubHeader>
            {/* {firstName + " " + lastName} */}
            {/* {streetAddress}
						{streetAddressTwo}
						{city + ", " + stateCd?.label + ", " + zipCode} */}
            <FormButtonWrapper>
              <StyledButton
                variant={retryCount > 2 ? "disabled" : "secondary"}
                onClick={() => {
                  setStep(step - 1);
                  setRetryCount(0);
                }}
                disabled={retryCount > 2}
              >
                Back
              </StyledButton>
              <Spacer></Spacer>
              <StyledButton
                disabled={retryCount > 2}
                variant={retryCount > 2 ? "disabled" : "primary"}
                onClick={() => {
                  setRetryCount(retryCount + 1);
                  handleNext();
                }}
              >
                {!loadingSpinner ? "Retry" : <ProgressSpinner />}
              </StyledButton>
            </FormButtonWrapper>
          </DefaultModal>
        );
    }
  };
  useEffect(() => {
    setTimeout(() => {
      setToastr(false);
    }, 3000);
  }, [toastr]);
  const { loading } = submitClaimDetails;
  useEffect(() => {
    if (step === 2 && claimUploadedFiles.some((x) => x.status === "error")) {
      setFileSizeError(true);
    } else {
      setFileSizeError(false);
    }
  }, [step, claimUploadedFiles]);
  return (
    <div>
      <Toastr open={toastr}>
        <ToastrIconBox>
          <ToastrIcon alt="" src="/react/images/valid-check.svg"></ToastrIcon>
        </ToastrIconBox>
        <ToastrInfo>
          <ToastrText>Claim submitted successfully!</ToastrText>
          <ToastrCloseIcon
            alt=""
            src="/react/images/valid-close.svg"
            onClick={() => setToastr(false)}
          ></ToastrCloseIcon>
        </ToastrInfo>
      </Toastr>
      {visible === true ? (
        <FormModalWrapper visible={visible}>
          <ModalInnerWrapperCustom>
            <FormModalContent>
              <CloseIcon
                alt=""
                src="/react/images/icn-close.svg"
                onClick={closeForm}
              />
              <div>
                <Header>Submit a Claim</Header>
                <SubHeader>{renderSubheader(step)}</SubHeader>
                <ProgressBarContainer>
                  <ProgressStep active={step >= 0} />
                  <ProgressStep active={step >= 1} />
                  <ProgressStep active={step >= 2} />
                </ProgressBarContainer>

                {renderSwitch(step)}
                {step <= 2 && (
                  <FormButtonWrapper>
                    <SubmitButton
                      variant="secondary"
                      onClick={() => {
                        if (step === 0) {
                          closeForm();
                        } else {
                          setStep(step - 1);

                          setFileLengthError(false);
                        }
                      }}
                    >
                      {step === 0 ? "Cancel" : "Back"}
                    </SubmitButton>
                    <Spacer></Spacer>
                    <SubmitButton
                      variant={fileSizeError ? "disabled" : "primary"}
                      onClick={handleNext}
                      disabled={fileSizeError}
                    >
                      {step === 2 && !loadingSpinner ? (
                        "Submit"
                      ) : step === 2 && loadingSpinner ? (
                        <ProgressSpinner />
                      ) : (
                        "Continue"
                      )}
                    </SubmitButton>
                  </FormButtonWrapper>
                )}
              </div>
            </FormModalContent>
          </ModalInnerWrapperCustom>
        </FormModalWrapper>
      ) : null}
    </div>
  );
};
const ModalInnerWrapperCustom = styled(ModalInnerWrapper)`
  max-width: 440px;
`;
const SpinnerRotate = keyframes`
  from {transform: rotate(0deg);}
  to {transform: rotate(360deg);}
`;

const SubmitButton = styled(StyledButton)`
  width: 100px;
  padding: 0px;
  @media only screen and (max-width: 768px) {
    width: 100%;
  }
`;

const ProgressSpinner = styled.div`
  text-align: center;
  margin-left: auto;
  margin-right: auto;
  border: 0.2rem solid #375225;
  border-top: 0.2rem solid white;
  border-radius: 50%;
  height: 1rem;
  width: 1rem;
  animation-name: ${SpinnerRotate};
  animation-duration: 2s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  @media only screen and (max-width: 768px) {
    margin: auto;
  }
`;
const DefaultModal = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding-top: 40px;
`;
const ToastrIconBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 40px;
  height: 64px;
  background-color: #36502a;
  align-items: center;
  justify-content: center;
`;
const ToastrIcon = styled.img`
  display: flex;
  flex-direction: column;
  width: 16px;
  height: 16px;
`;
const ToastrInfo = styled.div`
  display: flex;
  flex-direction: row;
  width: 288px;
  height: 64px;
  align-items: center;
  justify-content: space-around;
`;
const ToastrCloseIcon = styled.img`
  width: 16px;
  height: 16px;
  object-fit: contain;
  cursor: pointer;
`;
const ToastrText = styled.div`
  font-size: 14px;
  font-weight: 500;
  line-height: 1.29;
  color: white;
`;
const Toastr = styled.div`
  position: fixed;
  background-color: #3e7128;
  top: 190px;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #3e7128;
  display: ${(props) => (props.open ? "flex" : "none")};
  flex-direction: row;
`;
const DropdownSelectStyled = styled(DropdownSelect)``;
const MemberCardWrapper = styled.div`
  margin-top: 24px;
`;
const MemberCardsContainer = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 8px;
`;
const MemberCard = styled.div`
  overflow: hidden;
  padding: 16px 16px 12px 16px;
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
const RadioImg = styled.img`
  align-self: flex-start;
  margin-top: 4px;
`;
const MemeberDetailFieldWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
`;
const MemeberDetailFieldImg = styled.img`
  margin-top: 1.5px;
`;
const MemeberDetailField = styled.div`
  margin-bottom: 8px;
  font-family: "museo-sans", san-serif;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.43;
  color: #474b55;
`;
const ErrorLabel = styled.div`
  font-size: 12px;
  font-weight: 500;
  line-height: 1.33;
  color: #a0252c;
`;
const ProgressBarContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
`;
const ProgressStep = styled.div`
  height: 6px;
  border-radius: 3.5px;
  background-color: ${(props) => (props.active ? "#008bbf" : "#d8d8d8")};
`;
const FormModalWrapper = styled(ModalWrapper)`
  transition: opacity 300ms ease-in-out;
  opacity: ${(props) => (props.visible ? "1" : "0")};
`;

const FormModalContent = styled(ModalContent)`
  transition: opacity 300ms ease-in-out;
`;

const SubHeader = styled.h3`
  margin: 16px 0;
  font-family: "museo-sans", san-serif;
  font-size: 14px;
  font-weight: 700;
  font-stretch: normal;
  font-style: normal;
  line-height: 24px;
  letter-spacing: normal;
  color: #474b55;
`;
const FileUploadContent = styled.div`
  padding: 24px 0px 16px 0px;
  font-family: "museo-sans", san-serif;
  font-size: 14px;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.43;
  letter-spacing: normal;
  text-align: left;
`;
const FileUploadTipHeading = styled.div`
  font-weight: 300;
  color: #474b55;
`;
const FileUploadListContainer = styled.ul`
  list-style-type: disc;
  padding-left: 24px;
`;
const FileUploadTips = styled.li`
  font-weight: bold;
`;
const FileUploadIcon = styled.img`
  margin: auto;
  padding-top: 24px;
`;
const DragDropTxt = styled.div`
padding:12px 0px;
font-weight: 500;
color: ${(props) => (props.fileLengthError ? "#ad122a;" : "#474b55;")} 
text-align: center;
`;
const BrowseFiles = styled.div`
  color: #008bbf;
  cursor: pointer;
  font-weight: bold;
  text-align: center;
  font-size: 14px;
`;
const FileUploader = styled.label`
position:relative;
width: 100%;
height: 138px;
margin-bottom: 8px;
margin-top: 16px;
border-radius: 4px;
border:${(props) =>
  props.fileLengthError ? "2px solid #ad122a;" : "2px dashed #d8d8d8;"} 
padding:0px;
&:hover{
	border:${(props) =>
    props.fileLengthError ? "2px solid #ad122a;" : "2px solid #008bbf;"} 
	background-color:rgba(0, 139, 191, 0.1);
};
`;
const MaxUploadedFileText = styled.div`
  font-size: 14px;
  font-weight: 300;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.43;
  letter-spacing: 2px;
  text-align: left;
  color: #ad122a;
  padding-top: 4px;
  padding-bottom: 4px;
`;
const UploadedFileText = styled.div`
  font-size: 12px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 2;
  letter-spacing: 2px;
  text-align: left;
  color: #757575;
  padding-top: 24px;
  padding-bottom: 16px;
`;
const UploadedFileContainer = styled.div`
  width: 100%;
  height: 28px;
  margin-bottom: 24px;
  display: flex;
  flex-direction: row;
  align-items: start;
  justify-content: space-between;
`;
const UploadedFileIcon = styled.img`
  padding-right: 12px;
  width: 24px;
  height: 24px;
  box-sizing: content-box;
`;
const UploadedFileActionIcon = styled.img`
  cursor: pointer;
  padding-top: 6px;
  padding-left: 12px;
  width: 20px;
  height: 20px;
  box-sizing: content-box;
`;
const UploadKeyframe = keyframes`
	100% {background-position:left;}
`;
const FileNameText = styled.div`
  color: ${(props) => (props.uploadStatus === "error" ? "#ad122a" : "#474b55")};
  white-space: nowrap;
  width: 250px;
  text-overflow: ellipsis;
  overflow: hidden;
  @media only screen and (max-width: 768px) {
    width: 150px;
  }
`;
const FileUploadProgressBar = styled.div`
  width: 100%;
  margin: auto;
  height: 4px;
  margin-top: 7px;
  background: ${(props) =>
    `linear-gradient(to right ,${props.bgColor} 50%, #d8d8d8 0)`};
  background-size: 200% 100%;
  background-position: right;
  border-radius: 2px;
  animation: ${UploadKeyframe};
  animation-duration: ${(props) => `${props.animationTime}s`};
  animation-fill-mode: forwards;
`;

const FileUploadSubTip = styled.span`
  font-weight: bold;
`;

const InputWrapper = styled.div`
  position: relative;
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
  font-family: "museo-sans", san-serif !important;
`;

const Input = styled.input`
  min-height: 40px;
  width: 100%;
  max-width: 100%;
  font-size: 16px;
  font-weight: 300;
  font-family: "museo-sans", san-serif !important;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: normal;
  color: #474b55;
  padding: 8px 16px;
  border: 1px solid #474b55;
  border-radius: 4px;
  border: solid 1px #a8abac;
  border-color: ${(props) => props.error && "#ad122a"};
  margin-bottom: 8px;
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

const InfoMsg = styled.span`
  font-size: 12px;
  font-weight: 300;
  line-height: 1.33;
  letter-spacing: 0.4px;
  color: rgba(0, 0, 0, 0.6);
  position: absolute;
  bottom: -10px;
  left: 0;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 100%;
  grid-row-gap: 16px;
  margin-top: 8px;
`;
const Spacer = styled.div`
  width: 20px;
`;
const FormButtonWrapper = styled(ButtonWrapper)`
  margin-top: 2rem;
  margin-bottom: 0rem;
  display: flex;
  justify-content: end;
  @media only screen and (max-width: 768px) {
    width: 100%;
    display: flex;
    flex-direction: column-reverse;
    gap: 8px;
    > button {
      margin: 0;
    }
  }
`;
const datePickerStyles = (border, claimInformationCopy) => {
  return {
    height: 45,
    border: border
      ? "solid 2px #003863"
      : claimInformationCopy["dateOfService"].error
        ? "solid 1px #ad122a"
        : "solid 1px #a8abac",
    fontFamily: "museo-sans",
    fontColor: "#a8abac",
    backgroundColor: "#ffffff",
    marginTop: "0px",
    marginBottom: "8px",
    width: "100%",
    borderRadius: "4px",
    color: claimInformationCopy["dateOfService"].error ? "#ad122a" : "#474b55",
    opacity: 1,
  };
};

const InfoWrapper = styled.div`
  float: left;
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

const AttestationWrapper = styled.div`
  margin-top: 2rem;
`;

const AttestationTitle = styled.h2`
  color: #003863;
  font-size: 16px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: normal;
  margin-bottom: 0.5rem;
`;

const AttestationBody = styled.p`
  color: #474b55;
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.43;
  letter-spacing: normal;
  margin-bottom: 1rem;
`;

const AttestationCheckboxWrapper = styled.div`
  margin-top: 1rem;
  width: 100%;
`;

const AttestationInput = styled(Input)`
  color: ${(props) => (props.error ? "#ad122a" : "#474b55")};
`;

const AttestationCheckboxCustom = styled.div`
  display: block;
  position: relative;
  padding-left: 35px;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  p {
    color: ${(props) => (props.error ? "#ad122a" : "#474b55")};
    font-size: 14px;
    font-weight: 500;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.43;
    letter-spacing: normal;
    padding-top: 0.5rem;
  }
  span {
    display: ${(props) => (props.checked ? "block" : "default")};
    position: absolute;
    top: 0;
    left: 0;
    height: 24px;
    width: 24px;
    background-color: ${(props) => (props.checked ? "#003863" : "#fff")};
    margin-top: 5px;
    border: ${(props) =>
      props.error ? "1px solid #ad122a" : "1px solid #a8abac"};
    border-radius: 4px;
  }

  span:hover {
    background-color: ${(props) => (props.checked ? "#003863" : "#ccc")};
  }
`;

const AttestationCheckbox = styled.input`
  float: left;
  height: 1.4rem;
  width: 5%;
  margin-right: 2%;
  line-height: 1.43;
  outline: ${(props) => props.error && "#ad122a"};
`;

const AttestationCheckChar = styled.div`
  ${(props) =>
    props.checked && {
      content: "",
      position: "absolute",
      left: "9px",
      top: "5px",
      width: "5px",
      height: "10px",
      border: "solid white",
      borderWidth: "0 3px 3px 0",
      webkitTransform: "rotate(45deg)",
      msTransform: "rotate(45deg)",
      transform: "rotate(45deg)",
    }}
`;

export default SubmitClaimModal;
