import React from "react";
import FormsAndDocuments from "../../components/formsanddocuments";
import { SHOW_CC_FORMS_AND_DOCS } from "../../constants/splits";
import PageLayout from "../../layouts/PageLayout";

export default () => {
  return (
    <PageLayout splitFeatureName={SHOW_CC_FORMS_AND_DOCS}>
      <FormsAndDocuments />
    </PageLayout>
  );
};
