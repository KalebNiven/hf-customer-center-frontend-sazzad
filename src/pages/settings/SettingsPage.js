import React from 'react'
import AccountSettings from '../../components/settings/AccountSettings'
import { SETTINGS_PAGE } from '../../constants/splits'
import PageLayout from '../../layouts/PageLayout'

export default () => {
    return (
        <PageLayout splitFeatureName={SETTINGS_PAGE}>
            <AccountSettings />
        </PageLayout>
    )
}