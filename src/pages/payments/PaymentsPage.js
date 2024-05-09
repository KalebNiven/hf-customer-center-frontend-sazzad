import React from "react";
import PaymentPage from "../../components/payments/paymentPage";
import { PAYMENTS_PAGE } from "../../constants/splits";
import PageLayout from "../../layouts/PageLayout";

export default () => {
  return (
    <PageLayout splitFeatureName={PAYMENTS_PAGE}>
      <PaymentPage />
    </PageLayout>
  );
};
