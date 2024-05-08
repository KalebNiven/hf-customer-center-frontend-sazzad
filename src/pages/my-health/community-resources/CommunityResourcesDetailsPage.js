import React from "react";
import NowPowDetailsView from "../../../components/myHealth/nowPowDetailsView";
import { COMMUNITY_RESOURCES_PAGE } from "../../../constants/splits";
import PageLayout from "../../../layouts/PageLayout";

export default () => {
  return (
    <PageLayout splitFeatureName={COMMUNITY_RESOURCES_PAGE}>
      <NowPowDetailsView />
    </PageLayout>
  );
};
