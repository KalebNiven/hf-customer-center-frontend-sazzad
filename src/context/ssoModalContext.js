import React, { createContext, useContext, useState } from "react";

export const SSOModalContext = createContext();

export const SSOModalContextProvider = ({ children }) => {
  const initState = {
    routeLink: "",
    externalLinkName: "",
    showMemberModal: false,
    membershipKey: null,
  };
  const [ssoModalState, setSsoModalState] = useState({ ...initState });

  const resetSsoModal = () => {
    setSsoModalState({ ...initState });
  };

  return (
    <SSOModalContext.Provider
      value={{ ssoModalState, setSsoModalState, resetSsoModal }}
    >
      {children}
    </SSOModalContext.Provider>
  );
};

export const useSSOModalContext = () => {
  return useContext(SSOModalContext);
};
