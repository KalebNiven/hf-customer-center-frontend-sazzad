const CLIENT_ID = process.env.MIX_REACT_OKTA_CLIENT_ID_SPA;
const ISSUER = process.env.MIX_REACT_OKTA_ISSUER_SPA;
const REDIRECT_URI = window.location.origin + "/login/callback";

export const oktaConfig = {
  issuer: `${ISSUER}`,
  clientId: `${CLIENT_ID}`,
  redirectUri: `${REDIRECT_URI}`,
  pkce: true,
  scopes: ["openid", "profile", "email"],
  disableHttpsCheck: true,
};
