import React from "react";
import FindCarePCP from "../../components/findACare/findCarePCP";
import { FIND_CARE_PCP_PAGE } from "../../constants/splits";
import PageLayout from "../../layouts/PageLayout";

export default () => {
  return (
    <PageLayout splitFeatureName={FIND_CARE_PCP_PAGE}>
      <FindCarePCP />
    </PageLayout>
  );
};
