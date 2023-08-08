import React from 'react'
import styled from 'styled-components'
import { useHealthResourcesContext } from './healthResourcesContext'

const HealthResourcesChevron = ({ currentMemberInfo }) => {
    const { surveyLocalStatuses, resoucesVisible, setResoucesVisible, currentResources } = useHealthResourcesContext()

    const handleResoucesDropdownClick = (memberId) => {
        let newResourcesVisible = [...resoucesVisible];
        if(resoucesVisible.includes(memberId)) {
          newResourcesVisible = resoucesVisible.filter(item => item !== memberId)
        } else {
          newResourcesVisible.push(memberId)
        }
        setResoucesVisible(newResourcesVisible)
    }

    const surveyCompleteLocally = (memberId) => {
        let isComplete = false;
        // surveyLocalStatuses was built based on localDB survey responses
        if(surveyLocalStatuses && surveyLocalStatuses[memberId] && surveyLocalStatuses[memberId] === "COMPLETE") isComplete = true;
        return isComplete
    }

    return (
        <>
            {
                (surveyCompleteLocally(currentMemberInfo.memberId) && currentResources[currentMemberInfo.memberId]?.length > 0) ? <ChevronIcon src={`react/images/icn-${resoucesVisible.includes(currentMemberInfo.memberId) ? "up" : "down"}-arrow.svg`} onClick={() => handleResoucesDropdownClick(currentMemberInfo.memberId, currentMemberInfo.companyCode)}/> : surveyCompleteLocally(currentMemberInfo.memberId) ? <ChevronIconPlaceholder /> : null
            }
        </>
    )
}

const ChevronIcon = styled.img`
  cursor: pointer;
  margin-left: 16px;
  width: 20px;
`;

const ChevronIconPlaceholder = styled.span`
  margin-left: 16px;
  width: 20px;
`;

export default HealthResourcesChevron
