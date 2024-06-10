import React from "react";
import ExternalSiteLink from "../../../common/externalSiteLink";
import ExternalSiteLinkSSO from "../../../common/externalSiteLinkSSO";
import {
  ParticipatingLocationsLogoItem,
  ParticipatingLocationsLogo,
  externalLinkStyles,
} from "../styles";
import { SSO } from "../../config";

const ParticipatingLocations = ({ locations }) => {
  const isEven = (number) => number % 2 === 0;
  return (
    <>
      {locations?.map((logo, idx) =>
        logo.type === SSO ? (
          <ExternalSiteLinkSSO
            key={idx}
            link={logo.url}
            label={logo.label}
            target="_blank"
            styles={externalLinkStyles}
          >
            <ParticipatingLocationsLogoItem>
              <ParticipatingLocationsLogo src={logo.img} />
            </ParticipatingLocationsLogoItem>
          </ExternalSiteLinkSSO>
        ) : (
          <ExternalSiteLink
            key={idx}
            link={logo.url}
            label={logo.label}
            target="_blank"
            styles={externalLinkStyles}
          >
            <ParticipatingLocationsLogoItem>
              <ParticipatingLocationsLogo src={logo.img} />
            </ParticipatingLocationsLogoItem>
          </ExternalSiteLink>
        ),
      )}
      {isEven(locations.length) && (
        <ParticipatingLocationsLogoItem></ParticipatingLocationsLogoItem>
      )}
    </>
  );
};

export default ParticipatingLocations;
