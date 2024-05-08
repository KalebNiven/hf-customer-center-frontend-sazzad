import React from "react";
import Documents from "../../components/documents";
import { DOCUMENTS_PAGE } from "../../constants/splits";
import PageLayout from "../../layouts/PageLayout";

export default () => {
  return (
    <PageLayout splitFeatureName={DOCUMENTS_PAGE}>
      <Documents />
    </PageLayout>
  );
};
