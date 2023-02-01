import React from "react";
import { Provider } from "react-redux";
import { Route, Redirect, Switch, useLocation } from "react-router-dom";
import { SecureRoute, LoginCallback } from '@okta/okta-react';
import { useOktaAuth } from "@okta/okta-react";
import AuthenticatedUserWrapper from './AuthenticatedUserWrapper';
import UnauthenticatedUserWrapper from './UnauthenticatedUserWrapper';
import HRA from './components/hra/hraCard'
import ClaimDetailsPage from "./components/claims/claimDetailsPage";
import AuthorizationDetailsPage from "./components/auths/authorizationDetailsPage";
import FindCareDetails from "./components/findACare/findCareDetails";
import FindCarePCP from "./components/findACare/findCarePCP";
import FindCareSearch from "./components/findACare/findCareSearch";
import CoverageBenefitsPage from "./components/coverageBenefits/coverageBenefitsPage";
import ClaimsPage from "./components/claims/claimsPage";
import AuthorizationPage from "./components/auths/authorizationPage";
import FindCare from "./components/findACare/findCarepage";
import MemberIDCardPage from "./components/memberIDCard/memberIDCardPage";
import HomePage from "./components/home/homePage";
import PaymentPage from "./components/payments/paymentPage";
import MyHealthPage from "./components/myHealth/myHealthPage";
import NowPowCategoryListPage from "./components/myHealth/nowPowCategoryListPage";
import NowPowDetailsView from "./components/myHealth/nowPowDetailsView";
import SignatureChecklist from "./components/home/signatureChecklist";
import AccountSettings from "./components/settings/AccountSettings";
import OTCInfoPage from "./components/overTheCounter/infoPages/components/otcInfoPage";
import Login from './components/auth/login'
import ActivateOTCCardPage from "./components/overTheCounter/activateOTCCardPage";
import CostEstimatorPage from "./components/costEstimator/costEstimatorPage";
import store from "./store/store";
import ErrorPage from './components/common/ErrorPage'
import CreateAccount from "./components/auth/createAccount";
import NotFound404 from './components/common/NotFound404'
import styled from 'styled-components';
import LoadingOverlay from './components/common/loadingOverlay';
import Documents from './components/documents';
import { withErrorBoundary, useErrorBoundary } from "react-use-error-boundary";
import GlobalErrorPage from "./components/unrecoverableError/GlobalErrorPage";

const AppWrapper = withErrorBoundary (({ jwt, selectedMemberId }) => {
    const { authState, oktaAuth } = useOktaAuth();
    const location = useLocation();

    const [error, resetError] = useErrorBoundary(
        // We'll perhaps log to segment here
      );
    
      if (error) {
        return (
          <GlobalErrorPage error={error}/>
        );
      }

    if(!authState && location.pathname !== "/login/callback") return <LoadingOverlay />;
    if(!authState?.isAuthenticated) {
        return (
            <Provider store={store}>
            <UnauthenticatedUserWrapper>
                <Switch> 
                    <Route exact path="/login" component={Login}/>
                    <Route exact path="/reset" component={() => <></>}/>
                    <Route exact path="/" component={() => <Redirect to="/login" />}/>
                    <Route exact path="/register" component={() => <CreateAccount/>}/>
                    <Route exact path='/login/callback' component={LoginCallback} />
                    <Route exact path='*' component={() => <NotFound404 isAuthenticated={authState?.isAuthenticated} />} />
                </Switch>
            </UnauthenticatedUserWrapper>
            </Provider>
        )
    } else {
        return (
            <Provider store={store}>
                <AuthenticatedUserWrapper jwt_token={jwt}>
                    <Switch>
                        <SecureRoute exact path="/findcare" component={() => <FindCare jwt_token={jwt} />} />
                        <SecureRoute exact path="/claims" component={ClaimsPage} />
                        <SecureRoute exact path="/authorizations" component={AuthorizationPage} />
                        <SecureRoute exact path="/coverage-and-benefits" component={CoverageBenefitsPage} />
                        <SecureRoute exact path="/claimDetails" component={ClaimDetailsPage} /> 
                        <SecureRoute exact path="/documents/:id" component={Documents}/>
                        <SecureRoute exact path="/authorizationDetails" component={AuthorizationDetailsPage} />
                        <SecureRoute exact path="/search" component={() => <FindCareSearch jwt_token={jwt} />} />
                        <SecureRoute exact path="/details" component={() => <FindCareDetails jwt_token={jwt} />} />
                        <SecureRoute exact path="/pcp" component={() => <FindCarePCP jwt_token={jwt} />} />
                        <SecureRoute exact path="/idcard" component={() => <MemberIDCardPage selectedMemberId={selectedMemberId} />} />
                        <SecureRoute exact path="/home" component={() => <HomePage />} />
                        <SecureRoute exact path="/" component={() => <Redirect to="/home" />} />
                        <SecureRoute exact path="/payments" component={() => <PaymentPage />} />
                        <SecureRoute exact path="/communityResources" component={() => <MyHealthPage />} />
                        <SecureRoute exact path="/communityResources/category" component={() => <NowPowCategoryListPage />} />
                        <SecureRoute exact path="/communityResources/details" component={() => <NowPowDetailsView />} />
                        <SecureRoute path="/hra" component={HRA} />
                        <SecureRoute path="/signatureChecklist"  component={() => <SignatureChecklist />}  />
                        <SecureRoute exact path="/settings" component={AccountSettings} />
                        <SecureRoute exact path="/otc/learn-more" component={OTCInfoPage} />
                        <SecureRoute exact path="/otc/activate-card" component={ActivateOTCCardPage} />
                        <SecureRoute exact path="/costEstimator" component={CostEstimatorPage} />
                        <SecureRoute exact path="/login" component={() => <Redirect to="/home" />}/>
                        <SecureRoute exact path='*' component={() => <NotFound404 isAuthenticated={authState?.isAuthenticated} />} />
                    </Switch>
                </AuthenticatedUserWrapper>
            </Provider>
        )
    }
});

export default AppWrapper
