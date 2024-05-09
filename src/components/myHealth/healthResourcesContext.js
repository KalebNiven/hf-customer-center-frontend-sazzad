import React, { createContext, useContext, useState } from "react";

export const HealthResourcesContext = createContext();

export const HealthResourcesContextProvider = ({ children }) => {
  const [surveyLocalStatuses, setSurveyLocalStatuses] = useState(null);
  const [resoucesVisible, setResoucesVisible] = useState([]);
  const [currentResources, setCurrentResources] = useState([]);
  const [generalResources, setGeneralResources] = useState([]);
  const [currentCompanyCodes, setCurrentCompanyCodes] = useState([]);
  const [generalResourcesLoader, setGeneralResourcesLoader] = useState(false);

  return (
    <HealthResourcesContext.Provider
      value={{
        surveyLocalStatuses,
        setSurveyLocalStatuses,
        currentResources,
        setCurrentResources,
        resoucesVisible,
        setResoucesVisible,
        generalResources,
        setGeneralResources,
        currentCompanyCodes,
        setCurrentCompanyCodes,
        generalResourcesLoader,
        setGeneralResourcesLoader,
      }}
    >
      {children}
    </HealthResourcesContext.Provider>
  );
};

export const useHealthResourcesContext = () => {
  return useContext(HealthResourcesContext);
};
