import React from "react";
import QuestionnaireWidget from "./QuestionnaireWidget";
import PermissionDenied from "../common/PermissionDenied";

const Questionnaire = ({ lob }) => {
  const mapping = { LIP: <QuestionnaireWidget /> };
  const widgetLob = mapping[lob];
  if (!widgetLob) return <PermissionDenied />;

  return widgetLob;
};

export default Questionnaire;
