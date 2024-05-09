import React from "react";
import AuthorizationPage from "../../components/authorizations/authorizationPage";
import { AUTHORIZATIONS_PAGE } from "../../constants/splits";
import PageLayout from "../../layouts/PageLayout";

export default () => {
  return (
    <PageLayout splitFeatureName={AUTHORIZATIONS_PAGE}>
      <AuthorizationPage />
    </PageLayout>
  );
};
