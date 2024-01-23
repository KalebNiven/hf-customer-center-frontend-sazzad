import styled from "styled-components";
import { IconButton } from "@material-ui/core";


export const LoadingWrapper = styled.div`
    height: 100%;
`;

export const Container = styled.div`
    background-color: #f4f4f4;
    max-width: 992px;
    position: relative;

    align-self: center;
    width: 100%;
    height: 100%;
    margin-bottom: 8rem;
    padding: 0px 20px;
`;

export const TopOptions = styled.div`
    background: white;
    padding: 16px 0 16px 200px;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 20px;

    a {
        cursor: pointer;
    }

    span {
        font-size: 14px;
        color: #474b55;
    }
`;

export const DocumentCenterButton = styled.button`
    cursor: pointer;
    padding: 10px 25px;
    color: white;
    border-radius: 20px;
    background: #3e7128;
    display: flex;
    align-items: center;
    font-size: 14px;
    font-weight: 600;
    outline: 0;
    border: 0;
`;

export const Main = styled.div`
    padding: 0px 0px;
    flex: 1;
`;

export const MyDocuments = styled.div`
    font-weight: 600;
    font-size: ${(props) =>props.isMobile? "32px":"24px"};
    line-height: ${(props) =>props.isMobile? "40px":"32px"};
    color: #003863;
    margin-bottom: 20px;
    margin-top: 40px;
    padding: 0;
`;

export const SubTitle = styled.div`
    font-weight: 600;
    font-size: 18px;
    line-height: 24px;
    color: #003863;
    margin-bottom: 20px;
    margin-top: 40px;
    padding: 0;
    font-style: normal;
`;

export const CurrentlyEnrolled = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 20px;

    padding: 0;

    @media only screen and (max-width: 600px) {
        padding: 0px 20px;
    }

    p {
        font-weight: 400;
        font-size: 14px;
        color: #474b55;
        font-family: "museo-sans", san-serif;
    }
    .text {
        margin-top: 8px;
        font-weight: 400;
        font-size: 14px;
        color: #474b55;
        font-family: "museo-sans", san-serif;
        line-height: 16px;
    }
    a {
        color: #008bbf !important;
        cursor: pointer;
        font-weight: 600;
    }
`;

export const Paperless = styled.div`
    font-size: 14px;
    display: flex;
    flex-direction: row;
    gap: 5px;

    span {
        color: #474b55;
    }

    .option {
        font-weight: 600;
    }

    a {
        color: #008bbf !important;
        cursor: pointer;
        font-weight: 600;
    }
`;

export const LeafIcon = styled.img``;

export const FilterWrapper = styled.div`
    padding: 5px;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 20px;

    span {
        color: #474b55;
        font-size: 14px;
        font-weight: 400;
    }

    padding: 0;

    @media only screen and (max-width: 600px) {
        padding: 0px 20px;
    }
`;

export const DocumentTypeButton = styled.label`
    cursor: pointer;
    padding: 5px 12px;
    border-radius: 20px;
    background: white;
    display: flex;
    align-items: center;
    font-size: 14px;
    font-weight: 600;
    outline: 0;
    border: ${({ selected }) => (selected == true ? "1px solid #008bbf" : 0)};
    color: ${({ selected }) => (selected == true ? "#008bbf" : "#474B55")};
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
`;

export const DocumentRangeButton = styled.button`
    cursor: pointer;
    position: relative;
    padding: 5px 12px;
    border-radius: 20px;
    background: white;
    display: flex;
    align-items: center;
    font-size: 14px;
    font-weight: 600;
    outline: 0;
    border: ${({ selected }) => (selected == true ? "1px solid #008bbf" : 0)};
    color: ${({ selected }) => (selected == true ? "#008bbf" : "#474B55")};
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
    background: ${({ datePicked }) =>
        datePicked
            ? "linear-gradient(0deg, rgba(0, 139, 191, 0.1), rgba(0, 139, 191, 0.1)), #FFFFFF"
            : "white"};
`;

export const TableDataUI = styled.div`
    padding: 0px;
    margin-top: 10px;



    @media only screen and (max-width: 600px) {
        padding: 0px;
    }

    .rdt_Table {
        background: none;
    }

    .rdt_TableHeadRow {
        border: 0;
        display: none;
    }
    .rdt_TableCol {
        /* span{
            opacity: 0 !important;
        } */
    }

    .rdt_TableRow{
        margin-bottom: 8px;
        outline: 0;
    }

    .iconWrapper {
        display: flex;
        flex-direction: row;
        gap: 10px;
        padding: 10px 0 !important;
    }

    .icon {
        width: 56px;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .name {
        font-size: 14px;
        height: 100%;
        font-weight: 600;
        color: var(--Colors-Primary-Slate-500, #474B55);
        display: flex;
        align-items: center;
        text-transform: capitalize;
    }

    .date {
        font-size: 14px;
        height: 100%;
        font-weight: 400;
        color: #474b55;
        display: flex;
        align-items: center;
    }

    .download {
        height: 100%;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        /* border: 2px solid red; */
        padding: 10px !important;
        .download-icon {
             cursor: pointer;
         }
    }

    .mobileWrapper {
        display: flex;
        flex-direction: row;
        gap: 5px;
        align-items: center;
    }

    .mobileContainer {
        display: flex;
        width: 100%;
        flex-direction: column;
        gap: 5px;
    }

    @media only screen and (max-width: 500px) {
        .mobileContainer .name {
            max-width: 220px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            display:block;
        }
    }

    @media only screen and (max-width: 460px) {
        .mobileContainer .name {
            max-width: 190px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            display:block;
        }
    }
    
    @media only screen and (max-width: 400px) {
        .mobileContainer .name {
            max-width: 160px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            display:block;
        }
    }
`;

export const DocumentTypeDropdown = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;

    .type {
        font-weight: 600;
        font-size: 16px;
        color: #003863;
    }

    .option {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 10px;
    }

    .optionName {
        color: #474b55;
        font-weight: 300;
        font-size: 16px;
    }

    .buttonWrapper {
        display: flex;
        flex-direction: row;

        justify-content: space-between;
        margin-top: 10px;
    }
    .dropdownDocType {
        position: absolute;
        background-color: white;
        border: 1px solid #d8d8d8;
        padding: 16px;
        margin: 4px;
        box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
        border-radius: 4px;
        width: max-content;
        margin-top: 5px;
        z-index: 99;
    }

    .dropDownOptionPane {
        max-height: 280px;
        overflow-y: auto;
        margin: 5px 0;
        width: max-content;
    }
`;

export const ClearFilter = styled.button`
    border: 0;
    outline: 0;
    color: #008bbf;
    font-size: 14px;
    cursor: pointer;
    font-weight: 600;
    background-color: white;
    padding: 0;
`;

export const Apply = styled.button`
    color: white;
    background: #3e7128;
    border-radius: 4px;
    padding: 8px 26px;
    cursor: pointer;
    border: 0;
    outline: 0;
`;

export const ClearAll = styled.button`
    border: 0;
    padding: 0;
    color: #008bbf;
    background: none;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
`;


export const ClearAllWrapper = styled.div`
    width: 100%;
    height: 80px;
    position:fixed;
    bottom: 0;
    border: 2px solid red;
`; 

export const NoData = styled.div`
    margin-top: 20px;
    width: 100%;
    text-align: center;
`;

export const DocumentRangeShowWrapper = styled.div`
    position: absolute;
    z-index: 99;
    background: white;
    padding: 1rem;
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.23);
    border-radius: 4px;
   display: flex;
   flex-direction: column;

    
    .main{

        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        gap: 20px;

    }

.text{


  font-family: 'Museo Sans',sans-serif;
font-weight: 400;
font-size: 14px;


color: #474B55;
}
`;

export const HrLine = styled.div`
    width: 100%;
    border-top: 1px solid #d8d8d8;
    margin-bottom: 16.5px;

    padding: 0;

    @media only screen and (max-width: 600px) {
        padding: 0px;
    }
`;

export const DependentBlockWrapper = styled.div`
    max-width: 450px;
    @media only screen and (max-width: 768px) {
        max-width: 100%;
        margin-right: 6px;
    }
`;

export const DateButton = styled.button`
    border: 0;
    padding: 0;
    color: #008bbf;
    background: none;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    margin-top: 8px;
`;

export const DateContent = styled.div`
    @media only screen and (min-width: 769px) {
        margin-bottom: 8px;
        display: flex;
    }
    margin-bottom: 20px;
    margin-top: -7px;
`;

export const DateComponent = styled.div`
    @media only screen and (min-width: 770px) {
        padding: 8px 0px 8px 0px;
        margin: 0px 10px 0px 0px;
    }
    padding: 8px 0px 8px 0px;
    margin-bottom: 0px;

    @media only screen and (min-width: 769px) and (max-width: 769px) {
        margin: 16px 10px 0px 0px;
    }
`;

export const EndDateComponent = styled.div`
    @media only screen and (min-width: 770px) {
        padding: 8px 0px 8px 0px;
        margin-top: 0px;
    }
    padding: 8px 0px 8px 0px;
    @media only screen and (min-width: 769px) and (max-width: 769px) {
        margin: 16px 0px 0px 0px;
    }
`;

export const DateWrapper = styled.div`
    display: flex;
    flex-direction: column;

    span {
        font-size: 16px;
        font-weight: 300;
        color: #474b55;
        margin: 0;
        padding: 0;
    }
    .MuiOutlinedInput-notchedOutline {
        border-color: rgba(0, 0, 0, 0.23) !important;
    }
    .MuiOutlinedInput-root {
        margin-top: 4px !important;
    }
`;

export const styleWithMargin = (border) => {
    return {
        height: 45,
        // border: border ? "2px solid #003863" : "1px solid #a8abac",
        fontFamily: "museo-sans",
        fontColor: "#a8abac",
        backgroundColor: "#ffffff",
        marginTop: "21px",
        width: "100%",
        borderRadius: "4px",
        outline: 0,
    };
};

export const styleWithoutMargin = (border) => {
    return {
        height: 45,
        // border: border ? "2px solid #003863" : "1px solid #a8abac",
        fontFamily: "museo-sans",
        fontColor: "#a8abac",
        backgroundColor: "#ffffff",
        width: "100%",
        borderRadius: "4px",
        outline: 0,
    };
};

export const ImgIcon = styled.img`
    cursor: pointer;
`;

export const Highlight = styled.div`
    background-color: #3e7128;
    border-radius: 50%;
    color: #ffffff !important;
`;

export const NoHighlight = styled.div``;

export const Day = styled(IconButton)`
    width: 36px;
    height: 36px;
    font-size: 12px !important;
    font-family: "museo-sans";
    margin: 0px 0px !important;
    font-weight: 500;
    color: ${(props) =>
        props.highlight
            ? "#ffffff !important"
            : "rgba(0, 0, 0, 0.87) !important"};
`;

export const NoDocumentError = styled.div`
    max-width: 484px;
    padding: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: white;
    flex-direction: column;
    margin: 20px auto 0;
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
    border-radius: 4px;

    .text-wrapper {
        display: flex;
        align-items: center;
        flex-direction: column;
        margin: 22px 0 0px 0;
    }

    .error-message {
        color: #003863;
        font-size: 18px;
        font-weight: 600;
    }

    .error-discription {
        color: #474b55;
        font-size: 14px;
        font-weight: 400;
        text-align: center;
    }
`;

export const RetryButton = styled.button`
    border: 0;
    width: max-content;
    padding: 8px 27px;
    color: #ffffff;
    background: #3e7128;
    font-weight: 600;
    cursor: pointer;
    margin-top: 8px;
    cursor: pointer;
    border-radius: 4px;
    font-size: 18px;
`;

export const FilterButton = styled.div`
    cursor: pointer;
    display: flex;
    flex-direction: row;
    gap: 10px;
    align-items: center;
    justify-content: center;
    width: 100%;
    background: #ffffff;
    border-radius: 20px;
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
    border-radius: 32px;
    padding: 6px 16px;

    span {
        padding: 0;
    }

    .filter {
        color: #474b55;
        font-size: 14px;
        font-weight: 400;
    }
`;
