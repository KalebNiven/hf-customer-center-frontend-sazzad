import styled from "styled-components";
import React,  { useState } from "react";
import GlobalStyle from "../../styles/GlobalStyle";
import AddMembershipModal from "./addMembershipModal";


const HealthFirstChecklist = () => {

    const [showAddMembershipModal, setShowAddMembershipModal] = useState(false)

    return (
        <><GlobalStyle />
            <Card>
                <NewToHlthFrstTxt>New to Healthfirst?</NewToHlthFrstTxt>
                <CheckListTxt>Here’s a checklist to get you started with your Healthfirst health plan.</CheckListTxt>
                <CheckListCardStep1>
                    <Steps>STEP 1</Steps>
                    <StepHeading>Make Your First Premium Payment (if applicable)</StepHeading>
                    <Description>Once you’ve made your first premium payment, a benfits packet containing your Member ID will be mailed to you.</Description>
                    <Notice>
                        <NoticeTxt>
                            <b>Important:</b> Complete this step if you’re enrolled in <b>Leaf & Leaf Premier Plans, Essential Plans,</b>
                            or <b>Child Health Plus — and have a premium obligation to start your coverage.</b> Otherwise, go to Step 2.
                        </NoticeTxt>
                    </Notice>
                </CheckListCardStep1>
                <CheckListCardStep2>
                    <Steps>STEP 2</Steps>
                    <StepHeading>Add Your Membership to Your Account</StepHeading>
                    <Description>Once you receive your benefits packet containing your Member ID,
                        <AddMemberShip onClick={() => setShowAddMembershipModal(true)}>add your membership</AddMemberShip> to this account. A new account is not needed. </Description>
                </CheckListCardStep2>
                <CheckListCardStep3>
                    <Steps>STEP 3</Steps>
                    <StepHeading>Access Your Benefits</StepHeading>
                    <Description>Once you add your membership to this account, you'll be able to: enroll in AutoPay, search for in-network providers,
                        find essential services nearby, access your Member ID card, view claims and benefits, and so much more.</Description>
                </CheckListCardStep3>
                <AddMembershipModal unmountMe={() => setShowAddMembershipModal(false)} showModal={showAddMembershipModal}/>
            </Card>
        </>
    );
};

export default HealthFirstChecklist;

const Card = styled.div`
    width:100%;
    border-radius: 4px;
    word-break: break-word;
    margin-bottom: 40px;
`;

const CheckListTxt = styled.div`
    font-size: 14px;
    font-weight: 400;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.14;
    letter-spacing: normal;
    text-align: left;
    color: #474b55;
    margin: 0px 0px 22px 16px;
`;


const NewToHlthFrstTxt = styled.div`
    font-size: 18px;
    font-weight: 400;
    font-stretch: normal;
    font-style: normal;
    line-height: 24px;
    letter-spacing: normal;
    text-align: left;
    color: #003863;
    padding: 13px 0px 11px 16px;
`;

const CheckListCardStep1 = styled.div`
    margin: 0 0 1px;
    padding: 16px 16px 24px 15px;
    background-color: #ffffff;
    // height:199px;
`;

const CheckListCardStep2 = styled.div`
    margin: 0 0 1px;
    padding: 16px 16px 24px 15px;
    background-color: #ffffff;
    // height:136px;
`;

const CheckListCardStep3 = styled.div`
    margin: 0 0 1px;
    padding: 16px 16px 24px 15px;
    background-color: #ffffff;
    // height:152px;
`;

const Steps = styled.div`
    margin: 0 0px 24px 0;
    font-size: 12px;
    font-weight: 500;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.5;
    letter-spacing: 0.43px;
    text-align: left;
    color: #757575;
`;

const StepHeading = styled.div`
    margin: 24px 0px 4px 1px;
    font-size: 16px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.13;
    letter-spacing: normal;
    text-align: left;
    color: #474b55;
`;

const Description = styled.div`
    margin: 4px 0 11px 1px;
    font-size: 14px;
    font-weight: 400;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.14;
    letter-spacing: normal;
    text-align: left;
    color: #474b55;
`;

const Notice = styled.div`
    margin: 11px 0 0 1px;
    padding: 10px;
    background-color: #eefafe;
`;

const NoticeTxt = styled.div`
    font-size: 12px;
    font-weight: 400;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.33;
    letter-spacing: normal;
    text-align: left;
    color: #474b55;
`;

const AddMemberShip = styled.span`
    font-weight: 500;
    color:#008bbf;
    text-decoration: underline;
    &:hover{
        cursor:pointer;
      }
`;