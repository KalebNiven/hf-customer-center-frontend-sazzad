import React from 'react'
import FormsAndDocuments from '../../components/formsanddocuments'
import { DOCUMENTS_PAGE } from '../../constants/splits'
import PageLayout from '../../layouts/PageLayout'

export default () => {
    return (
        <PageLayout splitFeatureName={DOCUMENTS_PAGE}>
            <FormsAndDocuments />
        </PageLayout>
    )
}