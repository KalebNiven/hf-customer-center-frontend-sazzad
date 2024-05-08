import React from "react";
import SignatureChecklist from "../../components/home/signatureChecklist";
import { SIGNATURE_CHECKLIST_PAGE } from "../../constants/splits";
import PageLayout from "../../layouts/PageLayout";

export default () => {
  return (
    <PageLayout splitFeatureName={SIGNATURE_CHECKLIST_PAGE}>
      <SignatureChecklist />
    </PageLayout>
  );
};
