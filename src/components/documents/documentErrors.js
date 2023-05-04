import React from "react";
import { NoDocumentError, RetryButton } from "./style";

export const NoDocument = (props) => {
    return (
        <NoDocumentError>
            <div className="warning-icon">
                <img src="/react/images/Union.png" />
            </div>
            <div className="text-wrapper">
                <div className="error-message">No Documents Found</div>
                <div className="error-discription">
                    There are currently no documents in your Document Center.
                    Documents can be found here as they become available.
                </div>
            </div>
        </NoDocumentError>
    );
};

export const DownloadDocumentError = (props) => {
    return (
        <>
            <br/>
            <NoDocumentError>
                <div className="text-wrapper">
                    <div className="error-message">No Document Found</div>
                    <div className="error-discription">
                        There was an error trying to download this document 
                    </div>
                </div>
            </NoDocumentError>    
            <br/>
            <br/>
        </>
    );
};

export const DocErrors = (props) => {
    return (
        <NoDocumentError>
            <div className="warning-icon">
                <img src="/react/images/Triangle.svg" />
            </div>
            <div className="text-wrapper">
                <div className="error-message">
                    Your Documents Failed to Load
                </div>
                <div className="error-discription">
                    An error occurred while attempting to load your documents.
                    Please, reload the page or come back and try again at a
                    later date.
                </div>
            </div>
            <RetryButton onClick={() => props.tryAgain() }>Retry</RetryButton>
        </NoDocumentError>
    );
};
