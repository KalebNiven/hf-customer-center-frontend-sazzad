import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";  
import {
    getDocument,
    documentFileLoading
} from "../../store/actions";

import { DownloadDocumentError } from "./documentErrors";
import { LoadingWrapper } from "./style";

import styled from "styled-components";

import Spinner from "../common/spinner";

const ProgressWrapper = styled.div`
    width: 100%;
    margin-top: 10px;
    margin-bottom: 10px;
`;

const GetDocument = (props) => {   
    
    const docId = document.location.pathname.split('/')[2];

    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });

    let isNodeId = params.isNodeId;

    const dispatch = useDispatch();
    const documents = useSelector((state) => state.documents.data);
    let documentLoading = true;

    const [documentError, setDocumentError] = useState();
    const [documentOpened, setDocumentOpened] = useState(false);

    if(documentError === undefined){
        setDocumentError(false);
    }

    useEffect(() => {
        const { FileContent, MIMEType } = documents.document;
        setDocumentError(documents.documentError);
        documentLoading = documents.documentLoading;
        if (FileContent && MIMEType) {
            var byteCharacters = atob(FileContent);
            var byteNumbers = new Array(byteCharacters.length);
            for (var i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            var byteArray = new Uint8Array(byteNumbers);
            var file = new Blob([byteArray], { type: MIMEType });
            const fileUrl = (window.URL || window.webkitURL).createObjectURL(file);
            window.open(fileUrl, '_parent');
            setDocumentOpened(true);
        }
        if (!documentLoading) {         
            dispatch(documentFileLoading());
            dispatch(getDocument(docId, isNodeId));
        }
    });

    return <LoadingWrapper>   
        {  documentError ? 
            <DownloadDocumentError/> : 
            !documentOpened && (
                <ProgressWrapper>
                    <Spinner />
                </ProgressWrapper>
            )
        }
        </LoadingWrapper>;


};

export default GetDocument;