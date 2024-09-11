/* eslint-disable filename-rules/match */
import axios from "axios";

const { API_UTILS_BASE_URL } = process.env;
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
    baseURL: API_UTILS_BASE_URL,
    headers: HEADERS,
  });

  if (authenticated) {
    try {
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
