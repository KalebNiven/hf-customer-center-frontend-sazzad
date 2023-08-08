import React from 'react'
import ActivateOTCCardPage from '../../components/overTheCounter/activateOTCCardPage'
import { OTC_PAGE } from '../../constants/splits'
import PageLayout from '../../layouts/PageLayout'

export default () => {
    return (
        <PageLayout splitFeatureName={OTC_PAGE}>
            <ActivateOTCCardPage />
        </PageLayout>
    )
}