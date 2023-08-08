import React, { useState, useEffect, useRef } from "react";
import ReactDOM, { render } from 'react-dom';
import styled, {keyframes} from 'styled-components'
import { ModalWrapper, ModalInnerWrapper, ModalContent, Text, CloseIcon,
    Button, ButtonWrapper } from "./styles/commonStyles";
import { Provider, useSelector, useDispatch } from "react-redux";
import store from "./store/store";
import { requestCustomerInfo, requestPreferenceCenterInfo, requestPreferredContactInfoSubmit } from "./store/actions";
import MFAModal from "./components/common/mfaModal";
import SuccessModalV2 from "./components/common/successModalV2";
import ErrorModal from "./components/common/errorModal";
import Spinner from "./components/common/spinner";

const targetElement = document.getElementById("preferredContactInfo");

const PreferredContactInfo = (props) => {
    let contactType = (props.type ? props.type : null);

    const useComponentDidMount = () => {
        const ref = useRef();
        useEffect(() => {
            ref.current = true;
        }, []);
        return ref.current;
    };    

    const { tryAgainButtonClick } = props;

    const dispatch = useDispatch();
    const customerInfo = useSelector((state) => state.customerInfo.data);
    const isComponentMounted = useComponentDidMount();
    const preferenceCenterInfo = useSelector((state) => state.preferenceCenterInfo);
    const submitPreferredContactInfoResponse = useSelector((state) => state.preferredContactInfoSubmit);
    const [step, setStep] = useState(contactType);
    const [selectedPhone, setSelectedPhone] = useState(null);
    const [selectedEmail, setSelectedEmail] = useState(null);
    const [customPhoneVal, setCustomPhoneVal] = useState(''); // This will need to be used for the custom field... we'll need to set onclicks for the toggle to check this value and then to copy it to selectedContact... otherwise we may miss the value if clicking outside of the text input box
    const [customEmailVal, setCustomEmailVal] = useState(''); // This will need to be used for the custom field... we'll need to set onclicks for the toggle to check this value and then to copy it to selectedContact... otherwise we may miss the value if clicking outside of the text input box
	const [selectContactError, setSelectContactError] = useState("");

    useEffect(() => {
        dispatch(requestPreferenceCenterInfo());
    }, []);

    useEffect(() => {
        if (isComponentMounted && !submitPreferredContactInfoResponse?.loading) {
            if (submitPreferredContactInfoResponse?.error === "" && submitPreferredContactInfoResponse?.data?.data?.errors.length == 0) {
                switch (step) {
                    case "Email":
                        setStep("Phone");
                    case 'Phone':
                        setStep("MFA");
                    default:
                        //setStep("Success");
                }
            }
            else{
                setStep("Error");
            }
        }
    }, [submitPreferredContactInfoResponse]);

    const formatPhone = (phone, format) => {
        switch (format) {
            // ex: (917) 111 - 2323
            case 1:
                // Strip all characters from the input except digits
                phone = phone.replace(/\D/g, '');
    
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
                    phone = `(${phone.substring(0, 3)}) ${phone.substring(3, 6)} - ${phone.substring(6, 10)}`;
                }
    
                break;
            // ex: 917-111-2323
            case 2:
            default:
                phone = phone.replace(/\D/g, '');
                phone = phone.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
        }
        return phone;
    };

    const handleCustomPhoneNumberChange = (event) => {
        let tempPhone = "";
        tempPhone = formatPhone(event.target.value, 1);
        //setNewPhone(tempPhone);
        setCustomPhoneVal(tempPhone);
        setSelectedPhone({sourceType: 'custom', type: 'mobile', number: tempPhone});
        event.target.value = tempPhone;
    }

    const handleCustomEmailChange = (event) => {
        let tempEmail = "";
        tempEmail = event.target.value;
        setCustomEmailVal(tempEmail);
        setSelectedEmail({sourceType: 'custom', email: tempEmail});
        event.target.value = tempEmail;
    }

    const checkInputError = () => {
        if(step == 'Email'){
            if(selectedEmail?.email){
                setSelectContactError('');
            }
            else{
                setSelectContactError('Please select a preferred email address.');
                return true;
            }
        }
        else if(step == 'Phone'){
            if(selectedPhone?.number){
                setSelectContactError('');
            }
            else{
                setSelectContactError('Please select a preferred phone number.');
                return true;
            }
        }
        return false;
    }

    const submitForm = (data) => {
        //submit form and if get back an error, then increment.
        /*if(timesSubmitted >= 3){
            setStep('Error');
        }
        else{
            */
            //console.log("jfdklsjfkldjfkldsfsdf");
            dispatch(requestPreferredContactInfoSubmit(data, customerInfo.csrf));
        /*}
        setTimesSubmitted(timesSubmitted+1);
        */
    }

    const handleSave = () => {
        if(checkInputError()){
            return null;
        }
        if(step == "Email" && preferenceCenterInfo?.data?.phones?.is_different){
            setStep("Phone");
        }
        else{

            let formData = {};

            formData = {
                firstName: customerInfo.firstName,
                lastName: customerInfo.lastName,
                memberId: customerInfo.memberId,
                shouldUpdateEmailInOkta: (selectedEmail?.email ? true : false),
                email: (selectedEmail?.email ? selectedEmail.email : (preferenceCenterInfo?.data?.email?.pm !== undefined ? preferenceCenterInfo.data.email.pm : "")).toUpperCase(),
                emailOptIn: true,
                shouldUpdatePhoneInOkta: (selectedPhone?.number ? true : false),
                primaryPhone:formatPhone((selectedPhone?.number ? selectedPhone.number : (preferenceCenterInfo?.data?.phones?.pm_primary !== undefined ? preferenceCenterInfo.data.phones.pm_primary : "")), 1),
                primaryPhoneType:(selectedPhone?.type ? selectedPhone.type : (preferenceCenterInfo?.data?.phones?.pm_primary_type !== undefined && preferenceCenterInfo?.data?.phones?.pm_primary_type !== "" ? preferenceCenterInfo.data.phones.pm_primary_type : "mobile")),
                primaryPhoneCallOptIn: true,
                primaryPhoneTextOptIn: true,
                secondaryPhone:formatPhone((preferenceCenterInfo?.data?.phones?.pm_secondary !== undefined ? preferenceCenterInfo.data.phones.pm_secondary : ""), 1),
                secondaryPhoneType:(preferenceCenterInfo?.data?.phones?.pm_secondary_type !== undefined && preferenceCenterInfo?.data?.phones?.pm_secondary_type !== "" ? preferenceCenterInfo.data.phones.pm_secondary_type : "mobile"),
                secondaryPhoneCallOptIn: true,
                secondaryPhoneTextOptIn: true,
            }

            let filteredFormData = Object.fromEntries(Object.entries(formData).filter(([_, v]) => v != null));
            submitForm(filteredFormData);
        }
    };

    const handleMFAStatus = (status) => {
        switch (status) {
            case 'Success':
                setStep('Success');
                break;
            case 'Invalid':
                setStep('Error');
                break;
            case 'Expired':
                setStep('Error');
                break;
            case 'Error':
                setStep('Error');
                break;
            default:
                setStep('Error');
                break;
        }
    }

    const getContacts = (type) => {
        let contactsArr = [];
        switch (type) {
            case 'phone':
                if(preferenceCenterInfo?.data?.phones !== undefined){
                    if(preferenceCenterInfo?.data?.phones?.okta !== undefined && preferenceCenterInfo?.data?.phones?.okta != ''){
                        contactsArr.push({number: preferenceCenterInfo.data.phones.okta, type: '', sourceType: 'okta'});
                    } 
                    if(preferenceCenterInfo?.data?.phones?.pm_primary !== undefined && preferenceCenterInfo?.data?.phones?.pm_primary != ''){
                        contactsArr.push({number: preferenceCenterInfo.data.phones.pm_primary, type: preferenceCenterInfo.data.phones.pm_primary_type, sourceType: 'pm'});
                    }
                    if(preferenceCenterInfo?.data?.phones?.pm_secondary !== undefined && preferenceCenterInfo?.data?.phones?.pm_secondary != ''){
                        contactsArr.push({number: preferenceCenterInfo.data.phones.pm_secondary, type: preferenceCenterInfo.data.phones.pm_secondary_type, sourceType: 'pm'});
                    }
                }
                return contactsArr;
            case 'email':
                if(preferenceCenterInfo?.data?.email?.okta !== undefined && preferenceCenterInfo?.data?.email?.okta != ''){
                    contactsArr.push({email: preferenceCenterInfo.data.email.okta, sourceType: 'okta'});
                } 
                if(preferenceCenterInfo?.data?.email?.pm !== undefined && preferenceCenterInfo?.data?.email?.pm != ''){
                    contactsArr.push({email: preferenceCenterInfo.data.email.pm, sourceType: 'pm'});
                }
                return contactsArr;
            default:
                return [];
        }
    }

    const closeForm = (data) => {
        //Go to home
        window.location.replace("/home");
    }

    const renderSwitch = (step) => {
		switch (step) {
			case 'Phone':
				return (
                    <div>
                    <Header>
                        Our records show multiple phone numbers associated with your account.
                    </Header>
                    <SubHeader>
                        Please select the mobile phone number we should associate with your account. 
                    </SubHeader>
                    <SelectText>
                        Select your primary mobile number
                    </SelectText>
                    { !preferenceCenterInfo.loading ?
                        getContacts('phone').length >= 0 ? (
                            <ContactCardsContainer>
                                {
                                    getContacts('phone').map(((contact) => (
                                        <ContactCard key={contact.phone+contact.sourceType}
                                            onClick={() => setSelectedPhone(contact)}
                                            status={selectContactError ? 'error' : selectedPhone && selectedPhone.number === contact.number ? 'selected' : ""} >
                                            <RadioButtonContainer>
                                                {
                                                    selectedPhone && selectedPhone.number === contact.number ?
                                                        <RadioImg src="/react/images/icn-radio-active.svg" /> :
                                                        <RadioImg src="/react/images/icn-radio-inactive.svg" />
                                                }
                                                <ContactValueWrapper>
                                                    <ContactValue className="mt-0">
                                                        {formatPhone(contact.number, 1)}
                                                    </ContactValue>
                                                </ContactValueWrapper>
                                            </RadioButtonContainer>
                                        </ContactCard>
                                    )))
                                }
                                {/*
                                <ContactCard key={'newContactCardInputerTwo'}
                                    onClick={() => setSelectedPhone({sourceType: 'custom', number: customPhoneVal})} // Need to do custom check
                                    status={selectContactError ? 'error' : selectedPhone && selectedPhone.sourceType === 'custom' ? 'selected' : ""} >
                                    <RadioButtonContainer>
                                        {
                                            selectedPhone && selectedPhone.sourceType === 'custom' ?
                                                <RadioImg src="/react/images/icn-radio-active.svg" /> :
                                                <RadioImg src="/react/images/icn-radio-inactive.svg" />
                                        }
                                        <ContactValueWrapper>
                                            <ContactInputValue className="mt-0">
                                                <InputWrapper>
                                                    <ContactInput type="text" placeholder="Enter Phone Number"
                                                        onClick={(e) => handleCustomPhoneNumberChange(e)}
                                                        onChange={(e) => handleCustomPhoneNumberChange(e)}
                                                    />
                                                </InputWrapper>
                                            </ContactInputValue>
                                        </ContactValueWrapper>
                                    </RadioButtonContainer>
                                </ContactCard>
                                */}
                                {selectContactError && <ErrorLabel>{selectContactError}</ErrorLabel>}
                            </ContactCardsContainer>
                        ) :
                            null
                    :
                        <ProgressWrapper>
                            <Spinner />
                        </ProgressWrapper>
                    }
                    <BottomText>
                        Your contact information can always be changed within your Account Settings.
                    </BottomText>
                    <FormButtonWrapper>
                        { !submitPreferredContactInfoResponse.loading ?
                        <FormButton green={true} onClick={!submitPreferredContactInfoResponse.loading ? handleSave : null}>
                            Save
                        </FormButton>
                        :
                            <FormButton green={true}>
                                <ProgressSpinner></ProgressSpinner>
                            </FormButton>
                        }
                    </FormButtonWrapper>
                    </div>
				);
			case 'Email':
				return (
                    <div>
                    <Header>
                        Our records show multiple email addresses associated with your account.
                    </Header>
                    <SubHeader>
                        Please select the email address we should associate with your account. 
                    </SubHeader>
                    <SelectText>
                        Select your preferred email address
                    </SelectText>
                    { !preferenceCenterInfo.loading?
                        getContacts('email').length >= 0 ? (
                            <ContactCardsContainer>
                                {
                                    getContacts('email').map(((contact) => (
                                        <ContactCard key={contact.email+contact.sourceType}
                                            onClick={() => setSelectedEmail(contact)}
                                            status={selectContactError ? 'error' : selectedEmail && selectedEmail.email === contact.email ? 'selected' : ""} >
                                            <RadioButtonContainer>
                                                {
                                                    selectedEmail && selectedEmail.email === contact.email ?
                                                        <RadioImg src="/react/images/icn-radio-active.svg" /> :
                                                        <RadioImg src="/react/images/icn-radio-inactive.svg" />
                                                }
                                                <ContactValueWrapper>
                                                    <ContactValue className="mt-0">
                                                        {contact.email.toLowerCase()}
                                                    </ContactValue>
                                                </ContactValueWrapper>
                                            </RadioButtonContainer>
                                        </ContactCard>
                                    )))
                                }
                                {/*
                                <ContactCard key={'newContactCardInputer'}
                                    onClick={() => setSelectedEmail({sourceType: 'custom', email: customEmailVal})}
                                    status={selectContactError ? 'error' : selectedEmail && selectedEmail.sourceType === 'custom' ? 'selected' : ""} >
                                    <RadioButtonContainer>
                                        {
                                            selectedEmail && selectedEmail.sourceType === 'custom' ?
                                                <RadioImg src="/react/images/icn-radio-active.svg" /> :
                                                <RadioImg src="/react/images/icn-radio-inactive.svg" />
                                        }
                                        <ContactValueWrapper>
                                            <ContactInputValue className="mt-0">
                                                <InputWrapper>
                                                    <ContactInput type="text" placeholder="Enter Email"
                                                        onClick={(e) => handleCustomEmailChange(e)}
                                                        onChange={(e) => handleCustomEmailChange(e)}
                                                    />
                                                </InputWrapper>
                                            </ContactInputValue>
                                        </ContactValueWrapper>
                                    </RadioButtonContainer>
                                </ContactCard>
                                */}
                                {selectContactError && <ErrorLabel>{selectContactError}</ErrorLabel>}
                            </ContactCardsContainer>
                        ) :
                            null
                    :
                        <ProgressWrapper>
                            <Spinner />
                        </ProgressWrapper>
                    }
                    <BottomText>
                        Your contact information can always be changed within your Account Settings.
                    </BottomText>
                    <FormButtonWrapper>
                        { !submitPreferredContactInfoResponse.loading ?
                        <FormButton green={true} onClick={!submitPreferredContactInfoResponse.loading ? handleSave : null}>
                            Save
                        </FormButton>
                        :
                            <FormButton green={true}>
                                <ProgressSpinner></ProgressSpinner>
                            </FormButton>
                        }
                    </FormButtonWrapper>
                    </div>
				);
            case "MFA":
                return (
                    <MFAModal mfaStatus={(status) => handleMFAStatus(status)} targetEmail={selectedEmail?.email} targetPhone={selectedPhone?.number} />
                );
            case "Success":
                return (
                    <SuccessModalV2 closeButtonClick={() => closeForm()} modalHeaderText={"Your contact information has been updated successfully!"} />
                );
            case "Error":
                return (
                    <ErrorModal closeButtonClick={() => closeForm()} />
                );
			default:
				return (
					null
				);

		}
	}

    return (
        <PreferredContactInfoWrapper>
            {renderSwitch(step)}
        </PreferredContactInfoWrapper>
    );
};

const PreferredContactInfoWrapper = styled.div`
    position: relative;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    min-width: 0;
    word-wrap: break-word;
    background-color: #fff;
    background-clip: border-box;
    border: 1px solid rgba(0,0,0,.125);
    border-radius: 0.25rem;
    width: 320px;
    border-radius: 4px;
    margin-left: auto!important;
    margin-right: auto!important;
    margin-bottom: 3rem;
    padding-bottom: 1rem;
`

const Header = styled.h1`
    margin: 2.5rem 5% .5rem;
    font-size: 18px;
    font-weight: 500;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.33;
    letter-spacing: normal;
    text-align: center;
    color: #003863;
`
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
`

const SelectText = styled.p`
    margin: 0 5% 8px;
    font-size: 14px;
    font-weight: 500;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.43;
    letter-spacing: normal;
    text-align: left;
    color: #474b55;
`

const ContactCardsContainer = styled.div`
    margin: 0 5% 8px;
    display: flex;
    flex-direction: column;
    row-gap: 8px;
`
const ContactCard = styled.div`
    overflow:hidden;
    padding: 16px 16px 12px 16px;
    border-radius: 6px;
    border: ${({ status }) => status ? status === "selected" ? "solid 2px #003863" : "solid 2px #ad122a" : "solid 1px #d8d8d8"};
`
const RadioButtonContainer = styled.div`
    display:flex;
    gap:12px;
`
const RadioImg = styled.img`
    align-self: flex-start;
    margin-top: auto;
    margin-bottom: auto;
`
const ContactValueWrapper = styled.div`
    width: 100%;
`
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
`
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
`
const MemeberDetailFieldWrapper = styled.div`
    display: flex;
    align-items: flex-start;
    gap: 8px;
`
const MemeberDetailFieldImg = styled.img`
    margin-top:1.5px
`
const MemeberDetailField = styled.div`
    margin-bottom:8px;
    font-family: "museo-sans", san-serif;
    font-size: 14px;
    font-weight: 500;
    line-height: 1.43;
    color: #474b55;
`
const ErrorLabel = styled.div`
    font-size: 12px;
    font-weight: 500;
    line-height: 1.33;
    color: #a0252c;
`

const BottomText = styled.p`
    margin: 2rem 5% 2.5rem 5%;
    font-size: 14px;
    font-weight: 500;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.43;
    letter-spacing: normal;
    text-align: left;
    color: #474b55;
`

const FormButtonWrapper = styled(ButtonWrapper)`
  margin-top: 2rem; 
  margin-bottom: 0rem;
  text-align: center;
`;
const FormButton = styled(Button)`
  float: none!important;
  width: 90%;
  margin-left: 5%;
  margin-right: 5%;
`;
const ProgressWrapper = styled.div`
  width:100%;
`;
const InputWrapper = styled.div` 
	position:relative;
`
const ContactInput = styled.input`
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
    border-color: ${props => props.error && "#ad122a"};
	margin-bottom: 2px;
    &[type=number]::-webkit-inner-spin-button, 
    &[type=number]::-webkit-outer-spin-button {  
        display: none;
    }
    &:focus {
        border-color: #474b55;
    }
    ::placeholder,
    ::-webkit-input-placeholder {
        color: ${props => props.error ? "#ad122a" : "#a8abac"};
    }
    :-ms-input-placeholder {
        color: ${props => props.error ? "#ad122a" : "#a8abac"};
    }
`
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

export default PreferredContactInfo;