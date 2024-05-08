import React from "react";
import { useSelector } from "react-redux";
import { StepsToActiveListItemActivateButton } from "../styles";
import { useHistory } from "react-router-dom";
import { handleSegmentClick } from "../../../../libs/segment";

const ActivateOTCCardLink = () => {
  const history = useHistory();
  const customerInfo = useSelector((state) => state.customerInfo);
  const handleClick = () => {
    handleSegmentClick(
      "/otc/learn-more",
      "Activate Card",
      "Activate Card",
      "link",
      "center",
      customerInfo,
      "otc",
    );
    history.push({ pathname: "/otc/activate-card" });
  };

  return (
    <StepsToActiveListItemActivateButton onClick={handleClick}>
      Activate Card
    </StepsToActiveListItemActivateButton>
  );
};

export default ActivateOTCCardLink;
