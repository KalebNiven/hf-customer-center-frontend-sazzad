import React, { useEffect, useState } from 'react'
const { MIX_APP_DOMAIN } = process.env;

// @@ useRedirect take required "url" argument, validates the URL and redirects the user if validation is passed
// @@ useRedirect takes optional "callback" argument which will be called after successful redirect
const useRedirect = (url, callback) => {
    const [isRedirecting, setIsRedirecting] = useState(false);

    useEffect(() => {
      if(!url) return;

      const decodedRedirectURL = decodeURI(url);

      const isValidHostName = (url) => {
        const isRelativePath = url.indexOf('https')===-1;
        if(isRelativePath) return true;
        const urlObject = new URL(url);
        const domainURLObject = new URL(MIX_APP_DOMAIN);
        return urlObject.hostname === domainURLObject.hostname ? true : false;
      }

      // Check if requested URL is an EOB document
      const isEOBDocumentURL = (url) => {
        //used for deep link non eob   
        if(url.indexOf('documents') !== -1 || url.indexOf('claims/eob') !== -1){
          return true;
        }
        return false;
      }
      
      // Validate redirectUrl and handle redirect
      if(isValidHostName(decodedRedirectURL)) {
        if(callback) callback();
        if(isEOBDocumentURL(decodedRedirectURL)) {
          // Open in new tab
          window.open(decodedRedirectURL, "_blank");
        } else {
          // Redirect within current tab
          setIsRedirecting(true)
          window.location.href = decodedRedirectURL;
        }
        return () => setIsRedirecting(false);
      }

    }, []);

    return { isRedirecting }
}

export default useRedirect









