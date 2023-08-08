import React from "react";
import UnrecoverableErrorUnauthenticated from "./UnrecoverableErrorUnauthenticated";
import UnrecoverableErrorAuthenticated from "./UnrecoverableErrorAuthenticated";
import { useOktaAuth } from "@okta/okta-react";

const GlobalErrorPage = (props) => {
    const { error } = props;
    const showDebug = process.env.NODE_ENV !== 'production';
    const { authState, oktaAuth } = useOktaAuth();
    
    return (
        <>
            {
                authState?.isAuthenticated ?
                <UnrecoverableErrorAuthenticated errorMessage={error.message} showDebug={showDebug} /> :
                <UnrecoverableErrorUnauthenticated errorMessage={error.message} showDebug={showDebug} />
            }
        </>
    )
};

export default GlobalErrorPage;