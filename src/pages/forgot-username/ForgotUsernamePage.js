import React from 'react'
import ForgotUserPage from '../../components/auth/registration/forgotUsernamePage'
import AuthPageLayout from '../../layouts/AuthPageLayout'
import { FORGOT_USERNAME_PAGE } from '../../constants/splits'

export default () => {
    return (
        <AuthPageLayout splitFeatureName={FORGOT_USERNAME_PAGE}>
            <ForgotUserPage />
        </AuthPageLayout>
    )
}