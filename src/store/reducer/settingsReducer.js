import * as actionTypes from "../actions/actionTypes";

export const initialState = {
    userName: null,
    userNameSuccess: null,
    userNameError: null,
    loadingUsername: false,
    passwordSuccess: null,
    passwordError: null,
    loadingPassword: false,
    reportErrorSuccess: false,
    selectedTabValue: 0,
};

export default function settingsReducer(state = initialState, action) {
    switch (action.type) {
        case actionTypes.GET_USERNAME: {
            return {
                ...state,
                userName: null,
            };
        }
        case actionTypes.UPDATE_USERNAME: {
            return {
                ...state,
                userName: action.payload,
            };
        }
        case actionTypes.RESET_MESSAGE: {
            return {
                ...state,
                userNameSuccess: null,
                userNameError: null,
                passwordSuccess: null,
                passwordError: null,
            };
        }
        case actionTypes.REQUEST_CHANGE_USERNAME: {
            return {
                ...state,
                loadingUsername: true,
                userNameSuccess: null,
                userNameError: null,
            };
        }
        case actionTypes.RECEIVE_CHANGE_USERNAME: {
            let successMsg, errorMsg, username;
            const response = action.payload;
            if (response.data.responseCode === 200) {
                successMsg = response.data.successMessage;
                username = response.userName.username;
            } else errorMsg = response.data.usernameError;
            return {
                ...state,
                userName: username ? username : state.userName,
                userNameSuccess: successMsg,
                userNameError: errorMsg,
                loadingUsername: false,
            };
        }
        case actionTypes.REQUEST_CHANGE_PASSWORD: {
            return {
                ...state,
                loadingPassword: true,
                passwordSuccess: null,
                passwordError: null,
            };
        }
        case actionTypes.RECEIVE_CHANGE_PASSWORD: {
            let successMsg, errorMsg;
            const response = action.payload;
            if (response.responseCode === 200)
                successMsg = response.successMessage;
            else errorMsg = response.error;
            return {
                ...state,
                passwordSuccess: successMsg,
                passwordError: errorMsg,
                loadingPassword: false,
            };
        }
        case actionTypes.REPORT_ERROR_SUCCESS: {
            return {
                ...state,
                reportErrorSuccess: true,
            };
        }

        case actionTypes.TOGGLE_SETTINGS_TAB_VALUE: {
            return {
                ...state,
                selectedTabValue: action.payload.value,
            };
        }
        default:
            return state;
    }
}
