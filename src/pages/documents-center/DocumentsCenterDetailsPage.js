import React from 'react'
import GetDocument from '../../components/documents/getDocument'
import { DOCUMENTS_PAGE } from '../../constants/splits'
import PageLayout from '../../layouts/PageLayout'

export default () => {
    return (
        <PageLayout splitFeatureName={DOCUMENTS_PAGE}>
            <GetDocument />
        </PageLayout>
    )
}