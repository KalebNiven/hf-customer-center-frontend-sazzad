import React, { useEffect } from 'react'
import { useSurveyContext } from '../../context/surveyContext'
import { useSelector } from 'react-redux'
import { getLanguageFromUrl } from '../../utils/misc';
import { DIGITAL_SURVEY } from '../../constants/splits';
import { useClient } from '@splitsoftware/splitio-react';
import useLogError from '../../hooks/useLogError';

// This Component is used to mount Digital Survey widget.
const DigitalSurvey = () => {
    const { surveyScript, digitalSurveyWidget, setDigitalSurveyWidget } = useSurveyContext();
    const { logError } = useLogError();
    const { memberId, id_token, customerId } = useSelector((state) => state.customerInfo.data);
    const token = (id_token === undefined ? id_token : id_token.replace('Bearer ', ''));

    const splitHookClient = useClient(customerId === null ? 'Anonymous' : customerId);
    const { treatment } = splitHookClient.getTreatmentWithConfig(DIGITAL_SURVEY, {});

    const mountProps = {
        token: token,
        locale: getLanguageFromUrl(),
        onSurveyDoneClick: () => {},
        onSurveyDoneBackClick: () => {},
        isEmbedded: true,
        parentElement: "#digital-survey",
        widgetPage: 'HRA',
        appId: 'cc',             
        memberId : memberId,
    }

    useEffect(() => {
        if(treatment !== "on") return;

        if(surveyScript && !digitalSurveyWidget){
            try {
                const widget = new window.HraWidget(mountProps);
                setDigitalSurveyWidget(widget);
                widget.deployTriggers(mountProps);
              } catch (error) {
                (async () => {
                    try {
                        await logError(error);
                    } catch (err) {
                        console.error('Error caught: ', err.message);
                    }
                })()
              }
        }
    }, [surveyScript, mountProps, treatment])

    return (
        <>
            { treatment === "on" && <div id="digital-survey"></div> }
        </>
    )
}

export default DigitalSurvey
