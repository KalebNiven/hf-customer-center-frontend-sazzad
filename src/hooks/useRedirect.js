import React, { useEffect, useState } from 'react'
const { MIX_APP_DOMAIN } = process.env;
import { useSelector } from "react-redux";

import { ANALYTICS_TRACK_TYPE, ANALYTICS_TRACK_CATEGORY } from "../constants/segment";
import {AnalyticsTrack } from "../components/common/segment/analytics";
import {getDocumentsBasedOnId} from "../../src/store/saga/apis";
// @@ useRedirect take required "url" argument, validates the URL and redirects the user if validation is passed
// @@ useRedirect takes optional "callback" argument which will be called after successful redirect
const useRedirect = (url, callback) => {
    const [isRedirecting, setIsRedirecting] = useState(false);
    const customerInfo = useSelector(state => state.customerInfo)

    useEffect(() => {
      if(!customerInfo.data.accountStatus) return;
      if(!url) return;

      const decodedRedirectURL = decodeURI(url);

      const isValidHostName = (url) => {
        const isRelativePath = url.indexOf('https')===-1;
        if(isRelativePath) return true;
        const urlObject = new URL(url);
        const domainURLObject = new URL(MIX_APP_DOMAIN);
        return urlObject.hostname === domainURLObject.hostname ? true : false;
      }
      const analyticsTrackDocumentEob = (docId,status) => {
        AnalyticsTrack(
          `EOB ${docId} Event ${status ? 'Success' : 'Fail'}`,
         customerInfo,
         {
           "raw_text": decodedRedirectURL,
           "destination_url": decodedRedirectURL,
           "description": "EOB DOCUMENT EVENT",
           "category": ANALYTICS_TRACK_CATEGORY.document,
           "type": status ? ANALYTICS_TRACK_TYPE.eventSuccess : ANALYTICS_TRACK_TYPE.eventFail,
           "targetMemberId": customerInfo?.data?.memberId,
           "location": {
            "desktop": {
              "width": 960,
              "value": "center"
            },
            "tablet": {
              "width": 768,
              "value": "center"
            },
            "mobile": {
              "width": 0,
              "value": "center"
            }
          }
         }
       );
      }
      // Check if requested URL is an EOB document
      const isEOBDocumentURL = (url) => {
        const EOB_DOCUMENT_URI = "/claims/eob/";
        const DOCUMENTS_URI = "/documents/";
        const urlObject = new URL(url,`${MIX_APP_DOMAIN}`);
        const documentId = url.substring(url.slice(0, urlObject.origin.length + DOCUMENTS_URI.length).length,url.lastIndexOf("?"));
        const documentResponse = getDocumentsBasedOnId(documentId);

        documentResponse.then(data=>{
          const successState = data.status === 200;
          analyticsTrackDocumentEob(documentId,successState)
        })
        const eobURI = url.slice(0, urlObject.origin.length + EOB_DOCUMENT_URI.length).slice(urlObject.origin.length)
        const documentsURI = url.slice(0, urlObject.origin.length + DOCUMENTS_URI.length).slice(urlObject.origin.length)
        return eobURI === EOB_DOCUMENT_URI || documentsURI === DOCUMENTS_URI
      }

      // Validate redirectUrl and handle redirect
      if(isValidHostName(decodedRedirectURL)) {
        if(isEOBDocumentURL(decodedRedirectURL)) {
          // Open in new tab
          window.open(decodedRedirectURL, "_blank");
        } else {
          // Redirect within current tab
          setIsRedirecting(true)
          window.location.href = decodedRedirectURL;
        }
        if(callback) callback();

      return () => setIsRedirecting(false)
    }}, [customerInfo.data])

    return { isRedirecting }
}

export default useRedirect
