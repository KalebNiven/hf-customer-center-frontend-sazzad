import React from "react";
import { CONST_ESTIMATOR_PAGE } from "../../constants/splits";
import CostEstimatorPage from "../../components/costEstimator/costEstimatorPage";
import PageLayout from "../../layouts/PageLayout";

export default () => {
  return (
    <PageLayout splitFeatureName={CONST_ESTIMATOR_PAGE}>
      <CostEstimatorPage />
    </PageLayout>
  );
};
