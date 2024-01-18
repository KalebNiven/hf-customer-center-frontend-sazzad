import React from 'react'
import { COMMUNITY_RESOURCES_PAGE } from '../../../constants/splits'
import NowPowSection from '../../../components/myHealth/nowPowSection'
import PageLayout from '../../../layouts/PageLayout'
import CommunityResourcesWidget from '../../../components/myHealth/CommunityResourcesWidget'

export default () => {
    return (
        <PageLayout splitFeatureName={COMMUNITY_RESOURCES_PAGE}>
            <CommunityResourcesWidget />
            <NowPowSection />
        </PageLayout>
    )
}