/* eslint-disable react/no-unknown-property */
import React, { useState } from "react";
import Frame, { FrameContextConsumer } from "react-frame-component";
import { useSelector } from 'react-redux';
import PaymentError from './paymentError';
import { usePaymentsModalContext } from '../../context/paymentsModalContext';

const { MIX_REACT_PAYMENTS_BASE_URL } = process.env;
const hostWindow = window;

// purge session storage for payments
export const purgePaymentsSessionData = () => sessionStorage.removeItem(`persist:${MIX_REACT_PAYMENTS_BASE_URL}`);

const loadPaymentsScripts = (iframeDoc, setIsError) => { // iframe context
  const uniqueHash = (+new Date()).toString(16); // to prevent caching

  const tailwindCSS = document.createElement("link");
  tailwindCSS.className = "hf--payments--bundle";
  tailwindCSS.href = `https://${MIX_REACT_PAYMENTS_BASE_URL}/dist/tailwind-bundle.css`;
  tailwindCSS.rel = "stylesheet";
  iframeDoc.head.appendChild(tailwindCSS, document.head.childNodes[0]);

  const appLink = document.createElement("link");
  appLink.className = "hf--payments--bundle";
  appLink.href = `https://${MIX_REACT_PAYMENTS_BASE_URL}/dist/payments-bundle.css?h=${uniqueHash}`;
  appLink.rel = "stylesheet";
  iframeDoc.head.appendChild(appLink);

  const script = document.createElement("script");
  script.className = "hf--payments--bundle";
  script.src = `https://${MIX_REACT_PAYMENTS_BASE_URL}/dist/payments-bundle.js?h=${uniqueHash}`;
  script.setAttribute("defer", "defer"); // adding a value to defer to ensure it registers
  script.onerror = () => setIsError(true);
  iframeDoc.head.appendChild(script);
};

const setIframeHeight = (height = '100%') => {
  const iframe = document.getElementsByTagName('iframe');
  iframe[0].height = `${height}px`;
};

function PaymentPortal() {
  const [isError, setIsError] = useState(false);
  const { paymentsModalState } = usePaymentsModalContext();

  const localStorageOKTA = JSON.parse(localStorage.getItem('okta-token-storage'));
  const { accessToken } = localStorageOKTA.accessToken;
  const { idToken } = localStorageOKTA.idToken;
  const memberData = useSelector((state) => state.customerInfo);
  const memberId = paymentsModalState?.membership?.MemberId ?? memberData?.data?.memberId;

  return (
    <Frame className="hf--payments--iframe" heigh="50rem" width="100%" allowFullScreen>
      <FrameContextConsumer>
        {({ document, window }) => {
          // listen to content changes to update height of iframe
          const mutationObserverConfig = { subtree: true, childList: true };
          const observer = new MutationObserver(() => {
            setIframeHeight(document.body.scrollHeight);
          });
          observer.observe(document, mutationObserverConfig);
          // pass page url via global function
          window.getHref = () => hostWindow.location.href;
          // load scripts on load
          loadPaymentsScripts(document, setIsError);
          return (
            <div
              id="hf--payments--root"
              hf--payments--app="lofl"
              hf--payments--token="okta"
              hf--payments--session={accessToken}
              hf--payments--session2={idToken}
              hf--payments--member={memberId}
            >
              {isError ? (
                <PaymentError />
              ) : (
                <h1 id="hf--payments--loading" className="mt-5 text-center">
                  Loading Payment Portal...
                </h1>
              )}
            </div>
          );
        }}
      </FrameContextConsumer>
    </Frame>
  );
}

export default PaymentPortal;
