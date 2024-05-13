import React, { useEffect } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  SHOW_HEALTH_ASSESMENT_SURVEY,
  SHOW_MY_HEALTH_CHECKLIST,
  SHOW_NOW_POW,
} from "../../constants/splits";
import { FeatureTreatment } from "../../libs/featureFlags";
import { handleSegmentClick } from "../../libs/segment";
import { useState } from "react";
import { getValidHRASurveryPlan } from "../../utils/misc";

const MyHealthPage = () => {
  const [showHRACard, setShowHRACard] = useState(true);

  useEffect(() => {
    sessionStorage.setItem("longLoad", false);
    setShowHRACard(
      getValidHRASurveryPlan(customerInfo?.hohPlans) ? true : false,
    );
  }, []);

  const history = useHistory();

  const customerInfo = useSelector((state) => state.customerInfo.data);

  const splitAttributes = {
    memberId: customerInfo?.memberId,
    customerId: customerInfo?.customerId,
    lob: customerInfo?.sessLobCode,
    membershipStatus: customerInfo?.membershipStatus,
    accountStatus: customerInfo?.accountStatus,
    companyCode: customerInfo?.hohPlans?.map((plan) => plan.CompanyNumber),
    benefitPackage: customerInfo?.hohPlans?.map((plan) => plan.BenefitPackage),
  };

  const handleSegment = (label, href, description) => {
    handleSegmentClick(
      href,
      label,
      description,
      "link",
      "bottom",
      customerInfo,
      "myHealth",
    );
    history.push(href);
  };

  return (
    <ContainerWrapper>
      <Container>
        <Header>My Health</Header>
        <FeatureTreatment
          treatmentName={SHOW_HEALTH_ASSESMENT_SURVEY}
          onLoad={() => {}}
          onTimedout={() => {}}
          attributes={splitAttributes}
        >
          {showHRACard && (
            <Card>
              <Wrapper>
                <Image src="/react/images/exam_plus.svg" />
                <ContentWrapper>
                  <Title>Annual Health Assessment</Title>
                  <Content>
                    Please complete this voluntary Health Questionnaire. This
                    will help us to meet your health care needs. This survey is
                    confidential and will NOT affect your healthcare coverage.
                    If you have any other questions about this Health
                    Questionnaire, please call Member Services.{" "}
                  </Content>
                  <Navigator
                    onClick={() =>
                      handleSegment(
                        "Take Assessment",
                        "/my-health/annual-health-assessment",
                        "Annual Health Assessment",
                      )
                    }
                  >
                    Take Assessment
                  </Navigator>
                </ContentWrapper>
              </Wrapper>
            </Card>
          )}
        </FeatureTreatment>
        <FeatureTreatment
          treatmentName={SHOW_MY_HEALTH_CHECKLIST}
          onLoad={() => {}}
          onTimedout={() => {}}
          attributes={splitAttributes}
        >
          <Card>
            <Wrapper>
              <Image src="/react/images/check_list.svg" />
              <ContentWrapper>
                <Title>My Health Checklist</Title>
                <Content>
                  Based on a number of factors (including your age, gender, and
                  health history), you should consider completing the following
                  activities. These recommendations are based on data available
                  to Healthfirst.
                </Content>
                <Navigator
                  onClick={() =>
                    handleSegment(
                      "View My Health Checklist",
                      "/my-health/my-health-checklist",
                      "My Health Checklist",
                    )
                  }
                >
                  View My Health Checklist
                </Navigator>
              </ContentWrapper>
            </Wrapper>
          </Card>
        </FeatureTreatment>
        <FeatureTreatment
          treatmentName={SHOW_NOW_POW}
          onLoad={() => {}}
          onTimedout={() => {}}
          attributes={splitAttributes}
        >
          <Card>
            <Wrapper>
              <Image src="/react/images/community.svg" />
              <ContentWrapper>
                <Title>Community Resources</Title>
                <Content>
                  Find essential services nearby—food, housing, education,
                  financial and legal assistance, and more.
                </Content>
                <Navigator
                  onClick={() =>
                    handleSegment(
                      "Browse Resources",
                      "/my-health/community-resources",
                      "Community Resources",
                    )
                  }
                >
                  Browse Resources
                </Navigator>
              </ContentWrapper>
            </Wrapper>
          </Card>
        </FeatureTreatment>
      </Container>
    </ContainerWrapper>
  );
};

const ContainerWrapper = styled.div`
  display: flex;
  justify-content: center;
  height: 100%;
`;

const Container = styled.div`
  max-width: 1024px;
  height: 100%;
  margin: 2rem 1rem;
`;

const Image = styled.img`
  @media only screen and (max-width: 760px) {
    width: 96px;
    height: 96px;
  }
`;

const Navigator = styled.div`
  font-weight: 600;
  font-size: 14px;
  color: #008bbf;
  cursor: pointer;
`;

const ContentWrapper = styled.div`
  padding: 13px;
`;

const Wrapper = styled.div`
  display: flex;
  @media only screen and (max-width: 760px) {
    flex-direction: column;
  }
`;

const Content = styled.div`
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: #474b55;
  margin-bottom: 8px;
`;

const Header = styled.div`
  width: 320px;
  height: 32px;
  left: 144px;
  top: 152px;
  font-weight: 600;
  font-size: 24px;
  line-height: 32px;
  color: #003863;
  margin-bottom: 32px;
`;

const Card = styled.div`
  padding: 24px;
  gap: 16px;
  background: #ffffff;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  margin-bottom: 16px;
`;

const Title = styled.div`
  font-weight: 600;
  font-size: 18px;
  line-height: 24px;
  color: #003863;
  margin-bottom: 8px;
`;

export default MyHealthPage;
