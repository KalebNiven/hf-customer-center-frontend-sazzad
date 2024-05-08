import React from "react";
import ForgotPass from "../../components/auth/registration/forgotPasswordPage";
import AuthPageLayout from "../../layouts/AuthPageLayout";
import { FORGOT_PASSWORD_PAGE } from "../../constants/splits";

export default () => {
  return (
    <AuthPageLayout splitFeatureName={FORGOT_PASSWORD_PAGE}>
      <ForgotPass />
    </AuthPageLayout>
  );
};
