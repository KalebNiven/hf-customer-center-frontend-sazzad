import React, { useState, useEffect } from "react";
import styled from "styled-components";
import DataTable from "react-data-table-component";
import Pagination from "./pagination";
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import format from "date-fns/format";
import isSameDay from "date-fns/isSameDay";
import { Hidden, IconButton } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { red } from "@material-ui/core/colors";
import DropdownSelect from "./dropdownSelect";
const SearchComponent = ({ searchTxt, onFilter, searchPlaceHolder }) => (
    <Search
        id="search"
        onChange={onFilter}
        type="text"
        placeholder={searchPlaceHolder}
        value={searchTxt}
        aria-label="Search Input"
    />
);

const theme = createMuiTheme({
    overrides: {
        // Style sheet name
        MuiFormControl: {
            // Name of the rule
            root: {
                // Some CSS
                width: "100%",
                "&:focus-visible": {
                    outline: "none",
                },
            },
        },
        MuiOutlinedInput: {
            root: {
                marginTop: "30px !important",
                "@media only screen and (max-width: 769px)": {
                    marginTop: "5px !important",
                },
            },
            notchedOutline: {
                borderColor: "transparent !important",
            },
        },
        MuiInputBase: {
            root: {
                cursor: "pointer",
            },
            input: {
                padding: "5px !important",
                cursor: "pointer",
            },
        },
        MuiPopover: {
            paper: {
                marginTop: "12px",
            },
        },
    },
});

const TableContent = ({
    searchPlaceHolder,
    data,
    customerInfo,
    columns,
    mobileColumns,
    defaultSortFieldId,
    defaultSortAsc,
    pathName,
    tab,
    handleSegmentBtn,
}) => {
    const [searchTxt, setSearchTxt] = useState("");
    const [srchResult, setSrchResult] = useState([]);
    const [memberships, setMemberships] = useState([]);
    const [membershipSelection, setMembershipSelection] = useState(null);
    const [startValue, setStartValue] = useState(null);
    const [endValue, setEndValue] = useState(null);
    const [startOpen, setStartOpen] = useState(false);
    const [endOpen, setEndOpen] = useState(false);
    const history = useHistory();

    

    const customStyle = {
        headRow: {
            style: {
                minHeight: "46px",
            },
        },
        headCells: {
            style: {
                fontSize: "12px",
                color: "#757575",
                fontWeight: "500",
            },
        },
        cells: {
            style: {
                fontSize: "14px",
                fontWeight: "500",
                color: "#474b55",
                textTransform: "capitalize",
            },
        },
        rows: {
            style: {
                outline: "none !important",
                minHeight: "56px",
                "&:hover": {
                    backgroundColor: "rgba(0,0,0,.05) !important",
                },
                "&:active": {
                    backgroundColor: "rgba(0,0,0,.1) !important",
                },
            },
        },
        table: {
            style: {
                boxShadow: "0 2px 8px 0 #d8d8d8",
                color: "black",
                minWidth: "600px",
            },
        },
        tableWrapper: {
            style: {
                display: "initial",
            },
        },
    };

    const tableStyle = {
        headRow: {
            denseStyle: {
                minHeight: "32px !important",
            },
        },
        rows: {
            style: {
                minHeight: "56px",
            },
        },
    };

    useEffect(() => {
        formatMemberDDList();
    }, []);

    useEffect(() => {
        let searchResult;
        if (tab === "claim") {
            searchResult = data.filter(
                (item) =>
                    (searchTxt.length >= 3
                        ? item.claimId
                              .toLowerCase()
                              .includes(searchTxt.toLowerCase()) ||
                          item.providerName
                              .toLowerCase()
                              .includes(searchTxt.toLowerCase()) ||
                          item.claimStatus
                              .toLowerCase()
                              .includes(searchTxt.toLowerCase()) ||
                          item.memberName
                              .toLowerCase()
                              .includes(searchTxt.toLowerCase())
                        : item) &&
                    (startValue != null
                        ? new Date(item.serviceDate).setHours(0, 0, 0, 0) >=
                          new Date(startValue).setHours(0, 0, 0, 0)
                        : item) &&
                    (endValue != null
                        ? new Date(item.serviceDate).setHours(0, 0, 0, 0) <=
                          new Date(endValue).setHours(0, 0, 0, 0)
                        : item) &&
                    (membershipSelection != null
                        ? membershipSelection == item.memberId
                        : item)
            );
        } else {
            searchResult = data.filter(
                (item) =>
                    (searchTxt.length >= 3
                        ? item.authorizationId
                              .toLowerCase()
                              .includes(searchTxt.toLowerCase()) ||
                          item.providerName
                              .toLowerCase()
                              .includes(searchTxt.toLowerCase()) ||
                          item.authorizationStatus
                              .toLowerCase()
                              .includes(searchTxt.toLowerCase())
                        : item) &&
                    (startValue != null
                        ? new Date(item.startDate).setHours(0, 0, 0, 0) >=
                          new Date(startValue).setHours(0, 0, 0, 0)
                        : item) &&
                    (endValue != null
                        ? new Date(item.endDate).setHours(0, 0, 0, 0) <=
                          new Date(endValue).setHours(0, 0, 0, 0)
                        : item) &&
                    (membershipSelection != null
                        ? membershipSelection == item.memberId
                        : item)
            );
        }
        setSrchResult(searchResult);
    }, [searchTxt, membershipSelection, startValue, endValue, data]);

    const handleRenderDay = (date, selectedDate, dayInCurrentMonth) => {
        const isSelected = isSameDay(date, selectedDate);

        return dayInCurrentMonth ? (
            isSelected ? (
                <Highlight>
                    <Day highlight = "true">
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

    const formatNameCapitalize = (name) => {
        if (typeof name !== "undefined") {
            name = name.toLowerCase();
            return name.charAt(0).toUpperCase() + name.slice(1);
        }
        return name;
    };

    const formatMemberDDList = () => {
        var memberships = [];
        memberships.push({ label: "All Members", value: null, planName: "" });

        customerInfo["hohPlans"].forEach((plan) => {
            var hohplan = {
                label:
                    formatNameCapitalize(plan.FirstName) +
                    " " +
                    formatNameCapitalize(plan.LastName),
                value: plan.MemberId,
                planName: formatNameCapitalize(plan.PlanName),
                membershipStatus: plan.MembershipStatus,
                membershipEffectiveDate: plan.MembershipEffectiveDate,
                membershipExpirationDate: plan.MembershipExpirationDate,
                companyCode: plan.CompanyCode,
                firstName: plan.FirstName,
                lastName: plan.LastName,
            };
            memberships.push(hohplan);
        });

        customerInfo["dependents"].forEach((dependent) => {
            var membership = {
                label:
                    formatNameCapitalize(dependent.firstName) +
                    " " +
                    formatNameCapitalize(dependent.lastName),
                value: dependent.memberId,
                planName: dependent.planName,
            };
            memberships.push(membership);
        });
        setMemberships(memberships);
    };

    const handleMembershipSelection = (memberId) => {
        setMembershipSelection(memberId);
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
                        src="/react/images/icn-close.svg"
                        onClick={(e) => clearStartDate(e)}
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
                        src="/react/images/icn-close.svg"
                        onClick={(e) => clearEndDate(e)}
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

    return (
        <ThemeProvider theme={theme}>
            <OuterContainer srchResult={srchResult}>
                <InnerWrapper>
                    <SearchComponent
                        searchTxt={searchTxt}
                        onFilter={(e) => setSearchTxt(e.target.value)}
                        searchPlaceHolder={searchPlaceHolder}
                    />
                    {memberships && memberships.length > 2 ? (
                        <MemberDropDownSelect
                            selected={{ label: "All Members" }}
                            values={memberships}
                            showImage={true}
                            onSelect={handleMembershipSelection}
                            //error={phoneTypeError}
                            //onInvalidateError={invalidatePhoneTypeError}
                            errorMessage="Please select an option."
                        />
                    ) : null}
                    <DateContent>
                        <DateComponent>
                            <MuiPickersUtilsProvider  utils={DateFnsUtils}>
                                <DatePicker
                                    autoOk
                                    disableToolbar
                                    variant="inline"
                                    inputVariant="outlined"
                                    format="MM/dd/yyyy"
                                    id="date-start-inline"
                                    value={startValue}
                                    onChange={(value) => setStartValue(value)}
                                    onOpen={handleStartOpen}
                                    onClose={handleStartOpen}
                                    placeholder="Start Date"
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
                        </DateComponent>
                        <EndDateComponent>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <DatePicker
                                    autoOk
                                    disableToolbar
                                    variant="inline"
                                    inputVariant="outlined"
                                    format="MM/dd/yyyy"
                                    id="date-end-inline"
                                    onOpen={handleEndOpen}
                                    onClose={handleEndOpen}
                                    value={endValue}
                                    onChange={(value) => setEndValue(value)}
                                    placeholder="End Date"
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
                        </EndDateComponent>
                    </DateContent>
                </InnerWrapper>
                <Hidden only={["xs"]}>
                    <DataTable
                        noHeader={true}
                        columns={columns}
                        data={srchResult}
                        customStyles={customStyle}
                        pagination
                        paginationPerPage={10}
                        paginationComponent={Pagination}
                        highlightOnHover
                        pointerOnHover
                        noDataComponent={<NoData>—</NoData>}
                        defaultSortField={defaultSortFieldId}
                        defaultSortAsc={defaultSortAsc}
                        onRowClicked={(row) => {
                            history.push({
                                pathname: pathName,
                                state: row,
                            });
                            handleSegmentBtn(row);
                        }}
                        style={{
                            boxShadow: "0 2px 8px 0 #d8d8d8",
                            borderRadius: "4px",
                            display: "inline",
                        }}
                        // style={{overflow: "visible"}}
                    />
                </Hidden>
                <Hidden only={["xl", "lg", "md", "sm"]}>
                    <DataTable
                        noHeader={true}
                        noTableHead={true}
                        columns={mobileColumns}
                        data={srchResult}
                        pagination
                        paginationPerPage={10}
                        paginationComponent={Pagination}
                        highlightOnHover
                        defaultSortField={defaultSortFieldId}
                        defaultSortAsc={defaultSortAsc}
                        noDataComponent={<NoData>—</NoData>}
                        style={{
                            marginLeft: "-16px",
                            width: "110%",
                            overflow: "visible",
                        }}
                    />
                </Hidden>
            </OuterContainer>
        </ThemeProvider>
    );
};

const DateComponent = styled.div`
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

const EndDateComponent = styled.div`
    @media only screen and (min-width: 770px) {
        padding: 8px 0px 8px 0px;
        margin-top: 0px;
    }
    padding: 8px 0px 8px 0px;
    @media only screen and (min-width: 769px) and (max-width: 769px) {
        margin: 16px 0px 0px 0px;
    }
`;

const NoData = styled.div`
    margin-top: 20px;
    width: 100%;
    text-align: center;
`;

const InnerWrapper = styled.div`
    @media only screen and (min-width: 769px) {
        display: flex;
    }
    display: contents;
    flex: 1 1 auto;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    width: 100%;
    min-width: 600px;
`;

const OkText = styled.div`
    border-radius: 4px;
    background-color: #3e7128;
    width: 59px;
    height: 35px;
    color: #ffffff;
    vertical-align: middle;
    text-align: center;
    display: table-cell;
    font-family: "museo-sans";
    font-size: 18px;
`;

const OuterContainer = styled.div`
    @media only screen and (min-width: 769px) {
    }
    margin: 10px 16px 12px;
    margin-bottom: ${(props) =>
        props.srchResult.length > 4 ? "0rem" : "20rem"};
`;

const Search = styled.input`
    height: 27px;
    border-radius: 4px;
    border: solid 1px #a8abac;
    align-self: flex-end;
    margin-bottom: 16px;
    box-sizing: initial;
    @media only screen and (max-width: 768px) {
        margin-top: 15px;
    }
    @media only screen and (min-width: 769px) {
        margin-right: 10px;
        width: 328px;
    }

    width: -webkit-fill-available;
    padding: 8px 0px 8px 35px;
    background-color: #ffffff;
    font-size: 16px;
    font-weight: 300;
    font-family: "museo-sans";
    background: url("/react/images/icn-search.svg") no-repeat scroll #ffffff 10px
        13px;

    ::-webkit-input-placeholder {
        /* Chrome/Opera/Safari */
        color: #a8abac;
    }
    ::-moz-placeholder {
        /* Firefox 19+ */
        color: #a8abac;
    }
    :-ms-input-placeholder {
        /* IE 10+ */
        color: #a8abac;
    }
    :-moz-placeholder {
        /* Firefox 18- */
        color: #a8abac;
    }

    ::placeholder {
        color: #a8abac;
    }
    &:focus {
        border: solid 2px #003863;
    }
`;

const MemberDropDownSelect = styled(DropdownSelect)``;

const DateContent = styled.div`
    @media only screen and (min-width: 769px) {
        margin-top: -30px;
        margin-bottom: 8px;
        display: flex;
    }
    margin-bottom: 20px;
    margin-top: -7px;
`;

const Day = styled(IconButton)`
    width: 36px;
    height: 36px;
    font-size: 12px !important;
    font-family: "museo-sans";
    margin: 0px 0px !important;
    font-weight: 500;
    color: ${(props) =>
        props.highlight == "true"
            ? "#ffffff !important"
            : "rgba(0, 0, 0, 0.87) !important"};
`;

// const NonCurrentMonthDay = styled.div`
//   color: theme.palette.text.disabled,
// `;
// const HighlightNonCurrentMonthDay = styled.div`
//   color: "#676767",
// `
const Highlight = styled.div`
    background-color: #3e7128;
    border-radius: 50%;
    color: #ffffff !important;
`;

const NoHighlight = styled.div``;

const styleWithMargin = (border) => {
    return {
        height: 45,
        border: border ? "solid 2px #003863" : "solid 1px #a8abac",
        fontFamily: "museo-sans",
        fontColor: "#a8abac",
        backgroundColor: "#ffffff",
        marginTop: "21px",
        width: "100%",
        borderRadius: "4px",
    };
};

const styleWithoutMargin = (border) => {
    return {
        height: 45,
        border: border ? "solid 2px #003863" : "solid 1px #a8abac",
        fontFamily: "museo-sans",
        fontColor: "#a8abac",
        backgroundColor: "#ffffff",
        width: "100%",
        borderRadius: "4px",
    };
};

const ImgIcon = styled.img`
    cursor: pointer;
`;
export default TableContent;
