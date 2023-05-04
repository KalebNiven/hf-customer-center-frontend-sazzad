import React from 'react'
import { CoverageNoteWrapper, CoverageNoteParagraph, CoverageNoteHeading, CoverageNoteDesc } from '../styles';
import { cardTypes } from "../../const"

const getCoverageNoteDescription = (cardType) => {
    switch(cardType) {
        case cardTypes.otc:
            return "If your card is lost or stolen, please report it immediately by calling your Signature (HMO) Member Services at 1-855-771-1081.";
        case cardTypes.otcPlus:
            return "If your card is lost or stolen, please report it immediately by calling Member Services at 1-888-260-1010.";
        case cardTypes.flex:
            return "If your card is lost or stolen, please report it immediately by calling Member Services at 1-833-350-2910.";
        default: 
            return "If your card is lost or stolen, please report it immediately by calling Member Services at 1-888-260-1010.";
    }
}

const CoverageNote = ({ cardType, resetPeriod }) => {
    return (
        <CoverageNoteWrapper>
            <CoverageNoteHeading>{cardType} Card Lost or Stolen?</CoverageNoteHeading>
            <CoverageNoteDesc>{getCoverageNoteDescription(cardType)}</CoverageNoteDesc>
            <CoverageNoteParagraph margin="50px 0 0 0">Coverage is provided by Healthfirst Health Plan, Inc. or Healthfirst Insurance Company, Inc. (“Healthfirst”). Healthfirst Medicare Plan has HMO and PPO plans with a Medicare contract. Our SNPs also have contracts with the NY State Medicaid program. Enrollment in Healthfirst Medicare Plan depends on contract renewal. Plans contain exclusions and limitations.</CoverageNoteParagraph>
            <CoverageNoteParagraph>Healthfirst complies with applicable Federal civil rights laws and does not discriminate on the basis of race, color, national origin, age, disability, or sex. OTC items are subject to the plan’s list of eligible items and the plan’s participating network of retail, online, and utility providers.</CoverageNoteParagraph>
            <CoverageNoteParagraph margin="50px 0 0 0">© 2022 HF Management Services, LLC  1059-22</CoverageNoteParagraph>
        </CoverageNoteWrapper>
    )
}

export default CoverageNote
