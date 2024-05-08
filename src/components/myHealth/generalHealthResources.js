import React from "react";
import styled from "styled-components";
import ResoucesList from "./resoucesList";

const GeneralHealthResources = ({ content }) => {
  return (
    <ResourcesWrapper>
      <Heading>General Health Resources</Heading>
      <ResoucesList content={content} />
    </ResourcesWrapper>
  );
};

export const ResourcesWrapper = styled.div`
  @media only screen and (max-width: 480px) {
    padding: 0 16px;
  }

  margin-bottom: 35px;
`;

export const Heading = styled.h2`
  flex-grow: 0;
  margin: 0 16px 19px 1px;
  font-size: 18px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: normal;
  text-align: left;
  color: #003863;
`;

export default GeneralHealthResources;
