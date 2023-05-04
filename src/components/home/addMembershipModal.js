import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import {
    ModalWrapper, ModalInnerWrapper, ModalContent, CloseIcon, ButtonWrapper
} from "../../styles/commonStyles";
import moment from 'moment';
import { useDispatch, useSelector } from "react-redux";
import { requestAddMembership } from "../../store/actions";
import { useHomeContext } from './homeContext';



const AddMembershipModal = ({ unmountMe, showModal }) => {

    const initialState = {
        "memberId": {
            value: '',
            error: null
        },
        "firstName": {
            value: '',
            error: null
        },
        "lastName": {
            value: '',
            error: null
        },
        "dateofBirth": {
            value: '',
            error: null
        },
        "zipcode": {
            value: '',
            error: null
        }
    }
    const [membershipInfo, setMembershipInfo] = useState(initialState)

    const [toastr, setToastr] = useState(false);
    const dispatch = useDispatch();
    const customerInfo = useSelector((state) => state.customerInfo.data);
    const addMembership = useSelector((state) => state.addMembership);
    const [submitClicked, setSubmitClicked] = useState(false);
    const [showMemberIdImg, setShowMemberIdImg] = useState(false);
    const { showSuccessModal, setShowSuccessModal } = useHomeContext();
    const clearState = () => {
        setMembershipInfo({ ...initialState });
    };
    useEffect(() => {
        setTimeout(() => {
            setToastr(false)
        }, 3000);
    }, [toastr])

    useEffect(() => {
        const { loading } = addMembership;
        if (!loading && submitClicked) {
            if(addMembership.error === "" && addMembership.success === "success"){
                // window.location.reload();
                // closeModal();
                // setToastr(true);
                // setSubmitClicked(false);
                // clearState();
                closeModal();
                setSubmitClicked(false);
                setShowSuccessModal(true);
            
            }
            else{
                if (addMembership.error === 'no_matches_found') {
                    const accountInfo = { ...membershipInfo }
                    accountInfo['memberId'] = {
                        value:  accountInfo['memberId'].value,
                        error: "Make sure that all information matches your enrollment form."
                    }
                    accountInfo['lastName'] = {
                        value:  accountInfo['lastName'].value,
                        error: " "
                    }
                    accountInfo['dateofBirth'] = {
                        value:  accountInfo['dateofBirth'].value,
                        error: " "
                    }
                    accountInfo['zipcode'] = {
                        value:  accountInfo['zipcode'].value,
                        error: " "
                    }
                    setMembershipInfo(accountInfo);
                }
                else if (addMembership.error === 'already_taken') {
                    const accountInfo = { ...membershipInfo }
                    accountInfo['memberId'] = {
                        value:  accountInfo['memberId'].value,
                        error: "This Member ID is already attached to an existing account. Please log in to that account to view your plan information. "
                    }
                    accountInfo['lastName'] = {
                        value:  accountInfo['lastName'].value,
                        error: " "
                    }
                    accountInfo['dateofBirth'] = {
                        value:  accountInfo['dateofBirth'].value,
                        error: " "
                    }
                    accountInfo['zipcode'] = {
                        value:  accountInfo['zipcode'].value,
                        error: " "
                    }
                    setMembershipInfo(accountInfo);
                }
                else{
                    closeModal();
                    setToastr(true);
                    setSubmitClicked(false);
                    clearState();
                }
            }
        }
    }, [addMembership])

    const handleClick = () => {
        const accountInfo = { ...membershipInfo }
        for (const [key, value] of Object.entries(accountInfo)) {
            if (key === 'memberId' && value.value.length < 8) {
                accountInfo[key] = {
                    value: value.value,
                    error: "Your Member ID does not meet our minimum requirements."
                }
            }
            else if (key === 'zipcode' && !value.value.match(/^\d+$/)) {
                accountInfo[key] = {
                    value: value.value,
                    error: "Zipcode must be a number"
                }
            }
            else if (key === 'dateofBirth') {
                if (!moment(value.value, "MM/DD/YYYY").isValid()) {
                    accountInfo[key] = {
                        value: value.value,
                        error: "Your Date of Birth is not correct. Please enter it again."
                    }
                }
                else if (moment().diff(moment(value.value, "MM/DD/YYYY"), 'years') < 18) {
                    accountInfo[key] = {
                        value: value.value,
                        error: "Sorry! You must be 18 years of age or older to create an account"
                    }
                }
            }
        }
        if (accountInfo['memberId'].error || accountInfo['zipcode'].error
             || accountInfo['lastName'].error
            || accountInfo['dateofBirth'].error) {
            setMembershipInfo(accountInfo);
        }
        else {
            setSubmitClicked(true);
            let membershipDetails = {
                entryPoint: 'modal',
                memberId: membershipInfo['memberId'].value,
                lastName: membershipInfo['lastName'].value,
                DOBFULL: membershipInfo['dateofBirth'].value,
                zipCode: membershipInfo['zipcode'].value
            }
            dispatch(requestAddMembership(membershipDetails, customerInfo.csrf));
        }

    }

    const closeModal = () => {
        unmountMe();
        clearState();
    }

    const onContinue = () => {
        setShowSuccessModal(false);
        window.location.reload();
    }

    const getMsg = (msg) => {
        if (msg === 'internal_error') {
            return <ToastrText>
                Uh-Oh! Something went wrong.
            </ToastrText>
        }
        else if (msg === 'multiple_customerIds_found') {
            return <ToastrText>
                We are unable to add this membership to your account. Please <ContactTxt href="https://healthfirst.org/contact" target="_blank">contact us</ContactTxt> for assistance.
            </ToastrText>
        }
    }

    return (

        <div>

            {
                showModal === true ?

                    <FormModalWrapper visible={showModal}>

                        <ModalInnerWrapperCustom>
                            <Toastr open={toastr} error={addMembership.error !== ""}>
                                <ToastrIconBox error={addMembership.error !== ""}><ToastrIcon alt = "toastMsgIcon" src={addMembership.error !== "" ? "/react/images/icn-alert.svg" : "/react/images/valid-check.svg"}></ToastrIcon></ToastrIconBox>
                                <ToastrInfo>
                                    {addMembership.error !== "" ? getMsg(addMembership.error) :
                                        <ToastrText>Membership Attached!</ToastrText>}
                                    <ToastrCloseIcon alt = "" src="/react/images/valid-close.svg" onClick={() => setToastr(false)}></ToastrCloseIcon>
                                </ToastrInfo>
                            </Toastr>
                            <FormModalContent>

                                <CloseIcon alt = "" src="/react/images/icn-close.svg" onClick={() => closeModal()} />

                                <div>
                                    <Header>
                                        Please Enter Your Member ID
                                    </Header>
                                    <SubHeader>
                                       A Member ID is required to get the most out of your Healthfirst account.
                                    </SubHeader>
                                    <FormGrid>
                                        <InputWrapper>
                                            <InputHeader>Member ID</InputHeader>
                                            <MemberIdInput>
                                                <Input type="text" placeholder="Enter Member ID"
                                                    value={membershipInfo["memberId"].value}
                                                    onChange={(e) => {
                                                        if(submitClicked)
                                                        {
                                                        setMembershipInfo({
                                                            ...membershipInfo,
                                                            memberId: {
                                                                value: e.target.value,
                                                                error: null
                                                            },
                                                            lastName: {
                                                                value: membershipInfo["lastName"].value,
                                                                error: null
                                                            },
                                                            dateofBirth: {
                                                                value: membershipInfo["dateofBirth"].value,
                                                                error: null
                                                            },
                                                            zipcode: {
                                                                value: membershipInfo["zipcode"].value,
                                                                error: null
                                                            }
                                                        })
                                                        setSubmitClicked(false);
                                                    }
                                                    else{
                                                        setMembershipInfo({
                                                            ...membershipInfo,
                                                            memberId: {
                                                                value: e.target.value,
                                                                error: null
                                                            }
                                                        })
                                                    }

                                                    }
                                                    }
                                                    error={membershipInfo["memberId"].error}
                                                />
                                                {membershipInfo["memberId"].error && <InputErrorMsg>{membershipInfo["memberId"].error}</InputErrorMsg>}
                                                <InfoIcon alt = "" onMouseOver={() => setShowMemberIdImg(true)} onMouseOut={() => setShowMemberIdImg(false)} src="/react/images/ico-info.png"></InfoIcon>
                                                {showMemberIdImg &&
                                                    <MemberIdImg alt = "" src="/react/images/mem_id.png"></MemberIdImg>
                                                }
                                            </MemberIdInput>
                                            {/* {showMemberIdImg */}

                                        </InputWrapper>
                                        <AdditionalInfo>Additional Information</AdditionalInfo>
                                        <InputWrapper>
                                            <InputHeader>Last Name</InputHeader>
                                            <Input type="text" placeholder="Enter Last Name"
                                                value={membershipInfo["lastName"].value}
                                                onChange={(e) => {
                                                    if(submitClicked)
                                                        {
                                                        setMembershipInfo({
                                                            ...membershipInfo,
                                                            memberId: {
                                                                value: membershipInfo["memberId"].value,
                                                                error: null
                                                            },
                                                            lastName: {
                                                                value: e.target.value,
                                                                error: null
                                                            },
                                                            dateofBirth: {
                                                                value: membershipInfo["dateofBirth"].value,
                                                                error: null
                                                            },
                                                            zipcode: {
                                                                value: membershipInfo["zipcode"].value,
                                                                error: null
                                                            }
                                                        })
                                                        setSubmitClicked(false);
                                                    }
                                                    else{
                                                        setMembershipInfo({
                                                            ...membershipInfo,
                                                            lastName: {
                                                                value: e.target.value,
                                                                error: null
                                                            }
                                                        })
                                                    }
                                                    //if(!!e.target.value.match(/[a-zA-Z]+/g)){
                                                    
                                                    //}

                                                }
                                                }
                                                error={membershipInfo["lastName"].error}
                                            />
                                            {membershipInfo["lastName"].error && <InputErrorMsg>{membershipInfo["lastName"].error}</InputErrorMsg>}
                                        </InputWrapper>
                                        <InputWrapper>
                                            <InputHeader>Date of Birth</InputHeader>
                                            <Input type="text" placeholder="MM/DD/YYYY"
                                                value={membershipInfo["dateofBirth"].value}
                                                onChange={(e) => {
                                                    if (e.target.value.length > membershipInfo["dateofBirth"].value.length) {
                                                        let input = e.target.value;
                                                        input = input.replace(/\D/g, '');
                                                        input = input.substring(0, 10);
                                                        let size = input.length;
                                                        if (size < 2) {
                                                            input = input;
                                                        } else if (size < 4) {
                                                            input = input.substring(0, 2) + '/' + input.substring(2, input.length);
                                                        } else {
                                                            input = input.substring(0, 2) + '/' + input.substring(2, 4) + '/' + input.substring(4, 8);
                                                        }
                                                        if(submitClicked){
                                                        setMembershipInfo({
                                                            ...membershipInfo,
                                                            dateofBirth: {
                                                                value: input,
                                                                error: null
                                                            },
                                                            memberId: {
                                                                value: membershipInfo["memberId"].value,
                                                                error: null
                                                            },
                                                            lastName: {
                                                                value: membershipInfo["lastName"].value,
                                                                error: null
                                                            },
                                                            zipcode: {
                                                                value: membershipInfo["zipcode"].value,
                                                                error: null
                                                            }
                                                        })
                                                        setSubmitClicked(false);
                                                    }
                                                    else{
                                                        setMembershipInfo({
                                                            ...membershipInfo,
                                                            dateofBirth: {
                                                                value: input,
                                                                error: null
                                                            }
                                                        })
                                                    }
                                                    } else {
                                                        if(submitClicked){
                                                            setMembershipInfo({
                                                                ...membershipInfo,
                                                                dateofBirth: {
                                                                    value: e.target.value,
                                                                    error: null
                                                                },
                                                                memberId: {
                                                                    value: membershipInfo["memberId"].value,
                                                                    error: null
                                                                },
                                                                lastName: {
                                                                    value: membershipInfo["lastName"].value,
                                                                    error: null
                                                                },
                                                                zipcode: {
                                                                    value: membershipInfo["zipcode"].value,
                                                                    error: null
                                                                }
                                                            })
                                                            setSubmitClicked(false);
                                                        }
                                                        else{
                                                        setMembershipInfo({
                                                            ...membershipInfo,
                                                            dateofBirth: {
                                                                value: e.target.value,
                                                                error: null
                                                            }
                                                        })
                                                    }
                                                    }
                                                    // //}
                                                }}
                                                error={membershipInfo["dateofBirth"].error}
                                            />
                                            {membershipInfo["dateofBirth"].error && <InputErrorMsg>{membershipInfo["dateofBirth"].error}</InputErrorMsg>}
                                        </InputWrapper>
                                        <InputWrapper>
                                            <InputHeader>Zip Code</InputHeader>
                                            <Input type="text" placeholder="Enter Zip Code" maxLength={5}
                                                value={membershipInfo["zipcode"].value}
                                                onChange={(e) => {
                                                    //if(!!e.target.value.match(/[a-zA-Z]+/g)){
                                                        if(submitClicked)
                                                        {
                                                        setMembershipInfo({
                                                            ...membershipInfo,
                                                            memberId: {
                                                                value: membershipInfo["memberId"].value,
                                                                error: null
                                                            },
                                                            lastName: {
                                                                value: membershipInfo["lastName"].value,
                                                                error: null
                                                            },
                                                            dateofBirth: {
                                                                value: membershipInfo["dateofBirth"].value,
                                                                error: null
                                                            },
                                                            zipcode: {
                                                                value: e.target.value,
                                                                error: null
                                                            }
                                                        })
                                                        setSubmitClicked(false);
                                                    }
                                                    else{
                                                        setMembershipInfo({
                                                            ...membershipInfo,
                                                            zipcode: {
                                                                value: e.target.value,
                                                                error: null
                                                            }
                                                        })
                                                    }
                                                   
                                                    //}

                                                }
                                                }
                                                error={membershipInfo["zipcode"].error}
                                            />
                                            {membershipInfo["zipcode"].error && <InputErrorMsg>{membershipInfo["zipcode"].error}</InputErrorMsg>}
                                        </InputWrapper>

                                    </FormGrid>
                                    

                                            <FormButtonWrapper>
                                            <StyledButton variant="secondary"
                                                onClick={() => closeModal()}
    
                                            >
                                                Cancel
                                            </StyledButton><Spacer></Spacer>
                                            <StyledButton variant="primary"
                                                onClick={() =>  handleClick()}
                                                disabled={
                                                        membershipInfo["memberId"].value === '' ||
                                                        membershipInfo["lastName"].value === '' ||
                                                        membershipInfo["dateofBirth"].value === null ||
                                                        membershipInfo["zipcode"].value === '' 
                                                    }
    
                                            >
                                                {addMembership.loading ? <ProgressSpinner /> : 'Submit'}
                                            </StyledButton></FormButtonWrapper>
                                </div>
                            </FormModalContent>
                        </ModalInnerWrapperCustom>
                    </FormModalWrapper>
                     :(showSuccessModal ? <SuccessModalWrapper><SuccessModalInnerWrapper>
                        <CloseIcon alt = "" src="/react/images/icn-close.svg" onClick={() => onContinue()} />
                       <CheckIcon alt = "" src = "/react/images/icn-green-tick.svg"/>
                       <SuccessMsg>Your Membership has been added successfully!</SuccessMsg>
                       <Continue onClick = {() => onContinue()} >Continue</Continue>
                       </SuccessModalInnerWrapper></SuccessModalWrapper> : null )}
        </div>
    )
}

const SpinnerRotate = keyframes`
  from {transform: rotate(0deg);}
  to {transform: rotate(360deg);}
`;

const ProgressSpinner = styled.div`
  text-align: center;
  border: .2rem solid grey;
  border-top: .2rem solid white;
  border-radius: 50%;
  height: 20px;
  width: 20px;
  margin:auto;
  animation-name: ${SpinnerRotate};
  animation-duration: 2s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
`;

const FormModalWrapper = styled(ModalWrapper)`
    transition: opacity 300ms ease-in-out;
    opacity: ${props => props.visible ? "1" : "0"};
`

const ModalInnerWrapperCustom = styled(ModalInnerWrapper)`
    
`;

const FormModalContent = styled(ModalContent)`
    transition: opacity 300ms ease-in-out;
    margin-top:50px;
`;

const Header = styled.div`
    font-size: 18px;
    font-weight: 400;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.6;
    letter-spacing: normal;
    color: #003863;
    margin-top: 15px;
    text-align:left;
`;

const SubHeader = styled.h3`
    margin: 16px 0;
    font-family: "museo-sans", san-serif;
    font-size: 16px;
    font-weight:300px;
    font-stretch: normal;
    font-style: normal;
    line-height: 24px;
    letter-spacing: normal;
    color: #474b55;
    text-align:left;
`;

const InfoIcon = styled.img`
    position:absolute;
    right: 15px;
    top: 13px;
`;

const FormGrid = styled.div`
    display: grid;
    grid-template-columns: 100%;
    grid-row-gap: 16px;
    margin-top:8px
`;

const InputWrapper = styled.div` 
	position:relative;
`;

const InputErrorMsg = styled.div`
    font-size: 12px;
    font-weight: 300;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.33;
    letter-spacing: normal;
    color: #AD122A;
    padding-top: 4px;
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
    color: ${props => props.error ? "#ad122a" :  "#474b55"};
    padding: 8px 16px;
    border-radius: 4px;
    border: solid 1px #a8abac;
    border-color: ${props => props.error && "#ad122a"};
		margin-bottom: 8px;
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
`;

const MemberIdInput = styled.div`
    position:relative;
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

const AdditionalInfo = styled.div`
font-style: normal;
font-weight: 400;
font-size: 14px;
line-height: 18px;
color: #474B55;
`;

const AddAccountBtn = styled.button`
    font-size: 14px;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.14;
    letter-spacing: normal;
    border-radius: 4px;
    border: solid 0px;
    height: 40px;
    text-align: center;
    width: 100%;
    padding: 8px 16px;
    background-color: #3e7128;
    color: #ffffff;
    margin: 20px auto;
    &:hover {
        cursor:pointer;
    }
    &:disabled {
        cursor:auto;
        background-color: grey;
    }
`;

const SpinnerBackground = styled.div`
    background-color: #3e7128;
    border-radius: 4px;
    border: solid 0px;
    height: 40px;
    width: 100%;
    padding-top:5px;
    margin-top: 20px;
`;

const Toastr = styled.div`
    position: fixed;
    background-color:${props => props.error ? '#ad122a' : '#3e7128'} ;
    top: 45px;
    left: 50%;
    transform:translate(-50%,-50%);
    display:${props => props.open ? 'flex' : 'none'};
    flex-direction:row;
`;

const ToastrIconBox = styled.div`
    display:flex;
    flex-direction:column;
    width:40px;
    height:64px;
    background-color:${props => props.error ? '#8d0016' : '#36502a'} ;
    align-items: center;
    justify-content: center;
`
const ToastrIcon = styled.img`
    display:flex;
    flex-direction:column;
    width:16px;
    height:16px;
`
const ToastrInfo = styled.div`
    display:flex;
    flex-direction:row;
    width:400px;
    padding-left: 20px;
    height:64px;
    align-items: center;
    justify-content: space-around;
`
const ToastrCloseIcon = styled.img`
    width: 16px;
    height: 16px;
    object-fit: contain;
    &:hover {
        cursor: pointer;
    }
    margin-right: 6px;
`;
const ToastrText = styled.div`
    font-size: 14px;
    font-weight: 500; 
    line-height: 1.29; 
    color:white;
    width: 276px;
`;

const ContactTxt = styled.a`
    font-weight:bold;
    color:white;
`;

const MemberIdImg = styled.img`
    position: absolute;
    bottom: 125%;
    left: 41%;
    @media only screen and (max-width: 414px) {
        left: 25%;
    };
`;

const FormButtonWrapper = styled(ButtonWrapper)`
  margin-top: 2rem;
  margin-bottom: 0rem;
  display: flex;
 justify-content: end;
  @media only screen and (max-width: 768px) {
	width:100%;
    display:flex;
	flex-direction:column-reverse;
    gap:8px;
    >button{
        width:100%;
        margin:0
    }
}
`;

const Spacer = styled.div`
width:20px;
`;

const StyledButton = styled.button`
height: 40px;
border-radius: 4px;
padding:8px 16px;
white-space: nowrap;
width:92px;
background-color: ${({ variant }) => variant === "primary" ? '#3e7128' : '#ffffff' };
font-family: "museo-sans";
  font-size: 18px;
  font-weight:  ${({ variant }) => variant === "primary" ? '600' : '400' };
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: -0.08px;
  text-align: center;
  border:${({ variant }) =>variant === 'secondary' ? `1px solid #3e7128` : '0px'};
  color: ${({ variant }) => variant === "primary" ? '#ffffff' : '#3e7128' };
  &:hover {
    cursor:pointer;
    background-color: ${({ variant }) => variant === "primary" ? '#517f3d' : '#3e71280d'};
  }
`;

const CheckIcon = styled.img`
  width: 73px;
  height: 73px;
  flex-grow: 0;
  margin: 31px auto 0px;
  object-fit: contain;
`;

const SuccessMsg = styled.div`
    font-style: normal;
    font-weight: 600;
    font-size: 24px;
    line-height: 32px;
    text-align: center;
    color: #003863;
    margin-top: 23px;
`;

const Continue = styled.div`
    margin-top: 48px;
    text-align: center;
    font-size: 18px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.14;
    letter-spacing: normal;
    border-radius: 4px;
    border: solid 0px;
    width: 113px;
    margin: 48px auto 0px;
    padding: 8px 16px;
    background-color: #3e7128;
    color: #ffffff;
    &:hover{
    cursor:pointer;
    }
`;

const SuccessModalWrapper = styled(ModalWrapper)`
transition: opacity 300ms ease-in-out;
background: rgba(0, 42, 74, 0.72);
`;

const SuccessModalInnerWrapper = styled(ModalInnerWrapper)`
background: white;
max-width: 440px;
height: auto;
padding: 24px;

@media only screen  and (max-width: 480px) {
    width: 344px;
    height: auto;
}
`;



export default AddMembershipModal;