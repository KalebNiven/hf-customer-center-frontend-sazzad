import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();
  
  // scroll to the top of the page every time pathname changes (e.g. history.push() used)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}