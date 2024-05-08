import React from "react";
import MyHealthCheckList from "../../components/myHealth/myHealthCheckList";
import PageLayout from "../../layouts/PageLayout";
import { MY_HEALTH_PAGE } from "../../constants/splits";

export default () => {
  return (
    <PageLayout splitFeatureName={MY_HEALTH_PAGE}>
      <MyHealthCheckList />
    </PageLayout>
  );
};
