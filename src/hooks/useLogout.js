import { useOktaAuth } from '@okta/okta-react';
import { useDispatch } from "react-redux";
import { requestResetState } from '../store/actions';

export const useLogout = () => {
  const { oktaAuth, authState } = useOktaAuth();
  const dispatch = useDispatch();

  return async function() {
    analytics.reset();
    try {
      await oktaAuth.signOut({ postLogoutRedirectUri: window.location.origin + '/login' })
      oktaAuth.tokenManager.clear();
      localStorage.removeItem("identifySegmentFlag");
      sessionStorage.removeItem("currentMemberId");
      sessionStorage.removeItem('SessionTimeStamp');
      sessionStorage.removeItem('from');
      sessionStorage.removeItem(`persist:${window.location.host}_PROVIDER_APP`);
      sessionStorage.removeItem(`persist:${process.env.MIX_REACT_PAYMENTS_BASE_URL}`);
      sessionStorage.removeItem('skipAddMembership');
      sessionStorage.removeItem('visitedPrefCenterSync');
      ProviderDirectoryWidget.invalidateStore();
      dispatch(requestResetState());
    } catch (err) {
      console.log('Error caught: ', err.message)
    }
  }
}
