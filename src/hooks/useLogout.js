import { useOktaAuth } from '@okta/okta-react';

export const useLogout = () => {
  const { oktaAuth, authState } = useOktaAuth();

  return async function() {
    analytics.reset();

    try {
      await oktaAuth.signOut({ postLogoutRedirectUri: window.location.origin + '/login' })
      oktaAuth.tokenManager.clear();
      sessionStorage.removeItem("userLoggedIn");
      sessionStorage.removeItem("currentMemberId"); 
      sessionStorage.removeItem('SessionTimeStamp');
      sessionStorage.removeItem(`persist:${window.location.host}_PROVIDER_APP`);
      ProviderDirectoryWidget.invalidateStore();
    } catch (err) {
      console.log('Error caught: ', err.message)
    }
  }
}