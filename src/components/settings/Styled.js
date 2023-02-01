
import styled, { keyframes } from "styled-components";
import { OverlayTrigger, Popover } from "react-bootstrap";

const RightHeader = styled.div`
  font-size: 24px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: normal;
  text-align: left;
  color: #003863;
  margin-top: 25px;

  @media only screen and (max-width: 767px) {
    margin: 25px 16px 0;
  }

`;

const SubHeader = styled.div`
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.43;
  letter-spacing: normal;
  text-align: left;
  color: #474b55;
  margin-top: 8px;
  margin-bottom: 25px;

  @media only screen and (max-width: 767px) {
    margin: 25px 16px 0;
  }
`;

const Card = styled.div`
  padding: 24px;
  border-radius: 4px;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
  margin: 15px 0;
  @media only screen and (max-width: 480px) {
    padding: 24px 16px;
  }
`;

const Title = styled.div`
  font-size: 18px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: normal;
  text-align: left;
  color: #003863;
`;

const Text = styled.div`
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.29;
  letter-spacing: normal;
  text-align: left;
  color: #474b55;
  margin-top: 5px;
`;

const RowBlock = styled.div`
  display: flex;
`;

const UserName = styled.div`
  font-size: 16px;
  font-weight: 300;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: normal;
  text-align: left;
  color: #474b55;
  margin-top: 24px;
  width: 90%;
`;

const EditButton = styled.button`
  height: 40px;
  justify-content: center;
  align-items: center;
  // margin-top: 16px;
  padding: 8px;
  border-radius: 8px;
  border: solid 1px #d8d8d8;
  background-color: #ffffff;
  width: 80px;
  display: flex;
  &:hover {
    background-color: rgb(242, 249, 252);
  }
  &:active {
    background-color: rgb(230, 244, 249);
  }
`;

const EditImg = styled.img`
  margin-right: 5px;
`;

const ButtonTxt = styled.div`
  font-size: 14px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.14;
  letter-spacing: normal;
  text-align: left;
  color: #008bbf;
`;

const Label = styled.div`
  font-size: 16px;
  font-weight: 300;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: normal;
  text-align: left;
  color: #474b55;
  margin: ${(props) => props.space ? '28px 0 4px' : '16px 0 4px'};
`;

const TextBox = styled.div`
  display:flex;
  padding: 8px 0 8px 10px;
  border-radius: 4px;
  border: ${(props) => props.error ? 'solid 1px #ad122a' : 'solid 1px #a8abac'};
`;
RightHeader,SubHeader,Card,Title,Text,RowBlock,UserName,EditButton,EditImg,ButtonTxt,Label,TextBox,UserImg,InputBox,ButtonRow
const UserImg = styled.img`
  width: ${(props) => props.width ? '30px' : '20px'};
  height: 20px;
  margin: 2px 8px 0 0;
`;

const InputBox = styled.input`
  font-size: 16px;
  font-weight: 300;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: normal;
  text-align: left;
  color: ${(props) => props.error ? '#ad122a' : '#474b55'};
  border: none;
  width: 100%;

  ::placeholder {
    color: #a8abac;
  }
  &[type=number]::-webkit-inner-spin-button, 
    &[type=number]::-webkit-outer-spin-button {  
        display: none;
    }
`;


const ButtonRow = styled.div`

  @media only screen and (min-width: 481px) {
    display: inline-block;
  }
  margin-top: 24px;
  width: 100%;
`;

const CancelButton = styled.button`
  padding: 8px 16px;
  border-radius: 4px;
  border: solid 1px #3e7128;
  background-color: #ffffff;
  color: #3e7128;
  font-size: 18px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: -0.08px;
  text-align: center;

  @media only screen and (max-width: 480px) {
    width: 100%;
    margin-top: 8px;
  }

  @media only screen and (min-width: 481px) {
    float: right;
    margin-left: 8px;
  }
`;

const ChangeButton = styled.button`
  padding: 8px 16px;
  border-radius: 4px;
  border: 1px solid #3e7128;
  background-color: #3e7128;
  color: #ffffff;
  float: right;
  font-size: 18px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: -0.08px;
  text-align: center;

  @media only screen and (max-width: 480px) {
    width: 100%;
  }

  @media only screen and (min-width: 481px) {
    float: right;
    margin-left: 8px;
  }
`;

const DisabledButton = styled.button`
  padding: 8px 16px;
  border-radius: 4px;
  background-color: #d8d8d8;
  color: #757575;
  float: right;
  font-size: 18px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: -0.08px;
  text-align: center;
  border: none;

  @media only screen and (max-width: 480px) {
    width: 100%;
  }

  @media only screen and (min-width: 481px) {
    float: right;
    margin-left: 8px;
  }
`;

const Pop = styled.div`
  background-color: #003863;
  color: white;
  position: relative;
  width: 262px;
  height: 100px;
  right: -385px;
  top: -10px;

  ::after {
    position: absolute;
    left: 225px;
    bottom: -5%;
    content: '';
    width: 10px;
    height: 10px;
    background: #003863;
    transform: rotate(45deg);
  }
`;
const PassPopover = styled(Popover)`
  background-color: #003863;
  color: white;
  right: -10px !important;
  padding: 8px;
  border-radius: 4px;
  box-shadow: 0 2px 8px 0 #d8d8d8;
  width: 230px;
  margin-bottom: 0;

  ::after {
    position: absolute;
    right: 18px;
    bottom: -3%;
    content: '';
    width: 10px;
    height: 10px;
    background: #003863;
    transform: rotate(45deg);
  }
`;

const PasswordText = styled.ul`
  list-style: ${(props) => props.noStyle ? 'none' : 'disc'};
  list-style-position: ${(props) => props.noStyle ? '' : 'outside'};
  margin-bottom: 0;
  margin-left: ${(props) => props.noStyle ? '0' : '1.5rem'};;
`;

const PasswordRules = styled.li`
  font-size: 12px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: normal;
  text-align: left;
`;

const ProgressWrapper = styled.div`
  width:100%;
`;

const SpinnerRotate = keyframes`
  from {transform: rotate(0deg);}
  to {transform: rotate(360deg);}
`;

const ProgressSpinner = styled.div`
  text-align: center;
  margin: auto;
  margin-top: 5em;
  margin-bottom: 5em;
  border: .25em solid  #b5b5b5;
  border-top: .25em solid #ffffff;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  animation-name: ${SpinnerRotate};
  animation-duration: 2s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
`;


const ErrorLabel = styled.label`
  font-size: 12px;
  font-weight: 300;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: 0.4px;
  text-align: left;
  color: #ad122a;
  margin: 0px;
  padding: 0px;
`;
export  {
    RightHeader, SubHeader, Card, Title, Text, RowBlock, UserName, EditButton, EditImg, ButtonTxt, Label, TextBox, UserImg,
    InputBox, ButtonRow, CancelButton, ChangeButton, DisabledButton, Pop, PassPopover, PasswordText, PasswordRules, ProgressWrapper,
    SpinnerRotate, ProgressSpinner, ErrorLabel
  }