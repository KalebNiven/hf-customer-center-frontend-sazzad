import React from 'react'
import PageLayout from '../layouts/PageLayout'
import NotFound404 from '../components/common/NotFound404'

export default (props) => {
    return (
        <PageLayout splitFeatureName="" ignoreSplit>
            <NotFound404 {...props} />
        </PageLayout>
    )
}