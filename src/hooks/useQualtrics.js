import { useState, useEffect} from 'react';
import {useSelector } from "react-redux";
import {createScriptTag } from "../utils/qualtrics.js"

'use strict';

export const qualtricsAction = {
    NO_ACTION : 'No Action', //default ~~> used for timed intercept
    SUBMIT_CLAIM: 'Submit Claim',
    MAIL_ME_ID_CARD: 'Mail Me ID Card',
    CHANGE_PCP: 'Change your Primary Care Provider',
   //TODO: add 1 entry per trigger use case
}

let qualtricsData = {}; //embedded data placeholder

const getQualtricsData = (field) => {
    if(qualtricsData[field]) return qualtricsData[field];
    return null;
};

const setQualtricsData = (field, value) => {
    if(!qualtricsData[field]) return false;
    if(field==='action') qualtricsData[field] = value;
    else qualtricsData[field] = value;
    return true;
};

if(!window.getQualtricsData) window.getQualtricsData = getQualtricsData;
if(!window.setQualtricsData) window.setQualtricsData = setQualtricsData;

export const useQualtrics = (qualtricsAction) => { 
    const [didQualtricsLoad, setDidQualtricsLoad] = useState(false); 
    const {data} = useSelector((state) => state.customerInfo);

    //fetch qualtrics resources
    useEffect(() => {
        if(window.QSI || didQualtricsLoad) return;
          if(!data?.accountStatus) return ;
        if( data?.accountStatus ==="MEMBER" && data?.membershipStatus ==="active") { 
            setDidQualtricsLoad(true);
            createScriptTag();
        }
    }, [didQualtricsLoad, data]);

    useEffect(()=>{
        if(!data) return;

        const customerData = {
            firstName: data.firstName,
            lastName: data.lastName,
            memberId: data.memberId,
            lob: data.sessLobCode,
            companyCode: data.companyCode,
            zipcode: data.zipcode,
            action: qualtricsAction,
            page:location.pathname
        }
        qualtricsData = Object.assign({}, qualtricsData, customerData);
    },[data]);

};
