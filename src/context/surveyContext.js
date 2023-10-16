
import React, { createContext, useContext, useState } from 'react'
export const SurveyContext = createContext()
const HRA_WIDGET_SCRIPT_ID = 'survey-widget-script';

export const SurveyContextProvider = ({ children }) => {
    const [surveyScript, setSurveyScript] = useState(document.getElementById(HRA_WIDGET_SCRIPT_ID));
    const [digitalSurveyWidget, setDigitalSurveyWidget] = useState(null);

    const DIGITAL_SURVEY_EVENTS = {
        CLAIM_SUBMITTED: 'CLAIM_SUBMITTED',
        MAIL_ID_CARD: 'MAIL_ID_CARD',
        PCP_UPDATE: 'PCP_UPDATE',
        CHAT: 'CHAT' 
    }
    const triggerDigitalSurveyByEventName = (widget, eventName) => {
        if(!widget) new Error('Survey Widget not found');
        if(!eventName) new Error('Event name not provided');
        widget.action = eventName;
        return true;
    }

    return (
        <SurveyContext.Provider value={{ 
            surveyScript,
            setSurveyScript,
            digitalSurveyWidget,
            setDigitalSurveyWidget,
            DIGITAL_SURVEY_EVENTS,
            triggerDigitalSurveyByEventName
        }}>
            {children}
        </SurveyContext.Provider>
    )
}

export const useSurveyContext = () => {
    return useContext(SurveyContext)
}