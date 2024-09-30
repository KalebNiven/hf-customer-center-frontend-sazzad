/* eslint-disable filename-rules/match */
import axios from "axios";

const { MIX_REACT_API_UTILS_BASE_URL } = process.env;
const HEADERS = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

/**
 *
 * @param {boolean} authenticated
 * @param {object} [obj={}]
 * @param {string} [obj.accessToken]
 * @param {string} [obj.idToken]
 * @returns {import('axios').AxiosInstance}
 */
export const ccUtils = (
  authenticated = false,
  { accessToken, idToken } = {},
) => {
  let ccUtilsRequest = axios.create({
    baseURL: MIX_REACT_API_UTILS_BASE_URL,
    headers: HEADERS,
  });

  if (authenticated) {
    try {
      const localStorageOKTA = JSON.parse(
        localStorage.getItem("okta-token-storage"),
      );
      const accessToken = localStorageOKTA.accessToken.accessToken;
      const idToken = localStorageOKTA.idToken.idToken;

      ccUtilsRequest.interceptors.request.use(
        (config) => {
          config.headers["Authorization"] = "Bearer " + accessToken;
          config.headers["id-token"] = idToken;
          return config;
        },
        (error) => {
          return Promise.reject(error);
        },
      );
    } catch (e) {
      console.log(e);
    }
  }
  return ccUtilsRequest;
};
