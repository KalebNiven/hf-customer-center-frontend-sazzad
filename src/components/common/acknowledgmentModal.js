import React, { useEffect, useState } from "react";
import { useAppContext } from "../../AppContext";
import {
  Button,
  ButtonsWrapper,
  CloseIcon,
  CloseIconWrapper,
  Description,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Title,
  Wrappper,
} from "./externalSiteModal";
import { AnalyticsTrack } from "../common/segment/analytics";
import {
  ANALYTICS_TRACK_CATEGORY,
  ANALYTICS_TRACK_TYPE,
} from "../../constants/segment";
import { useSelector } from "react-redux";
import styled from "styled-components";
import ExternalSiteLink from "./externalSiteLink";

const ACKNOWLEDGMENTS = {
  "Manage Prescriptions": {
    title: <Title>Prescription drugs are now covered by Medicaid NYRx.</Title>,
    description: (
      <Description>
        Starting April 1, 2023, prescription drugs are covered by Medicaid NYRx,
        the New York State Medicaid pharmacy program. For more information,
        visit{" "}
        <ExternalSiteLink
          link="https://member.emedny.org"
          label="member.emedny.org"
          target="_blank"
          styles={{ color: "#008bbf", cursor: "pointer", fontWeight: 700 }}
        >
          member.emedny.org
        </ExternalSiteLink>{" "}
        or call <b>1-855-648-1909</b> (TTY 1-800-662-1220). They can answer your
        call: Monday - Friday, 8am - 8pm Saturday, 9am - 1 pm.
      </Description>
    ),
    confirmation: "close",
  },
};

const AcknowledgmentModal = () => {
  const { acknowledgmentModal, resetAcknowledgmentModal } = useAppContext();
  const { externalSiteModal } = useAppContext();
  const customerInfo = useSelector((state) => state.customerInfo);

  useEffect(() => {
    return () => {
      // reset modal content on component unmount
      resetAcknowledgmentModal();
    };
  }, []);

  useEffect(() => {
    resetAcknowledgmentModal();
  }, [externalSiteModal]);

  const handleClose = () => {
    if (acknowledgmentModal.callback) acknowledgmentModal.callback();

    AnalyticsTrack("Acknowledgement Modal Resolved", customerInfo, {
      raw_text: ACKNOWLEDGMENTS[acknowledgmentModal.label].confirmation,
      destination_url: "N/A",
      description: acknowledgmentModal.label + " acknowledgment resolved",
      category: ANALYTICS_TRACK_CATEGORY.home,
      type: ANALYTICS_TRACK_TYPE.buttonClicked,
      targetMemberId: customerInfo.data.memberId,
      location: {
        desktop: {
          width: 1024,
          value: "center",
        },
        tablet: {
          width: 768,
          value: "center",
        },
        mobile: {
          width: 0,
          value: "center",
        },
      },
    });
    resetAcknowledgmentModal();
  };

  return (
    <>
      {acknowledgmentModal.isVisible && (
        <AcknowledgementWrapper>
          <Dialog>
            <DialogHeader>
              <CloseIconWrapper>
                <CloseIcon
                  src="/react/images/icn-close.svg"
                  onClick={handleClose}
                />
              </CloseIconWrapper>
              {ACKNOWLEDGMENTS[acknowledgmentModal.label].title}
            </DialogHeader>
            <DialogBody>
              <Description>
                {ACKNOWLEDGMENTS[acknowledgmentModal.label].description}
              </Description>
            </DialogBody>
            <DialogFooter>
              <ButtonsWrapper>
                <Button onClick={handleClose}>
                  {ACKNOWLEDGMENTS[acknowledgmentModal.label].confirmation}
                </Button>
              </ButtonsWrapper>
            </DialogFooter>
          </Dialog>
        </AcknowledgementWrapper>
      )}
    </>
  );
};

export default AcknowledgmentModal;

const AcknowledgementWrapper = styled(Wrappper)`
  cursor: auto;
`;
