import React from 'react'
import AuthorizationDetailsPage from '../../components/authorizations/authorizationDetailsPage'
import { AUTHORIZATIONS_PAGE } from '../../constants/splits'
import PageLayout from '../../layouts/PageLayout'

export default () => {
    return (
        <PageLayout splitFeatureName={AUTHORIZATIONS_PAGE}>
            <AuthorizationDetailsPage />
        </PageLayout>
    )
}