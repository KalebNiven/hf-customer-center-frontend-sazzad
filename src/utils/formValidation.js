const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
//const VALID_NAME_REGEX = /^[a-zA-Z]+$/;
const VALID_NAME_REGEX = /\d+/;
const VALID_MOBILE_NUMBER_REGEX = /^[0-9 ,-]+$/;

export const emailIsValid = (email) => {
  return EMAIL_REGEX.test(email);
};

export const nameisValid = (name) => {
  return VALID_NAME_REGEX.test(name);
};

export const mobileNumberIsValid = (mobileNumber) => {
  return VALID_MOBILE_NUMBER_REGEX.test(mobileNumber);
};

//This method would be used for separating numbers by Hyphen (Copy Paste scenario)
export const patternSeparation = (value, pattern) => {
  var i = 0;
  phone = value.toString();
  return pattern.replace(/#/g, (_) => phone[i++]);
};

//dateOfBirth: string 'MM/YY'
export const dobIsValid = (dateOfBirth) => {
  let month = parseInt(dateOfBirth.split("/")[0]);
  let day = parseInt(dateOfBirth.split("/")[1]);
  if (month > 12 || month < 1) return false;
  switch (month) {
    case 2:
      if (day > 29) {
        return false;
      }
      break;
    case 4:
    case 6:
    case 9:
    case 11:
      if (day > 30) {
        return false;
      }
      break;
    default:
      if (day > 31) {
        return false;
      }
      break;
  }
  return true;
};

export const passwordIsValid = (value) => {
  return (
    /[A-Z]/.test(value) && // has a uppercase letter
    /^(?=.{9,})/.test(value) && // has 9 digits
    /[a-z]/.test(value) && // has a lowercase letter
    /\d/.test(value) && // has a digit
    /[!@#$%^&*]/.test(value)
  ); // has an allowed special character
};
