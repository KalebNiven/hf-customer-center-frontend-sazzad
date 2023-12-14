import React from "react";
import { Provider } from "react-redux";
import { Route, Redirect, Switch, useLocation } from "react-router-dom";
import { SecureRoute, LoginCallback } from '@okta/okta-react';
import { useOktaAuth } from "@okta/okta-react";
import AuthenticatedUserWrapper from './AuthenticatedUserWrapper';
import UnauthenticatedUserWrapper from './UnauthenticatedUserWrapper';
import store from "./store/store";
import LoadingOverlay from './components/common/loadingOverlay';
import { HandleLanguageSelection } from "./components/auth/login/languageSelection";
import GlobalError from "./components/common/globalErrors/globalErrors";

// Page Imports
import HomePage from './pages/HomePage';
import NotFound404Page from './pages/NotFound404Page';
import ClaimsPage from './pages/claims/ClaimsPage';
import ClaimsDetailsPage from './pages/claims/ClaimsDetailsPage';
import AuthorizationsDetailsPage from './pages/authorizations/AuthorizationsDetailsPage';
import AuthorizationsPage from './pages/authorizations/AuthorizationsPage';
import CoverageAndBenefitsPage from './pages/coverage-and-benefits/CoverageAndBenefitsPage';
import DocumentsCenterPage from './pages/documents-center/DocumentsCenterPage';
import DocumentsCenterDetailsPage from './pages/documents-center/DocumentsCenterDetailsPage';
import FindCareDetailsPage from './pages/find-care/FindCareDetailsPage';
import FindCarePage from './pages/find-care/FindCarePage';
import FindCarePCPPage from './pages/find-care/FindCarePCPPage';
import FindCareSearchPage from './pages/find-care/FindCareSearchPage';
import PaymentsPage from './pages/payments/PaymentsPage';
import MemberIDCardPage from './pages/member-id-card/MemberIDCardPage';
import CommunityResourcesCategoryPage from './pages/my-health/community-resources/CommunityResourcesCategoryPage';
import CommunityResourcesDetailsPage from './pages/my-health/community-resources/CommunityResourcesDetailsPage';
import CommunityResourcesPage from './pages//my-health/community-resources/CommunityResourcesPage';
import OTCLearnMorePage from './pages/otc/OTCLearnMorePage';
import OTCActivatePage from './pages/otc/OTCActivatePage';
import SettingsPage from './pages/settings/SettingsPage';
import CostEstimatorPage from './pages/cost-estimator/CostEstimatorPage';
import SignatureChecklistPage from './pages/signature-checklist/SignatureChecklistPage';
import AddMembershipPage from './pages/add-membership/AddMembershipPage';
import SelectPreferredContactsPage from './pages/select-preferred-contacts/SelectPreferredContactsPage';
import HRAPage from './pages/hra/HRAPage';
import LoginPage from './pages/login/LoginPage';
import RegisterPage from './pages/register/RegisterPage';
import ForgotUserNamePage from './pages/forgot-username/ForgotUsernamePage';
import ForgotPasswordPage from './pages/forgot-password/ForgotPasswordPage';
import Logout from "./components/common/logout";
import MyHealthPage from "./pages/my-health/MyHealthPage";
import MyHealthCheckListPage from "./pages/my-health/MyHealthCheckListPage"; 
import AnnualHealthAssessmentPage from "./pages/my-health/AnnualHealthAssessmentPage"; 
import MyRewardsPage from "./pages/my-health/MyRewardsPage";
import OTCWidgetPage from "./pages/otc/OTCWidgetPage";
import FormsAndDocumentPage from "./pages/forms-and-documents/FormsAndDocumentPage";

const AppWrapper = () => {
    const { authState, oktaAuth } = useOktaAuth();
    const location = useLocation();

    if(!authState && location.pathname !== "/login/callback") return <LoadingOverlay />;
    if(!authState?.isAuthenticated) {
        return (
            <Provider store={store}>
                <UnauthenticatedUserWrapper>
                    <Switch> 
                        <Route exact path="/login" component={LoginPage}/>
                        <Route exact path='/login/callback' component={LoginCallback} />
                        <Route exact path="/register" component={RegisterPage}/>
                        <Route exact path='/forgotUsername' component={ForgotUserNamePage} />
                        <Route exact path='/forgotPassword' component={ForgotPasswordPage} />
                        {/* Util Routes */}
                        <Route exact path="/" component={() => <Redirect to="/login" />}/>
                        {/* Important: 404 Page must be the very last route! */}
                        <Route exact path='*' component={() => <NotFound404Page isAuthenticated={authState?.isAuthenticated} />} />
                    </Switch>
                </UnauthenticatedUserWrapper>
            </Provider>
        )
    } else {
        return (
            <Provider store={store}>
                <Switch>
                    <SecureRoute path="/sessionExpired" component={Logout} />
                </Switch>
                <AuthenticatedUserWrapper>
                    <Switch>
                        {/* Pages */}
                        <SecureRoute exact path="/claims" component={ClaimsPage} />
                        <SecureRoute exact path="/claimDetails" component={ClaimsDetailsPage} /> 
                        <SecureRoute exact path="/authorizations" component={AuthorizationsPage} />
                        <SecureRoute exact path="/authorizationDetails" component={AuthorizationsDetailsPage} />
                        <SecureRoute exact path="/coverage-and-benefits" component={CoverageAndBenefitsPage} />
                        <SecureRoute exact path="/documents/:id" component={DocumentsCenterDetailsPage} />
                        <SecureRoute exact path="/document-center" component={DocumentsCenterPage} />
                        <SecureRoute exact path="/forms-and-documents" component={FormsAndDocumentPage} />
                        <SecureRoute exact path="/communityResources" component={CommunityResourcesPage} />
                        <SecureRoute exact path="/communityResources/category" component={CommunityResourcesCategoryPage} />
                        <SecureRoute exact path="/communityResources/details" component={CommunityResourcesDetailsPage} />
                        <SecureRoute exact path="/findcare" component={FindCarePage} />
                        <SecureRoute exact path="/search" component={FindCareSearchPage} />
                        <SecureRoute exact path="/details" component={FindCareDetailsPage} />
                        <SecureRoute exact path="/pcp" component={FindCarePCPPage} />
                        <SecureRoute exact path="/idcard" component={MemberIDCardPage} />
                        <SecureRoute exact path="/home" component={HomePage} />
                        <SecureRoute exact path="/payments" component={PaymentsPage} />
                        <SecureRoute exact path="/my-health" component={MyHealthPage}/>
                        <SecureRoute path="/hra/:memberId" component={HRAPage} />
                        <SecureRoute exact path="/settings" component={SettingsPage} />
                        <SecureRoute exact path="/costEstimator" component={CostEstimatorPage} />
                        {/* <SecureRoute exact path="/otc/learn-more" component={OTCLearnMorePage} />
                        <SecureRoute exact path="/otc/activate-card" component={OTCActivatePage} /> */}
                        <SecureRoute path="/signatureChecklist" component={SignatureChecklistPage} />
                        <SecureRoute exact path='/addMembership' component={AddMembershipPage} />
                        <SecureRoute exact path="/selectPreferredContacts" component={SelectPreferredContactsPage} />
                        <SecureRoute exact path="/my-health/my-health-checklist" component={MyHealthCheckListPage}/>
                        <SecureRoute exact path="/my-rewards" component={MyRewardsPage}/>
                        <SecureRoute exact path="/my-health/community-resources" component={CommunityResourcesPage}/>
                        <SecureRoute exact path="/my-health/annual-health-assessment" component={AnnualHealthAssessmentPage}/>
                        <SecureRoute exact path="/my-health/community-resources/category" component={CommunityResourcesCategoryPage} />
                        <SecureRoute exact path="/my-health/community-resources/details" component={CommunityResourcesDetailsPage} /> 
                        {/* Util Routes */}
                        <SecureRoute exact path="/sessionExpired" component={Logout} />
                        <SecureRoute exact path="/selectLanguage" component={HandleLanguageSelection} />
                        <SecureRoute exact path="/otc-widget" component={OTCWidgetPage} />
                        { /* ! This is doesn't seem to be a correct implementation... */ }
                        <SecureRoute exact path='/permissionDenied' component={() => <GlobalError />} />
                        <SecureRoute exact path="/login" component={() => <Redirect to="/home" />} />
                        <SecureRoute exact path="/" component={() => <Redirect to="/home" />} />
                        {/* Important: 404 Page must be the very last route! */}
                        <SecureRoute exact path='*' component={() => <NotFound404Page isAuthenticated={authState?.isAuthenticated} />} />
                    </Switch>
                </AuthenticatedUserWrapper>
            </Provider>
        )
    }
};

export default AppWrapper
