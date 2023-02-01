import React from "react";
import { Provider } from "react-redux";
import store from "../../store/store";
import {AnalyticsPage, AnalyticsTrack } from "../common/segment/analytics";
import { ANALYTICS_TRACK_TYPE, ANALYTICS_TRACK_CATEGORY } from "../../constants/segment";
import Footer from "../../footer";
import ErrorNavBar from "./ErrorNavBar";
import { AppContextProvider } from "../../AppContext";
import UnrecoverableError from "./UnrecoverableError";


const GlobalErrorPage = (props) => {

    const { error } = props;
    const showDebug = process.env.NODE_ENV !== 'production';
    
    return (
        <>
        <Provider store={store}>
            <AppContextProvider>
                <ErrorNavBar />
                <UnrecoverableError errorMessage={error.message} showDebug={showDebug} />
                <Footer />
            </AppContextProvider>
        </Provider>
        </>
    )
};

export default GlobalErrorPage;