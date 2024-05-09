import React from "react";
import OTCInfoPage from "../../components/overTheCounter/infoPages/components/otcInfoPage";
import { OTC_PAGE } from "../../constants/splits";
import PageLayout from "../../layouts/PageLayout";

export default () => {
  return (
    <PageLayout splitFeatureName={OTC_PAGE}>
      <OTCInfoPage />
    </PageLayout>
  );
};
