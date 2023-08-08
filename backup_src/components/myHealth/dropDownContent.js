import React from 'react'
import styled from 'styled-components'
import ResoucesList from './resoucesList'
import Spinner from "../common/spinner";

const DropDownContent = ({ content }) => {
    return (
        <ResoucesDropdownWrapper>
            <ResoucesDropdownTitle>Recommened Resources</ResoucesDropdownTitle>
            <ResoucesList content={content} withBorder />
            { content.length > 0 ? null : <Spinner /> }
        </ResoucesDropdownWrapper>
    )
}

const ResoucesDropdownWrapper = styled.div`
  padding: 0 16px;
`;

const ResoucesDropdownTitle = styled.h3`
  margin: 16px 0;
  font-size: 16px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: normal;
  text-align: left;
  color: #003863;
`;

export default DropDownContent
