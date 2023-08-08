import React from 'react'
import NowPowCategoryListPage from '../../../components/myHealth/nowPowCategoryListPage'
import { COMMUNITY_RESOURCES_PAGE } from '../../../constants/splits'
import PageLayout from '../../../layouts/PageLayout'

export default () => {
    return (
        <PageLayout splitFeatureName={COMMUNITY_RESOURCES_PAGE}>
            <NowPowCategoryListPage />
        </PageLayout>
    )
}