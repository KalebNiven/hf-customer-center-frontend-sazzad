import React from "react";
import { HOME_PAGE } from "../constants/splits";
import PageLayout from "../layouts/PageLayout";
import HomePage from "../components/home/homePage";

export default () => {
  return (
    <PageLayout splitFeatureName={HOME_PAGE}>
      <HomePage />
    </PageLayout>
  );
};
