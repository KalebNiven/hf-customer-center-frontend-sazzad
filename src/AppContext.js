import React, { createContext, useContext, useState, useEffect } from "react";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [externalSiteModal, setExternalSiteModal] = useState({
    isVisible: false,
    link: "#",
    target: "_blank",
    segmentPageCategory: null,
    segmentTitle: null,
    segmentTargetMemberId: null,
    membershipKey: null,
    label: null,
  });
  const [innerWidth, setInnerWidth] = useState("");
  const [toastOpen, setToastOpen] = useState(false);
  const [toastState, setToastState] = useState("");
  const [planName, setPlanName] = useState("");
  const [openPaperLess, setOpenPaperLess] = useState(false);
  const [globalError, setGlobalError] = useState(false);
  const [acknowledgmentModal, setAcknowledgmentModal] = useState({
    isVisible: false,
  });

  const resetExternalModal = () => {
    setExternalSiteModal({
      isVisible: false,
      link: null,
      target: null,
      pageCategory: null,
      segmentPageCategory: null,
      segmentTitle: null,
      segmentTargetMemberId: null,
      membershipKey: null,
      label: null,
    });
  };

  const resetAcknowledgmentModal = () => {
    setAcknowledgmentModal({ isVisible: false });
  };
  /* Window Resize Listener */
  const onWindowResize = () => {
    const innerWidth = window.innerWidth;
    setInnerWidth(innerWidth);
  };

  useEffect(() => {
    window.addEventListener("resize", onWindowResize);
    const innerWidth = window.innerWidth;
    setInnerWidth(innerWidth);

    return () => {
      window.removeEventListener("resize", onWindowResize);
    };
  }, []);

  return (
    <AppContext.Provider
      value={{
        externalSiteModal,
        setExternalSiteModal,
        openPaperLess,
        setOpenPaperLess,
        toastState,
        setToastState,
        planName,
        setPlanName,
        toastOpen,
        setToastOpen,
        drawerOpen,
        setDrawerOpen,
        externalSiteModal,
        setExternalSiteModal,
        resetExternalModal,
        innerWidth,
        setInnerWidth,
        globalError,
        setGlobalError,
        acknowledgmentModal,
        setAcknowledgmentModal,
        resetAcknowledgmentModal,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};
