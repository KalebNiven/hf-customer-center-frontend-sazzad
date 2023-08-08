
import styled, { keyframes } from 'styled-components';
import { ButtonWrapper } from "../../styles/commonStyles";
export const FormGrid = styled.div`
    display: grid;
    grid-template-columns: 100%;
    grid-row-gap: 16px;
    margin-top: 8px;
`;

export const InputWrapper = styled.div`
    position: relative;
`;

export const Spinner = styled.div`
  text-align: center;
  margin: auto;
  margin-top: 9px;
  border: .2em solid #e6e6e6;
  border-top: .2em solid #4b6f32;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  animation-name: ${keyframes`from {transform: rotate(0deg);} to {transform: rotate(360deg);}`};
  animation-duration: 2s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
`;



export const ProgressWrapper = styled.div`
    width: 100%;
    background: #4b6f32;
    margin-top: 10px;
   // margin-bottom: 10px;
    height: 40px;
    border-radius: 4px;
   // padding: 8px 16px;
`;


export const InputHeader = styled.h3`
    margin: 0px 4px 8px 0px;
    font-size: 16px;
    font-weight: 300;
    font-stretch: normal;
    font-style: normal;
    line-height: 24px;
    letter-spacing: normal;
    color: #474b55;
    font-family: "museo-sans", san-serif !important;
`;

export const MemberIdInput = styled.div`
    position: relative;
`;

export const Input = styled.input`
    min-height: 40px;
    width: 100%;
    max-width: 100%;
    font-size: 16px;
    font-weight: 300;
    font-family: "museo-sans" !important;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.5;
    letter-spacing: normal;
    color: ${(props) => (props.error ? "#ad122a" : "#474b55")};
    padding: 8px 16px;
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
        font-family: "museo-sans" !important;
    }
    :-ms-input-placeholder {
        color: ${(props) => (props.error ? "#ad122a" : "#a8abac")};
        font-family: "museo-sans" !important;
    }
`;

export const InputErrorMsg = styled.div`
    font-size: 12px;
    font-weight: 300;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.33;
    letter-spacing: normal;
    color: #ad122a;
   // padding-top: 4px;
`;

export const InfoIcon = styled.img`
    position: absolute;
    right: 15px;
    top: 13px;
    cursor:pointer;
`;

export const MemberCard = styled.div`
    overflow: hidden;
    padding: 16px 16px 12px 16px;
    border-radius: 4px;
   // border: solid 2px #d8d8d8;
    background: #ffffff;
`;

export const MemberCardsContainer = styled.div`
    display: flex;
    flex-direction: column;
    row-gap: 8px;
    width: 320px;
    left: 0px;
    top: 0px;
    border-radius: 4px;
    margin: auto;
    margin-bottom: 59px;
    margin-top: 3px;
    font-family: "museo-sans" !important;
`;

export const FormButtonWrapper = styled(ButtonWrapper)`
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
            width: 100%;
            margin: 0;
        }
    }
`;


export const VerifyButton = styled.button`
    margin-top: 13px;
    height: 40px;
    border-radius: 4px;
    padding: 8px 16px;
    white-space: nowrap;
    width: 100%;
    background-color: ${({ variant }) =>
        variant === "primary" ? "#3e7128" : "#D3D3D3"};
    font-family: "museo-sans";
    font-size: 18px;
    font-weight: ${({ variant }) => (variant === "primary" ? "600" : "400")};
    font-stretch: normal;
    font-style: normal;
    line-height: 1.33;
    letter-spacing: -0.08px;
    text-align: center;
    border: ${({ variant }) =>
        variant === "secondary" ? `1px solid #3e7128` : "0px"};
    color: ${({ variant }) => (variant === "primary" ? "#ffffff" : "#757575")};
    &:hover {
        
        background-color: ${({ variant }) =>
            variant === "primary" ? "#517f3d" : "#D3D3D3"};
    }
`;

export const StyledButton = styled.button`
    margin-top: 13px;
    height: 40px;
    border-radius: 4px;
    padding: 8px 16px;
    white-space: nowrap;
    width: 100%;
    background-color: ${({ variant }) =>
        variant === "primary" ? "#3e7128" : "#ffffff"};
    font-family: "museo-sans";
    font-size: 18px;
    font-weight: ${({ variant }) => (variant === "primary" ? "600" : "400")};
    font-stretch: normal;
    font-style: normal;
    line-height: 1.33;
    letter-spacing: -0.08px;
    text-align: center;
    border: ${({ variant }) =>
        variant === "secondary" ? `1px solid #3e7128` : "0px"};
    color: ${({ variant }) => (variant === "primary" ? "#ffffff" : "#3e7128")};
    &:hover {
        cursor: pointer;
        background-color: ${({ variant }) =>
            variant === "primary" ? "#517f3d" : "#3e71280d"};
    }
`;

export const AdditionalInfo = styled.div`
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    color: #474b55;
    margin-top: 10px;
`;
export const CenterInfo = styled.div`
    text-align: center;
    line-height: 22px;
`;

export const ItalicFont = styled.div`
    font-style: italic;
    line-height: 18px !important;
`;

export const CheckBox = styled.input`
    margin-top: 10px;
    display: flex;
    flex-direction: row;
    width: 17px;
    &:checked {
        bakcground-color: red;
    }
`;

export const TermsInfo = styled.label`
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    color: #474b55;
    margin-left: 8px;
    margin-top: 6px;
`;

export const TermsLink = styled.a`
    font-weight: 600;
    color: #008cc1 !important;
`;
export const CheckBoxWrapper = styled.div`
    display: flex;
    flex-direction: row;
`;

export const SubHeader = styled.h3`
    font-weight: 400;
    font-size: 14px;
    line-height: 18px;
    text-align: center;
    color: #474b55;
    margin-bottom: 8px;
`;

export const BackIcon = styled.img`
    height: 16px;
    float: left;
    &:hover {
        cursor: pointer;
    }
`;
export const BackText = styled.p`
    width:20px; 
    margin-left: 19px;
    margin-top: -3px;
    font-size: 14px;
    color: #474b55;
    text-transform: uppercase;
    margin-bottom: 7px;
    &:hover {
        cursor: pointer;
    }
`;

export const Link = styled.a`
    font-weight: 600;
    color: #008bbf !important;
    &:hover {
        cursor: pointer;
    }
`;

export const Header = styled.div`
    font-weight: 400;
    font-size: 18px;
    line-height: 24px;
    text-align: center;
    color: #003f6b;
    margin-bottom: 12px;
`;


export const Tooltip = styled.div`
    position: absolute;
    width: 239px;
    height: 64px;
    margin: auto;
    margin-top: 40px;
    margin-left: 70px;
    background: #003863;
    border-radius: 4px;
`;

export const LogoImg = styled.img`
  height: 47px;
  margin: auto;
  margin-top: 15px;
  margin-bottom: 47px;
}
`;

export const ToolTipText = styled(SubHeader)`
        align-items: center;
        text-align: center;
        color: #FFFFFF;
        padding: 13px 16px 11px 12px;
`;

export const  Span = styled.span`
    font-weight: 600;
    font-size: 14px;
    line-height: 18px;
    text-align: center;
    color:${({ variant }) => variant  ? "#3788BC" : "#474b55"};
    margin-bottom: 8px;
    cursor:pointer;
`;
