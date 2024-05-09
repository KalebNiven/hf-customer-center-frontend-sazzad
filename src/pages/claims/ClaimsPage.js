import React from "react";
import ClaimsPage from "../../components/claims/claimsPage";
import { CLAIMS_PAGE } from "../../constants/splits";
import PageLayout from "../../layouts/PageLayout";

export default () => {
  return (
    <PageLayout splitFeatureName={CLAIMS_PAGE}>
      <ClaimsPage />
    </PageLayout>
  );
};
