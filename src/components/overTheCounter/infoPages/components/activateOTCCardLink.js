import React from 'react'
import { StepsToActiveListItemActivateButton } from '../styles';
import { useHistory } from 'react-router-dom'

const ActivateOTCCardLink = () => {
    const history = useHistory();

    const handleClick = () => {
        history.push({ pathname: "/otc/activate-card" })
    }
      
    return (
        <StepsToActiveListItemActivateButton onClick={handleClick}>Activate Card</StepsToActiveListItemActivateButton>
    )
}

export default ActivateOTCCardLink
