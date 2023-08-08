import React, { useEffect, useState } from 'react'
import Toaster from '../components/common/toaster';
const Ctx = React.createContext();

let toastId = 0;
export function ToastProvider({children}){
    const [toasts, setToasts] = useState([]);
    const [toastOpen, setToastOpen] = useState(false);

    const addToast = (toastDetails) => {
        const id = toastId++;
        const toast = {toastDetails, id};
        setToastOpen(true);
        setToasts([...toasts, toast]);
    }

    const removeToast = (id) => {
        const newToasts = toasts.filter(t => t.id !== id);
        setToastOpen(false)
        setToasts(newToasts);
    }

    return(
        <Ctx.Provider value={{addToast, removeToast}}>
            {children}
            <>
                {toasts.map( toast => {
                    return toastOpen && <Toaster
                        key={toast.id}
                        toasterTop={toast.toastDetails.toasterTop}
                        unmountMe={() => removeToast(toast.id)}
                        timeout={toast.toastDetails.timeout}
                        notificationText={toast.toastDetails.notificationText}
                        notificationType={toast.toastDetails.notificationType}
                        notificationLink={toast.toastDetails.notificationLink}
                        notificationLinkText={toast.toastDetails.notificationLinkText}
                    />
                })}
            </>

        </Ctx.Provider>
    )
}

export const useToaster = () => React.useContext(Ctx);