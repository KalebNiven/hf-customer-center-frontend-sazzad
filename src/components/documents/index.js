import React, { useState, useEffect, useRef } from "react";
import { Box, useMediaQuery, useTheme, Hidden } from "@material-ui/core";
import moment from "moment";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import Spinner from "../common/spinner";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "react-data-table-component";
import format from "date-fns/format";
import isSameDay from "date-fns/isSameDay";
import { FeatureTreatment } from "../../libs/featureFlags";
import {
    setSelectIndexTab,
    getDocumentsList,
    clearDocs,
    clearLoadingStatus,
} from "../../store/actions";
import DependentBlock from "../common/dependentBlock";
import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";
import { SHOW_DOC, SHOW_PAPERLESS_WIDGET } from "../../constants/splits";
import useOnClickOutside from "./useOnClickOutside";

import { AnalyticsTrack } from "../../components/common/segment/analytics";
import {
    ANALYTICS_TRACK_TYPE,
    ANALYTICS_TRACK_CATEGORY,
} from "./../../constants/segment";

import {
    Container,
    Main,
    MyDocuments,
    CurrentlyEnrolled,
    HrLine,
    TableDataUI,
    Paperless,
    LeafIcon,
    FilterWrapper,
    DocumentRangeButton,
    ClearAll,
    NoData,
    DocumentRangeShowWrapper,
    DependentBlockWrapper,
    DateContent,
    DateComponent,
    EndDateComponent,
    DateButton,
    DateWrapper,
    styleWithMargin,
    styleWithoutMargin,
    ImgIcon,
    NoHighlight,
    Highlight,
    Day,
    FilterButton,
} from "./style";

import MobileFilterView from "./filterMobileView";

import Pagination from "../common/pagination";
import { NoDocument, DocErrors } from "./documentErrors";
import { truncateString } from "../../utils/strings";
import { useSplitEval } from "../../hooks/useSplitEval";

const DocumentCenter = (props) => {
    const { featureconfig } = props ? props : {};

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
    const [memberSelection, setMemberSelection] = useState({});
    const [documentTypeToggle, setDocumentTypeToggle] = useState(false);
    const [documentRangeToggle, setDocumentRangeToggle] = useState(false);
    const [selectedDocumentType, setSelectedDocumentType] = useState([]);
    const [displayDocList, setDisplayDocList] = useState([]);
    const [documentsListError, setDocumentsListError] = useState(false);
    const [paperlessStatus, setPaperlessStatus] = useState([]);
    const [paperlessStatusLoaded, setPaperlessStatusLoaded] = useState([]);
    const [documentsListLoaded, setDocumentsListLoaded] = useState([]);

    const [startValue, setStartValue] = useState(null);
    const [endValue, setEndValue] = useState(null);
    const [startOpen, setStartOpen] = useState(false);
    const [endOpen, setEndOpen] = useState(false);
    const [dateRangeDisplay, setDateRangeDisplay] = useState();

    const [showMobileFilterView, setShowMobileFilterView] = useState(false);

    const history = useHistory();


    const ref = useRef();
    const refRange = useRef();
    const refRangeA = useRef();

    useOnClickOutside(ref, () => setDocumentTypeToggle(false));
    useOnClickOutside(refRange, () => setDocumentRangeToggle(false));
    useOnClickOutside(refRangeA, () => setDocumentRangeToggle(false));
    const documents = useSelector((state) => state.documents.data);
    const dispatch = useDispatch();
    const customerInfo = useSelector((state) => state.customerInfo); 
    const [totalRecords, setTotalRecords] = useState(null);
    const splitEval = useSplitEval();

   const setDocumentList = (documentList) => {
    setDisplayDocList(documentList)
    console.log("documentList",documentList)

    }

    const getDocuments = (memberInfo, type, startDate, endDate, overrides) => {
        dispatch(clearLoadingStatus());
        dispatch(clearDocs());

        const memberId =
            memberInfo && memberInfo.value
                ? memberInfo.value
                : memberSelection.memberId;
        const companyCode =
            memberInfo && memberInfo.companyCode
                ? memberInfo.companyCode
                : memberSelection.companyCode;
        const benefitPackage =
            memberInfo && memberInfo.benefitPackage
                ? memberInfo.benefitPackage
                : memberSelection.benefitPackage;

        if (!type) {
            type = selectedDocumentType;
        }

        if (
            dateRangeDisplay &&
            (!overrides || (overrides && !overrides.clearFilters))
        ) {
            if (!startDate && dateRangeDisplay.start) {
                startDate = moment(dateRangeDisplay.start, "MM/DD/YYYY").format(
                    "YYYY-MM-DD"
                );
            }

            if (!endDate && dateRangeDisplay.end) {
                endDate = moment(dateRangeDisplay.end, "MM/DD/YYYY").format(
                    "YYYY-MM-DD"
                );
            }
        }

        dispatch(
            getDocumentsList(
                memberId,
                type,
                startDate,
                endDate,
                companyCode,
                benefitPackage,
                featureconfig
            )
        );
    };

    const handleSegmentBtn = (label, row, action) => {
        try {
            AnalyticsTrack(`${label} clicked`, customerInfo, {
                raw_text: `Document ${
                    row?.DocumentID ? row?.DocumentID : action
                } Clicked`,
                destination_url: window.location.origin + "/document-center",
                category: ANALYTICS_TRACK_CATEGORY.documentCenter,
                type: ANALYTICS_TRACK_TYPE.buttonClicked,
                // targetMemberId: row?.targetMemberId,
                description: `Document ${
                    row?.DocumentID ? row?.DocumentID : action
                } clicked`,
                location: {
                    desktop: {
                        width: 968,
                        value: "center",
                    },
                    tablet: {
                        width: 768,
                        value: "center",
                    },
                    mobile: {
                        width: 0,
                        value: "center",
                    },
                },
                targetMemberId: memberSelection.relationshipType ? memberSelection.memberId : undefined,
                relationshipType: memberSelection.relationshipType
            });
        } catch (err) {
            console.log("AnalyticsTrack Error");
        }
    };

    const customStyles = {
        headCells: {
            style: {
                background: "#f4f4f4",
                color: "#757575",
                fontSize: "12px",
                fontWeight: "400",
                textTransform: "uppercase",
                border: "none",
            },
        },
        table: {
            style: {
                borderCollapse: "separate",
                borderSpacing: "8px",
            },
        },
        rows: {
            style: {
                boxShadow: "0px 2px 8px 0px rgb(0 0 0 / 10%)",
                borderRadius: "4px",              
                width: "auto",
                padding: "0",
                outline: 0,
                "&:hover": {
                    backgroundColor: "rgba(0,0,0,.05) !important",
                    border: "1px solid rgba(0,0,0,.05) !important",
                },
                "&:active": {
                    backgroundColor: "rgba(0,0,0,.1) !important",
                },
            },
        },
        cells: {
            style: {
                width: "auto",
                height: "auto",
                padding: "0",
            },
        },
    };

    const replaceChars = ({word, delimiter="_"})=> {
        if(!word?.length) return ""; 
        const wordArray = word.split(delimiter);
        const filteredWords = wordArray.filter(word => word.toLowerCase() !== "sensitive");
        let finalResult = filteredWords.join(" ");
        if(finalResult?.toLowerCase().indexOf("sensitive") >=0){
        finalResult = finalResult.toLowerCase().replaceAll("sensitive", "");
    }
        return finalResult
    }
   
    
    const columns = [
        {
            id: "Documents",
            selector: (row) => (
                <div data-tag="allowRowEvents" className="iconWrapper">
                    <div data-tag="allowRowEvents" className="icon">
                        <img
                            data-tag="allowRowEvents"
                            src="/react/images/documents-pdf-icon.svg"
                        />
                    </div>
                    <div data-tag="allowRowEvents" className="name">
                        {row.DocumentType ? replaceChars({word: row.DocumentType}) : ""}
                    </div>
                </div>
            ),
            grow: 2,
            name: "Document",
            sortable: true,
            sortFunction: (rowA, rowB) => {
                const aField = rowA.DocumentType;
                const bField = rowB.DocumentType;

                if (aField > bField) {
                    return 1;
                } else {
                    return -1;
                }
            },
        },
        {
            id: "CreationDate",
            selector: "CreationDate",
            cell: (row) => <>{getFormattedDate(row.DocumentDate)}</>,
            name: "Date",
            sortable: true,
            sortFunction: (rowA, rowB) => {
                const aField = moment(
                    rowA.DocumentDate,
                    rowA.DocumentDate.split("-")[0].length < 4
                        ? "MM-DD-YYYY"
                        : "YYYY-MM-DD"
                );
                const bField = moment(
                    rowB.DocumentDate,
                    rowB.DocumentDate.split("-")[0].length < 4
                        ? "MM-DD-YYYY"
                        : "YYYY-MM-DD"
                );

                if (aField > bField) {
                    return 1;
                } else {
                    return -1;
                }
            },
        },
        {
            id: "DocumentType",
            selector: "DocumentType",
            cell: (row) => <>{row.DisplayDocumentTypeName ? row.DisplayDocumentTypeName : row.DocumentType ?  replaceChars({word: row.DocumentType}) : ""}</>,
            name: "Document Type",
            sortable: true,
            sortFunction: (rowA, rowB) => {
                const aField = rowA.DisplayDocumentTypeName ? rowA.DisplayDocumentTypeName : rowA.DocumentType; 
                const bField = rowB.DisplayDocumentTypeName ? rowB.DisplayDocumentTypeName : rowB.DocumentType;

                if (aField > bField) {
                    return 1;
                } else {
                    return -1;
                }
            },
        },
        {
            id: "download",
            selector: "download",
            cell: (row) => (
                <a
                    className="download"
                    onClick={(e) => {
                        handleSegmentBtn("Download button", row);
                        window.open(
                            `/documents/${row.NodeID ? row.NodeID : row.DocumentID}?isNodeId=${row.NodeID ? 'true' : 'false'}`,
                            "_blank"
                        );
                    }}
                >
                    <img
                        className="download-icon"
                        src="/react/images/documents-download-icon.svg"
                    />
                </a>
            ),
            name: "",
            maxWidth: "60px",
        },
    ];

    const getFormattedDate = (date) => {
    
        return moment(
            date,
            date.split("-")[0].length < 4 ? "MM-DD-YYYY" : "YYYY-MM-DD"
        ).format("ll");
    };

    const MobileColumns = [
        {
            id: "CreationDate",
            selector: "CreationDate",
            cell: (row) => (
                <div data-tag="allowRowEvents" className="mobileWrapper">
                    <span data-tag="allowRowEvents" className="icon">
                        <img
                            data-tag="allowRowEvents"
                            src="/react/images/documents-pdf-icon.svg"
                        />
                    </span>
                    <div data-tag="allowRowEvents" className="mobileContainer">
                        <span data-tag="allowRowEvents" className="name">
                        
                            {truncateString( 
                                row.DocumentType ? replaceChars({word: row.DocumentType}) : "", 
                                20
                            )}
                        </span>
                        <span data-tag="allowRowEvents" className="date">
                            {getFormattedDate(row.DocumentDate)}
                        </span>
                    </div>
                </div>
            ),
            sortable: true,
            sortFunction: (rowA, rowB) => {
 

                const aField = moment(
                    rowA.DocumentDate,
                    rowA.DocumentDate.split("-")[0].length < 4
                        ? "MM-DD-YYYY"
                        : "YYYY-MM-DD"
                );
                const bField = moment(
                    rowB.DocumentDate,
                    rowB.DocumentDate.split("-")[0].length < 4
                        ? "MM-DD-YYYY"
                        : "YYYY-MM-DD"
                );

                if (aField > bField) {
                    return 1;
                } else {
                    return -1;
                }
            },
            name: "Date",
        },

        {
            id: "download",
            selector: (row) => (
                <a
                    className="download"
                    onClick={(e) => {
                        handleSegmentBtn("Download button", row);

                        window.open(
                            `/documents/${row.NodeID ? row.NodeID : row.DocumentID}?isNodeId=${row.NodeID ? 'true' : 'false'}`,
                            "_blank"
                        );
                    }}
                >
                    <img
                        className="download-icon"
                        src="/react/images/documents-download-icon.svg"
                    />
                </a>
            ),
            name: "",
            maxWidth: "60px",
            minWidth: "0px",
        },
    ];

    useEffect(() => {
        setMemberSelection({
            ...memberSelection,
            memberId: customerInfo.data.memberId,
            planName: customerInfo.data.planName,
            membershipStatus: customerInfo.data.membershipStatus,
            membershipEffectiveDate: customerInfo.data.membershipEffectiveDate,
            membershipExpirationDate:
                customerInfo.data.membershipExpirationDate,
            companyCode: customerInfo.data.companyCode,
            lob: customerInfo.data.sessLobCode,
            groupNumber: customerInfo.data.groupNumber,
            benefitPackage: customerInfo.data.benefitPackage,
            firstName: customerInfo.data.firstName,
            lastName: customerInfo.data.lastName,
        });
        getDocuments({
            value: customerInfo.data.memberId,
            companyCode: customerInfo.data.companyCode,
            benefitPackage: customerInfo.data.benefitPackage,
        });

        dispatch(clearLoadingStatus());
    }, [customerInfo]);

    useEffect(() => {
        const {
            documentsList,
            documentTypes,
            paperlessStatus,
            paperlessStatusLoaded,
            documentsListLoaded,
            documentsListError
        } = documents;
        setDocumentList(documentsList);
        setPaperlessStatus(paperlessStatus);
        setDocumentsListError(documentsListError);
        setPaperlessStatusLoaded(paperlessStatusLoaded);
        setDocumentsListLoaded(documentsListLoaded);
        sessionStorage.setItem("longLoad", false);
        if(totalRecords === null && documentsListLoaded == true){            
                setTotalRecords(documentsList?.length ? documentsList?.length : 0 )
        }
        
    }, [documents]);

    useEffect(()=>{

        if(startValue && endValue){
            setDocumentRangeToggle(false);
            if(isMobile) {
                setShowMobileFilterView(false)
                setDocumentsListLoaded(false);
            }
        }
    },[startValue,endValue]) 

    const handleCheckboxChange = (event) => {
        const type = event.target.name;
        if (event.target.checked) {
            if (selectedDocumentType.indexOf(type) < 0) {
                const arr = [...selectedDocumentType, type];
                setSelectedDocumentType(arr);
                getDocuments(null, arr);
            }
        } else {
            const filter = selectedDocumentType.filter((text) => text != type);
            if (filter?.length === 0) {
                const { documentsList } = documents;
                setDocumentList(documentsList);
            }
            setSelectedDocumentType(filter);
            getDocuments(null, documentsList);
        }
    };
    const resetFilter = () => {
        setDocumentTypeToggle(false);
        const { documentsList } = documents;
        setDocumentList(documentsList);
        setSelectedDocumentType([]);
    };
    const applyFilter = () => {
        setDocumentTypeToggle(false);
        const { documentsList } = documents;
        const displayArry =
            selectedDocumentType?.length === 0
                ? documentsList
                : documentsList.filter(
                      (item) =>
                          selectedDocumentType.indexOf(item.DocumentType) > -1
                  );
        setDocumentList(displayArry);
    };

    const handleRenderDay = (date, selectedDate, dayInCurrentMonth) => {
        const isSelected = isSameDay(date, selectedDate);

        return dayInCurrentMonth ? (
            isSelected ? (
                <Highlight>
                    <Day highlight>
                        <span>{format(date, "d")}</span>
                    </Day>
                </Highlight>
            ) : (
                <NoHighlight>
                    <Day>
                        <span>{format(date, "d")}</span>
                    </Day>
                </NoHighlight>
            )
        ) : (
            <NoHighlight>
                <Day disabled>
                    <span></span>
                </Day>
            </NoHighlight>
        );
    };

    const handleStartOpen = () => {
        setStartOpen(!startOpen);
    };

    const handleEndOpen = () => {
        setEndOpen(!endOpen);
    };

    const clearStartDate = (e) => {
        e.stopPropagation();
        e.preventDefault();
        setStartValue(null);
    };

    const clearEndDate = (e) => {
        e.stopPropagation();
        e.preventDefault();
        setEndValue(null);
    };

    const handleStyles = (width, start) => {
        let styles = "";
        let endIcon = "";
        if (start) {
            styles =
                width > 768
                    ? styleWithMargin(startOpen)
                    : styleWithoutMargin(startOpen);
            if (startValue)
                endIcon = (
                    <ImgIcon
                        alt=""
                        style={{ cursor: "pointer" }}
                        src="/react/images/icn-close.svg"
                        onClick={(e) => {
                            setStartValue(null);
                            setDocumentTypeToggle(false);
                            setDocumentRangeToggle(false);
                            setDocumentsListLoaded(false);
                            setDisplayDocList([]);
                            getDocuments(null, null, null, null, {
                                clearFilters: true,
                            });

                            handleSegmentBtn("Clear Start Date Filter", {}, "Clear Start Date Filter");

                            clearStartDate(e);
                            setDateRangeDisplay({
                                ...dateRangeDisplay,
                                start: null,
                            });
                        }}
                    />
                );
            else
                endIcon = startOpen ? (
                    <ImgIcon alt="" src="/react/images/icn-dropdown-up.svg" />
                ) : (
                    <ImgIcon alt="" src="/react/images/icn-dropdown.svg" />
                );
        } else {
            styles =
                width > 768
                    ? styleWithMargin(endOpen)
                    : styleWithoutMargin(endOpen);
            if (endValue)
                endIcon = (
                    <ImgIcon
                        alt=""
                        style={{ cursor: "pointer" }}
                        src="/react/images/icn-close.svg"
                        onClick={(e) => {
                            // setStartValue(null);
                            setEndValue(null);

                            setDocumentTypeToggle(false);
                            setDocumentRangeToggle(false);
                            setDocumentsListLoaded(false);
                            setDisplayDocList([]);
                            getDocuments(null, null, null, null, {
                                clearFilters: true,
                            });

                            handleSegmentBtn("Clear End Date Filter", {});

                            clearEndDate(e);
                            setDateRangeDisplay({
                                ...dateRangeDisplay,
                                start: null,
                            });
                        }}
                    />
                );
            else
                endIcon = endOpen ? (
                    <ImgIcon
                        alt="dropdownUpIcon"
                        src="/react/images/icn-dropdown-up.svg"
                    />
                ) : (
                    <ImgIcon alt="" src="/react/images/icn-dropdown.svg" />
                );
        }
        return {
            style: styles,
            startAdornment: <img alt="" src="/react/images/icn-calendar.svg" />,
            endAdornment: endIcon,
        };
    };

    const getMmanagePaperlessLink = () => {
        return (
            <a
                className="manage"
                onClick={() => {
                    handleSegmentBtn(
                        "Manage button",
                        undefined,
                        "Manage button"
                    );
                    history.push({
                        pathname: "/settings",
                        state: {
                            sideBarIndex: 2,
                        },
                    });
                }}
            >
                Manage
            </a>
        );
    };


    return (
        <Container>
            {showMobileFilterView && (
                <MobileFilterView
                    setShowMobileFilterView={setShowMobileFilterView}
                    startValue={startValue}
                    setStartValue={setStartValue}
                    endValue={endValue}
                    setEndValue={setEndValue}
                    setDateRangeDisplay={setDateRangeDisplay}
                    dateRangeDisplay={dateRangeDisplay}
                    getDocuments={getDocuments}
                    setDisplayDocList={setDisplayDocList}
                    setDocumentsListLoaded={setDocumentsListLoaded}
                />
            )}
            <Main>
                <MyDocuments>Document Center</MyDocuments>

                {paperlessStatusLoaded ? (
                    paperlessStatus ? (
                        <CurrentlyEnrolled>
                        {splitEval.evaluateSplitByName(SHOW_PAPERLESS_WIDGET) && 
                            <>
                                <Paperless>
                                    <LeafIcon src="/react/images/documents-leaf.svg"></LeafIcon>
                                    <span>
                                        Currently enrolled in
                                        <span className="option">
                                            {" "}
                                            Paperless
                                        </span>
                                        .
                                    </span>
                                    <a
                                        onClick={() => {
                                            handleSegmentBtn("Edit button", {});
                                            history.push({
                                                pathname: "/settings",
                                                state: {
                                                    sideBarIndex: 2,
                                                },
                                            });
                                        }}
                                    >
                                        Edit
                                    </a>
                                </Paperless>
                                <p>
                                    You are no longer receiving paper mail for
                                    certain communications (determination
                                    letters for Clinical, Appeals & Grievances,
                                    EOBs, etc.) as these notices will now be
                                    posted directly within My Documents.
                                </p>
                                <span className="text">
                                    Only records from the past two years will be
                                    displayed below.
                                </span>
                            </>
                            }

                            <DependentBlockWrapper className="no-print">
                                {
                                    <DependentBlock
                                        memberSelection={memberSelection}
                                        setMemberSelection={setMemberSelection}
                                        halfWidth
                                        callback={(memberInfo) => {
                                            handleSegmentBtn(
                                                "Select member dropdown",
                                                undefined,
                                                "member"
                                            );

                                            setDocumentsListLoaded(false);
                                            setDisplayDocList([]);
                                            getDocuments(memberInfo);
                                        }}
                                        activeOnly={
                                            customerInfo.data
                                                ?.membershipStatus !== "active"
                                        }
                                        minorsOnly={true}
                                        prevPlans={
                                            featureconfig.SHOW_PREVIOUS_PLANS
                                                ? true
                                                : false
                                        }
                                        activeDepsOnly={false}
                                    />
                                }
                            </DependentBlockWrapper>
                        </CurrentlyEnrolled>
                    ) : (
                        <CurrentlyEnrolled>
                            {
                                splitEval.evaluateSplitByName(SHOW_PAPERLESS_WIDGET) && 
                                <>
                                    <Paperless>
                                        <LeafIcon src="/react/images/documents-leaf.svg"></LeafIcon>
                                        <span>
                                            <span className="option">
                                                Enroll in Paperless
                                            </span>
                                            .
                                        </span>
                                    </Paperless>
                                    <p>
                                        Enroll to get your documents online instead of
                                        by mail, and save paper and time. Your documents
                                        will be sent to your primary email address as
                                        they become paperless and available online.
                                    </p>

                                    <a
                                        style={{
                                            cursor: "pointer",
                                            color: "#008bbf !important",
                                            fontWeight: "bold",
                                            width: "fit-content",
                                        }}
                                        onClick={() => {
                                            dispatch(setSelectIndexTab(2));
                                            history.push({
                                                pathname: "/settings",
                                                state: {
                                                    sideBarIndex: 2,
                                                },
                                            });
                                        }}
                                    >
                                        <span
                                            style={{
                                                color: "#008bbf",
                                                fontWeight: "bold",
                                            }}
                                            onClick={() => {
                                                handleSegmentBtn(
                                                    "Enroll in paperless",
                                                    undefined,
                                                    "enroll in paperless"
                                                );
                                            }}
                                        >
                                            Enroll in Paperless
                                        </span>
                                    </a>

                                    <span className="text">
                                        Only records from the past two years will be
                                        displayed below.
                                    </span>
                                </>
                            }
                            <DependentBlockWrapper className="no-print">
                                {
                                    <DependentBlock
                                        memberSelection={memberSelection}
                                        setMemberSelection={setMemberSelection}
                                        halfWidth
                                        callback={(memberInfo) => {
                                            handleSegmentBtn(
                                                "Select member dropdown",
                                                {},
                                                "member"
                                            );
                                            setDocumentsListLoaded(false);
                                            setDocumentList([]);
                                            setTotalRecords(null);
                                            getDocuments(memberInfo);
                                        }}
                                        activeOnly={
                                            customerInfo.data?.accountStatus ===
                                            "active"
                                                ? false
                                                : true
                                        }
                                        minorsOnly={true}
                                        prevPlans={
                                            featureconfig.SHOW_PREVIOUS_PLANS
                                                ? true
                                                : false
                                        }
                                        activeDepsOnly={false}
                                    />
                                }
                            </DependentBlockWrapper>
                        </CurrentlyEnrolled>
                    )
                ) : (
                    <></>
                )}

                <HrLine />
                {totalRecords > 0 && (
                    <>
                        {isMobile ? (
                            <>
                                <FilterButton
                                    onClick={() => {
                                        setShowMobileFilterView(true);
                                        handleSegmentBtn(
                                            "Filter button",
                                            {},
                                            "Filter button"
                                        );
                                    }}
                                >
                                    <span>
                                        <img
                                            alt=""
                                            src="/react/images/filter.svg"
                                        />
                                    </span>
                                    <span className="filter">Filters</span>
                                </FilterButton>
                            </>
                        ) : (
                            <FilterWrapper>
                                <span>Filter By</span>
                                <DocumentRangeButton
                                    selected={documentRangeToggle}
                                    datePicked={startValue}
                                    onClick={() => {
                                        handleSegmentBtn(
                                            "Date range button",
                                            {},
                                            "Date range button"
                                        );
                                        setDocumentTypeToggle(false);
                                        setDocumentRangeToggle(
                                            !documentRangeToggle
                                        );
                                    }}
                                >
                                    {!startValue && !endValue && "Date Range"}
                                    {startValue || endValue ? (
                                        <>
                                            {dateRangeDisplay?.start}
                                            {dateRangeDisplay &&
                                            dateRangeDisplay.start &&
                                            dateRangeDisplay.end
                                                ? " - "
                                                : ""}
                                            {dateRangeDisplay?.end}
                                        </>
                                    ) : null}
                                </DocumentRangeButton>
                                {!documentRangeToggle &&
                                (startValue || endValue) ? (
                                    <ClearAll
                                        onClick={() => {
                                            setSelectedDocumentType([]);
                                            setDocumentTypeToggle(false);
                                            setDocumentRangeToggle(false);
                                            setDateRangeDisplay();
                                            setStartValue(null);
                                            setEndValue(null);
                                            setDocumentsListLoaded(false);
                                            setDocumentList([]);
                                            getDocuments(
                                                null,
                                                null,
                                                null,
                                                null,
                                                { clearFilters: true }
                                            );
                                            handleSegmentBtn(
                                                "Clear all button",
                                                {},
                                                "Clear all button"
                                            );
                                        }}
                                    >
                                        Clear all
                                    </ClearAll>
                                ) : null}
                            </FilterWrapper>
                        )}
                    </>
                )}

                {documentRangeToggle && (
                    <DocumentRangeShowWrapper>
                        <div className="main">
                            <DateContent>
                                <DateComponent>
                                    <DateWrapper
                                        ref={refRange}
                                        className="preventClose"
                                    >
                                        <span>From</span>

                                        <MuiPickersUtilsProvider
                                            utils={DateFnsUtils}
                                        >
                                            <DatePickerFeild
                                                className="bordered-date-picker"
                                                minDate={moment().subtract(
                                                    2,
                                                    "years"
                                                )}
                                                autoOk
                                                disableToolbar
                                                variant="inline"
                                                inputVariant="outlined"
                                                format="MM/dd/yyyy"
                                                id="date-start-inline-doc"
                                                value={startValue}
                                                onChange={(value) => {
                                                    var startDate = moment(
                                                        value
                                                    );
                                                    var endDate = moment(
                                                        endValue
                                                    );

                                                    if (startDate > endDate) {
                                                        setStartValue(
                                                            moment(endValue)
                                                                .subtract(
                                                                    1,
                                                                    "days"
                                                                )
                                                                .utcOffset(
                                                                    0,
                                                                    false
                                                                )
                                                                .format(
                                                                    "MM/DD/YYYY"
                                                                )
                                                        );
                                                        setDateRangeDisplay({
                                                            ...dateRangeDisplay,
                                                            start: moment(
                                                                endValue
                                                            )
                                                                .subtract(
                                                                    1,
                                                                    "days"
                                                                )
                                                                .format(
                                                                    "MM/DD/YYYY"
                                                                ),
                                                        });
                                                        getDocuments(
                                                            null,
                                                            null,
                                                            moment(endValue)
                                                                .subtract(
                                                                    1,
                                                                    "days"
                                                                )
                                                                .format(
                                                                    "YYYY-MM-DD"
                                                                )
                                                        );
                                                    } else {
                                                        setDateRangeDisplay({
                                                            ...dateRangeDisplay,
                                                            start: moment(
                                                                value
                                                            ).format(
                                                                "MM/DD/YYYY"
                                                            ),
                                                        });
                                                        setStartValue(
                                                            moment(value)
                                                                .utcOffset(
                                                                    0,
                                                                    false
                                                                )
                                                                .format(
                                                                    "MM/DD/YYYY"
                                                                )
                                                        );
                                                        getDocuments(
                                                            null,
                                                            null,
                                                            moment(
                                                                value
                                                            ).format(
                                                                "YYYY-MM-DD"
                                                            )
                                                        );
                                                    }

                                                    setDocumentsListLoaded(
                                                        false
                                                    );
                                                    setDocumentList([]);
                                                }}
                                                isOpen={startOpen}
                                                onOpen={handleStartOpen}
                                                onClose={handleStartOpen}
                                                placeholder="mm/dd/yyyy"
                                                renderDay={handleRenderDay}
                                                InputProps={handleStyles(
                                                    window.screen.width,
                                                    true
                                                )}
                                                PopoverProps={{
                                                    anchorOrigin: {
                                                        horizontal: "left",
                                                        vertical: "bottom",
                                                    },
                                                    transformOrigin: {
                                                        horizontal: "left",
                                                        vertical: "top",
                                                    },
                                                    style: { left: "-35px" },
                                                }}
                                            />
                                        </MuiPickersUtilsProvider>
                                    </DateWrapper>
                                </DateComponent>
                                <EndDateComponent>
                                    <DateWrapper ref={refRangeA}>
                                        <span>To</span>
                                        <MuiPickersUtilsProvider
                                            utils={DateFnsUtils}
                                        >
                                            <DatePickerFeild
                                                minDate={moment().subtract(
                                                    2,
                                                    "years"
                                                )}
                                                autoOk
                                                disableToolbar
                                                variant="inline"
                                                inputVariant="outlined"
                                                format="MM/dd/yyyy"
                                                id="date-end-inline-doc"
                                                onOpen={handleEndOpen}
                                                onClose={handleEndOpen}
                                                isOpen={endOpen}
                                                value={endValue}
                                                onChange={(value) => {
                                                    var startDate = moment(
                                                        startValue
                                                    );
                                                    var endDate = moment(value);

                                                    if (startDate > endDate) {
                                                        setEndValue(
                                                            moment(startValue)
                                                                .add(1, "days")
                                                                .utcOffset(
                                                                    0,
                                                                    false
                                                                )
                                                                .format(
                                                                    "MM/DD/YYYY"
                                                                )
                                                        );
                                                        setDateRangeDisplay({
                                                            ...dateRangeDisplay,
                                                            end: moment(
                                                                startValue
                                                            )
                                                                .add(1, "days")
                                                                .format(
                                                                    "MM/DD/YYYY"
                                                                ),
                                                        });
                                                        getDocuments(
                                                            null,
                                                            null,
                                                            null,
                                                            moment(startValue)
                                                                .add(1, "days")
                                                                .format(
                                                                    "YYYY-MM-DD"
                                                                )
                                                        );
                                                    } else {
                                                        setDateRangeDisplay({
                                                            ...dateRangeDisplay,
                                                            end: moment(
                                                                value
                                                            ).format(
                                                                "MM/DD/YYYY"
                                                            ),
                                                        });
                                                        setEndValue(
                                                            moment(value)
                                                                .utcOffset(
                                                                    0,
                                                                    false
                                                                )
                                                                .format(
                                                                    "MM/DD/YYYY"
                                                                )
                                                        );
                                                        getDocuments(
                                                            null,
                                                            null,
                                                            null,
                                                            moment(
                                                                value
                                                            ).format(
                                                                "YYYY-MM-DD"
                                                            )
                                                        );
                                                    }

                                                    setDocumentsListLoaded(
                                                        false
                                                    );
                                                    setDocumentList([]);
                                                }}
                                                placeholder="mm/dd/yyyy"
                                                renderDay={handleRenderDay}
                                                InputProps={handleStyles(
                                                    window.screen.width,
                                                    false
                                                )}
                                                PopoverProps={{
                                                    anchorOrigin: {
                                                        horizontal: "left",
                                                        vertical: "bottom",
                                                    },
                                                    transformOrigin: {
                                                        horizontal: "left",
                                                        vertical: "top",
                                                    },
                                                    style: { left: "-35px" },
                                                }}
                                            />
                                        </MuiPickersUtilsProvider>
                                    </DateWrapper>
                                </EndDateComponent>
                            </DateContent>
                            <DateButton
                                onClick={() => {
                                    setStartValue(null);
                                    setEndValue(null);
                                    setDateRangeDisplay();
                                    setDocumentTypeToggle(false);
                                    setDocumentRangeToggle(false);
                                    setDocumentsListLoaded(false);
                                    setDocumentList([]);
                                    getDocuments(null, null, null, null, {
                                        clearFilters: true,
                                    });

                                    handleSegmentBtn(
                                        "Clear button",
                                        {},
                                        "Clear button"
                                    );
                                }}
                            >
                                Clear
                            </DateButton>
                        </div>
                    </DocumentRangeShowWrapper>
                )}

                {documentsListError ? (
                    <Box>
                        <DocErrors
                            tryAgain={() => {
                                setDocumentsListLoaded(false);
                                setDisplayDocList([]);
                                setDocumentsListError(false);
                                getDocuments();
                            }}
                        />
                    </Box>
                ) : displayDocList &&
                  displayDocList?.length === 0 &&
                  documentsListLoaded ? (
                    <Box>
                        <NoDocument />
                    </Box>
                ) : (
                    <></>
                )}

                {(displayDocList || displayDocList?.length === 0) &&
                !documentsListLoaded ? (
                    <ProgressWrapper>
                        <Spinner />
                    </ProgressWrapper>
                ) : (
                    displayDocList?.length > 0 && (
                        <TableDataUI>
                            <Hidden only={["xs"]}>
                                <DataTable
                                    noHeader={true}
                                    data={displayDocList}
                                    columns={columns}
                                    pagination
                                    paginationPerPage={10}
                                    paginationComponent={Pagination}
                                    onChangePage={(page) => {
                                        if (page) {
                                            const segmentMessage = `Page No. ${page}`;
                                            handleSegmentBtn(
                                                "PageChangeButton",
                                                undefined,
                                                segmentMessage
                                            );
                                        }
                                    }}
                                    onChangeRowsPerPage={(
                                        currentRowsPerPage
                                    ) => {
                                        if (currentRowsPerPage) {
                                            const segmentMessage = `No. of Documents per page ${currentRowsPerPage}`;
                                            handleSegmentBtn(
                                                "DocumentsPerPage",
                                                undefined,
                                                segmentMessage
                                            );
                                        }
                                    }}
                                    defaultSortField="CreationDate"
                                    onSort={({ name }) => {
                                        if (name) {
                                            const segmentMessage = `${name} sort`;
                                            handleSegmentBtn(
                                                segmentMessage,
                                                undefined,
                                                segmentMessage
                                            );
                                        }
                                    }}
                                    defaultSortAsc={false}
                                    highlightOnHover
                                    noDataComponent={<NoData />}
                                    style={{
                                        boxShadow: "0 2px 8px 0 #d8d8d8",
                                        borderRadius: "4px",
                                        display: "inline",
                                    }}
                                    onRowClicked={(row) => {
                                        handleSegmentBtn(
                                            "Download button",
                                            row
                                        );
                                        window.open(
                                            `/documents/${row.NodeID ? row.NodeID : row.DocumentID}?isNodeId=${row.NodeID ? 'true' : 'false'}`,
                                            "_blank"
                                        );
                                    }}
                                    customStyles={customStyles}
                                    
                                />
                            </Hidden>

                            <Hidden only={["xl", "lg", "md", "sm"]}>
                                <DataTable
                                    noHeader={true}
                                    data={displayDocList}
                                    columns={MobileColumns}
                                    pagination
                                    paginationPerPage={10}
                                    paginationComponent={Pagination}
                                    onChangePage={(page) => {
                                        if (page) {
                                            const segmentMessage = `Page No. ${page}`;
                                            handleSegmentBtn(
                                                "PageChangeButton",
                                                undefined,
                                                segmentMessage
                                            );
                                        }
                                    }}
                                    onChangeRowsPerPage={(
                                        currentRowsPerPage
                                    ) => {
                                        if (currentRowsPerPage) {
                                            const segmentMessage = `No. of Documents per page ${currentRowsPerPage}`;
                                            handleSegmentBtn(
                                                "DocumentsPerPage",
                                                undefined,
                                                segmentMessage
                                            );
                                        }
                                    }}
                                    defaultSortField="CreationDate"
                                    onSort={({ name }) => {
                                        if (name) {
                                            const segmentMmessage = `${name} sort`;
                                            handleSegmentBtn(
                                                segmentMmessage,
                                                undefined,
                                                segmentMmessage
                                            );
                                        }
                                    }}
                                    defaultSortAsc={false}
                                    noDataComponent={<NoData />}
                                    style={{
                                        boxShadow: "0 2px 8px 0 #d8d8d8",
                                        borderRadius: "4px",
                                        display: "inline",
                                    }}
                                    onRowClicked={(row) => {
                                        handleSegmentBtn(
                                            "Download button",
                                            row
                                        );
                                        window.open(
                                            `/documents/${row.NodeID ? row.NodeID : row.DocumentID}?isNodeId=${row.NodeID ? 'true' : 'false'}`,
                                            "_blank"
                                        );
                                    }}
                                    customStyles={customStyles}
                                    
                                />
                            </Hidden>
                        </TableDataUI>
                    )
                )}
            </Main>
        </Container>
    );
};

const Index = (props) => {
    const customerInfo = useSelector((state) => state.customerInfo);

    const splitAttributes = {
        lob: customerInfo.data?.sessLobCode,
        membershipStatus: customerInfo.data?.membershipStatus,
        accountStatus: customerInfo.data?.accountStatus,
        companyCode: customerInfo.data?.hohPlans?.map(
            (plan) => plan.CompanyNumber
        ),
        benefitPackage: customerInfo.data?.hohPlans?.map(
            (plan) => plan.BenefitPackage
        ),
    };

    const splitAttributesForPaperless = {
        companyCode: customerInfo.data?.companyCode,
        benefitPackage: customerInfo.data?.benefitPackage,
        lob: customerInfo.data?.sessLobCode,
        membershipStatus: customerInfo.data?.membershipStatus,
        accountStatus: customerInfo.data?.accountStatus,
    }; 
    const featureTreatment = (
        <FeatureTreatment
            key="doc_center_page_feature"
            treatmentNames={[SHOW_DOC]}
            treatmentName={SHOW_DOC}
            onLoad={() => {}}
            onTimedout={() => {}}
            attributes={splitAttributes}
        >
            <DocumentCenter {...props} splitAttributesForPaperless={splitAttributesForPaperless} /> 
        </FeatureTreatment>
    );

    return featureTreatment;
};

const ProgressWrapper = styled.div`
    width: 100%;
    margin-top: 10px;
    margin-bottom: 10px;
`;

export default Index;

const DatePickerFeild = styled(DatePicker)`
    & > div {
        border: ${(props) =>
            props.isOpen ? "2px solid rgb(0, 56, 99) !important" : ""};
    }

    .MuiOutlinedInput-inputAdornedStart {
        padding-left: 4px;
        padding-top: 20px;
    }

    .MuiOutlinedInput-inputAdornedEnd {
        padding-left: 4px;
        padding-top: 20px;
    }
`;  