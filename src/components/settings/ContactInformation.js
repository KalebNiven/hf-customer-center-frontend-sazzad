import React, { useEffect, useState } from 'react';
import {
	RightHeader, SubHeader, Card, Title, Text, RowBlock, UserName, EditButton, EditImg, ButtonTxt, Label, TextBox, UserImg,
	InputBox, ButtonRow, CancelButton, ChangeButton, DisabledButton, Pop, PassPopover, PasswordText, PasswordRules, ProgressWrapper,
	SpinnerRotate, ProgressSpinner, ErrorLabel
} from './Styled';
import { useSelector, useDispatch } from "react-redux";
import { requestCustomerInfo, requestContactEmailInfo, requestContactPhoneInfo } from '../../store/actions/index';
import styled from 'styled-components';
import {
	ModalWrapper, ModalInnerWrapper, ModalContent, Header, CloseIcon,
	Button, ButtonWrapper
} from "../../styles/commonStyles";
import { useAppContext } from '../../AppContext'
import { StyledButton } from '../common/styles';
import DropdownSelect from "../common/dropdownSelect";
import * as CONSTANTS from '../../constants/common';
import Toaster from '../common/toaster';
import { verifyContactInfo, resendCodeContactInfo, verifyPhoneContactInfo, verifyEmailContactInfo } from '../../store/saga/apis';
const ContactInformation = () => {
	const customerInfo = useSelector(state => state.customerInfo.data)
	const submitContactInfoPayload = useSelector(state => state.submitContactInfoPayload)
	const [loadingSpinner, setLoadingSpinner] = useState(false);
	const [loadingSpinnerSave, setLoadingSpinnerSave] = useState(false);
	const [emailAddressEditing, setEmailAddressEditing] = useState(false);
	const [emailAddressVerifying, setEmailAddressVerifying] = useState(false);
	const [phoneVerifying, setPhoneVerifying] = useState(false);
	const [phoneEditing, setPhoneEditing] = useState(false);
	const [emailError, setEmailError] = useState('');
	const [verificationModalData, setVerificationModalData] = useState(false);
	const [emailAddress, setEmailAddress] = useState(customerInfo?.email);
	const [currentModal, setCurrentModal] = useState('');
	const { toastOpen, setToastOpen } = useAppContext()
	const { toastState, setToastState } = useAppContext()
	const [phoneNumber, setPhoneNumber] = useState({
		value: '',
		type: CONSTANTS.PhoneTypeValues[0]?.value,
		error: null
	})
	const [phoneNumberHashed, setPhoneNumberHashed] = useState('');
	const [verificationCode, setVerificationCode] = useState('');
	const [toastrPop, setToastrPop] = useState({
		toastrOpen: false,
		toastrState: '',
		toastrMsg: ''
	})
	const [toastrPopInit, setToastrPopInit] = useState({
		toastrOpen: false,
		toastrState: '',
		toastrMsg: ''
	})
	const [resendCodeState, setResendCodeState] = useState(false);
	const [resendVerificationCodeRes, setResendVerificationCodeRes] = useState({})
	const [postVerifyError, setPostVerifyError] = useState({
		error: false,
		message: ''
	})

	useEffect(() => {
		if (window.localStorage.getItem("contactInfoNavIndex") !== null) {
			window.localStorage.removeItem("contactInfoNavIndex")
		}
	}, [])

	const dispatch = useDispatch();
	useEffect(() => {
		const { loading, error, submitEmailDetails, submitPhoneDetails } = submitContactInfoPayload;
		setLoadingSpinnerSave(loading);
		if (!loading && error === '' && (submitEmailDetails || submitPhoneDetails)) {

			if (emailAddressEditing || emailAddressVerifying) {
				setVerificationModalData(emailAddress)
			}
			else if (phoneEditing || phoneVerifying) {
				setVerificationModalData(phoneNumberHashed)
			}
		}
		if (error !== '') {
			emailAddressEditing ? setEmailError(error) : setPhoneNumber(() => ({ ...phoneNumber, error: error }))
		}
	}, [submitContactInfoPayload])
	useEffect(() => {
		const toastrPopCopy = { ...toastrPop }


		setTimeout(() => {
			toastrPopCopy.toastrOpen = false
			setToastrPop(toastrPopCopy);
		}, 5000);
	}, [toastrPop])
	useEffect(() => {
		if (verificationModalData) {
			setTimeout(() => {
				setResendCodeState(true)
			}, 30000)
		}
		else {
			setResendCodeState(false)
		}
	}, [verificationModalData, resendVerificationCodeRes])
	useEffect(() => {
		const phoneNumberCopy = { ...phoneNumber }
		setEmailAddress(customerInfo?.email)
		setPhoneNumberHashed(getHashedPhoneNum(customerInfo?.mobilePhone))
		setPhoneNumber({
			...phoneNumberCopy,
			value: customerInfo?.mobilePhone
		})

	}, [customerInfo])



	const validateEmail = () => {
		if (emailAddress === '') {
			setEmailError('An email address is required')
		}
		else if (emailAddress === customerInfo?.email && !emailAddressVerifying) {
			setEmailError('The email address is the same as the existing one. Please try again.')
		}
		else if (!/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(emailAddress)) {
			setEmailError('Please use the proper email format')
		}
		else {
			setEmailError('')
			setCurrentModal('email')
			dispatch(requestContactEmailInfo(emailAddress))
		}
	}

	const validatePhone = () => {

		if (!phoneNumber.value) {
			setPhoneNumber((phoneNumber) => ({ ...phoneNumber, error: 'A phone number is required' }))
		} else if (phoneNumber.value.length !== 10) {
			setPhoneNumber((phoneNumber) => ({ ...phoneNumber, error: 'Please use 10-digit number format' }))
		} else if (customerInfo?.mobilePhone === phoneNumber.value && !phoneVerifying) {
			setPhoneNumber((phoneNumber) => ({ ...phoneNumber, error: 'This phone number already exists' }))
		}
		else if (phoneNumber.value.match(/(\d)\1{9}/g)) {
			setPhoneNumber((phoneNumber) => ({ ...phoneNumber, error: 'Invalid Phone Number.' }))
		}
		else {
			setPhoneNumber(() => ({ ...phoneNumber, error: '' }))
			//setVerificationModalData(phoneNumberHashed)
			setCurrentModal('sms')
			dispatch(requestContactPhoneInfo(phoneNumber?.value))
		}
	}
	const verifyApi = async () => {
		const payload = {
			verificationCode,
			channelType: currentModal
		}
		const toastrPopCopy = { ...toastrPop }
		setLoadingSpinner(true)
		const postVerifyErrorCopy = { ...postVerifyError }
		await verifyContactInfo(payload).then((res) => {	
			setLoadingSpinner(false);	
			if(res?.data?.status === "Failure"){
				postVerifyErrorCopy.error = true
				postVerifyErrorCopy.message = res.data.message
				setPostVerifyError(postVerifyErrorCopy)
			} else {
			toastrPopCopy.toastrMsg = res.message
			toastrPopCopy.toastrState = res.status
			toastrPopCopy.toastrOpen = true
			setVerificationModalData(false)
			setToastOpen(true)
			setToastState(res.message)
			setToastrPop(toastrPopCopy)
			setVerificationCode('')
			postVerifyErrorCopy.error = false;
			postVerifyErrorCopy.message = '';
			setPostVerifyError(postVerifyErrorCopy)
		}
		setEmailAddressEditing(false);
		setPhoneEditing(false)
		}).catch(err => {
			if (err.response) {
				setLoadingSpinner(false)
				postVerifyErrorCopy.error = true
				postVerifyErrorCopy.message = err.response.data.message
				setPostVerifyError(postVerifyErrorCopy)
				setLoadingSpinner(false);
				setEmailAddressEditing(false);
				setPhoneEditing(false);
			}
		})
	}
	const verifyEmailLink = async () => {
		const payload = {
			channelType: "email",
			email: emailAddress
		}

		setEmailAddressVerifying(true)
		await verifyEmailContactInfo(payload, true).then(res => {
			setVerificationModalData(emailAddress)
			setCurrentModal('email')
		}).catch(err => console.log(err)).finally(() => {
			setEmailAddressVerifying(false);
		})
	}
	const verifyPhoneLink = async () => {
		const payload = {
			channelType: "sms",
			phone: phoneNumber?.value
		}
		setPhoneVerifying(true);
		await verifyPhoneContactInfo(payload, true).then(res => {
			setVerificationModalData(phoneNumberHashed)
			setCurrentModal('sms')
		}).catch(err => {
			console.log(err)
		}).finally(() => {
			setPhoneVerifying(false);
		})
	}
	const resendVerificationCode = async () => {
		const payload = {
			channelType: currentModal
		}
		const responseData = await resendCodeContactInfo(payload, customerInfo.csrf).then(res => {
			setResendVerificationCodeRes(responseData)
		}).catch(err => console.log(err))


	}
	const verificationModal = () => {
		return (
			<FormModalWrapper visible={verificationModalData}>
				<ModalInnerWrapperCustom>
					<FormModalContent>
						<CloseIcon src="/react/images/icn-close.svg" onClick={() => setVerificationModalData(false)} />
						<>
							<HeaderCustom>
								Enter Verification Code
							</HeaderCustom>
							<SubHeaderCustom>A verification code has been sent to: <SubHeaderBold>{verificationModalData}</SubHeaderBold>
							</SubHeaderCustom>
							<Label>Verification Code</Label>
							<TextBox error={postVerifyError.error}>

								<InputBox error={postVerifyError.error} type="number" value={verificationCode} onChange={(e) => {
									if (e.target.value.length <= 6) {
										setVerificationCode(e.target.value)
									}

								}}
									placeholder="Code (6 digits)"
								/>
							</TextBox>
							<Tip
								emailErrorCheck={postVerifyError?.error}>{postVerifyError?.message} &nbsp;</Tip>

							<SendCodeText>Didn’t get the code? <LinkText resendCodeState={resendCodeState} onClick={() => {
								setResendCodeState(false);
								resendVerificationCode()
							}}>Send code again</LinkText></SendCodeText>
							<ContactUsext>If you are still unable to verify, <LinkText resendCodeState={true} onClick={() => window.open("https://healthfirst.org/contact", "_blank")}>please contact us</LinkText></ContactUsext>
							<FormButtonWrapper>
								<StyledButtonCustom onClick={() => {
									window.localStorage.setItem("contactInfoNavIndex", JSON.stringify("1"))
									const postVerifyErrorCopy = { ...postVerifyError }
									setVerificationCode('')
									setVerificationModalData(false)
									setEmailAddressEditing(false)
									setPhoneEditing(false)
									postVerifyErrorCopy.error = false;
									postVerifyErrorCopy.message = '';
									setPostVerifyError(postVerifyErrorCopy)
									dispatch(requestCustomerInfo());
								}} variant="secondary" >
									Cancel
								</StyledButtonCustom>
								<Spacer></Spacer>
								<StyledButtonCustomVerify variant={verificationCode.length < 6 ? "disabled" : "primary"} disabled={verificationCode.length < 6} onClick={() => {
									verifyApi()
								}}>
									{loadingSpinner ? <ProgressWrapperCustom><ProgressSpinnerCustomVerify /></ProgressWrapperCustom> : 'Verify and Save'}</StyledButtonCustomVerify>
							</FormButtonWrapper>
						</>
					</FormModalContent>
				</ModalInnerWrapperCustom>
			</FormModalWrapper>
		)
	}
	const handlePhoneNumberType = (value) => {
		const phoneNumberCopy = { ...phoneNumber }
		phoneNumberCopy.type = value
		setPhoneNumber(phoneNumberCopy)
	}
	const emailErrorCheck = emailError.length > 0 ? true : false;
	const phoneNumberCopy = { ...phoneNumber }
	const getHashedPhoneNum = (phoneNum) => {
		const hashedNum = phoneNum && phoneNum.length > 0 && phoneNum.split("").map((x, ind) => {
			if ([2, 5].some(index => index === ind)) {
				return `${x}-`
			}
			else {
				return x
			}
		})
		return hashedNum && hashedNum.length > 0 ? hashedNum.join("") : ''
	}
	const { toastrOpen, toastrState, toastrMsg } = toastrPop;
	const { emailStatus, phoneStatus } = customerInfo;
	return (
		<>

			{toastOpen === true &&
				<>
					<Toaster
						unmountMe={() => {
							window.localStorage.setItem("contactInfoNavIndex", JSON.stringify("1"))
							setToastOpen(false)
							setToastState("")
							dispatch(requestCustomerInfo())
						}}
						timeout={5000}
						notificationText={toastState}
						notificationType={"success"}
					/>
				</>}
			{verificationModalData && verificationModal()}
			<RightHeader>Personal Information</RightHeader>
			<SubHeader>Control what information and methods Healthfirst will use to contact you.</SubHeader>
			<Card>
				<Title>Email Address</Title>
				<Text>This will be the email address we will use to contact you.</Text>
				{
					emailAddressEditing ?
						<>
							<Label>Email Address</Label>
							<TextBox error={emailErrorCheck} >
								<InputBox error={emailErrorCheck} value={emailAddress} onChange={(e) => setEmailAddress(e.target.value)}
								/>
								<UserImg alt = "sd" src="/react/images/Close.svg" onClick={() => setEmailAddress('')} />
							</TextBox>
							<Tip emailErrorCheck={emailErrorCheck}>{emailErrorCheck ? emailError : 'Your email address must be verified before the change takes effect.'}</Tip>
							<FormButtonWrapper>


								<StyledButtonCustom onClick={() => {
									setEmailError('')
									setPhoneEditing(false)
									setEmailAddressEditing(!emailAddressEditing)
									setEmailAddress(customerInfo.email)
									setEmailError('')

								}} variant="secondary" >
									Cancel
								</StyledButtonCustom>
								<Spacer></Spacer>
								<StyledButtonCustomSave variant={"primary"} onClick={validateEmail}>
									{loadingSpinnerSave ? <ProgressWrapperCustomSave><ProgressSpinnerCustom /></ProgressWrapperCustomSave> : 'Save'}</StyledButtonCustomSave>
							</FormButtonWrapper>
						</>
						: (
							<EmailReadFlex>
								<PhoneReadFlexFirstCol>
									<UserNameAutoWidth>{customerInfo.email}</UserNameAutoWidth>
								</PhoneReadFlexFirstCol>
								<EmailReadFlexColVerify>
									{/* <SubTitle></SubTitle> */}
									<RowBlockVerify>
										<UserImg alt = "" src={emailStatus ? "/react/images/Checkmark-Circle.svg" : "/react/images/Unverified.svg"} />
										<VerfiedLabel alt = "" emailStatus={emailStatus}>{emailStatus ? 'Verified' : 'Unverified'}</VerfiedLabel>
									</RowBlockVerify>
								</EmailReadFlexColVerify>

								{!emailStatus && <FlexColUnverified>
									{/* <SubTitle></SubTitle> */}
									<RowBlockVerify>
										{emailAddressVerifying ? <ProgressWrapperCustomSave><ProgressSpinnerCustom /></ProgressWrapperCustomSave> :
											<><UserImg alt = "" src={"/react/images/Verify-circle.svg"} />
												<VerifyLink onClick={() => {

													verifyEmailLink();
												}}>{'Verify'}</VerifyLink></>}
									</RowBlockVerify>
								</FlexColUnverified>}
								<PhoneReadFlexCol ml="auto">
									<EditButton onClick={() => {
										setPhoneEditing(false)
										setEmailAddressEditing(!emailAddressEditing)
									}}>
										<EditImg src="/react/images/other/ico-pencil.svg" />
										<ButtonTxt>Edit</ButtonTxt>
									</EditButton>
								</PhoneReadFlexCol>

							</EmailReadFlex>
						)
				}

			</Card>
			<Card>
				<Title>Phone Numbers</Title>
				<Text>In case we need to contact you via phone or text, please make sure your number(s) are up to date.</Text>
				{
					phoneEditing ?
						<>
							<SubTitle>Primary Phone Number</SubTitle>
							<RowBlockCustom >
								<ColBlockPhoneType>
									<Label>Phone Type</Label>
									<InputCustom>Mobile</InputCustom>
								</ColBlockPhoneType>
								<ColBlockPhoneNumber>
									<Label>Phone Number</Label>
									<TextBox error={phoneNumber.error}>
										<InputBox value={phoneNumberHashed} error={phoneNumber.error}
											onChange={(e) => {
												let currentValue = e.target.value.replaceAll('-', '');


												if (currentValue && !currentValue.match(/^[0-9]+$/)) return;
												const length = currentValue.length
												if (length <= 10) {
													setPhoneNumber({
														...phoneNumberCopy,
														value: currentValue
													})
													const first = currentValue.substring(0, 3)
													const middle = currentValue.substring(3, 6)
													const last = currentValue.substring(6, 10)
													if (length > 6) {
														currentValue = `${first}-${middle}-${last}`
													} else if (length > 3) {
														currentValue = `${first}-${middle}`
													} else {
														currentValue = first
													}
													setPhoneNumberHashed(currentValue)
												}

											}}
										/>

										<UserImg alt = "" src="/react/images/Close.svg" onClick={() => {
											setPhoneNumber({
												...phoneNumberCopy,
												value: ''
											})
											setPhoneNumberHashed('')
										}} />
									</TextBox>
									<Tip emailErrorCheck={phoneNumber.error}>{phoneNumber.error}</Tip>
								</ColBlockPhoneNumber>
							</RowBlockCustom>
							<FormButtonWrapper><StyledButtonCustom onClick={() => {
								setEmailAddressEditing(false)
								setPhoneEditing(!phoneEditing)
								setPhoneNumber({
									...phoneNumberCopy,
									value: customerInfo?.mobilePhone,
									error: ''
								})
								setPhoneNumberHashed(getHashedPhoneNum(customerInfo?.mobilePhone))
							}} variant="secondary" >
								Cancel
							</StyledButtonCustom><Spacer></Spacer>
								<StyledButtonCustomSave variant={"primary"} onClick={validatePhone}>
									{loadingSpinnerSave ? <ProgressWrapperCustomSave><ProgressSpinnerCustom /></ProgressWrapperCustomSave> : 'Save'}</StyledButtonCustomSave>
							</FormButtonWrapper>
						</>
						: (
							<PhoneReadFlex>
								<PhoneReadFlexFirstCol>
									<SubTitle>Primary Phone Number</SubTitle>
									<PhoneUserNameCustom>{customerInfo?.mobilePhone ? getHashedPhoneNum(customerInfo?.mobilePhone) : 'XXX-XXX-XXXX'}</PhoneUserNameCustom>
								</PhoneReadFlexFirstCol>
								<PhoneReadFlexColVerify>
									{/* <SubTitle></SubTitle> */}
									<PhoneRowBlockVerify phoneStatus={phoneStatus}>
										<UserImg alt = "" src={phoneStatus ? "/react/images/Checkmark-Circle.svg" : "/react/images/Unverified.svg"} />
										<VerfiedLabel alt = "" phoneStatus={phoneStatus}>{phoneStatus ? 'Verified' : 'Unverified'}</VerfiedLabel>
									</PhoneRowBlockVerify>
								</PhoneReadFlexColVerify>
								{!phoneStatus && <PhoneFlexColUnverified>
									{/* <SubTitle></SubTitle> */}
									<PhoneRowBlockVerify>
										{phoneVerifying ?
											<ProgressWrapperCustomSave><ProgressSpinnerCustom /></ProgressWrapperCustomSave> :
											(<><UserImgVerifyCircle alt = "" src={"/react/images/Verify-circle.svg"} />
												<VerifyLink onClick={() => {

													verifyPhoneLink();
												}}>{'Verify'}</VerifyLink></>)}
									</PhoneRowBlockVerify>
								</PhoneFlexColUnverified>}
								<PhoneReadFlexCol ml="auto">
									<EditButton onClick={() => {
										setEmailAddressEditing(false)
										setPhoneEditing(!phoneEditing)
										setPhoneNumberHashed(getHashedPhoneNum(customerInfo?.mobilePhone))
										setPhoneNumber({
											...phoneNumberCopy,
											value: customerInfo?.mobilePhone
										})
									}}>
										<EditImg src="/react/images/other/ico-pencil.svg" />
										<ButtonTxt>Edit</ButtonTxt>
									</EditButton>
								</PhoneReadFlexCol>
							</PhoneReadFlex>
						)

				}


			</Card>
		</>
	)
}
export default ContactInformation;
const ProgressWrapperCustomSave = styled(ProgressWrapper)`
width:100%;`
const ProgressWrapperCustom = styled(ProgressWrapper)`
width:160px;`
const ProgressSpinnerCustom = styled(ProgressSpinner)`
margin:auto;
height:20px;
width:20px;
`;

const ProgressSpinnerCustomVerify = styled(ProgressSpinner)`
margin:auto;
margin-left:60px;
height:20px;
width:20px;
@media only screen and (max-width: 768px) {
	//margin-left:130px;
	position:absolute;
	left:50%;
	margin-left:-10px;
	margin-top:-10px;
	
	magin-right:auto;
    
}
`;


const StyledButtonCustom = styled(StyledButton)`
width:auto;
`

const StyledButtonCustomVerify = styled(StyledButton)`
width:170px;

@media only screen and (max-width: 768px) {
	width:auto;
}
`
const StyledButtonCustomSave = styled(StyledButton)`
width:100px;
@media only screen and (max-width: 768px) {
	width:auto;
    
}
`

const UserImgVerifyCircle = styled(UserImg)`
margin: 2px 8px;
`

const VerfiedLabel = styled.span`
color:${({ emailStatus, phoneStatus }) => (emailStatus || phoneStatus) ? '#529535' : '#757575'};
font-size:14px;
line-height:1.33;
font-weight:bold;
`
const VerifyLink = styled.span`
color:#008bbf;
font-size: 14px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.14;
  letter-spacing: normal;
  cursor:pointer;
  margin-bottom:2px;
`
const ToastrIconBox = styled.div`
border-radius: 6px;
display:flex;
flex-direction:column;
padding: 0px 8px;
height:64px;
background-color:${({ toastrState }) => toastrState === 'Success' ? '#36502a' : '#ad122a'};
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
width:288px;
height:64px;
align-items: center;
    justify-content: space-around;
`
const ToastrCloseIcon = styled.img`
width: 16px;
  height: 16px;
  object-fit: contain;
  cursor:pointer;
  margin: 24px 16px;
`;
const ToastrText = styled.div`
font-size: 14px;
  font-weight: 500; 
  line-height: 1.29; 
color:white;
padding: 16px 12px;
`
const Toastr = styled.div`
border-radius: 6px;
    position: fixed;
    background-color: ${({ toastrState }) => toastrState === 'Success' ? '#3e7128' : '#ad122a'};
    top: 130px;
    left: 50%;
    transform:translate(-50%,-50%);
    display:${props => props.open ? 'flex' : 'none'};
    flex-direction:row;
`;
const HeaderCustom = styled(Header)`
@media only screen and (max-width: 600px) {
    padding-top:4px;
    font-size:20px;
    line-height: 1.6;
}
    
`;
const EmailReadFlex = styled.div`
    display:flex;
	align-items:center;
	align-self:center;
    flex-direction:row;
    justify-content: flex-start;
	margin-top:24px;
	@media only screen and (max-width: 600px) {
		flex-wrap:wrap; 
	};
`;
const PhoneReadFlex = styled.div`
    display:flex;
	align-items:center;
	align-self:center;
    flex-direction:row;
    padding-top:15px;
    justify-content: flex-start;
	@media only screen and (max-width: 600px) {
		flex-wrap:wrap; 
	};
`;
const UserNameAutoWidth = styled(UserName)`
	margin-top: 0px;
    width:auto;
`;
const UserNameCustom = styled(UserName)`
margin-top:8px;
@media only screen and (max-width: 600px) {
	align-self: flex-start;
};
`;
const PhoneUserNameCustom = styled(UserNameCustom)`
margin-top:8px;
padding-bottom: 9px;
@media only screen and (max-width: 600px) {
	align-self: flex-start;
	padding-bottom: 0px;
};
`;
const PhoneReadFlexCol = styled.div`
    display:flex;
	align-items:center;
	align-self:center;
    flex-direction:column;
	margin-left:${({ ml }) => ml ? ml : null};
	align-self: flex-end;
	@media only screen and (max-width: 600px) {
		margin-bottom:10px;
		
	};
`;
const PhoneReadFlexFirstCol = styled(PhoneReadFlexCol)`
    width:185px;
	display: flex;
	align-items:flex-start;
	align-self:center;
	@media only screen and (max-width: 600px) {
		width:75%
		
	};
`;
const EmailReadFlexColVerify = styled(PhoneReadFlexCol)`
justify-content:space-around;
display: flex;
align-items:center;
align-self:center;
margin-left: 65px;
margin-right: auto;
// margin-top: -40px;
@media only screen and (max-width: 600px) {
	order:3;
	margin:0 10px 0 0;
};
`
const PhoneReadFlexColVerify = styled(PhoneReadFlexCol)`
justify-content:space-around;
margin-left: 65px;
margin-right: auto;
@media only screen and (max-width: 600px) {
	order:3;
	margin:0 10px 0 0;
};
`
const FlexColUnverified = styled(PhoneReadFlexCol)`
justify-content:space-around;
display: flex;
align-items:center;
align-self:center;
margin-left: auto;
margin-right: 6px;
// margin-top: -40px;
@media only screen and (max-width: 600px) {
	order:4;
	margin:0;
};
`
const PhoneFlexColUnverified = styled(PhoneReadFlexCol)`
justify-content:space-around;
display: flex;
align-items:center;
align-self:flex-end;
margin-left: auto;
margin-right: 6px;
// margin-top: -40px;
@media only screen and (max-width: 600px) {
	order:4;
	margin:0;
};
`
const RowBlockCustom = styled(RowBlock)`
@media only screen and (max-width: 600px) {
    flex-direction:row;
};
`;
const RowBlockVerify = styled(RowBlockCustom)`
align-items:end;
padding-bottom:1px;
@media only screen and (max-width: 600px) {
    padding-bottom:0px;
};
`
const PhoneRowBlockVerify = styled(RowBlockVerify)`
padding-bottom:9px;
@media only screen and (max-width: 600px) {
    padding-bottom:${(phoneStatus) => phoneStatus ? '9px' : '0px'};
	width:90px;
};
`
const ColBlockPhoneType = styled(RowBlock)`
flex-direction:column;
flex:1;
margin-right:16px;
@media only screen and (max-width: 600px) {
    margin-right:0px;
};
`;

const ColBlockPhoneNumber = styled(RowBlock)`
flex-direction:column;
flex:2;
`;
const SubTitle = styled(Title)`
	width: 155px;
	height: 18px;
	flex-grow: 0;
	font-family: "museo-sans", san-serif;
	font-size: 14px;
	font-weight: bold;
	font-stretch: normal;
	font-style: normal;
	line-height: 1.29;
	letter-spacing: normal;
	text-align: left;
	color: var(--text-grey);
	padding-top:15px;
	padding-bottom:20px;
	@media only screen and (max-width: 600px) {
		align-self: flex-start;
	};
  
`;
const LinkText = styled.span`
color:${({ resendCodeState }) => resendCodeState ? '#3788bc' : 'gray'};
cursor:${({ resendCodeState }) => resendCodeState ? 'pointer' : 'not-allowed'};
font-weight:900;
`;
const SendCodeText = styled(Text)`
padding-top:10px;
`;
const ContactUsext = styled(Text)`
padding-top:11px;
margin-bottom:2.5rem;
`;
const Tip = styled(Text)`
line-height:16px;
font-size:12px;
font-weight:300;
color: ${({ emailErrorCheck }) => emailErrorCheck ? '#ad122a' : 'rgba(0, 0, 0, 0.6)'} ;
@media only screen and (max-width: 768px) {
    padding-bottom:12px;
};
`
const FormModalWrapper = styled(ModalWrapper)`
    transition: opacity 300ms ease-in-out;
    opacity: ${props => props.visible ? "1" : "0"};
`

const FormModalContent = styled(ModalContent)`
    transition: opacity 300ms ease-in-out;
    @media only screen and (max-width: 600px) {
        padding:16px;
    }
`
const ModalInnerWrapperCustom = styled(ModalInnerWrapper)`
height: 500px;
max-width:500px;
`;
const FormButtonWrapper = styled(ButtonWrapper)`
  margin-top: 16px;
  margin-bottom: 0rem;
  display: flex;
 justify-content: end;
  @media only screen and (max-width: 768px) {
	width:100%;
    display:flex;
	flex-direction:column-reverse;
    gap:8px;
    >button{
        margin:0
    }
}
`;
const Spacer = styled.div`
width:20px;
@media only screen and (max-width: 768px) {
    display:none;
};
`;
const SubHeaderCustom = styled(SubHeader)`
font-size:16px;
@media only screen and (max-width: 600px) {
    margin:0px;
}
`
const InputCustom = styled.div` {
    padding-top:8px;
    flex-grow: 1;
    font-family: "museo-sans", san-serif;
    font-size: 16px;
    font-weight: 300;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.5;
    letter-spacing: normal;
    text-align: left;
    color: var(--text-grey);
  }
  `
const SubHeaderBold = styled(SubHeader)`
font-weight:bold;
@media only screen and (max-width: 600px) {
    font-size:16px;
    margin:0px;
}
`;
