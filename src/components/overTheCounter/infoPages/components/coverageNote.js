import React from 'react'
import { CoverageNoteWrapper, CoverageNoteParagraph, CoverageNoteHeading, CoverageNoteDesc } from '../styles';

const CoverageNote = ({ cardType, resetPeriod }) => {
    return (
        <CoverageNoteWrapper>
            <CoverageNoteHeading>{cardType} Card Lost or Stolen?</CoverageNoteHeading>
            <CoverageNoteDesc>Call the Member Services phone number on your Member ID card for assistance.Please note that you’ll need to report the card lost or stolen within the {resetPeriod} that the card was lost or stolen in order to get credit for that {resetPeriod}. If you report the card lost or stolen in the {resetPeriod} after it was lost or stolen, you might not receive credit for that {resetPeriod}.</CoverageNoteDesc>
            <CoverageNoteParagraph margin="50px 0 0 0">Coverage is provided by Healthfirst Health Plan, Inc. or Healthfirst Insurance Company, Inc. (“Healthfirst”). Healthfirst Medicare Plan has HMO and PPO plans with a Medicare contract. Our SNPs also have contracts with the NY State Medicaid program. Enrollment in Healthfirst Medicare Plan depends on contract renewal. Plans contain exclusions and limitations.</CoverageNoteParagraph>
            <CoverageNoteParagraph>Healthfirst complies with applicable Federal civil rights laws and does not discriminate on the basis of race, color, national origin, age, disability, or sex. OTC items are subject to the plan’s list of eligible items and the plan’s participating network of retail, online, and utility providers.</CoverageNoteParagraph>
            { cardType !== "Flex" && <CoverageNoteParagraph>OTC items are subject to the plan’s list of eligible items and the plan’s participating network of retail, online, and utility providers. Balances expire upon disenrollment.</CoverageNoteParagraph>}
            <CoverageNoteParagraph margin="50px 0 0 0">© 2022 HF Management Services, LLC  1059-22</CoverageNoteParagraph>
        </CoverageNoteWrapper>
    )
}

export default CoverageNote
