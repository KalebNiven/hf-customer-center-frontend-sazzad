import React from 'react';
import styled from 'styled-components';
import { useSelector } from "react-redux";
import { ModalWrapper, ModalInnerWrapper, ModalContent, CloseIcon, ButtonWrapper } from "../../styles/commonStyles";
import { StyledButton } from './styles';
import { useSSOModalContext } from '../../context/ssoModalContext';

const SSOModal = () => {
    const customerInfo = useSelector((state) => state.customerInfo.data);
    const { ssoModalState, setSsoModalState, resetSsoModal } = useSSOModalContext()
    const { showMemberModal, routeLink, externalLinkName } = ssoModalState;

    const handleClick = (membershipKey, routeLink, externalLinkName) => {
        setSsoModalState({ ...ssoModalState, showMemberModal: false, routeLink, externalLinkName, membershipKey })
    }

    const closeModal = () => {
        resetSsoModal()
    }

    return (
        <div>

            {
                showMemberModal === true ?
                    <FormModalWrapper visible={showMemberModal}>
                        <ModalInnerWrapperCustom>
                            <FormModalContent>
                                <CloseIcon src="react/images/icn-close.svg" onClick={() => closeModal()} />
                                <div>
                                    <Header>
                                        Select a plan to continue
                                    </Header>
                                    <SubHeader>
                                        There are multiple members with this benefit.Select the member you would like to use to access <b>{externalLinkName}</b>
                                    </SubHeader>
                                    <MembersList>
                                        {
                                            customerInfo.hohPlans.map((row, index) => {
                                                return (
                                                    row.MembershipStatus === "active" &&
                                                        <Card key={index} onClick={() => handleClick(row.MembershipKey, routeLink, externalLinkName)}>
                                                            <UserIcon src="/react/images/icons-solid-user-dark-grey.svg"></UserIcon>
                                                            <MemberDetails>
                                                                <MemberName>{row.FirstName.toLowerCase()}&nbsp;{row.LastName.toLowerCase()}</MemberName>
                                                                <PlanName>{row.PlanName}</PlanName>
                                                            </MemberDetails>
                                                            <ArrowIcon src="/react/images/icn-arrow-right.svg"></ArrowIcon>
                                                        </Card>
                                                )
                                            }
                                            )
                                        }
                                        {
                                            customerInfo.dependents.map((row, index) => {
                                                return (row.Status === "active" &&
                                                    <Card key={index} onClick={() => handleClick(row.MembershipKey, routeLink, externalLinkName)}>
                                                        <UserIcon src="/react/images/icons-solid-user-dark-grey.svg"></UserIcon>
                                                        <MemberDetails>
                                                            <MemberName>{row.firstName}&nbsp;{row.lastName}</MemberName>
                                                            <PlanName>{row.planName}</PlanName>
                                                        </MemberDetails>
                                                        <ArrowIcon src="/react/images/icn-arrow-right.svg"></ArrowIcon>
                                                    </Card>
                                                )
                                            }
                                            )
                                        }

                                    </MembersList>
                                    <FormButtonWrapper>
                                        <StyledButton variant="primary"
                                            onClick={() => closeModal()}

                                        >
                                            Cancel
                                        </StyledButton></FormButtonWrapper>
                                </div>
                            </FormModalContent>
                        </ModalInnerWrapperCustom>

                    </FormModalWrapper>
                    :
                    null}
        </div>)
}

const FormModalWrapper = styled(ModalWrapper)`
    transition: opacity 300ms ease-in-out;
    opacity: ${props => props.visible ? "1" : "0"};
`

const ModalInnerWrapperCustom = styled(ModalInnerWrapper)`
    
`;

const FormModalContent = styled(ModalContent)`
    transition: opacity 300ms ease-in-out;
    margin-top:50px;
`;

const Header = styled.div`
    font-size: 20px;
    font-weight: 500;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.6;
    letter-spacing: normal;
    color: #003863;
    margin: 4px 0px;
    text-align:left;
`;

const SubHeader = styled.h3`
    margin: 4px 0px 24px;
    font-size: 14px;
    font-weight: 500;
    font-stretch: normal;
    font-style: normal;
    line-height: 24px;
    letter-spacing: normal;
    color: #474b55;
    text-align:left;
`;

const FormButtonWrapper = styled(ButtonWrapper)`
  margin-top: 2rem;
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

const MembersList = styled.div`
  display: flex;
    margin-right:0px;
    max-height:240px;
        flex-direction: column;
        overflow-y:auto;
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          border-radius: 8px;
        }
        ::-webkit-scrollbar-thumb {
          background: #A8ABAC;
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #c3c3ce;
        }
  
`;

const Card = styled.div`
  width:100%;
  height: 72px;
  flex-grow: 0;
  margin-bottom: 8px;
  padding: 19px 16px 18px;
  border-radius: 4px;
  background-color: #ffffff;
  border: solid 1px #d8d8d8;
  
  &:hover {
    cursor:pointer;
    background-color: #f3f3f3;
}
display:flex;
`;





const UserIcon = styled.img`
width: 32px;
height: 32px;
margin: 2px 12px 1px 0;
padding: 8px;
object-fit: contain;
border-radius: 16px;
background-color: #eee;
`;

const MemberDetails = styled.div`
width: 80%;
`;

const MemberName = styled.div`
    height: 18px;
    font-size: 14px;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.29;
    letter-spacing: normal;
    color:#474b55;
    text-transform:capitalize
`;

const PlanName = styled.div`
    height: 16px;
    font-size: 14px;
    font-weight: 300;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.14;
    letter-spacing: normal;
    color:#474b55;
`;

const ArrowIcon = styled.img`
width: 20px;
    height: 20px;
    margin: 7px 0 8px 0px;
    object-fit: contain;
    filter: opacity(0.3) drop-shadow(0 0 0 #474b55);

`;




export default SSOModal;