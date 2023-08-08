import React from 'react'
import OTCWidget from '../../components/overTheCounter/otcWidget'
import { OTC_WIDGET_PAGE } from '../../constants/splits'
import PageLayout from '../../layouts/PageLayout'

export default () => {
    return (
        <PageLayout splitFeatureName={OTC_WIDGET_PAGE}>
            <OTCWidget />
        </PageLayout>
    )
}