
import React, { useEffect } from "react";
import { useSelector } from 'react-redux';

const PaymentPortal = () => {

  const { MIX_REACT_PAYMENTS_BASE_URL } = process.env;

  const memberData = useSelector(state => state.customerInfo);
  const oktaToken = memberData?.data?.id_token?.length>0?memberData.data.id_token.split(' ')[1] : '' ;

  useEffect(()=>{
    const uniqueHash = (+new Date).toString(16); //to prevent caching

    const appLink = document.createElement('link');
    appLink.className='hf--payments--bundle';
    appLink.href = `https://${MIX_REACT_PAYMENTS_BASE_URL}/dist/payments-bundle.css?h=${uniqueHash}`;
    appLink.rel= 'stylesheet';
    document.head.appendChild(appLink);

    const script = document.createElement('script');
    script.className='hf--payments--bundle';
    script.src = `https://${MIX_REACT_PAYMENTS_BASE_URL}/dist/payments-bundle.js?h=${uniqueHash}`;
    script.setAttribute('defer','defer'); //adding a value to defer to ensure it registers
    document.head.appendChild(script);

    //onUnmount ~~> casting html collection into array
    return ()=> [].forEach.call(document.getElementsByClassName('hf--payments--bundle'), el=>el.remove());
  },[]);

  return (<div
            id="hf--payments--root"
            hf--payments--app="lofl"
            hf--payments--token="okta"
            hf--payments--session={oktaToken}
          >
            <h1 id="hf--payments--loading" className="mt-5 text-center">
              Loading Payment Portal...
            </h1>
        </div>);
};

export default PaymentPortal;
