import React from 'react'
import FindCareSearch from '../../components/findACare/findCareSearch'
import { FIND_CARE_SEARCH_PAGE } from '../../constants/splits'
import PageLayout from '../../layouts/PageLayout'

export default () => {
    return (
        <PageLayout splitFeatureName={FIND_CARE_SEARCH_PAGE}>
            <FindCareSearch />
        </PageLayout>
    )
}