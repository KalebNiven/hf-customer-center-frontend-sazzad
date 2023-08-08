import React from 'react'
import AddMemberPage from '../../components/auth/addMembershipPage'
import { ADD_MEMBERSHIP_PAGE } from '../../constants/splits'
import PageLayout from '../../layouts/PageLayout'

export default () => {
    return (
        <PageLayout splitFeatureName={ADD_MEMBERSHIP_PAGE}>
            <AddMemberPage />
        </PageLayout>
    )
}