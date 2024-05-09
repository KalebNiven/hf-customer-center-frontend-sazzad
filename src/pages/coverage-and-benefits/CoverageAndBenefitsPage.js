import React from "react";
import PageLayout from "../../layouts/PageLayout";
import CoverageBenefitsPage from "../../components/coverageBenefits/coverageBenefitsPage";
import { COVERAGE_BENEFITS_PAGE } from "../../constants/splits";

export default () => {
  return (
    <PageLayout splitFeatureName={COVERAGE_BENEFITS_PAGE}>
      <CoverageBenefitsPage />
    </PageLayout>
  );
};
