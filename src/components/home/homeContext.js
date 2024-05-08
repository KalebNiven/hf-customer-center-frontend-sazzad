import React, { createContext, useContext, useState } from "react";

export const HomeContext = createContext();

export const HomeContextProvider = ({ children }) => {
  const [showSlides, setShowSlides] = useState(true);
  const [showhelpfulTips, setShowHelpfulTips] = useState(true);
  const [showPayment, setShowPayment] = useState(true);
  const [showCoverageActivation, setShowCoverageActivation] = useState(true);
  const [showAddMembershipModal, setShowAddMembershipModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  return (
    <HomeContext.Provider
      value={{
        showSlides,
        setShowSlides,
        showhelpfulTips,
        setShowHelpfulTips,
        showPayment,
        setShowPayment,
        showCoverageActivation,
        setShowCoverageActivation,
        showAddMembershipModal,
        setShowAddMembershipModal,
        showSuccessModal,
        setShowSuccessModal,
      }}
    >
      {children}
    </HomeContext.Provider>
  );
};

export const useHomeContext = () => {
  return useContext(HomeContext);
};
