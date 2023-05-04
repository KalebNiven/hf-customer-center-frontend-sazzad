import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled, { keyframes } from "styled-components";
import { OverlayTrigger, Popover } from "react-bootstrap";
import { getUserName, requestChangeUsername, requestChangePassword, settingsResetMessage } from "../../store/actions/index";
import {
  RightHeader, SubHeader, Card, Title, Text, RowBlock, UserName, EditButton, EditImg, ButtonTxt, Label, TextBox, UserImg,
  InputBox, ButtonRow, CancelButton, ChangeButton, DisabledButton, Pop, PassPopover, PasswordText, PasswordRules, ProgressWrapper,
  SpinnerRotate, ProgressSpinner, ErrorLabel
} from './Styled';
import Toaster from "../common/toaster";
import {AnalyticsPage, AnalyticsTrack } from "../../components/common/segment/analytics";
import { ANALYTICS_TRACK_TYPE, ANALYTICS_TRACK_CATEGORY } from "../../constants/segment";
const LoginSecurity = () => {

  const [editUserName, setEditUserName] = useState(false);
  const [editPassword, setEditPassword] = useState(false);
  const [showPopover, setShowPopover] = useState(false);
  const [userName, setUserName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currPassError, setCurrPassError] = useState(null);
  const [newPassError, setNewPassError] = useState(null);
  const [confirmPassError, setConfirmPassError] = useState(null);
  const [toaster, setToastr] = useState({
    open: false,
    message: '',
    type: ''
  });
  const dispatch = useDispatch();
  const settingsData = useSelector(state => state.settingsReducer);
  const loadingUsername = useSelector((state) => state.settingsReducer.loadingUsername);
  const loadingPassword = useSelector((state) => state.settingsReducer.loadingPassword);
  const customerInfo = useSelector((state) => state.customerInfo);

  useEffect(() => {
    const { loadingPassword, loadingUsername, passwordError, passwordSuccess, userNameError, userNameSuccess } = settingsData;
    const toasterCopy = { ...toaster }
    const currentMsg = [passwordError, passwordSuccess, userNameError, userNameSuccess].find(x => x && x.length > 0)

    if (!loadingUsername && !loadingPassword && currentMsg) {
      toasterCopy.open = true
      toasterCopy.message = currentMsg
      toasterCopy.type = currentMsg.includes('success') ? 'success' : 'error'
    }
    setToastr(toasterCopy)
    if (currentMsg) dispatch(settingsResetMessage());
  }, [settingsData])

  useEffect(() => {
    dispatch(getUserName());
  }, []);

  useEffect(() => {
    editPassword && validateCurrentPass();
  }, [currentPassword]);

  useEffect(() => {
    editPassword && validateNewPass();
  }, [newPassword]);

  useEffect(() => {
    editPassword && validateConfirmPass();
  }, [confirmPassword]);

  const toggleEditUserName = () => {
    setEditUserName(!editUserName);
  }

  const toggleEditPassword = () => {
    setEditPassword(!editPassword);
    setCurrPassError(null);
    setNewPassError(null);
    setConfirmPassError(null);
  }

  const handleUserNameChg = (label) => {
    handleSegmentBtn(label)
    if (userNameValidation()) {
      toggleEditUserName();
      dispatch(requestChangeUsername({ username: userName }, customerInfo?.data?.csrf ));
      setUserName('');
    }
    else {
      const toasterCopy = { ...toaster }
      toasterCopy.open = true
      toasterCopy.message = "Invalid username. Please enter at least 3 characters"
      toasterCopy.type = 'error'
      setToastr(toasterCopy)
      loadingUsername = false
    }
  }
  const userNameValidation = () => {
    if (userName.length >= 3) {
      return true;
    } else {
      return false;
    }
  }

  const handleSegmentBtn = (label) => { 


    AnalyticsTrack(
      label + " " + "link clicked",
      customerInfo,
      {
        "raw_text": label,
        "destination_url": window.location.pathname,
        "description": label,
        "category": ANALYTICS_TRACK_CATEGORY.LoginSecurity,
        "type": ANALYTICS_TRACK_TYPE.buttonClicked,
        "targetMemberId": customerInfo?.data?.memberId,
        "location": {
          "desktop": {
            "width": 960,
            "value": "left"
          },
          "tablet": {
            "width": 768,
            "value": "right"
          },
          "mobile": {
            "width": 0,
            "value": "right"
          }
        }
      }
    );
   

  }
  const handlePasswordChg = () => {
    handleSegmentBtn('Change Password')
    toggleEditPassword();
    dispatch(requestChangePassword({ oldPassword: currentPassword, password: newPassword, password_confirmation: confirmPassword }, customerInfo?.data?.csrf ));
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  }

  const handleUserNameCancel = () => {
    toggleEditUserName();
    setUserName('');
  }

  const handlePasswordCancel = () => {
    toggleEditPassword();
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setCurrPassError(null);
    setNewPassError(null);
    setConfirmPassError(null);
    setShowPopover(false);
  }

  const popoverTop = (
    <PassPopover>
      <PasswordText noStyle>
        <PasswordRules>Must Contain:</PasswordRules>
      </PasswordText>
      <PasswordText>
        <PasswordRules>At least 9 characters</PasswordRules>
        <PasswordRules>1 upper case letter</PasswordRules>
        <PasswordRules>1 lower case letter</PasswordRules>
        <PasswordRules>1 number</PasswordRules>
        <PasswordRules>1 special character </PasswordRules>
        <PasswordRules>Should NOT contain part of your username, first, or last name</PasswordRules>
      </PasswordText>
    </PassPopover>

  );

  const validateCurrentPass = () => {
    if (currentPassword === "" || currentPassword === null)
      setCurrPassError("Please enter current password.");
  }

  const validateNewPass = () => {

    const charsValid = new RegExp("^(?=.{9,})");
    if (!charsValid.test(newPassword)) {
      setNewPassError("Please enter at least 9 characters.");
      setShowPopover(true);
      return;
    }

    const validator = /[A-Z]/.test(newPassword) // has a uppercase letter
      && /[a-z]/.test(newPassword) // has a lowercase letter
      && /\d/.test(newPassword)    // has a digit
      && /[!@#$%^&*]/.test(newPassword)   // has an allowed special character

    if (!validator) {
      setNewPassError("Password does not meet minimum requirements.");
      setShowPopover(true);
    }
    else {
      setNewPassError('');
      if (newPassword && confirmPassword && newPassword !== confirmPassword) {
        setNewPassError("Passwords do not match. Please try again.");
        setConfirmPassError("Passwords do not match. Please try again.");
      }
    }
  }

  const validateConfirmPass = () => {
    if (confirmPassword === "" || confirmPassword === null)
      setConfirmPassError("Please enter confirm password.");
    else {
      if (newPassword !== confirmPassword) {
        setNewPassError("Passwords do not match. Please try again.");
        setConfirmPassError("Passwords do not match. Please try again.");
      }
      else {
        validateNewPass();
        setConfirmPassError('');
      }
    }
  }

  const handleCurrentPassword = (value) => {
    value && setCurrPassError('');
    setCurrentPassword(value);
  }

  const handleNewPassword = (value) => {
    if (value) {
      setNewPassError('');
      setShowPopover(false);
    }
    setNewPassword(value);
  }

  const handleConfirmPassword = (value) => {
    value && setConfirmPassError('');
    setConfirmPassword(value);
  }

  const handleUserNameInputChange = (e) => {
    const value = e.target.value;
    if (/^[\w\._@]+$/.test(value) || value.length === 0) setUserName(value.trim())
    // setUserName(value)
  }

  const toasterCopy = { ...toaster }
  return (
    <>
      {
        toasterCopy.open && (
          <Toaster unmountMe={() => {
            toasterCopy.open = false;
            setToastr(toasterCopy)
          }} timeout={5000} notificationText={toasterCopy.message} notificationType={toasterCopy.type} />
        )
      }

      <RightHeader>Login & Security</RightHeader>
      <SubHeader>Manage the username and password for your Healthfirst Account.</SubHeader>
      <Card>
        <Title>{editUserName ? 'Change Username' : 'Username'}</Title>
        <Text>This will be used to login to your account.</Text>
        {
          !loadingUsername ?
            editUserName ?
              <>
                <Label>Username</Label>
                <TextBox>
                  <UserImg alt = "" src="/img/other/ico-account.svg" />
                  <InputBox value={userName} onChange={handleUserNameInputChange}
                    placeholder={settingsData.userName} />
                </TextBox>
                <ButtonRow>
                  {
                    userName ?
                      <ChangeButton onClick={() => handleUserNameChg("Change Username")}>Change Username</ChangeButton>
                      :
                      <DisabledButton>Change Username</DisabledButton>
                  }
                  <CancelButton onClick={handleUserNameCancel}>Cancel</CancelButton>
                </ButtonRow>
              </>
              :
              <RowBlock>
                <UserName>{settingsData.userName}</UserName>
                <EditButton onClick={toggleEditUserName}>
                  <EditImg src="/img/other/ico-pencil.svg" />
                  <ButtonTxt>Edit</ButtonTxt>
                </EditButton>
              </RowBlock>
            :
            <ProgressWrapper>
              <ProgressSpinner />
            </ProgressWrapper>
        }
      </Card>
      <Card>
        <Title>{editPassword ? 'Change Password' : 'Password'}</Title>
        <Text>This will be used to login to your account.</Text>
        {
          !loadingPassword ?
            editPassword ?
              <>
                <Label>Current Password</Label>
                <TextBox error={currPassError}>
                  <UserImg alt = "" src={currPassError ? "/img/other/ico-lock-red.svg" : "/img/other/ico-lock.svg"} />
                  <InputBox type="password" value={currentPassword} onChange={(e) => handleCurrentPassword(e.target.value)}
                    onBlur={validateCurrentPass} placeholder="Enter Current Password" error={currPassError} />
                </TextBox>
                {currPassError && <ErrorLabel>{currPassError}</ErrorLabel>}

                <Label space>New Password</Label>
                <TextBox error={newPassError}>
                  <UserImg alt = "" src={newPassError ? "/img/other/ico-lock-red.svg" : "/img/other/ico-lock.svg"} />
                  <InputBox type="password" value={newPassword} onChange={(e) => handleNewPassword(e.target.value)}
                    onBlur={validateNewPass} placeholder="Enter New Password" error={newPassError} />
                  <OverlayTrigger show={showPopover} placement="top-end" overlay={popoverTop}>
                    <UserImg onMouseEnter={() => setShowPopover(true)} onMouseLeave={() => setShowPopover(false)}
                    alt = ""  src={showPopover ? "/img/other/ico-info-blue.svg" : "/img/gray/ico-info.svg"} width />
                  </OverlayTrigger>
                </TextBox>
                {newPassError && <ErrorLabel>{newPassError}</ErrorLabel>}

                <Label space>Confirm New Password</Label>
                <TextBox error={confirmPassError}>
                  <UserImg alt = "" src={confirmPassError ? "/img/other/ico-lock-red.svg" : "/img/other/ico-lock.svg"} />
                  <InputBox type="password" value={confirmPassword} onChange={(e) => handleConfirmPassword(e.target.value)}
                    onBlur={validateConfirmPass} placeholder="Confirm New Password" error={confirmPassError} />
                </TextBox>
                {confirmPassError && <ErrorLabel>{confirmPassError}</ErrorLabel>}

                <ButtonRow>
                  {
                    currPassError === '' && newPassError === '' && confirmPassError === '' ?
                      <ChangeButton onClick={handlePasswordChg}>Change Password</ChangeButton>
                      :
                      <DisabledButton>Change Password</DisabledButton>
                  }
                  <CancelButton onClick={handlePasswordCancel}>Cancel</CancelButton>
                </ButtonRow>
              </>
              :
              <RowBlock>
                <UserName>**********</UserName>
                <EditButton onClick={toggleEditPassword}>
                  <EditImg src="/img/other/ico-pencil.svg" />
                  <ButtonTxt>Edit</ButtonTxt>
                </EditButton>
              </RowBlock>
            :
            <ProgressWrapper>
              <ProgressSpinner />
            </ProgressWrapper>
        }
      </Card>
    </>
  )
}

export default LoginSecurity;

