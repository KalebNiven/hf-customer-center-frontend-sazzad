import React from 'react'
import { MEMBER_ID_CARD_PAGE } from '../../constants/splits'
import PageLayout from '../../layouts/PageLayout'
import MemberIDCardPage from '../../components/memberIDCard/memberIDCardPage'

export default () => {
    return (
        <PageLayout splitFeatureName={MEMBER_ID_CARD_PAGE}>
            <MemberIDCardPage />
        </PageLayout>
    )
}