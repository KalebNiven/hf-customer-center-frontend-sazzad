import React, { createContext, useContext, useState } from "react";

export const PaymentsModalContext = createContext();

export const PaymentsModalContextProvider = ({ children }) => {
  const initState = {
    routeLink: "",
    externalLinkName: "",
    showMemberModal: false,
    membershipKey: null,
    membership: null,
  };
  const [paymentsModalState, setPaymentsModalState] = useState({
    ...initState,
  });

  const resetPaymentsModal = () => {
    setPaymentsModalState({ ...initState });
  };

  return (
    <PaymentsModalContext.Provider
      value={{ paymentsModalState, setPaymentsModalState, resetPaymentsModal }}
    >
      {children}
    </PaymentsModalContext.Provider>
  );
};

export const usePaymentsModalContext = () => {
  return useContext(PaymentsModalContext);
};
