import React from "react";
import FindCareDetails from "../../components/findACare/findCareDetails";
import { FIND_CARE_PCP_PAGE } from "../../constants/splits";
import PageLayout from "../../layouts/PageLayout";

export default () => {
  return (
    <PageLayout splitFeatureName={FIND_CARE_PCP_PAGE}>
      <FindCareDetails />
    </PageLayout>
  );
};
