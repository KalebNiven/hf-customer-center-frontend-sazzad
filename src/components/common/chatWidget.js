
import React, { useEffect, useState } from 'react'
import { useSelector } from "react-redux";
import { SHOW_CHAT_WIDGET } from '../../constants/splits'
import { FeatureTreatment } from "../../libs/featureFlags";

export const ChatWidget = ({ memberId }) => {
    const customerInfo = useSelector((state) => state.customerInfo);

    const splitAttributes = {
        lob: customerInfo.data.sessLobCode,
        companyCode: customerInfo.data.companyCode,
        benefitPackage: customerInfo.data.benefitPackage,
        membershipStatus: customerInfo.data.membershipStatus,
        accountStatus: customerInfo.data.accountStatus,
    }


    return (
        <>
        <FeatureTreatment
        treatmentName={SHOW_CHAT_WIDGET}
        onLoad={() => { }}
        onTimedout={() => { }}
        attributes={splitAttributes}
    >
        <ChatWidgetScript memberId={memberId} removeChatWidget = {false}/>

    </FeatureTreatment>
    <FeatureTreatment
        treatmentName={SHOW_CHAT_WIDGET}
        onLoad={() => { }}
        onTimedout={() => { }}
        attributes={splitAttributes}
        invertBehavior>
            <ChatWidgetScript memberId={memberId} removeChatWidget = {true}/>
    </FeatureTreatment>
    
   </>
    )
}

export const ChatWidgetScript = ({ memberId, removeChatWidget }) => {
    const { MIX_CHAT_WIDGET_BASE_URL } = process.env;
    // Chat Widget Integration
    useEffect(() => {
        if(!removeChatWidget)
        {
        const chatContainer = document.querySelector("#hf-chat-widget-container")
        if (!memberId || !chatContainer) return;
        const jwtToken = chatContainer.dataset.jwt;
        const nonce = chatContainer.dataset.nonce;
        const script = document.createElement('script');
        script.src = MIX_CHAT_WIDGET_BASE_URL + '/widget.js';
        script.async = true;
        script.onload = () => window.EmbeddableWidget.mount({
            token: jwtToken,
            nonce: nonce,
            caller: "web",
            memberId: memberId
        })
        chatContainer.appendChild(script);

        return () => {
            chatContainer.removeChild(script);
        }
    }
    else{
        window.EmbeddableWidget && window.EmbeddableWidget.unmount();
    }
    }, [memberId])

    return <></>
}

export const RemoveChatWidgetScript = ({ memberId }) => {
    // Chat Widget Integration
    useEffect(() => {
        window.EmbeddableWidget && window.EmbeddableWidget.unmount();
        return () => {
        }
    }, [memberId])

    return <></>
}