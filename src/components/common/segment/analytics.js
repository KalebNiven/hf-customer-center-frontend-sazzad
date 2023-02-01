import React, { useState, useEffect } from "react";

export const AnalyticsPage = () => {
    window.analytics.page();
};

export const AnalyticsIdentifyNonMember = (fullName, memberEmail, oktaId) => {
 
    analytics.identify(
        oktaId,{ 
            traits: {
                email: memberEmail,
                name: fullName,
                oid: oktaId,
            }
        },
        {
            context: {
                externalIds: [
                    {
                        collection: "users",
                        encoding: "none",
                        id: oktaId,
                        type: "okta_id"
                    }
                ]
            }
        }
    );
};

export const AnalyticsIdentifyMember = (CustomerId, fullName, memberEmail, oktaId, memberId) => {
 
    window.analytics.identify(
        CustomerId, {
            traits: {
                email: memberEmail,
                name: fullName,
                oid: oktaId,
            }
        },
        {
            context: {
                externalIds:
                [
                    {
                        collection: "users",
                        encoding: "none",
                        id: oktaId,
                        type: "okta_id"
                    },
                    {
                        collection: "users",
                        encoding: "none",
                        id: memberId,
                        type: "member_id"
                    }
                ]
            }
        }
    );
};

const getLocation = (location) => {
    try{
        if(window.innerWidth > location?.desktop?.width){
            return (location?.desktop?.value !== undefined ? location?.desktop?.value : "unknown");
        }
        else if(window.innerWidth > location?.tablet?.width){
            return (location?.tablet?.value !== undefined ? location?.tablet?.value : "unknown");
        }
        else if(window.innerWidth > location?.mobile?.width){
            return (location?.mobile?.value !== undefined ? location?.mobile?.value : "unknown");
        }
    }
    catch(e){
        return "unknown";
    }
    return "unknown";
};

const compileFullPropsObj = (customerInfo, props) => {
    let fullProps = {
        "category": (props?.category !== undefined ? props.category : "unknown"),
        "type": (props?.type !== undefined ? props.type : "unknown"),
        "location": (props?.location !== undefined ? getLocation(props.location) : "unknown"),
        "raw_text": (props?.raw_text !== undefined ? props.raw_text : "unknown"),
        "description": (props?.description !== undefined ? props.description : "unknown"),
        "destination_url": (props?.destination_url !== undefined ? props.destination_url : "unknown"),
        "customerId": (customerInfo?.customerId !== undefined ? customerInfo.customerId : "unknown"),
        "sourceMemberId": (customerInfo?.memberId !== undefined ? customerInfo.memberId : "unknown"),
        "sourceMemberCompanyCode": (customerInfo?.companyCode !== undefined ? customerInfo.companyCode : "unknown"),
        "sourceMemberLOB": (customerInfo?.sessLobCode !== undefined ? customerInfo.sessLobCode : "unknown"),
        "sourceMemberBenefitPackage": (customerInfo?.benefitPackage !== undefined ? customerInfo.benefitPackage : "unknown"),
        "targetMemberId": (props?.targetMemberId !== undefined ? props.targetMemberId : "unknown"),
        "windowWidth": window.innerWidth,
        "windowHeight": window.innerHeight,
        "appVersion": (customerInfo?.appVersion !== undefined ? customerInfo.appVersion : "unknown"),
        "language": (customerInfo?.language !== undefined ? customerInfo.language : "unknown"),
        "meta": (props?.meta !== undefined ? props.meta : {}),

    };
    return fullProps;
};

export const AnalyticsTrack = (action, customerInfo, props=null) => {
    window.analytics.track(action, compileFullPropsObj(customerInfo.data, props));
};