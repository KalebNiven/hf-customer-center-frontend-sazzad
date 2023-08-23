import React, { useEffect, useState } from 'react';

const { MIX_APP_DOMAIN } = process.env;

// @@ useRedirect take required "url" argument, validates the URL and redirects the user if validation is passed
// @@ useRedirect takes optional "callback" argument which will be called after successful redirect
const useRedirect = (url, callback) => {
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (!url) return;

    // decodes URI into a String
    const decodedRedirectURL = decodeURI(url);

    // validates if passed url is the same as to MIX_APP_DOMAIN
    const isValidHostName = (url) => {
      const urlObject = new URL(url);
      const domainURLObject = new URL(MIX_APP_DOMAIN);
      return urlObject.hostname === domainURLObject.hostname;
    };

    // check if requested URL is an related to EOB document
    const isEOBDocumentURL = (url) => {
      // check if URL contains either 'documents' or 'claims/eob' which means it's related to EOB
      if (url.indexOf('documents') !== -1 || url.indexOf('claims/eob') !== -1) {
        return true; // this is EOB url
      }
      return false; // this isn't EOB url
    };

    // Validate redirectUrl and handle redirect
    if (isValidHostName(decodedRedirectURL)) {
      if (callback) callback();
      if (isEOBDocumentURL(decodedRedirectURL)) {
        // Open in new tab
        window.open(decodedRedirectURL, "_blank");
      } else {
        // Redirect within current tab
        setIsRedirecting(true);
        const urlObj = new URL(decodedRedirectURL);
        const domainURLObject = new URL(MIX_APP_DOMAIN);
        if (window.location.origin.includes("localhost")) {
          window.location.href = `http://localhost:3000${urlObj.pathname}?${urlObj.searchParams}`;
        } else {
          window.location.href = `https://${domainURLObject.hostname}${urlObj.pathname}?${urlObj.searchParams}`;
        }
      }
      return () => setIsRedirecting(false);
    }
  }, []);

  return { isRedirecting };
};

export default useRedirect;
