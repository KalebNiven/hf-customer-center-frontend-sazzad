import { useOktaAuth } from "@okta/okta-react";

export const useRefreshOktaToken = () => {
  const { oktaAuth } = useOktaAuth();

  return async function (callback) {
    try {
      const renewToken = await oktaAuth.token.renewTokens();
      await oktaAuth.tokenManager.setTokens(renewToken);
      if (callback) callback();
    } catch (err) {
      console.log("Error caught: ", err.message);
    }
  };
};
