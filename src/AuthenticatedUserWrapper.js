import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { requestCustomerInfo, requestGlobalAlerts } from './store/actions';
import { AppContextProvider } from './AppContext'
import { CoachMarksContextProvider } from './components/coachMarks/homePageCoachMarks/coachMarksContext'
import ExternalSiteModal from './components/common/externalSiteModal'
import { HealthResourcesContextProvider } from './components/myHealth/healthResourcesContext'
import { HomeContextProvider } from './components/home/homeContext'
import { ChatWidget } from './components/common/chatWidget';
import { FeatureFactory } from "./libs/featureFlags";
import { getFeatureFlagList } from "./constants/splits";
import useRedirect from "./hooks/useRedirect";
import GlobalAlerts from './components/common/globalAlerts';
import LoadingOverlay from './components/common/loadingOverlay';
import SessionTimeoutModal from './components/common/sessionTimeoutModal';
import { AnalyticsIdentifyNonMember, AnalyticsIdentifyMember } from "./components/common/segment/analytics";
import { useQualtrics } from './hooks/useQualtrics';
import { SSOModalContextProvider } from './context/ssoModalContext'
import SSOModal from './components/common/ssoModal'
import AppBar from './AppBarComponent'
import Footer from './footer';
import ScrollToTop from './components/common/scrollToTop'
import GlobalErrorPage from './components/unrecoverableError/GlobalErrorPage';

const { MIX_SPLITIO_KEY } = process.env;
const featureFlagList = getFeatureFlagList();

const featureFlagOptions = {
  scheduler: { featuresRefreshRate: 300, metricsRefreshRate: 30 },
  sync: {
    splitFilters: [
      {
        type: "byName",
        values: featureFlagList,
      },
    ],
  },
};

const AuthenticatedUserWrapper = ({ children, jwt_token }) => {
  const dispatch = useDispatch();
  const customerInfo = useSelector((state) => state.customerInfo);
  const { memberId, customerId, accountStatus, lastName, email, firstName, oktaId } = customerInfo.data;
  const { alertsList } = useSelector(state => state.globalAlerts);

  // Make the identify call here...
  useEffect(() => {
    const userLoggedIn = sessionStorage.getItem('userLoggedIn');
    if (oktaId && !userLoggedIn) {
      const fullName = firstName + " " + lastName;
      if (accountStatus === "MEMBER") {
        sessionStorage.setItem('userLoggedIn', 'Yes')
        AnalyticsIdentifyMember(customerId, fullName, email, oktaId, memberId)
      }
      else {
        sessionStorage.setItem('userLoggedIn', 'Yes')
        AnalyticsIdentifyNonMember(fullName, email, oktaId)
      }
    }
  }, [oktaId]);

  useQualtrics(); // launch qualtrics resources

  // Request customer info from the endpoint
  useEffect(() => {
    const localStorageData = localStorage.getItem('myCat');
    dispatch(requestCustomerInfo());
  }, []);
  
  // Request global alerts from the endpoint
  useEffect(() => {
    if(!customerInfo.data?.access_token || !customerInfo.data?.id_token) return;
    dispatch(requestGlobalAlerts());
  }, [customerInfo?.data]);
  
  const { isRedirecting } = useRedirect(sessionStorage.getItem('from'), () => sessionStorage.removeItem('from')) // Redirect After Login (if user requested a specific URL before he was authenticated).

  return (
    <>
   {customerInfo.loading == false > 0 ?
    (customerInfo.error === "" ?
      <FeatureFactory splitKey={MIX_SPLITIO_KEY} options={featureFlagOptions} uniqueId={customerId === null ? 'Anonymous' : customerInfo.data.customerId}>
          <AppContextProvider jwt_token={jwt_token}>
            <SSOModalContextProvider>
              { isRedirecting ? <LoadingOverlay isLoading={isRedirecting} /> : <>
              <ExternalSiteModal />
              <SSOModal />
              <ScrollToTop />
              {(memberId && customerId) && <ChatWidget memberId={memberId} customerId={customerId} />}
              {(alertsList?.length > 0) && <GlobalAlerts alertsList={alertsList} />}
              <CoachMarksContextProvider>
                <HealthResourcesContextProvider>
                  <HomeContextProvider>
                    <AppBar />
                    {children}
                    <Footer/>
                  </HomeContextProvider>
                </HealthResourcesContextProvider>
              </CoachMarksContextProvider>
              </> }
            </SSOModalContextProvider>
          </AppContextProvider>
        </FeatureFactory>
      :
        <GlobalErrorPage error={customerInfo?.error}/>
    )
    : <LoadingOverlay isLoading={customerInfo.loading}/> }
      <SessionTimeoutModal csrf={customerInfo.data.csrf}></SessionTimeoutModal>
    </>
  )
}

export default AuthenticatedUserWrapper
