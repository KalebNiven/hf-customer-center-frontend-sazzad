import React from "react";
import PageLayout from "../../layouts/PageLayout";
import { SHOW_MY_REWARDS } from "../../constants/splits";
import MyRewards from "../../components/myHealth/myRewards";

export default () => {
  return (
    <PageLayout splitFeatureName={SHOW_MY_REWARDS}>
      <MyRewards />
    </PageLayout>
  );
};
