import React, { useEffect } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { SHOW_COST_ESTIMATOR_WIDGET } from "../../constants/splits";
import { FeatureTreatment } from "../../libs/featureFlags";
import useLogError from "../../hooks/useLogError";

export const CostEstimatorPage = () => {
  const customerInfo = useSelector((state) => state.customerInfo.data);

  const splitAttributes = {
    lob: customerInfo.sessLobCode,
    companyCode: customerInfo.companyCode,
    benefitPackage: customerInfo.benefitPackage,
    membershipStatus: customerInfo.membershipStatus,
    accountStatus: customerInfo.accountStatus,
  };

  return (
    <>
      <FeatureTreatment
        treatmentName={SHOW_COST_ESTIMATOR_WIDGET}
        onLoad={() => {}}
        onTimedout={() => {}}
        attributes={splitAttributes}
      >
        <CostEstimatorWidget removeCostEstimatorWidget={false} />
        <EmbedContainer id="costCalculatorPageWrapper" />
      </FeatureTreatment>
      <FeatureTreatment
        treatmentName={SHOW_COST_ESTIMATOR_WIDGET}
        onLoad={() => {}}
        onTimedout={() => {}}
        attributes={splitAttributes}
        invertBehavior
      >
        <CostEstimatorWidget removeCostEstimatorWidget={true} />
        <EmbedContainer id="costCalculatorPageWrapper" />
      </FeatureTreatment>
    </>
  );
};

export const CostEstimatorWidget = ({ removeCostEstimatorWidget }) => {
  const { MIX_REACT_COST_CALCULATOR_BASE_URL } = process.env;
  const customerInfo = useSelector((state) => state.customerInfo.data);
  const jwt_token_with_bearer = customerInfo.id_token;
  const jwt_token =
    jwt_token_with_bearer === undefined
      ? jwt_token_with_bearer
      : jwt_token_with_bearer.replace("Bearer ", "");
  const { logError } = useLogError();

  useEffect(() => {
    if (!removeCostEstimatorWidget) {
      const costEstimatorContainer = document.querySelector(
        "#costCalculatorPageWrapper"
      );
      if (!costEstimatorContainer) return;
      const script = document.createElement("script");
      script.src = `${MIX_REACT_COST_CALCULATOR_BASE_URL}/cost-estimator-widget.js`;
      script.async = true;
      script.onload = () => {
        try {
          window.CostEstimator.mount({
            parentElement: "#costCalculatorPageWrapper",
            oktaToken: jwt_token,
          });
        } catch (error) {
          (async () => {
            try {
              await logError(error);
            } catch (err) {
              console.error("Error caught: ", err.message);
            }
          })();
        }
      };
      costEstimatorContainer.appendChild(script);

      return () => {
        costEstimatorContainer.removeChild(script);
      };
    } else {
      try {
        window.CostEstimator && window.CostEstimator.unmount();
      } catch (error) {
        (async () => {
          try {
            await logError(error);
          } catch (err) {
            console.error("Error caught: ", err.message);
          }
        })();
      }
    }
  }, []);

  return <></>;
};

export const RemoveCostEstimatorWidgetScript = () => {
  useEffect(() => {
    window.CostEstimator && window.CostEstimator.unmount();
    return () => {};
  }, []);
};

const EmbedContainer = styled.div`
  position: relative;
`;

export default CostEstimatorPage;
