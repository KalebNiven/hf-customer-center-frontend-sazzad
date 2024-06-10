import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import {
  ModalWrapper,
  ModalInnerWrapper,
  ModalContent,
  CloseIcon,
  ButtonWrapper,
} from "../../styles/commonStyles";
import { StyledButton } from "../common/styles";
import { usePaymentsModalContext } from "../../context/paymentsModalContext";
import { useAppContext } from "../../AppContext";
import { useClient } from "@splitsoftware/splitio-react";
import { SHOW_EXTERNAL_LINK_CARDS } from "../../constants/splits";
import { requestSelectPlan } from "../../store/actions";
import { useHistory } from "react-router-dom";
import { PAYMENTS_ACL, BINDER_ACL } from "../../constants/splits";

const MemberSelectionModal = () => {
  const customerInfo = useSelector((state) => state.customerInfo.data);
  const { paymentsModalState, setPaymentsModalState, resetPaymentsModal } =
    usePaymentsModalContext();
  const { showMemberModal, routeLink, externalLinkName } = paymentsModalState;
  const dispatch = useDispatch();
  const history = useHistory();
  const splitHookClient = useClient();
  const [plans, setPlans] = useState([]);

  const handleClick = (
    membershipKey,
    membership,
    routeLink,
    externalLinkName,
  ) => {
    setPaymentsModalState({
      ...paymentsModalState,
      showMemberModal: false,
      routeLink,
      externalLinkName,
      membershipKey,
      membership,
    });
    dispatch(requestSelectPlan(membershipKey));
  };

  const closeModal = () => {
    resetPaymentsModal();
    history.replace("/home");
  };

  splitHookClient.on(splitHookClient.Event.SDK_READY, function () {
    getPlansWithPayments();
  });

  useEffect(() => {
    if (splitHookClient.Event.SDK_READY) {
      getPlansWithPayments();
    }
  }, []);

  const checkACLs = (plan, accountStatus) => {
    let planAttrs = {
      memberId: plan?.MemberId,
      lob: plan?.LOBCode,
      membershipStatus: plan?.MembershipStatus,
      benefitPackage: plan?.BenefitPackage,
      accountStatus: accountStatus,
      companyCode: plan?.CompanyNumber,
    };
    let paymentsEnabledTreatment = splitHookClient.getTreatmentWithConfig(
      PAYMENTS_ACL,
      planAttrs,
    );
    let binderEnabledTreatment = splitHookClient.getTreatmentWithConfig(
      BINDER_ACL,
      planAttrs,
    );
    return (
      paymentsEnabledTreatment.treatment === "on" ||
      binderEnabledTreatment.treatment === "on"
    );
  };

  const getPlansWithPayments = () => {
    let filteredPlans = [];
    customerInfo.hohPlans.forEach((plan) => {
      if (checkACLs(plan, customerInfo?.accountStatus)) {
        filteredPlans.push(plan);
      }
    });
    setPlans(filteredPlans);
  };

  return (
    <div>
      {showMemberModal === true && plans !== null && plans.length > 0 ? (
        <FormModalWrapper visible={showMemberModal}>
          <ModalInnerWrapperCustom>
            <FormModalContent>
              <CloseIcon
                alt=""
                src="/react/images/icn-close.svg"
                onClick={() => closeModal()}
              />
              <div>
                <Header>Select a plan to continue</Header>
                <SubHeader>
                  There are multiple plans with this benefit. Select the plan
                  you would like to use to access <b>{externalLinkName}</b>
                </SubHeader>
                <MembersList>
                  {plans.map((row, index) => {
                    const enable = true;
                    return (
                      (row.MembershipStatus === "active" ||
                        row.MembershipStatus === "upcoming" ||
                        row.MembershipStatus === "inactive") && ( // Perhaps we should consider also displaying inactive here if they are passed in... just simply not filter
                        <Card
                          enable={enable}
                          key={index}
                          onClick={() => {
                            if (enable)
                              handleClick(
                                row.MembershipKey,
                                row,
                                routeLink,
                                externalLinkName,
                              );
                          }}
                        >
                          <UserIcon
                            alt=""
                            src="/react/images/icons-solid-user-dark-grey.svg"
                          ></UserIcon>
                          <MemberDetails>
                            <MemberName>
                              {row.FirstName.toLowerCase()}&nbsp;
                              {row.LastName.toLowerCase()}
                            </MemberName>
                            <PlanName>{row.PlanName}</PlanName>
                          </MemberDetails>
                          <ArrowIcon
                            enable={enable}
                            alt=""
                            src="/react/images/icn-arrow-right.svg"
                          ></ArrowIcon>
                        </Card>
                      )
                    );
                  })}
                </MembersList>
                <FormButtonWrapper>
                  <StyledButton variant="primary" onClick={() => closeModal()}>
                    Cancel
                  </StyledButton>
                </FormButtonWrapper>
              </div>
            </FormModalContent>
          </ModalInnerWrapperCustom>
        </FormModalWrapper>
      ) : null}
    </div>
  );
};

const FormModalWrapper = styled(ModalWrapper)`
  transition: opacity 300ms ease-in-out;
  opacity: ${(props) => (props.visible ? "1" : "0")};
`;

const ModalInnerWrapperCustom = styled(ModalInnerWrapper)``;

const FormModalContent = styled(ModalContent)`
  transition: opacity 300ms ease-in-out;
  margin-top: 50px;
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
  text-align: left;
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
  text-align: left;
`;

const FormButtonWrapper = styled(ButtonWrapper)`
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
      margin: 0;
    }
  }
`;

const MembersList = styled.div`
  display: flex;
  margin-right: 0px;
  max-height: 240px;
  flex-direction: column;
  overflow-y: auto;
  ::-webkit-scrollbar {
    width: 6px;
  }
  ::-webkit-scrollbar-track {
    border-radius: 8px;
  }
  ::-webkit-scrollbar-thumb {
    background: #a8abac;
    border-radius: 4px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #c3c3ce;
  }
`;

const Card = styled.div`
  width: 100%;
  height: 72px;
  flex-grow: 0;
  margin-bottom: 8px;
  padding: 19px 16px 18px;
  border-radius: 4px;
  background-color: #ffffff;
  border: solid 1px #d8d8d8;
  background-color: ${(props) => (props.enable ? "#ffffff" : "#A8ABAC")};

  &:hover {
    ${(props) =>
      props.enable
        ? `
        cursor:pointer;
        background-color: #f3f3f3;
    `
        : `
        cursor:not-allowed;
    `}
  }
  display: flex;
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
  color: #474b55;
  text-transform: capitalize;
`;

const PlanName = styled.div`
  height: 16px;
  font-size: 14px;
  font-weight: 300;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.14;
  letter-spacing: normal;
  color: #474b55;
`;

const ArrowIcon = styled.img`
  display: ${(props) => (props.enable ? "inherit" : "none")};
  width: 20px;
  height: 20px;
  margin: 7px 0 8px 0px;
  object-fit: contain;
  filter: opacity(0.3) drop-shadow(0 0 0 #474b55);
`;

export default MemberSelectionModal;
