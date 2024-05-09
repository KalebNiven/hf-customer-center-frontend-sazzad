import React from "react";
import ClaimDetailsPage from "../../components/claims/claimDetailsPage";
import { CLAIMS_PAGE } from "../../constants/splits";
import PageLayout from "../../layouts/PageLayout";

export default () => {
  return (
    <PageLayout splitFeatureName={CLAIMS_PAGE}>
      <ClaimDetailsPage />
    </PageLayout>
  );
};
