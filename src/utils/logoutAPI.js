const { MIX_REACT_OKTA_API_URL } = process.env; 

export const logoutApi = (param) => {
    analytics.reset();
    const { oktaAuth, authState } = useOktaAuth();
    
    sessionStorage.removeItem("userLoggedIn");
    fetch(`${MIX_REACT_OKTA_API_URL}/sessions/me`, {
        method: 'DELETE',
        headers: {
        cookie: document.cookie
        },
        credentials: 'include',
    })
    .then(res => {
        window.location.href = `${window.location.origin}${param ?'/' + param: ''}`;
    })
}