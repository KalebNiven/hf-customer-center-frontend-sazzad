import React from 'react'
import MemberIdCardWidget from '../../components/memberIDCard/memberIdCardWidget'
import { MEMBER_ID_CARD_PAGE } from '../../constants/splits'
import PageLayout from '../../layouts/PageLayout'


export default () => {
    return (
        <PageLayout splitFeatureName={MEMBER_ID_CARD_PAGE}>
            <MemberIdCardWidget />
        </PageLayout>
    )
}