import React from "react";
import { SHOW_TRANSPORTATION_CARD } from "../../constants/splits";
import PageLayout from "../../layouts/PageLayout";
import TransporationPage from "../../components/transportation/TransporationPage";

export default () => {
  return (
    <PageLayout splitFeatureName={SHOW_TRANSPORTATION_CARD}>
      <TransporationPage />
    </PageLayout>
  );
};
