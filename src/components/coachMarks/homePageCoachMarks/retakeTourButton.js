import React from "react";
import styled from "styled-components";

const RetakeTourButton = ({ handleRetakeTour }) => {
  return (
    <Button onClick={handleRetakeTour}>
      {/* <Icon src="/react/images/icons-outline-info-circle-blue.svg" /> */}
      <RetakeTourButtonText>Take a Tour</RetakeTourButtonText>
    </Button>
  );
};

export const Button = styled.button`
  display: flex;
  align-items: center;
  position: fixed;
  bottom: 73px;
  width: 139px;
  right: 24px;
  z-index: 11;
  ${"" /* padding: 10px 12px; */}
  border: none;
  border-radius: 32px;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.36);
  background-color: #fff;
  font-size: 14px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.14;
  letter-spacing: normal;
  color: #003863;
  cursor: pointer;
  padding: 0 11px;

  &:before {
    content: " ";
    background-image: url("/react/images/icons-outline-info-circle-blue.svg");
    display: block;
    background-size: 24px 24px;
    height: 24px;
    width: 24px;
  }

  &:hover {
    background: #003863;
    color: #fff;

    &:before {
      background-image: url("/react/images/icons-outline-info-circle-white.svg");
    }
  }
`;

export const RetakeTourButtonText = styled.div`
  margin-left: 9px;
  padding: 10px 0;
  margin-top: 2px;
`;

export const Icon = styled.img``;

export default RetakeTourButton;
