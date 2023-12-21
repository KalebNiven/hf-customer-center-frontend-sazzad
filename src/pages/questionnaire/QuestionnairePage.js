import React from 'react'
import PublicPageLayout from '../../layouts/PublicPageLayout'
import Questionnaire from '../../components/questionnaire/Questionnaire'
import { QUESTIONNAIRE_PAGE } from '../../constants/splits'
import { useParams } from 'react-router-dom'

export default () => {
    const { lob } = useParams();
    const splitAttributes = { lob };

    return (
        <PublicPageLayout splitFeatureName={QUESTIONNAIRE_PAGE} attributes={splitAttributes}>
            <Questionnaire lob={lob} />
        </PublicPageLayout>
    )
}
