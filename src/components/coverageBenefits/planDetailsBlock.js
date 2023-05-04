import React, { useState, useEffect } from 'react'
import moment from 'moment';
import { useSelector } from "react-redux";
import { MainCard, InnerCard, Title, MemberID, DateValid, Status, Icon, BlueHeader, Row, HorizontalDivider, Category, CostData, SubCategory, DataBlock } from './styles';
import { toTitleCase } from '../../utils/strings';

const PlanDetailsBlock = ({ memberSelection }) => {
    const { coverage } = useSelector((state) => state.coverageBenefits);
    const { membershipStatus, memberId, planName, membershipEffectiveDate, membershipExpirationDate } = memberSelection;

    return (
        <MainCard>
        <InnerCard isEmpty={!coverage.deductibleFamily && !coverage.deductibleIndividual && !coverage.maxOutOfPocketFamily && !coverage.maxOutOfPocketIndividual}>
          <Title>{planName && toTitleCase(planName)}</Title>
          <Status status={membershipStatus.toUpperCase()}>{membershipStatus.toUpperCase()}</Status>
          <MemberID>Member ID: {memberId}</MemberID>
          <DateValid>{moment(membershipEffectiveDate).format('LL')} - {moment(membershipExpirationDate).format('LL')}</DateValid>
          {
            (coverage.deductibleFamily || coverage.deductibleIndividual) &&
            <>
              <Icon alt="" margin src="/react/images/icn-dollar.svg" />
              <BlueHeader margin>Cost</BlueHeader>
            </>
          }
          {
            (coverage.deductibleFamily || coverage.deductibleIndividual) &&
            <>
              <Row extra>
                <DataBlock>
                  <Category>Deductible</Category>
                  { coverage.deductibleFamily && <CostData>${coverage.deductibleFamily} {coverage.deductibleFamily && <SubCategory width="true">Family</SubCategory>}</CostData> }
                  { coverage.deductibleIndividual && <CostData>${coverage.deductibleIndividual} <SubCategory width="true">Individual</SubCategory></CostData> }
                </DataBlock>
              </Row>
              <HorizontalDivider />
            </>
          }
          {
            (coverage.maxOutOfPocketFamily || coverage.maxOutOfPocketIndividual) &&
            <>
              <Row extra>
                <DataBlock>
                  <Category>Maximum Out of Pocket</Category>
                  { coverage.maxOutOfPocketFamily && <CostData>${coverage.maxOutOfPocketFamily} {coverage.maxOutOfPocketFamily && <SubCategory width="true">Family</SubCategory>}</CostData> }
                  { coverage.maxOutOfPocketIndividual && <CostData>${coverage.maxOutOfPocketIndividual} <SubCategory width="true">Individual</SubCategory></CostData> }
                </DataBlock>
              </Row>
            </>
          }
        </InnerCard>
      </MainCard>
    )
}

export default PlanDetailsBlock
