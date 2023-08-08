import styled from "styled-components";
import React from "react";
import GlobalStyle from "../../styles/GlobalStyle";
import moment from 'moment';
import { useSelector } from "react-redux";
import { useHistory } from 'react-router-dom';
import { useAppContext } from "../../AppContext"

const HealthFirstPlan = () => {


  const planDetails = useSelector((state) => state.customerInfo.data);
  const history = useHistory();
  const {planName,setPlanName} = useAppContext()

  const formatDate = (startDate, endDate, status) => {
    let validity = '';
    if (status === "active") {
      const memStartDate = moment(startDate).format('LL');
      validity = `${memStartDate} - Present`;
    }
    else {
      const memStartDate = moment(startDate).format('LL');
      const memExpdate = moment(endDate).format('LL');
      validity = `${memStartDate} - ${memExpdate}`;
    }
    return validity;
  }

  const handleButton = (planName) =>{
    setPlanName(planName)
    history.push(`/idcard`)
  }

  return (

    (planDetails.hohPlans !== undefined && planDetails.hohPlans.length > 1) && 
      <> <GlobalStyle />
        <MyHealthFirstPlan>
          My Other Healthfirst Plan
        </MyHealthFirstPlan>
        {
          planDetails.hohPlans.slice(1,planDetails.hohPlans.length).map((plan, index) => (
            <Card key={index}>
              <HealthPlan>
                <PlanImage alt = "" src="/react/images/ico-leaf-green.svg" />
                <PlanDetails>
                  <PlanName>{plan.PlanName.toLowerCase()}</PlanName>
                  <MemberDetails>
                    Member ID: {plan.MemberId}
                  </MemberDetails>
                </PlanDetails>
              </HealthPlan>
              <Validity>
                {formatDate(plan.MembershipEffectiveDate, plan.MembershipExpirationDate, plan.MembershipStatus)}
              </Validity>
              <Status status={plan.MembershipStatus}>
                <StatusTxt status={plan.MembershipStatus}>
                  {plan.MembershipStatus}
                </StatusTxt>
              </Status>
              {planDetails.membershipStatus === "active" &&
                <ViewMemberId className="myHealthPlan-coachmark" onClick={() => handleButton(plan.PlanName.toLowerCase()) }>
                  <MemberIcon alt = "" src="/react/images/icn-card.svg" />
                  <MemberTxt>View Member ID Card</MemberTxt>
                </ViewMemberId>}
            </Card>
          ))}
      </>
  );
};

export default HealthFirstPlan;

const MyHealthFirstPlan = styled.div`
  flex-grow: 0;
  font-size: 18px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: normal;
  text-align: left;
  color: #003863;
`;

const Card = styled.div`
  width:100%;
  flex-grow: 0;
  margin: 16px 0 32px;
  padding: 16px;
  border-radius: 4px;
  background-color: #ffffff;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
`;

const HealthPlan = styled.div`
  display:flex;
`;

const PlanImage = styled.img`
  width: 32px;
  height: 32px;
  flex-grow: 0;
  padding: 6px;
  background-color: #eeeeee;
  border-radius: 20px;
`;

const PlanDetails = styled.div``;

const PlanName = styled.div`
  flex-grow: 0;
  margin: 0 0px 2px 12px;
  font-size: 14px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.29;
  letter-spacing: normal;
  text-align: left;
  color: #474b55;
  text-transform:capitalize;
`;

const MemberDetails = styled.div`
  flex-grow: 0;
  margin: 2px 0 0 12px;
  font-size: 14px;
  font-weight: 300;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.14;
  letter-spacing: normal;
  text-align: left;
  color: #474b55;
`;

const Validity = styled.div`
  flex-grow: 0;
  margin: 12px 0 8px;
  font-size: 12px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: 0.2px;
  text-align: left;
  color: #474b55;
`;

const Status = styled.div`
  width: 90px;
  height: 20px;
  margin: 8px 213px 12px 0;
  padding: 4px 6px;
  background-color: ${props => props.status === 'active' ? '#3e7128' : props.status === 'inactive' ? '#d43900' : '#ffffff'} ;
  border-radius: 5px;
  border : ${props => props.status === 'upcoming' && 'solid 1px #529535'}
`;

const StatusTxt = styled.p`
  font-size: 12px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: 1.5px;
  text-align: center;
  text-transform:uppercase;
  color: ${props => props.status === 'upcoming' ? '#529535' : '#ffffff'};
`;

const ViewMemberId = styled.div`
  display:flex;
`;

const MemberIcon = styled.img`
  width: 20px;
  height: 20px;
  flex-grow: 0;
  object-fit: contain;
`;

const MemberTxt = styled.p`
  flex-grow: 0;
  margin: 1px 0 2px 8px;
  font-size: 14px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: left;
  color: #008bbf;
  cursor: pointer;

  &:hover{
    text-decoration: underline;
    text-decoration-color: black;
    text-decoration-thickness: 1px;
  }
  
`;

