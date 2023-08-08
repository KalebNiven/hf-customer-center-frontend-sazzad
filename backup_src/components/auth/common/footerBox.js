import React from "react";
import styled from "styled-components";
const { MIX_REACT_REG_CONTACT_LINK} = process.env;

const FooterBox = () => {
    return(
    <FooterContainer>
        <FooterContent>
            If you have any questions, please call the Member
            Services number on your Member ID card or visit us at
            <br />
            <BoldText href={MIX_REACT_REG_CONTACT_LINK} target="healthfirstContactus">member.healthfirst.org/contactus.</BoldText>
        </FooterContent>
    </FooterContainer>
    );
}

export default FooterBox;

const BoldText = styled.a`
    font-weight: 600;
    font-family: 'museo-sans', sans-serif !important;
`;
const FooterContainer = styled.div`
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
const FooterContent = styled.div`
    font-weight: 400;
    font-size: 14px;
    line-height: 18px;
    font-family: 'museo-sans', sans-serif !important;
    color: #474b55;
`;