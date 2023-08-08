// Hook
import { useEffect } from "react";

function useOnClickOutside(ref, handler) {
    useEffect(
        () => {
            const listener = (event) => {
                if (
                    !ref.current ||
                    ref.current.contains(event.target) ||
                    event.target.localName == "span" ||
                    event.target.localName == "input" ||
                    event.target.localName == "img" ||
                    event.target.localName == "button" ||
                    event.target?.classList?.contains("MuiSvgIcon-root")
                ) {
                    return;
                }
                handler(event);
            };
            document.addEventListener("mousedown", listener);
            document.addEventListener("touchstart", listener);
            return () => {
                document.removeEventListener("mousedown", listener);
                document.removeEventListener("touchstart", listener);
            };
        },
        [ref, handler]
    );
}

export default useOnClickOutside;
