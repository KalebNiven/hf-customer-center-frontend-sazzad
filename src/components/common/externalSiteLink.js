import React from "react";
import { useAppContext } from "../../AppContext";
import styled from "styled-components";
import PropTypes from "prop-types";

const ExternalSiteLink = ({
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
}) => {
  const { externalSiteModal, setExternalSiteModal } = useAppContext();

  const handleClick = () => {
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
  };

  return (
    <Link
      onClick={handleClick}
      segment-track={segmentTrack}
      segement-props={segmentProps}
      styles={styles}
    >
      {children}
    </Link>
  );
};

export const Link = styled.span`
  ${(props) => props.styles && props.styles}
`;

export default ExternalSiteLink;

ExternalSiteLink.propTypes = {
  label: PropTypes.string,
};

ExternalSiteLink.defaultProps = {
  label: "External Site Link",
};
