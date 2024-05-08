import React, { useEffect, useState, Fragment } from "react";
import styled from "styled-components";
import { requestCustomerOOP } from "../../store/actions/index";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../common/spinner";
import GlobalStyle from "../../styles/GlobalStyle";
import { cards, content } from "../../data/yearToDate";
import { numberWithCommas } from "../../utils/format";
import DropdownSelect from "../common/dropdownSelect";

const YearToDatePage = () => {
  const dispatch = useDispatch();
  const oop = useSelector((state) => state.oop);
  const { oopList, loading } = oop;
  const customerInfo = useSelector((state) => state.customerInfo.data);

  const [currentOOP, setCurrentOOP] = useState(null);
  const [memberships, setMemberships] = useState([]);
  const [membershipSelection, setMembershipSelection] = useState(null);

  useEffect(() => {
    dispatch(requestCustomerOOP());
    formatMemberDDList();
  }, []);

  useEffect(() => {
    if (oopList) setCurrentOOP(oopList[0]);
  }, [oopList]);

  const formatNameCapitalize = (name) => {
    name = name.toLowerCase();
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  const formatMemberDDList = () => {
    var memberships = [];

    customerInfo["hohPlans"].forEach((plan) => {
      var hohplan = {
        label:
          formatNameCapitalize(plan.FirstName) +
          " " +
          formatNameCapitalize(plan.LastName),
        value: plan.MemberId,
        planName: formatNameCapitalize(plan.PlanName),
        membershipStatus: plan.MembershipStatus,
        membershipEffectiveDate: plan.MembershipEffectiveDate,
        membershipExpirationDate: plan.MembershipExpirationDate,
        companyCode: plan.CompanyCode,
        firstName: plan.FirstName,
        lastName: plan.LastName,
      };
      memberships.push(hohplan);
    });

    customerInfo["dependents"].forEach((dependent) => {
      var member = {
        label:
          formatNameCapitalize(dependent.firstName) +
          " " +
          formatNameCapitalize(dependent.lastName),
        value: dependent.memberId,
        planName: dependent.planName,
      };
      memberships.push(member);
    });
    setMemberships(memberships);
  };

  const handleMembershipSelection = (memberId) => {
    oop.oopList.forEach((item) => {
      if (item.memberId === memberId) {
        setCurrentOOP(item);
      }
    });
    setMembershipSelection(memberId);
  };

  return !oopList || !currentOOP || loading ? (
    <Spinner />
  ) : currentOOP.oopLength ? (
    <YearToDateContainer>
      <GlobalStyle />
      <DropDownWrapper>
        {memberships && memberships.length > 1 ? (
          <MemberDropDownSelect
            showImage={true}
            selected={{
              label:
                formatNameCapitalize(customerInfo.firstName) +
                " " +
                formatNameCapitalize(customerInfo.lastName),
            }}
            values={memberships}
            onSelect={handleMembershipSelection}
            //error={phoneTypeError}
            //onInvalidateError={invalidatePhoneTypeError}
            errorMessage="Please select an option."
          />
        ) : null}
      </DropDownWrapper>
      {content.map((oopItem) => (
        <Fragment key={oopItem.id}>
          <IndividualTxt>{oopItem.type}</IndividualTxt>
          <IndividualCnt>
            {oopItem.data.map((item) => (
              <Paper key={item.id}>
                <HeaderTxt>{cards[item.title].header}</HeaderTxt>
                <Content>
                  <Annualdeduct>{cards[item.title].maxTitle}</Annualdeduct>
                  <Amount>
                    {currentOOP.oop[item.title] !== undefined
                      ? "$" +
                        numberWithCommas(
                          parseFloat(
                            currentOOP.oop[item.title].maximumamount,
                          ).toFixed(2),
                        )
                      : "Not Available"}
                  </Amount>
                </Content>
                <Content>
                  <Annualdeduct>{cards[item.title].currrentTitle}</Annualdeduct>
                  <Amount>
                    {currentOOP.oop[item.title] !== undefined
                      ? "$" +
                        numberWithCommas(
                          parseFloat(
                            currentOOP.oop[item.title].currentamount,
                          ).toFixed(2),
                        )
                      : "Not Available"}
                  </Amount>
                </Content>
              </Paper>
            ))}
          </IndividualCnt>
        </Fragment>
      ))}
    </YearToDateContainer>
  ) : null;
};

const YearToDateContainer = styled.div`
  * {
    box-sizing: content-box;
  }

  @media only screen and (min-width: 769px) {
    margin: 42px 8px 8px 8px;
  }
`;

const IndividualTxt = styled.div`
  @media only screen and (min-width: 769px) {
    margin: 31px 140px 0px 8px;
  }
  margin: 31px 258px 13px 16px;
  font-size: 18px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: normal;
  color: #003863;
`;

const Paper = styled.div`
  @media only screen and (min-width: 769px) {
    width: 492px;
    margin: 16px 8px 10px 0px;
    border: none;
  }
  margin: 16px 0px 10px 0px;
  padding: 16px 36px 32px 16px;
  border-radius: 4px;
  border: solid 1px #d8d8d8;
  box-shadow: 0 2px 8px 0 #d8d8d8;
  background-color: #ffffff;
  place-self: flex-start;
`;

const IndividualCnt = styled.div`
  @media only screen and (min-width: 769px) {
    display: flex;
  }
  display: contents;
  flex: 1 1 auto;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  padding-right: 8px;
  padding-left: 8px;
  width: 100%;
`;

const HeaderTxt = styled.div`
  margin: 0 88px 12px 0;
  font-size: 16px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  color: #474b55;
`;

const DropDownWrapper = styled.div`
  margin-left: 8px;
`;
const MemberDropDownSelect = styled(DropdownSelect)``;

const Content = styled.div`
  display: flex;
  flex: 1 1 auto;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  padding-left: 8px;
  width: 100%;
  margin-bottom: 1rem;
`;

const Annualdeduct = styled.div`
  margin: 2px 0px -10px -7px;
  font-size: 12px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: 0.2px;
  text-transform: uppercase;
  color: #757575;
  flex: 0.9;
  min-height: 30px;
  max-width: 290px;
`;

const Amount = styled.div`
  margin: 2px 0px 8px 40px;
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.14;
  letter-spacing: normal;
  color: #474b55;
  flex: 0.1;
  flex-basis: 60px;
  min-width: 60px;
  word-break: break-word;
`;

export default YearToDatePage;
