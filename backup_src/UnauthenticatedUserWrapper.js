import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { requestResetState } from './store/actions/index';
import { ToastProvider } from './hooks/useToaster'

const UnauthenticatedUserWrapper = ({ children }) => {

    // Reset Redux Store if not authenticated
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(requestResetState());
    }, [])

    return (
        <>
            <ToastProvider>
                {children}  
            </ToastProvider>
        </>
    )
}

export default UnauthenticatedUserWrapper
