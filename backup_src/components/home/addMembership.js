import styled from "styled-components";
import React,  { useState } from "react";
import GlobalStyle from "../../styles/GlobalStyle";
import AddMembershipModal from "./addMembershipModal";
import { useHomeContext } from './homeContext';

const AddMembership = () => {

  const { showAddMembershipModal, setShowAddMembershipModal } = useHomeContext();


  return (
    <><GlobalStyle />
      <Card>
        <AddMembershiptxt>Add Your Membership</AddMembershiptxt>
        <SuggestionTxt>
          Use your Member ID to add a membership to your account.
        </SuggestionTxt>
        <AddMembershipBtn onClick={() => setShowAddMembershipModal(true)}>
          Add Membership
        </AddMembershipBtn>
        <AddMembershipModal unmountMe={() => setShowAddMembershipModal(false)} showModal={showAddMembershipModal}/>
      </Card>
    </>
  );
};

export default AddMembership;

const Card = styled.div`
  width: 100%;
  padding: 16px 16px 16px 16px;
  border-radius: 4px;
  background-color: #ffffff;
  height:152px;
`;

const AddMembershiptxt = styled.div`
margin: 0 0 6px;
font-size: 16px;
font-weight: bold;
font-stretch: normal;
font-style: normal;
line-height: 1.29;
letter-spacing: normal;
text-align: left;
color:#474b55;
`;

const SuggestionTxt = styled.div`
margin: 0 0 16px;
font-size: 14px;
font-weight: 400;
font-stretch: normal;
font-style: normal;
line-height: 1.29;
letter-spacing: normal;
text-align: left;
color:#474b55;
`;

const AddMembershipBtn = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.14;
  letter-spacing: normal;
  border-radius: 4px;
  border: solid 0px;
  height: 30px;
  text-align: center;
  width: 100%;
  padding: 8px 16px;
  background-color: #3e7128;
  color: #ffffff;
  margin: auto;
  &:hover{
    cursor:pointer;
  }
`;