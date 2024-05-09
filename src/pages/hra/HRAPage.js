import React from "react";
import PageLayout from "../../layouts/PageLayout";
import HRA from "../../components/hra/hraCard";
import { HRA_PAGE } from "../../constants/splits";

export default () => {
  return (
    <PageLayout splitFeatureName={HRA_PAGE}>
      <HRA />
    </PageLayout>
  );
};
