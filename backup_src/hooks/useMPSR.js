import { useEffect } from 'react'
import { useSelector } from 'react-redux'
const MPSR_LOGIN_URL = process.env.MIX_REACT_APP_MPSR_LOGIN_URL;

// handle MPSR gateway (if mw=true query passed, we redirect the user to MPSR_LOGIN_URL)
export default function useMPSR() {
    const customerInfo = useSelector((state) => state.customerInfo);

    useEffect(() => {
        if(customerInfo.data.wantsMedicare) window.location.href = MPSR_LOGIN_URL;
    }, [customerInfo])
}