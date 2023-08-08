import React from 'react'
import Login from '../../components/auth/login'
import AuthPageLayout from '../../layouts/AuthPageLayout'
import { LOGIN_PAGE } from '../../constants/splits'

export default () => {
    return (
        <AuthPageLayout splitFeatureName={LOGIN_PAGE}>
            <Login />
        </AuthPageLayout>
    )
}