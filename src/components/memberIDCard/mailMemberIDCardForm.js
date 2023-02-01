import React, { useState, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import styled, {keyframes} from 'styled-components'
import { Provider, useSelector, useDispatch } from "react-redux";
import { requestSubmitMailMemberIDCardForm } from '../../store/actions/index';
import store from "../../store/store";
import { useHistory } from "react-router-dom";
import { ModalWrapper, ModalInnerWrapper, ModalContent, Header, Text, CloseIcon,
    Button, ButtonWrapper } from "../../styles/commonStyles";
import DropdownSelect from "../common/dropdownSelect";
import SuccessModal from "../common/successModal";
import TryAgainModal from "../common/tryAgainModal";
import ErrorModal from "../common/errorModal";
import * as CONSTANTS from '../../constants/common';
import { AnalyticsTrack } from "../common/segment/analytics";
import { ANALYTICS_TRACK_TYPE, ANALYTICS_TRACK_CATEGORY } from "../../constants/segment";

const MailMemberIDCardForm = (props) => {

    const useComponentDidMount = () => {
        const ref = useRef();
        useEffect(() => {
            ref.current = true;
        }, []);
        return ref.current;
    };    

    const { unmountMe, member, showForm } = props;

    const dispatch = useDispatch();
    const history = useHistory();
    const visible = showForm;
    const [isValid, setIsValid] = useState(null);
    const customerInfo = useSelector((state) => state.customerInfo);
    const submitMailMemberIDCardFormResponse = useSelector((state) => state.correspondence);
    const isComponentMounted = useComponentDidMount();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [streetAddress, setStreetAddress] = useState("");
    const [streetAddressTwo, setStreetAddressTwo] = useState("");
    const [city, setCity] = useState("");
    const [stateCd, setStateCd] = useState({label: "", code: ""});
    const [zipCode, setZipCode] = useState("");

    const [step, setStep] = useState(0);
    const [firstNameError, setFirstNameError] = useState(null);
    const [lastNameError, setLastNameError] = useState(null);
    const [streetAddressError, setStreetAddressError] = useState(null);
    const [streetAddressTwoError, setStreetAddressTwoError] = useState(null);
    const [cityError, setCityError] = useState(null);
    const [stateError, setStateError] = useState(null);
    const [zipCodeError, setZipCodeError] = useState(null);

    const [timesSubmitted, setTimesSubmitted] = useState(0);

    useEffect (() => {
        
    }, [step]); 

    useEffect (() => {
        if(isComponentMounted && !submitMailMemberIDCardFormResponse.loading) {
            if(submitMailMemberIDCardFormResponse.error){
                setStep("SomeError");
                AnalyticsTrack("Mail Order ID Card Submission Failed", customerInfo, { "raw_text": null, "destination_url": null, "category": ANALYTICS_TRACK_CATEGORY.memberIdCard, "type": ANALYTICS_TRACK_TYPE.eventFail, "targetMemberId": props.member.memberId });
            }
            else{
                setStep("Success");
                resetFormFields();
                setTimesSubmitted(1);
                AnalyticsTrack("Mail Order ID Card Submission Successful", customerInfo, { "raw_text": null, "destination_url": null, "category": ANALYTICS_TRACK_CATEGORY.memberIdCard, "type": ANALYTICS_TRACK_TYPE.eventSuccess, "targetMemberId": props.member.memberId });
            }
        }
    }, [submitMailMemberIDCardFormResponse]); 

    const handleFirstNameChange = (event) => {
        setFirstName(event.target.value);
    }
    const handleFirstNameBlur = (event) => {
        if(event.target.value !== ''){
            setFirstNameError(null);
        }
    }
    const handleLastNameChange = (event) => {
        setLastName(event.target.value);
    }
    const handleLastNameBlur = (event) => {
        if(event.target.value !== ''){
            setLastNameError(null);
        }
    }
    const handleStreetAddressChange = (event) => {
        setStreetAddress(event.target.value);
    }
    const handleStreetAddressBlur = (event) => {
        if(event.target.value !== ''){
            setStreetAddressError(null);
        }
    }
    const handleStreetAddressTwoChange = (event) => {
        setStreetAddressTwo(event.target.value);
    }
    const handleCityChange = (event) => {
        setCity(event.target.value);
    }
    const handleCityBlur = (event) => {
        if(event.target.value !== ''){
            setCityError(null);
        }
    }
    const handleStateChange = (event) => {
        if(event.code !== ''){
            setStateError(false);
        }
        setStateCd(event);
    }
    const handleZipCodeChange = (event) => {
        setZipCode(event.target.value);
    }
    const handleZipCodeBlur = (event) => {
        if(event.target.value !== ''){
            setZipCodeError(null);
        }
    }

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
        setStateCd({label: "", code: ""});
        setStateError(false);
        setZipCode("");
        setZipCodeError(false);
    }

    const closeForm = (data) => {
        //setVisible(false);
        goToFirstStep();
        resetFormFields();
        unmountMe();
    }

    const submitForm = () => {
        //submit form and if get back an error, then increment.
        if(timesSubmitted >= 3){
            setStep('Error');
        }
        else{
            let formData = {
                ZipCode: zipCode,
                State: stateCd.code,
                Representative: null,
                MemberId: member.memberId,
                LOB: member.lob,
                GroupNumber: member.groupNumber,
                CompanyNumber: member.companyCode,
                City: city,
                BenefitPackage: member.benefitPackage,
                ApplicationName: 'LOFL', //Not sure what we should be setting here
                AddressType: null, //Not sure if this is supposed to be null or Primary
                Address1: streetAddress,
                Address2: streetAddressTwo,
                ActionDate: null, //Not sure what this is
                ActionCode: null //Not sure what this is
            }
            let filteredFormData = Object.fromEntries(Object.entries(formData).filter(([_, v]) => v != null));

            dispatch(requestSubmitMailMemberIDCardForm(filteredFormData));
        }
        setTimesSubmitted(timesSubmitted+1);
    }

    const validateForm = () => {
        if(step == "Error"){
            goToFirstStep();
            return false;
        }
        let isValid = true;
        if(firstName === ""){
            setFirstNameError("This field is required.");
            isValid = false;
        } else (setFirstNameError(null));
        if(lastName === ""){
            setLastNameError("This field is required.");
            isValid = false;
        } else (setLastNameError(null));
        if(streetAddress === ""){
            setStreetAddressError("This field is required.");
            isValid = false;
        } else (setStreetAddressError(null));
        /* We are not going to require this one currently 
        if(streetAddressTwo === ""){
            setStreetAddressTwoError("This field is required.");
            isValid = false;
        } else (setStreetAddressTwoError(null));
        */
        if(city === ""){
            setCityError("This field is required.");
            isValid = false;
        } else (setCityError(null));
        if(stateCd.label === "" || stateCd.code === ""){
            setStateError("This field is required.");
            isValid = false;
        } else (setStateError(null));
        if(zipCode === ""){
            setZipCodeError("This field is required.");
            isValid = false;
        } else (setZipCodeError(null));
        
        if(!isValid) setIsValid(false);
        return isValid;
    }

    const setNotValid = () => {
        setIsValid(false);
    }
    
    const handleNextQuestionBtn = () => {    
        const isValid = validateForm()

        // check if the questions is the last one
        if(isValid) {
            
        }
    }

    const handleNext = () => {    
        const isValid = validateForm()

        // check if the questions is the last one
        if(isValid) {
            setStep(step+1);
        }
        else{
            goToFirstStep();
        }
    }

    const handleBack = () => {    
        const isValid = validateForm()

        // check if the questions is the last one
        if(isValid) {
            setStep(step-1);
        }
        else{
            goToFirstStep();
        }
    }

    const goToFirstStep = () => {    
        setStep(0);
    }

    const renderSwitch = (step) => { 
        switch(step) {
            case 0:
                return (
                    <div>
                        <FormModalHeader>
                            Mail Me a New ID Card
                        </FormModalHeader>
                        <Text>
                            This address will not be saved to your account and will only be used once to mail your ID card.
                        </Text>
                        <SubHeader>
                            Enter Mailing Address
                        </SubHeader>
                        <FormGrid>
                            <FullWrapper>
                                <InputHeader>First Name</InputHeader>
                                <Input placeholder="Enter First Name" value={firstName} onChange={handleFirstNameChange} onBlur={handleFirstNameBlur} error={firstNameError} />
                                {firstNameError && <InputErrorMsg>{firstNameError}</InputErrorMsg>}
                            </FullWrapper>
                            <FullWrapper>
                                <InputHeader>Last Name</InputHeader>
                                <Input placeholder="Enter Last Name" value={lastName} onChange={handleLastNameChange} onBlur={handleLastNameBlur} error={lastNameError} />
                                {lastNameError && <InputErrorMsg>{lastNameError}</InputErrorMsg>}
                            </FullWrapper>
                            <FullWrapper>
                                <InputHeader>Street Address</InputHeader>
                                <Input placeholder="Enter Street Address" value={streetAddress} onChange={handleStreetAddressChange} onBlur={handleStreetAddressBlur} error={streetAddressError} />
                                {streetAddressError && <InputErrorMsg>{streetAddressError}</InputErrorMsg>}
                            </FullWrapper>
                            <FullWrapper>
                                <InputHeader>Address Line #2 (Optional)</InputHeader>
                                <Input placeholder="Enter Street Address" value={streetAddressTwo} onChange={handleStreetAddressTwoChange} error={streetAddressTwoError} />
                                {streetAddressTwoError && <InputErrorMsg>{streetAddressTwoError}</InputErrorMsg>}
                            </FullWrapper>
                            <FullWrapper>
                                <InputHeader>City</InputHeader>
                                <Input placeholder="Enter City" value={city} onChange={handleCityChange} onBlur={handleCityBlur} error={cityError} />
                                {cityError && <InputErrorMsg>{cityError}</InputErrorMsg>}
                            </FullWrapper>
                            <HalfWrapper>
                                <InputHeader>State</InputHeader>
                                <DropdownSelect
                                            placeholder={'Select State'}
                                            selected={ stateCd.label === "" ? null : {label: stateCd.label}}
                                            selectedHighlight={true}
                                            heightPixels={211}
                                            values={CONSTANTS.StateLabelValues}
                                            onSelect={handleStateChange}
                                            error={stateError}
                                            onInvalidateError={setNotValid}
                                            errorMessage={'This field is required.'}
                                            fullWidth={true}
                                            showImage={false}
                                        />
                            </HalfWrapper>
                            <HalfWrapper>
                                <InputHeader>Zip Code</InputHeader>
                                <Input placeholder="Enter Zip Code" value={zipCode} onChange={handleZipCodeChange} onBlur={handleZipCodeBlur} error={zipCodeError} />
                                {zipCodeError && <InputErrorMsg>{zipCodeError}</InputErrorMsg>}
                            </HalfWrapper>
                        </FormGrid>
                        <FormButtonWrapper>
                            <FormButton green={true} onClick={handleNext}>
                                Continue
                            </FormButton>
                            <FormButton green={false} onClick={closeForm}>
                                Cancel
                            </FormButton>
                        </FormButtonWrapper>
                    </div>
                );
            case 1:
                return (
                    <div>
                        <FormModalHeader>
                            Mail Me a New ID Card
                        </FormModalHeader>
                        <SubHeaderTwo>
                            Please confirm the address you have provided. The new ID card will be mailed to the address below.
                        </SubHeaderTwo>
                        <InfoWrapper>
                        <FormText style={{whiteSpace: 'pre-line'}}>{firstName || lastName ? firstName + " " + lastName+"\n" : ""}</FormText>
                        <FormText style={{whiteSpace: 'pre-line'}}>{streetAddress ? streetAddress+"\n" : ""}</FormText>
                        <FormText style={{whiteSpace: 'pre-line'}}>{streetAddressTwo ? streetAddressTwo+"\n" : ""}</FormText>
                        <FormText style={{whiteSpace: 'pre-line'}}>{city + ", " + stateCd?.label + ", " + zipCode}</FormText>
                        </InfoWrapper>
                        <EditButton onClick={goToFirstStep}>Edit</EditButton>
                        <br style={{clear:'both'}} />
                        <FormButtonWrapper>
                            { !submitMailMemberIDCardFormResponse.loading ?
                                <FormButton green={true} onClick={
                                    (event)=>{
                                        submitForm(); 
                                        AnalyticsTrack(
                                            "Mail Order ID Card Submit Button Clicked", 
                                            customerInfo, 
                                            { 
                                                "raw_text": "Confirm Address", 
                                                "destination_url": "N/A", 
                                                "category": ANALYTICS_TRACK_CATEGORY.memberIdCard, 
                                                "type": ANALYTICS_TRACK_TYPE.linkClicked,
                                                "location": {
                                                    "desktop":{
                                                        "width": 1024,
                                                        "value": "center"
                                                    },
                                                    "tablet":{
                                                        "width": 768,
                                                        "value": "center"
                                                    },
                                                    "mobile":{
                                                        "width": 0,
                                                        "value": "center"
                                                    }
                                                }
                                            }
                                        )
                                    }
                                }>
                                    Confirm Address
                                </FormButton>
                            :
                                <FormButton green={true}>
                                    <ProgressSpinner></ProgressSpinner>
                                </FormButton>
                            }
                            <FormButton green={false} onClick={closeForm}>
                                Cancel
                            </FormButton>
                        </FormButtonWrapper>
                    </div>
                );
          case "Success":
                return (
                    <SuccessModal closeButtonClick={() => closeForm()} modalHeaderText={"Your new Member ID Card is on its way!"} modalBodyText={"Thank you for your ID Card request. Your new ID card will arrive at your current mailing address in 10-15 days."} />
                );
          case "Error":
                return (
                    <ErrorModal closeButtonClick={() => closeForm()} />
                );
          default:
                return (
                    <TryAgainModal tryAgainButtonClick={() => submitForm()} backButtonClick={() => setStep(1)}/>
                );
            
        }
      }
    return (
        <MailMemberIDCardFormWrapper>
            { visible === true ?
                <FormModalWrapper visible={visible}>
                    <ModalInnerWrapper>
                        <FormModalContent>
                        <CloseIcon src = "react/images/icn-close.svg" onClick={closeForm} />
                            {renderSwitch(step)}
                        </FormModalContent>
                    </ModalInnerWrapper>
                </FormModalWrapper>
                :
                null
            }
        </MailMemberIDCardFormWrapper>
    )
}

const MailMemberIDCardFormWrapper = styled.div`
`

const FormModalWrapper = styled(ModalWrapper)`
    transition: opacity 300ms ease-in-out;
    opacity: ${props => props.visible ? "1" : "0" };
`

const FormModalContent = styled(ModalContent)`
    transition: opacity 300ms ease-in-out;
`

const FormModalHeader = styled(Header)`
    font-size: 20px;
    line-height: 1.4;
    margin-bottom: 1rem;
`

const SubHeader = styled.h3`
    margin: 4px 4px 8px 0;
    font-size: 16px;
    font-weight: 700;
    font-stretch: normal;
    font-style: normal;
    line-height: 24px;
    letter-spacing: normal;
    color: #474b55;
`

const SubHeaderTwo = styled.h3`
    margin: 4px 4px 16px 0;
    font-size: 16px;
    font-weight: 700;
    font-stretch: normal;
    font-style: normal;
    line-height: 24px;
    letter-spacing: normal;
    color: #474b55;
`

const InputHeader = styled.h3`
    margin: 8px 4px 8px 0;
    font-size: 16px;
    font-weight: 300;
    font-stretch: normal;
    font-style: normal;
    line-height: 24px;
    letter-spacing: normal;
    color: #474b55;
`

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
    border-color: ${props => props.error && "#ad122a"};

    &[type=number]::-webkit-inner-spin-button, 
    &[type=number]::-webkit-outer-spin-button {  
        display: none;
    }

    &:focus {
        border-color: #474b55;
    }
    ::placeholder,
    ::-webkit-input-placeholder {
        color: ${props => props.error ? "#ad122a" : "#a8abac" };
    }
    :-ms-input-placeholder {
        color: ${props => props.error ? "#ad122a" : "#a8abac" };
    }
`

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
`

const FullWrapper = styled.div`
    grid-column: 1 / 3;
`

const HalfWrapper = styled.div`
    @media only screen and (max-width: 768px) {
        grid-column: 1 / 3;
    }
`

const FormButtonWrapper = styled(ButtonWrapper)`
  margin-top: 3.5rem;
  margin-bottom: 6rem;
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
`

const FormText = styled.div`
`

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

    &:focus {outline:0; box-shadow: none;}
`;
const SpinnerRotate = keyframes`
  from {transform: rotate(0deg);}
  to {transform: rotate(360deg);}
`;

const ProgressSpinner = styled.div`
  text-align: center;
  margin: auto;
  border: .2rem solid #375225;
  border-top: .2rem solid white;
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
  
export default MailMemberIDCardForm;