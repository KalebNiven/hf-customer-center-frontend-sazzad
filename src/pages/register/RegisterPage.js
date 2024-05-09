import React from "react";
import CreateAccount from "../../components/auth/registration/createAccount";
import AuthPageLayout from "../../layouts/AuthPageLayout";
import { REGISTER_PAGE } from "../../constants/splits";

export default () => {
  return (
    <AuthPageLayout splitFeatureName={REGISTER_PAGE}>
      <CreateAccount />
    </AuthPageLayout>
  );
};
