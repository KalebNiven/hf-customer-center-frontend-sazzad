import axios from "axios";

const { MIX_LOFL_API_BASE_URL } = process.env;
const BASE_URL = MIX_LOFL_API_BASE_URL + "/api/v2/";
const HEADERS = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

export const LOFLv2 = (authenticated = false) => {
  let LOFLv2Request = axios.create({
    baseURL: BASE_URL,
    headers: HEADERS,
  });

  if (authenticated) {
    try {
      const localStorageOKTA = JSON.parse(
        localStorage.getItem("okta-token-storage")
      );
      const accessToken = "Bearer " + localStorageOKTA.accessToken.accessToken;
      const idToken = "Bearer " + localStorageOKTA.idToken.idToken;

      LOFLv2Request.interceptors.request.use(
        (config) => {
          config.headers["Authorization"] = accessToken;
          config.headers["id-token"] = idToken;
          return config;
        },
        (error) => {
          return Promise.reject(error);
        }
      );
    } catch (e) {
      console.log(e);
    }
  }
  return LOFLv2Request;
};
