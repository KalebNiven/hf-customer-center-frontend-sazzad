import { useEffect } from "react";

export const useProviderDirectory = () => {
    const { MIX_REACT_APP_PROVIDER_BASE_URL } = process.env;

    useEffect(() => {
        const script = document.createElement("script");
        script.src =
            MIX_REACT_APP_PROVIDER_BASE_URL + "provider-directory-widget.js";
        script.async = true;
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        };
    }, []);
};
