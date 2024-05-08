import Cookies from "js-cookie";

export const deleteAllCookies = () => {
  Object.keys(Cookies.get()).forEach(function (cookieName) {
    Cookies.remove(cookieName);
  });
};
