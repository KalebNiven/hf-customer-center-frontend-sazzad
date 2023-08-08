import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { requestCustomerInfo, requestGlobalAlerts, requestPreferenceCenterInfo } from './store/actions';
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
import { useQualtrics ,qualtricsAction} from './hooks/useQualtrics';
import { SSOModalContextProvider } from './context/ssoModalContext'
import SSOModal from './components/common/ssoModal'
import AppBar from './AppBarComponent'
import Footer from './footer';
import ScrollToTop from './components/common/scrollToTop'
import GlobalErrorPage from './components/unrecoverableError/GlobalErrorPage';
import { ToastProvider } from './hooks/useToaster';
import { useLocation, useHistory } from "react-router-dom";
import { useProviderDirectory } from './hooks/useProviderDirectory';

const { MIX_REACT_APP_MPSR_LOGIN_URL } = process.env;
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

const AuthenticatedUserWrapper = ({ children }) => {
  const dispatch = useDispatch();
  const customerInfo = useSelector((state) => state.customerInfo);
  const location = useLocation();
  const history = useHistory();
  const { memberId, customerId, accountStatus, lastName, email, firstName, oktaId, id_token, nonce, wantsMedicare } = customerInfo.data;
  const { alertsList } = useSelector(state => state.globalAlerts);
  const preferenceCenterInfo = useSelector((state) => state.preferenceCenterInfo);
  const [isLoading, setIsLoading] = useState(true);
  const endpointsStrippedOfWrapper = [
    '/selectPreferredContacts',
    '/addMembership'
  ];
 

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

  useQualtrics(qualtricsAction.NO_ACTION); // launch qualtrics resources
  useProviderDirectory(); // launch Findcare Widget

  // Request customer info from the endpoint  
  useEffect(() => {
    dispatch(requestCustomerInfo());
    dispatch(requestPreferenceCenterInfo());
  }, []);
  
  // Request global alerts from the endpoint
  useEffect(() => {
    if(!customerInfo.data?.access_token || !customerInfo.data?.id_token) return;
    dispatch(requestGlobalAlerts());
  }, [customerInfo?.data]);

  useEffect(() => {
    //redirect to the addMembership page unless they skip for the session.
    if(accountStatus === 'NON-MEMBER' && !sessionStorage.getItem('skipAddMembership')){
      history.push('/addMembership');
    }
  }, [accountStatus])

  useEffect(() => {
    if(!sessionStorage.getItem('visitedPrefCenterSync') && (preferenceCenterInfo?.data?.email?.is_different || preferenceCenterInfo?.data?.phones?.is_different)){
      sessionStorage.setItem('visitedPrefCenterSync', 'true')
      history.push('/selectPreferredContacts');
      //useRedirect('/selectPreferredContacts');
    }
  }, [preferenceCenterInfo?.data]);
  
  const { isRedirecting } = useRedirect(sessionStorage.getItem('from'), () => sessionStorage.removeItem('from')) // Redirect After Login (if user requested a specific URL before he was authenticated).

  useEffect(() => {
    const visitedPrefCenterSync = sessionStorage.getItem('visitedPrefCenterSync');
    if (!isRedirecting && (visitedPrefCenterSync || (preferenceCenterInfo?.data != null && !preferenceCenterInfo?.data?.email?.is_different && !preferenceCenterInfo?.data?.phones?.is_different))) {
      setIsLoading(false);
    }
  }, [preferenceCenterInfo?.data, isRedirecting])


  return (
    <>
   {customerInfo.loading == false ?
    (customerInfo.error === "" ?
      wantsMedicare ? window.location.href = MIX_REACT_APP_MPSR_LOGIN_URL :
      <FeatureFactory splitKey={MIX_SPLITIO_KEY} options={featureFlagOptions} uniqueId={customerId === null ? 'Anonymous' : customerInfo.data.customerId}>
          <AppContextProvider>
            <SSOModalContextProvider>
              { isLoading ? <LoadingOverlay isLoading={isLoading} /> : <>
              <ExternalSiteModal />
              <SSOModal />
              <ScrollToTop />
              {(memberId && customerId && id_token && nonce && !endpointsStrippedOfWrapper.includes(location.pathname)) && <ChatWidget memberId={memberId} jwt={id_token} nonce={nonce} customerId={customerId} />}
              {(alertsList?.length > 0 && !endpointsStrippedOfWrapper.includes(location.pathname)) && <GlobalAlerts alertsList={alertsList} />}
              <CoachMarksContextProvider>
                <HealthResourcesContextProvider>
                  <HomeContextProvider>
                    <ToastProvider>
                    {!endpointsStrippedOfWrapper.includes(location.pathname) ? (
                    <>
                      <AppBar />
                      { children }
                      <Footer/>
                    </>
                    )
                    :
                      children
                    }
                    </ToastProvider>
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
