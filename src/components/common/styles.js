import styled from "styled-components";
import DependentDropdown from "./dependentDropdown";

const colorCodes = {
  white:'#ffffff',
  darkGreen:'#3e7128',
  hoverGreen: '#517f3d',
  secondaryHoverGreen:'#3e71280d',
  disabledBg:'#d8d8d8',
  disabledText:'#757575'
}
export const Container = styled.div`
  overflow:hidden;
  background-color:#f4f4f4;
  
  * {
    box-sizing: content-box;
  }
`;

export const InnerContainer = styled.div`
  margin-bottom: 30px;

  @media only screen and (max-width: 480px) {
    margin: 0px 0px 55px;
  }
  @media only screen and (min-width: 481px) and (max-width: 1324px) {
    margin: 0 30px 55px 30px;
  }
`;

export const MainHeader = styled.div`
  font-size: 24px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: normal;
  color: #003863;
  margin-bottom: ${props => props.hasDependents ? `30px` : `0px`};
  margin-top: ${props => props.noTopMargin ? `0` : `30px`};
  @media only screen and (max-width: 480px) {
    padding-left:16px;
  }
`;

export const Name = styled.div`
  font-size: 20px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.6;
  letter-spacing: normal;
  color: #003863;
  margin-top: ${props => props.documents ? `` : `32px`};
  margin-left: ${props => props.documents ? `20px` : ``};
  @media only screen and (max-width: 480px) {
    margin: 20px 20px 0;
  }
`;

export const DOB = styled.div`
  font-size: 14px;
  font-weight: 300;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.14;
  letter-spacing: normal;
  color: #474b55;
  margin-top: 3px;
  @media only screen and (max-width: 480px) {
    margin-left: 20px;
  }
`;

export const MainCard = styled.div`
  padding: 10px 0px;
  border-radius: 4px;
  box-shadow: 0 2px 8px 0 #d8d8d8;
  background-color: #ffffff;
  margin: 23px 15px 0 0;
  @media only screen and (max-width: 1324px) {
    width: 100%;

    &:not(:first-of-type) {
      margin: 30px 0 0 0;
    }
  }
`;

export const CardContainer = styled.div`
  display: flex;
  @media only screen and (max-width: 768px) {
    display: block;
    margin-bottom: 56px;
  }
  width: 100%;
`;

export const InnerCard = styled.div`
  margin: 20px 20px 0px;
`;

export const DocCard = styled.div`
  margin-top: 20px;
`;

export const DocView = styled.div`
  &:hover {
    background-color: #f3f3f3;
  }
`;

export const CardBlock = styled.div`
  width: 50%;

  @media only screen and (min-width: 601px) and (max-width: 1324px) {
    width: 100%;
    margin-right: ${props => props.left && "15px"}
  }
`;

export const Title = styled.div`
  font-size: 16px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.13;
  letter-spacing: normal;
  color: #474b55;
  display: inline-block;
`;

export const MemberID = styled.div`
  font-size: 14px;
  font-weight: 300;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.14;
  color: #474b55;
  letter-spacing: normal;
  margin-top: 5px;
`;

export const DateValid = styled.div`
  font-size: 12px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  color: #474b55;
  letter-spacing: 0.2px;
  margin-top: 5px;
`;

export const Status = styled.div`
  padding: 4px 6px;
  background-color: ${props => props.status === 'ACTIVE' ? `#3e7128` : `#e3342f`};;
  color: white;
  font-size: 12px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: 1.5px;
  text-align: center;
  display: inline-block;
  border-radius: 4px;
  float: right;
`;

export const Icon = styled.img`
  float: left;
  margin-top: ${props => props.margin ? `24px` : ``};
  margin-right: ${props => props.right ? `10px` : ``};
`;

export const IconRight = styled.div`
  float: right;
  position: relative;
  padding: 20px;
  border-radius: 4px;
  background: ${props => props.selected ? 'url(react/images/icn-download.svg) no-repeat 10px 10px #e6e6e6'
    : 'url(react/images/icn-download.svg) no-repeat 10px 10px'};
  align-self: flex-start;
  top: -2px;
  cursor: pointer;
`;

export const BlueHeader = styled.div`
  font-size: 18px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: normal;
  color: #003863;
  margin: ${props => props.margin ? `24px 0px 0px 30px` : `0px 0px 0px 30px`};
`;

export const Row = styled.div`
  padding: 20px 0;
  margin-bottom: ${props => props.space ? `15px` : ``};
  @media only screen and (max-width: 480px) {
    margin-bottom: ${props => props.space ? `55px` : ``};
  }
`;

export const DocRow = styled.div`
  padding: 10px 0;
  margin: 0px 20px;
`;

export const HorizontalDivider = styled.div`
  height: 1px;
  background-color: #d8d8d8;
  margin: ${props => props.noMargin ? '0px' : '0px -20px'};
`;

export const Category = styled.div`
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: 0.23px;
  color: #757575;
  display: inline-block;
  flex: 1;
`;

export const CostData = styled.div`
  font-size: 14px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.43;
  letter-spacing: normal;
  color: #474b55;
  display: inline-block;
  width: ${props => props.moreWidth ? `45%` : `25%`};
  text-align: right;
  white-space: ${props => props.moreWidth ? '' : 'nowrap'};
  flex: ${props => props.customFlex ? props.customFlex : .4};
  /* flex-grow: 1; */
  flex-grow: ${props => !props.extraSpace && .8};
  
  @media only screen and (max-width: 480px) {
    flex: ${props => props.customFlexMobile ? props.customFlexMobile : .4};
  }
`;

export const BenefitsData = styled.div`
  font-size: 14px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.43;
  letter-spacing: normal;
  color: #474b55;
  display: inline-block;
  float: right;
  width: 45%;
  text-align: right;
  white-space: nowrap;
`;

export const DataSpacer = styled.div`
  flex: .6;
`

export const SubCategory = styled.div`
  font-size: 12px;
  font-weight: 300;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: normal;
  text-align: right;
  color: #474b55;
  width: 100%;
  white-space: normal;
  /* flex: ${props => props.deductible ? 1 : .4}; */
`;

export const DataBlock = styled.div`
  display: inline-block;
  width: 100%;
  display: flex;
  justify-content: space-between;
  flex-flow: wrap;
`;

export const DataDocBlock = styled.div`
  display: inline-block;
  width: 100%;
  display: flex;
  align-items: center;
`;

export const CoversageBenefitsHeaderWrapper = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;

  @media only screen and (min-width: 601px) and (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }

  @media only screen and (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
  }
`

export const UserInfoWrapper = styled.div`
  flex: .3;
`

export const ButtonsWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  /* margin-left: 15px; */
  flex: 1;
  margin: ${props => props.hasDependents ? "8px 0px" : "0px"};

  @media only screen and (max-width: 600px) {
    flex-direction: column;
    width: 90%;
    margin: 0 auto;
  }
`

export const DownloadButton = styled.a`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px 15px;
  border-radius: 8px;
  box-shadow: 0 2px 8px 0 #d8d8d8;
  background-color: white;
  border: none;
  height: 27px;
  margin-right: 15px;
  text-align: center;

  @media only screen and (max-width: 600px) {
    margin: 8px 0;
    margin-top: ${props => props.firstItem ? "20px" : "0"};
  }

  @media only screen and (min-width: 601px) and (max-width: 1324px) {
    margin-right: 0;
    margin-left: ${props => props.firstItem ? "0" : "15px"};
    margin-top: 15px;
  }

  @media only screen and (min-width: 1025px) {
  }

  img {
    margin-right: 10px;
  }

  &:hover {
    text-decoration: none;
  }
`;


export const FormsAndDocsButton = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px 15px;
  border-radius: 8px;
  box-shadow: 0 2px 8px 0 #d8d8d8;
  background-color: white;
  border: none;
  height: 27px;
  margin-right: 15px;
  text-align: center;

  @media only screen and (max-width: 600px) {
    margin: 8px 0;
    margin-top: ${props => props.firstItem ? "20px" : "0"};
  }

  @media only screen and (min-width: 601px) and (max-width: 1324px) {
    margin-right: 0;
    margin-left: ${props => props.firstItem ? "0" : "15px"};
    margin-top: 15px;
  }

  @media only screen and (min-width: 1025px) {
  }

  img {
    margin-right: 10px;
  }

  &:hover {
    text-decoration: none;
  }
`;

export const ButtonText = styled.span`
  font-size: 14px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.14;
  letter-spacing: normal;
  color: #008bbf;
`;

export const Benefits = styled.span`
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.29;
  letter-spacing: normal;
  color: #474b55;
  display: inline-block;
  float: left;
  width: ${props => props.textWrap ? `50%` : ``};
`;

export const DocText = styled.span`
  flex: 1;
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.29;
  letter-spacing: normal;
  color: #474b55;
  display: inline-block;
  margin-top: 3px;
  @media only screen and (max-width: 480px) {
    width: 75%;
  }
`;

export const LanguageSelect = styled.div`
  display: ${(props) => (props.isOpen ? "block" : "none")};
  position: absolute;
  margin: ${(props) => (props.last ? '5px -80px' : '25px -80px')};
  border-radius: 4px;
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.23);;
  background-color: #ffffff;
  list-style-type: none;
  padding: 4px 0;
  z-index: 1;
  width: 100px;
  bottom: ${(props) => (props.last ? '100%' : '')};

`;
export const Language = styled.div`
  padding: 8px 12px 8px 16px;
  font-size: 16px;
  font-weight: 300;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: normal;
  color: #474b55;

  &:hover {
    cursor: pointer;
    background-color: #f3f3f3;
  }
`;

export const ValidLOBBlockWrapper = styled.div`
  margin-bottom: 50px;
`

export const Anchor = styled.div`
    display: block;
    position: relative;
    top: -150px;
    visibility: hidden;
`

export const MemberDropDownSelect = styled(DependentDropdown)`
`;

export const MemberDropDownSelectWrapper = styled.div`
  flex: 1;
  width: 100%;
`;

export const DropdownFieldContainer = styled.div`
  display: flex;
  flex: auto;
  margin-right: 9px;
  color: #474b55;

  *{
    box-sizing: border-box!important;
  }

  @media only screen and (min-width: 1324px) {
    margin-right: 15px;
  }

  @media only screen and (max-width: 480px) {
    margin: 0 20px;
    margin-left: 0;
    margin-right: 0;
  }
`;

export const DropdownField = styled.div`
  border-radius: 4px;
  border: solid 1px #a8abac;
  background-color: #ffffff;
  cursor: pointer;
  text-align: left;
  margin: auto;
  width: 100%;
  position: relative;
  width: -webkit-fill-available;
  padding: 9px 0px 9px 0px;
  background-color: #ffffff;
  font-size: 16px;
  font-weight: 300;
  font-family: "museo-sans";
  &:focus {
    box-shadow: none;
  }
  &:focus .hf-preference-center-dropdown-content {
    display: block;
  }
  &.error {
    border: solid 1px #ad122a;
  }
`;

export const DropdownFieldText = styled.div`
  font-size: 16px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.13;
  letter-spacing: normal;
  color: #474b55;
  display: inline-block;
  vertical-align: middle;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 24px;
  width: calc(100% - 90px);
  &.selected {
    color: #474b55;
  }
  &.error {
    color: #ad122a;
  }
`;

export const DropdownSecondFieldText = styled.div`
  font-size: 12px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: normal;
  color: #474b55;
`;


export const DropdownFieldTextContainer = styled.div`
  width: 100%;
`;

export const UserIconContainer = styled.div`
  display: inline-block;
  vertical-align: middle;
  margin-left: 7px;
`

export const DropdownIconContainer = styled.div`
  display: inline-block;
`;

export const DropdownIcon = styled.img`
  position: relative;
  width: 15px;
  height: 15px;
  object-fit: cover;
  overflow: hidden;
  margin: -5px 8px -4px 8px;
  vertical-align: middle;
`;

export const DropdownList = styled.div`
  display: ${(props) => (props.isOpen ? "block" : "none")};
  position: absolute;
  background-color: #ffffff;
  max-height: 180px;
  margin: 13px 0px;
  border-radius: 4px;
  box-shadow: 0 2px 8px 0 #d8d8d8;
  background-color: #ffffff;
  list-style-type: none;
  padding: 6px 0px;
  overflow: hidden;
  overflow-y: auto;
  z-index: 1;
  width: inherit;
  ::-webkit-scrollbar {
    width: 8px;
  }
  ::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }
  ::-webkit-scrollbar-thumb {
    background: #d8d8d8;
    border-radius: 4px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #c3c3ce;
  }
`;

export const DropdownListItem = styled.button`
  font-size: 16px;
  font-weight: 300;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: normal;
  color: #474b55;
  text-align: left;
  border: none;
  background-color: #ffffff;
  padding: 9px 12px;
  display: inline-block;
  vertical-align: middle;
  cursor: pointer;
  z-index: 2;
  width: inherit;
  &:focus {
    box-shadow: none;
  }
  &:hover {
    background-color: #f8f8f8;
  }
  ${UserIconContainer}{
    margin-left: -5px;
  }
  div{
    display: inline-block;
    vertical-align: middle;
  }
  h1{
    font-weight: 500;
    font-family: "museo-sans";
    font-size: 16px;
    color: #474b55;
    padding: 0;
    margin: 0;
  }
  h2{
    font-weight: 300;
    font-family: "museo-sans";
    font-size: 16px;
    color: #474b55;
    padding: 0;
    margin: 0;
  }
  p{
    font-weight: 300;
    font-family: "museo-sans";
    font-size: 12px;
    color: #474b55;
    padding: 0;
    margin: 0;
  }
`;

export const DropdownErrorMsg = styled.div`
  font-size: 12px;
  font-weight: 300;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: normal;
  color: #a0252c;
`;

export const HorizontalLine = styled.div`
  border-bottom: solid 1px #d8d8d8;
  margin: 0px 12px;
`;

export const UserCircleIcon = styled.img`
  float: left;
  background: #d8d8d8;
  padding: 5px;
  border-radius: 50%;
  margin: 0 10px;
  width: 25px;
`;

export const DropdownFieldTitle = styled.div`
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.29;
  letter-spacing: normal;
  color: #474b55;
  margin: 10px 0;

  @media only screen  and (max-width: 480px) {
    margin-left: 0;
    margin-right: 0;
  }
`

export const DependentBlockWrapper = styled.div`
  width: ${props => props.halfWidth && "50%"};

  @media only screen  and (max-width: 768px) {
    width: 100%;
  }
`
const {darkGreen,white,hoverGreen,secondaryHoverGreen,disabledText,disabledBg}= colorCodes;
const handleButtonBgColor = variant => {
  
  switch (variant) {
    case 'primary':
      return {default:darkGreen,hover:hoverGreen};
      case 'secondary':
        return {default:white,hover:secondaryHoverGreen};
        case 'disabled':
          return {default:disabledBg,hover:disabledBg};
    default:
      break;
  }
}
const handleButtonTextColor = variant => {
  switch (variant) {
    case 'primary':
      return {default:white,hover:white};
      case 'secondary':
        return {default:darkGreen,hover:darkGreen};
        case 'disabled':
          return {default:disabledText,hover:disabledText};
    default:
      break;
  }
}

export const StyledButton = styled.button`
height: 40px;
border-radius: 4px;
padding:8px 16px;
white-space: nowrap;
width:${({isMobile}) => isMobile? '100%' : 'auto'};
background-color: ${({ variant }) => handleButtonBgColor(variant).default};
font-family: "museo-sans";
  font-size: 18px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: -0.08px;
  text-align: center;
  border:${({ variant }) =>variant === 'secondary' ? `1px solid ${darkGreen}` : '0px'};
  color: ${({ variant }) => handleButtonTextColor(variant).default};
  &:hover {
    cursor:pointer;
    background-color: ${({ variant }) => handleButtonBgColor(variant).hover};
  }
`;

export const MainContentContainer = styled.div`
  height: 100%;
`

export const MinorText=styled.div`

display: flex;
flex-direction: row;
align-items: center;
gap: 5px;
margin-top: 10px;

span{
  font-family: 'Museo Sans',sans-serif;
font-weight: 600;
font-size: 14px;
color: #474B55;
line-height: 16px} 
` 