import React, { useState ,useEffect } from "react";
import styled from "styled-components";
import {
    Header,
    MemberCardsContainer,
    MemberCard,
} from "./styles";

import CreateUserCredentials from "./createUserCredentials";

const VerifyModal = (props) =>{
    const [isProceed, setIsProceed] = useState(false);

    useEffect(() => {
       
        setTimeout(() => setIsProceed(true), 3000);
    }, []);

    return (
        <>
            {isProceed ? (
                <CreateUserCredentials  memberInfo={props.memberInfo}/>
            ) : (
                <MemberCardsContainer>
                    <MemberCard>
                        <Image src="/react/images/icons-solid-checkmark-circle.svg"></Image>
                        <Text>Your account has been verified!</Text>
                    </MemberCard>
                </MemberCardsContainer>
            )}
        </>
    );
}

export default VerifyModal;

const Image = styled.img`
width:83.33px;
height:83.33px;
margin: 152.33px 118.33px 40.33px 103.33px
`;

const Text = styled(Header)`
margin-bottom:226px;
`;