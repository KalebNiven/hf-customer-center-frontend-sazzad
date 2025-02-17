import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import {
  ModalWrapper,
  ModalInnerWrapper,
  ModalContent,
  CloseIcon,
  ButtonWrapper,
} from "../../styles/commonStyles";
import { StyledButton } from "./styles";
import { useSSOModalContext } from "../../context/ssoModalContext";
import { useAppContext } from "../../AppContext";
import { useClient } from "@splitsoftware/splitio-react";
import { SHOW_EXTERNAL_LINK_CARDS } from "../../constants/splits";

const SSOModal = () => {
  const customerInfo = useSelector((state) => state.customerInfo.data);
  const { ssoModalState, setSsoModalState, resetSsoModal } =
    useSSOModalContext();
  const { showMemberModal, routeLink, externalLinkName, membershipSplit } =
    ssoModalState;
  const { setAcknowledgmentModal } = useAppContext();
  const { featureNameSplit } = ssoModalState;

  const handleClick = (
    membershipKey,
    routeLink,
    externalLinkName,
    splitTreatment,
  ) => {
    if (splitTreatment === "notice") {
      switch (externalLinkName) {
        case "Manage Prescriptions":
          resetSsoModal();
          setAcknowledgmentModal({ isVisible: true, label: externalLinkName });
          return;
        default:
          return;
      }
    } else
      setSsoModalState({
        ...ssoModalState,
        showMemberModal: false,
        routeLink,
        externalLinkName,
        membershipKey,
      });
  };
  const splitHookClient = useClient(
    customerInfo.customerId === null ? "Anonymous" : customerInfo.customerId,
  );

  const closeModal = () => {
    resetSsoModal();
  };

  const checkMemberForTreatment = (plan, memberType, membershipSplit) => {
    const splitAttributes = {
      memberId: memberType === "HOH" ? plan.MemberId : plan.memberId,
      lob: memberType === "HOH" ? plan.LOBCode : plan.LobCode,
      benefitPackage:
        memberType === "HOH" ? plan.BenefitPackage : plan.benefitPackage,
      membershipStatus:
        memberType === "HOH" ? plan.MembershipStatus : plan.Status,
      accountStatus: customerInfo.accountStatus,
      companyCode:
        memberType === "HOH" ? [plan.CompanyNumber] : [plan.companyCode],
    };
    const showManagePrescriptionsOverride =
      splitHookClient.getTreatmentWithConfig(membershipSplit, splitAttributes);
    return showManagePrescriptionsOverride.treatment;
  };

  const enableClickThrough = (row) => {
    const treatmentForFeature = checkMemberForTreatment(row, featureNameSplit);
    const enable =
      checkMemberForTreatment(row, SHOW_EXTERNAL_LINK_CARDS) === "on" &&
      treatmentForFeature !== "off" &&
      treatmentForFeature !== "control"
        ? true
        : false;
    return enable;
  };

  return (
    <div>
      {showMemberModal === true ? (
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
                  There are multiple members with this benefit. Select the
                  member you would like to use to access{" "}
                  <b>{externalLinkName}</b>
                </SubHeader>
                <MembersList>
                  {customerInfo.hohPlans.map((row, index) => {
                    const enable =
                      checkMemberForTreatment(
                        row,
                        "HOH",
                        SHOW_EXTERNAL_LINK_CARDS,
                      ) === "on"
                        ? true
                        : false;
                    return (
                      row.MembershipStatus === "active" && (
                        <Card
                          enable={enable}
                          key={index}
                          onClick={() => {
                            if (enable)
                              handleClick(
                                row.MembershipKey,
                                routeLink,
                                externalLinkName,
                                checkMemberForTreatment(
                                  row,
                                  "HOH",
                                  membershipSplit,
                                ),
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
                  {customerInfo.dependents.map((row, index) => {
                    const enable =
                      checkMemberForTreatment(
                        row,
                        "Dependent",
                        SHOW_EXTERNAL_LINK_CARDS,
                      ) === "on"
                        ? true
                        : false;
                    return (
                      row.Status === "active" && (
                        <Card
                          key={index}
                          enable={enable}
                          onClick={() => {
                            if (enable)
                              handleClick(
                                row.MembershipKey,
                                routeLink,
                                externalLinkName,
                                checkMemberForTreatment(
                                  row,
                                  "Dependent",
                                  membershipSplit,
                                ),
                              );
                          }}
                        >
                          <UserIcon
                            src="/react/images/icons-solid-user-dark-grey.svg"
                            alt=""
                          ></UserIcon>
                          <MemberDetails>
                            <MemberName>
                              {row.firstName}&nbsp;{row.lastName}
                            </MemberName>
                            <PlanName>{row.planName}</PlanName>
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

export default SSOModal;
