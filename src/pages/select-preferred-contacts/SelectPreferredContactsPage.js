import React from "react";
import { PREFERRED_CONTACT_INFO_PAGE } from "../../constants/splits";
import PageLayout from "../../layouts/PageLayout";
import PreferredContactInfoPage from "../../preferredContactInfoPage";

export default () => {
  return (
    <PageLayout splitFeatureName={PREFERRED_CONTACT_INFO_PAGE}>
      <PreferredContactInfoPage />
    </PageLayout>
  );
};
