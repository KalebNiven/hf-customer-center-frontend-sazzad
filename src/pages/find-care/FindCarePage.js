import React from "react";
import FindCare from "../../components/findACare/findCarepage";
import PageLayout from "../../layouts/PageLayout";
import { FIND_CARE_PAGE } from "../../constants/splits";

export default () => {
  return (
    <PageLayout splitFeatureName={FIND_CARE_PAGE}>
      <FindCare />
    </PageLayout>
  );
};
