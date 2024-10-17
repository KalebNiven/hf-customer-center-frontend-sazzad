import React, { useEffect } from "react";
import { useAppContext } from "../../AppContext";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { useSSOModalContext } from "../../context/ssoModalContext";

const ExternalSiteLinkSSO = ({
  link,
  target,
  children,
  segmentTrack,
  segmentProps,
  styles,
  segmentPageCategory,
  segmentTitle,
  segmentTargetMemberId,
  membershipKey,
  label,
  membershipSplit,
  featureNameSplit,
  linkType,
}) => {
  const customerInfo = useSelector((state) => state.customerInfo);
  const { externalSiteModal, setExternalSiteModal } = useAppContext();
  const { ssoModalState, setSsoModalState, resetSsoModal } =
    useSSOModalContext();
  const { showMemberModal, routeLink } = ssoModalState;
  const { MIX_REACT_OKTA_API_URL } = process.env;

  useEffect(() => {
    if (!showMemberModal && routeLink && ssoModalState.membershipKey) {
      handleClick({
        membershipKey: ssoModalState.membershipKey,
        link: ssoModalState.routeLink,
      });
    }
  }, [showMemberModal]);

  const displayMembersModal = (routeLink, externalLinkName) => {
    setSsoModalState({
      ...ssoModalState,
      showMemberModal: true,
      routeLink,
      externalLinkName,
      membershipSplit,
      featureNameSplit,
    });
  };

  const handleClick = ({ membershipKey, link }) => {
    label = ssoModalState.externalLinkName
      ? ssoModalState.externalLinkName
      : label;
    console.log("debug", linkType);
    if (linkType === "cvs") {
      fetch(`${MIX_REACT_OKTA_API_URL}/users/${customerInfo?.data?.oktaId}`, {
        method: "POST",
        credentials: "include",
        headers: {
          Accpet: "application/json",
        },
        body: {
          profile: {
            targetURL:
              "https://www.caremark.com/drugSearchInit.do?newLogin=yes",
          },
        },
      })
        .then((data) => {
          setExternalSiteModal({
            ...externalSiteModal,
            isVisible: true,
            link,
            target,
            segmentPageCategory,
            segmentTitle,
            segmentTargetMemberId,
            membershipKey,
            label,
          });
          resetSsoModal();
        })
        .catch((error) => {
          console.error("Error caught: ", error.message);
        });
    } else {
      setExternalSiteModal({
        ...externalSiteModal,
        isVisible: true,
        link,
        target,
        segmentPageCategory,
        segmentTitle,
        segmentTargetMemberId,
        membershipKey,
        label,
      });
      resetSsoModal();
    }
  };

  const hasDependents = (customerInfo) =>
    customerInfo?.data?.dependents.filter((plan) => plan.Status === "active")
      .length > 0
      ? true
      : false;
  const isDual = (customerInfo) =>
    customerInfo?.data?.hohPlans.filter(
      (plan) => plan.MembershipStatus === "active",
    ).length > 1
      ? true
      : false;

  return (
    <>
      {hasDependents(customerInfo) || isDual(customerInfo) ? (
        <Link
          onClick={() => displayMembersModal(link, label)}
          segment-track={segmentTrack}
          segement-props={segmentProps}
          styles={styles}
        >
          {children}
        </Link>
      ) : (
        <Link
          onClick={() =>
            handleClick({
              membershipKey: customerInfo?.data?.hohPlans[0]?.MembershipKey,
              link,
            })
          }
          segment-track={segmentTrack}
          segement-props={segmentProps}
          styles={styles}
        >
          {children}
        </Link>
      )}
    </>
  );
};

export const Link = styled.span`
  ${(props) => props.styles && props.styles}
`;

export default ExternalSiteLinkSSO;
