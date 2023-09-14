
import React, { useEffect, useState } from "react";
import PaymentError from './paymentError';
import { useSelector } from 'react-redux';
import { usePaymentsModalContext } from '../../context/paymentsModalContext';

const { MIX_REACT_PAYMENTS_BASE_URL } = process.env;

// purge session storage for payments
export const purgePaymentsSessionData = () => sessionStorage.removeItem(`persist:${MIX_REACT_PAYMENTS_BASE_URL}`);

const PaymentPortal = () => {

  const [isError, setIsError] = useState(false);
  const { paymentsModalState } = usePaymentsModalContext();

  const localStorageOKTA = JSON.parse(localStorage.getItem('okta-token-storage'));
  const accessToken = localStorageOKTA.accessToken.accessToken;
  const memberData = useSelector(state => state.customerInfo);
  const memberId = paymentsModalState?.membership?.MemberId ?? memberData?.data?.memberId;

  useEffect(()=>{
    const uniqueHash = (+new Date).toString(16); //to prevent caching

    const tailwindCSS = document.createElement('link');
    tailwindCSS.className='hf--payments--bundle';
    tailwindCSS.href = `https://${MIX_REACT_PAYMENTS_BASE_URL}/dist/tailwind-bundle.css`;
    tailwindCSS.rel= 'stylesheet';
    document.head.insertBefore(tailwindCSS, document.head.childNodes[0]);

    const appLink = document.createElement('link');
    appLink.className='hf--payments--bundle';
    appLink.href = `https://${MIX_REACT_PAYMENTS_BASE_URL}/dist/payments-bundle.css?h=${uniqueHash}`;
    appLink.rel= 'stylesheet';
    document.head.appendChild(appLink);

    const script = document.createElement('script');
    script.className='hf--payments--bundle';
    script.src = `https://${MIX_REACT_PAYMENTS_BASE_URL}/dist/payments-bundle.js?h=${uniqueHash}`;
    script.setAttribute('defer','defer'); //adding a value to defer to ensure it registers
    script.onerror = () => setIsError(true);
    document.head.appendChild(script);

    //onUnmount ~~> casting html collection into array
    const onUnmount = ()=> {
      [].forEach.call(document.getElementsByClassName('hf--payments--bundle'), el=>el.remove());
      purgePaymentsSessionData();
    };
    return onUnmount;
  },[]);

  return (<div
            id="hf--payments--root"
            hf--payments--app="lofl"
            hf--payments--token="okta"
            hf--payments--session={accessToken}
            hf--payments--member={memberId}
          >
            { isError ? <PaymentError /> :
              <h1 id="hf--payments--loading" className="mt-5 text-center">
                Loading Payment Portal...
              </h1>
            }
        </div>);
};

export default PaymentPortal;
