import React from "react";
import AnnualHealthAssessment from "../../components/myHealth/annualHealthAssessment";
import { MY_HEALTH_PAGE } from "../../constants/splits";
import PageLayout from "../../layouts/PageLayout";

export default () => {
  return (
    <PageLayout splitFeatureName={MY_HEALTH_PAGE}>
      <AnnualHealthAssessment />
    </PageLayout>
  );
};
