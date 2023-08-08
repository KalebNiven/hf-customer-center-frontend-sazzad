import React from 'react'
import MyHealthPage from '../../components/myHealth/myHealthPage'
import { MY_HEALTH_PAGE } from '../../constants/splits'
import PageLayout from '../../layouts/PageLayout'

export default () => {
    return (
        <PageLayout splitFeatureName={MY_HEALTH_PAGE}>
            <MyHealthPage />
        </PageLayout>
    )
}