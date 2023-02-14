import React, { useEffect, useState } from "react";
import "./index.css";
import "./MuiOverride.css";
import { useHistory } from "react-router-dom";
import { Security } from '@okta/okta-react';
import { OktaAuth, toRelativeUrl } from '@okta/okta-auth-js';
import { oktaConfig } from './libs/oktaConfig'
import AppWrapper from "./AppWrapper";

const oktaAuth = new OktaAuth(oktaConfig);

const App = ({ jwt, selectedMemberId }) => {
  const [loaderShow, setLoaderShow] = useState(sessionStorage.getItem("longLoad"))

  useEffect(() => {
    const longLoad = sessionStorage.getItem("longLoad")
    setLoaderShow(longLoad)
  }, [])

  const history = useHistory();

  const onAuthRequired = () => {
    history.push('/login');
  };

  const restoreOriginalUri = async (_oktaAuth, originalUri) => {
    history.replace(toRelativeUrl(originalUri || "/", window.location.origin));
  };

  return (
    <Security oktaAuth={oktaAuth} restoreOriginalUri={restoreOriginalUri} onAuthRequired={onAuthRequired} data-testid="appcomponent">
      <AppWrapper jwt={jwt} selectedMemberId={selectedMemberId} />
    </Security>
  );
};

export default App;