
import React, { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import { usePaymentsModalContext } from '../../context/paymentsModalContext';
import { purgePaymentsSessionData } from './paymentPage.utils';
import PaymentError from './paymentError';

const { MIX_REACT_PAYMENTS_BASE_URL } = process.env;

const BinderPortal = () => {

  const [isError, setIsError] = useState(false);
  const { paymentsModalState } = usePaymentsModalContext();

  const localStorageOKTA = JSON.parse(localStorage.getItem('okta-token-storage'));
  const accessToken = localStorageOKTA.accessToken.accessToken;
  const idToken = localStorageOKTA.idToken.idToken;
  const memberData = useSelector(state => state.customerInfo);
  const memberId = paymentsModalState?.membership?.MemberId ?? memberData?.data?.memberId ?? '';

  useEffect(()=>{
    const uniqueHash = (+new Date).toString(16); //to prevent caching

    const script = document.createElement('script');
    script.classxName='hf--payments--bundle';
    script.src = `https://${MIX_REACT_PAYMENTS_BASE_URL}/payments-asset-loader-binder.js?h=${uniqueHash}`;
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
            id="hf--binder--root"
            hf--binder--app="lofl"
            hf--binder--token="okta"
            hf--binder--session={accessToken}
            hf--binder--session2={idToken}
            hf--binder--member={memberId}
          >
            { isError ? <PaymentError /> :
              <h1 id="hf--binder--loading" className="mt-5 text-center">
                Loading Binder Portal...
              </h1>
            }
        </div>);
};

export default BinderPortal;
