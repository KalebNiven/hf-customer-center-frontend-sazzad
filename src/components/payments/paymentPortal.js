import React, { useEffect, useState } from "react";
import PaymentError from "./paymentError";
import { useSelector } from "react-redux";
import { usePaymentsModalContext } from "../../context/paymentsModalContext";
import {
  purgePaymentsSessionData,
  removeAllPaymentsResources,
} from "./paymentPage.utils";

const { MIX_REACT_PAYMENTS_BASE_URL } = process.env;

const PaymentPortal = () => {
  const [isError, setIsError] = useState(false);
  const { paymentsModalState } = usePaymentsModalContext();

  const localStorageOKTA = JSON.parse(
    localStorage.getItem("okta-token-storage"),
  );
  const accessToken = localStorageOKTA.accessToken.accessToken;
  const idToken = localStorageOKTA.idToken.idToken;
  const memberData = useSelector((state) => state.customerInfo);
  const memberId =
    paymentsModalState?.membership?.MemberId ?? memberData?.data?.memberId;

  useEffect(() => {
    const uniqueHash = (+new Date()).toString(16); //to prevent caching

    const script = document.createElement("script");
    script.className = "hf--payments--bundle";
    script.src = `https://${MIX_REACT_PAYMENTS_BASE_URL}/payments-asset-loader-app.js?h=${uniqueHash}`;
    script.setAttribute("defer", "defer"); //adding a value to defer to ensure it registers
    script.onerror = () => setIsError(true);
    document.head.appendChild(script);

    //onUnmount ~~> casting html collection into array
    const onUnmount = () => {
      purgePaymentsSessionData();
      removeAllPaymentsResources();
    };
    return onUnmount;
  }, []);

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
};

export default PaymentPortal;
