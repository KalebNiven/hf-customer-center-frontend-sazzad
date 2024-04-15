import React from 'react'
import { MEMBER_ID_CARD_PAGE } from '../../constants/splits'
import MemberIDCardPage from '../../components/memberIDCard/memberIDCardPage'
import { useClient } from '@splitsoftware/splitio-react'
import { useSelector } from 'react-redux'
import MemberIdCardWidget from '../../components/memberIDCard/memberIdCardWidget'
import PermissionDenied from '../../components/common/PermissionDenied'

export default () => {
    const splitHookClient = useClient();
    const customerInfo = useSelector((state) => state.customerInfo);

    const memberIdCardPageTreatment = splitHookClient.getTreatment(MEMBER_ID_CARD_PAGE);

    switch(memberIdCardPageTreatment){
        case 'on': 
            return <MemberIDCardPage />;
        case 'show_widget': 
            return <MemberIdCardWidget />;
        case 'off': 
            return <PermissionDenied />;
        case "control":
            return <></>;
        default:
            return <></>;
    }
}