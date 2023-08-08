import * as actionTypes from "../actions/actionTypes";

export const initialState = {
    data: {
        documentsList: [],
        documentsListLoaded: false,
        documentsListError: false,
        documentTypes: [],
        paperlessStatus: false,
        paperlessStatusLoaded: false,
        document: {},
        documentLoading: false,
        documentError: false
    },
};

export default function documents(state = initialState, action) {
    switch (action.type) {

        case actionTypes.DOCUMENT_ERROR: {
            return {
                ...state,
                data: {
                    document: {},
                    documentError: true,
                    documentLoading: true
                }
            };
        }  

        case actionTypes.DOCUMENT_FILE_LOADING: {
            return {
                ...state,
                data: {
                    document: {},
                    documentLoading: true,
                    documentError: false
                }
            };
        }  

        case actionTypes.RECEIVED_DOCUMENT_FILE: {

            return {
                ...state,
                data: {
                    document: action.payload.data.data,
                    documentLoading: true,
                    documentError: false
                }
            };
        }        

        case actionTypes.RECEIVE_DOCUMENT_LIST: {
            return {
                ...state,
                data: {
                    documentsList: action.payload.data.data.Documents,              
                    //documentTypes: action.payload.data.data.DocumentTypes,
                    paperlessStatus: action.payload.data.data.paperlessStatus,
                    paperlessStatusLoaded: true,
                    documentsListLoaded: true,
                    documentsListError: false
                },
            };
        }

        case actionTypes.ERROR_DOCUMENT_LIST: {

            return {
                ...state,
                data: {
                    documentsList: [],              
                    // documentTypes: action.payload.data.data.DocumentTypes,
                    paperlessStatus: false,
                    paperlessStatusLoaded: true,
                    documentsListLoaded: true,
                    documentsListError: true
                },
            };
        }

        case actionTypes.CLEAR_DOCS: {
            return {
                ...state,                
                data: Object.assign(state.data, { documentsList: [] })    
            };
        }

        case actionTypes.CLEAR_LOADING_STATUS: {
            return {
                ...state,
                data: Object.assign(state.data, { documentsListLoaded: false })     
            };
        }

        default:
            return state;
    }
}
