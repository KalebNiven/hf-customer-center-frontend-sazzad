import React, { useState } from "react";
import styled from "styled-components";
import MemberForm from './memberForm';
import NonMemberForm from './nonMemberForm';
import { Header, StyledButton} from "./styles";
import { useSelector } from "react-redux";
import { handleSegment } from "./handleSegment";
import VerifyAccount from "./verifyAccount";
import FooterMenu from "../auth/login/footerMenu"

const CreateAccount = () => {

    const customerInfo = useSelector((state) => state.customerInfo);
    const { MIX_REACT_REG_LEARN_MORE } = process.env;
    const { MIX_REACT_REG_CONTACT_LINK} = process.env;
    const [selection, setSelection] = useState("activeMember");
    const [showRegistration, setShowRegistration] = useState(false);
    const [showMemberShip, setShowMemberShip] = useState(false);
    const [isProceed,setIsProceed] = useState(false);
    const [memberRegisterDetails, setMemberRegisterDetails] = useState();

    const handleRadio = (value) => {
        setSelection(value);
    };
    const submitContinue=()=>{
        if(selection =='activeMember'){
            handleSegment("HBD","Active Healthfirst Member",customerInfo)
            setShowRegistration(true)
        }else if(selection == 'coverageMember'){
            handleSegment("HBD","I Need to Activate My Coverage",customerInfo)
            setShowMemberShip(true)
        }
    }
    const registrationWithId =()=>{
        setShowRegistration(true)
        setShowMemberShip(false)
    }
    const handleContinue = ()=>{
        setShowRegistration(false)
        setShowMemberShip(true)
    }
    return (
        <>
         {isProceed ? <VerifyAccount memberInfomation = {memberRegisterDetails}/>:
         <BackgroundDiv >
            <LanguageDiv><LanguageLink href=''>EN</LanguageLink> | <LanguageLink href=''>ES</LanguageLink> | <LanguageLink href=''>中文</LanguageLink></LanguageDiv>
            <LogoImg src="/react/images/simple_white.svg" />
        
            <MemberCardsContainer> 
                <MemberCard>
                {showRegistration?
                <MemberForm onBack={()=>setShowRegistration(false)} handleContinue={handleContinue} isProceedTocrediantials={(data) =>{setIsProceed(data)}} memberInfomation={(data) => setMemberRegisterDetails(data)}/>
                :showMemberShip? 
                <NonMemberForm onBack={()=>setShowMemberShip(false)} handleRegistrationWithId={registrationWithId} isProceedTocrediantials={(data) =>{setIsProceed(data)}}/> 
                :<>
                    <HeaderText>
                        What is your current membership status with Healthfirst?
                    </HeaderText>
                    <SubHeaderText>
                        Interested in Healthfirst plans?&nbsp;
                        <LearnLink href= {MIX_REACT_REG_LEARN_MORE} target="_shoppers">Learn More.&nbsp;</LearnLink>
                    </SubHeaderText>
                    <RadioButtonContainer
                        onClick={() => handleRadio("activeMember")}
                        active={selection === "activeMember"}

                    >
                        <RadioImg
                            src={
                                selection === "activeMember"
                                    ? "react/images/icn-radio-active.svg"
                                    : "react/images/icn-radio-inactive.svg"
                            }
                        />
                        <div>
                            <TextHeader className="mt-0">
                                Active Healthfirst Member
                            </TextHeader>
                            <div className="pt-2">
                                <TextWrapper>
                                    I am currently enrolled in a Healthfirst
                                    plan and have a Member ID, but I do not have
                                    an online account.
                                </TextWrapper>
                            </div>
                        </div>
                    </RadioButtonContainer>
                    <RadioButtonContainer
                        onClick={() => handleRadio("coverageMember")}
                        active={selection === "coverageMember"}
                    >
                        <RadioImg
                            src={
                                selection === "coverageMember"
                                    ? "react/images/icn-radio-active.svg"
                                    : "react/images/icn-radio-inactive.svg"
                            }
                        />
                        <div>
                            <TextHeader className="mt-0">
                                I Need to Activate My Coverage
                            </TextHeader>
                            <div className="pt-2">
                                <TextWrapper>
                                    I am enrolled in a Healthfirst plan, but my
                                    coverage isn't active as I need to make my
                                    first premium payment.
                                </TextWrapper>
                            </div>
                        </div>
                    </RadioButtonContainer>
                    <SubmitButton variant="primary" onClick={()=>submitContinue()}>Continue</SubmitButton> </>}
                </MemberCard>
                <FooterBox>
                    <FooterBoxContent>
                        If you have any questions, please call the Member
                        Services number on your Member ID card or visit us at
                        <br />
                        <BoldText href={MIX_REACT_REG_CONTACT_LINK} target="healthfirstContactus">member.healthfirst.org/contactus.</BoldText>
                    </FooterBoxContent>
                </FooterBox>
            </MemberCardsContainer>
            <FooterMenu/>
         </BackgroundDiv>
          }  

         </>
    
    );
};
export default CreateAccount;

const LanguageDiv = styled.div`
    text-align:right;
    font-size: 16px;
    font-weight: 700;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.13;
    letter-spacing: normal;
    color: white;
    margin-top: 22px;
    margin-right: 25px;
`;

const LanguageLink = styled.a`
    color:#ffffff;
    &:hover{
        color:#ffffff;
    }
    &:active{
        color:rgb(170, 170, 170) !important;
    }
`;

const TextHeader = styled.div`
    color: #003964;
    font-size: 16px;
    font-weight: 500;
    letter-spacing: 0;
    line-height: 18px;
    width: 235px;
`

const BoldText = styled.a`
    font-weight: 600;
    font-family: 'museo-sans', sans-serif !important;
`;
const FooterBox = styled.div`
    margin-top: 8px;
    background: linear-gradient(
            0deg,
            rgba(0, 139, 191, 0.1),
            rgba(0, 139, 191, 0.1)
        ),
        #ffffff;
    border: 1px solid #008bbf;
    border-radius: 4px;
    padding: 12px 16px;
    font-family: 'museo-sans', sans-serif !important;
`;
const FooterBoxContent = styled.div`
    font-weight: 400;
    font-size: 14px;
    line-height: 18px;
    font-family: 'museo-sans', sans-serif !important;
    color: #474b55;
`;
const HeaderText = styled.div`
    font-weight: 400;
    font-family: 'museo-sans', sans-serif !important;
    font-size: 18px;
    line-height: 24px;
    text-align: center;
    color: #003f6b;
    margin-bottom: 12px;
`;
const SubHeaderText = styled.div`
    font-weight: 400;
    font-size: 14px;
    line-height: 18px;
    text-align: center;
    color: #474c57;
    margin-bottom: 24px;
`;
const LearnLink = styled.a`
    color: #008bbf !important;
    cursor: pointer;
`;
const TextWrapper = styled.div`
    display: flex;
    Width:232px;
    Height:80px;
    font-family: 'museo-sans', sans-serif !important;
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    align-items: flex-start;
    gap: 8px;
`;
const RadioButtonContainer = styled.div`
    display: flex;
    gap: 12px;
    height: auto;
    width: 298px;
    border: 1px solid #d8d8d8;
    background: #ffffff;
    padding: 12px 12px 12px 14px;
    border-radius: 6px;
    margin-bottom: 8px;
    &:last-child {
        margin-bottom: 0px;
    }
    border:${props=>props.active && '2px solid #003863'};
`;
const MemberCard = styled.div`
    overflow: hidden;
    padding: 16px 16px 12px 16px;
    border-radius: 4px;
    //border: solid 2px #d8d8d8;
    background: #FFFFFF;
`;
const MemberCardsContainer = styled.div`
    display: flex;
    flex-direction: column;
    row-gap: 8px;
    width: 330px;
    left: 0px;
    top: 0px;    
    border-radius: 4px;
    margin: auto;
    margin-bottom: 59px;
    margin-top: 15px;
    font-family: 'museo-sans' !important;
`;
const RadioImg = styled.img`
    align-self: flex-start;
    margin-top: 4px;
`;

const SubmitButton = styled(StyledButton)`
    width: 100%;
    padding: 0px;
    margin-top: 24px;
    @media only screen and (max-width: 768px) {
        width: 100%;
    }
`;

const BackgroundDiv = styled.div`
    background-image: url(/react/images/background-image.png);
`;
const LogoImg = styled.img`
  height: 47px;
  margin: auto;
  margin-top: 15px;
  margin-bottom: 47px;
}
`;

const ContactDiv = styled.div`
    font-style: normal;
    font-size: 14px;
    line-height: 16px;
    text-align: center;
    color: #FFFFFF;
    margin-bottom:25px;
`;

const TextWeight = styled.span`
    font-weight: 700;
    font-family: 'museo-sans', sans-serif !important;
`;

const HiddenText = styled.span`
    @media (max-width: 768px) {
        display:none;
    }
`;
const BreackLine = styled.span`
@media (min-width: 768px) {
    display:none;
}
`;
const ShowText = styled.div`
    @media (max-width: 768px) {
        display:none;
    }
    margin-top:10px;
`;
