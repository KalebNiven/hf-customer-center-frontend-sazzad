import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import React, { useState } from "react";

import {
  Container,
  Nav,
  DateRangeWrapper,
  Footer,
  FromDateWrapper,
  EndDateWrapper,
  ImgIcon,
  styleWithMargin,
  styleWithoutMargin,
  Highlight,
  Day,
  NoHighlight,
  Clear,
} from "./filterMobileViewStyle";

import DateFnsUtils from "@date-io/date-fns";
import format from "date-fns/format";
import isSameDay from "date-fns/isSameDay";
import moment from "moment";

function filterMobileView({
  setShowMobileFilterView,
  startValue,
  setStartValue,
  endValue,
  setEndValue,
  setDateRangeDisplay,
  dateRangeDisplay,
  getDocuments,
  setDisplayDocList,
  setDocumentsListLoaded,
}) {
  const [startOpen, setStartOpen] = useState(false);
  const [endOpen, setEndOpen] = useState(false);

  const handleStyles = (width, start) => {
    let styles = "";
    let endIcon = "";
    if (start) {
      styles =
        width < 768
          ? styleWithMargin(startOpen)
          : styleWithoutMargin(startOpen);
      if (startValue)
        endIcon = (
          <ImgIcon
            alt=""
            src="/react/images/icn-close.svg"
            onClick={(e) => {
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
        width < 768 ? styleWithMargin(endOpen) : styleWithoutMargin(endOpen);
      if (endValue)
        endIcon = (
          <ImgIcon
            alt=""
            src="/react/images/icn-close.svg"
            onClick={(e) => {
              clearEndDate(e);

              setDateRangeDisplay({
                ...dateRangeDisplay,
                end: null,
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
      startAdornment: (
        <img
          alt=""
          src="/react/images/icn-calendar.svg"
          style={{ marginRight: "5px" }}
        />
      ),
      endAdornment: endIcon,
    };
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

  return (
    <Container>
      <Nav>
        <span className="filters">Filters</span>
        <span
          style={{ cursor: "pointer" }}
          onClick={() => {
            setShowMobileFilterView(false);
          }}
        >
          <img alt="close" src="/react/images/Close.svg" />
        </span>
      </Nav>

      <DateRangeWrapper>
        <span className="name">Date Range</span>

        <FromDateWrapper className="preventClose">
          <span>From</span>

          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <DatePicker
              minDate={moment().subtract(2, "years")}
              autoOk
              disableToolbar
              // variant="inline"
              inputVariant="outlined"
              format="MM/dd/yyyy"
              // id="date-start-inline"
              value={startValue}
              onChange={(value) => {
                var startDate = moment(value);
                var endDate = moment(endValue);

                if (startDate > endDate) {
                  setStartValue(
                    moment(endValue)
                      .subtract(1, "days")
                      .utcOffset(0, false)
                      .format("MM/DD/YYYY")
                  );
                  setDateRangeDisplay({
                    ...dateRangeDisplay,
                    start: moment(endValue)
                      .subtract(1, "days")
                      .format("MM/DD/YYYY"),
                  });
                  getDocuments(
                    null,
                    null,
                    moment(endValue).subtract(1, "days").format("YYYY-MM-DD")
                  );
                } else {
                  setStartValue(
                    moment(value).utcOffset(0, false).format("MM/DD/YYYY")
                  );
                  setDateRangeDisplay({
                    ...dateRangeDisplay,
                    start: moment(value).format("MM/DD/YYYY"),
                  });
                  getDocuments(null, null, moment(value).format("YYYY-MM-DD"));
                }
                setDocumentsListLoaded(false);
              }}
              onOpen={handleStartOpen}
              onClose={handleStartOpen}
              placeholder=" mm/dd/yyyy"
              renderDay={handleRenderDay}
              InputProps={handleStyles(window.screen.width, true)}
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
        </FromDateWrapper>

        <EndDateWrapper>
          <span>To</span>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <DatePicker
              minDate={moment().subtract(2, "years")}
              autoOk
              disableToolbar
              // variant="inline"
              inputVariant="outlined"
              format="MM/dd/yyyy"
              // id="date-end-inline"
              onOpen={handleEndOpen}
              onClose={handleEndOpen}
              value={endValue}
              onChange={(value) => {
                var startDate = moment(startValue);
                var endDate = moment(value);

                if (startDate > endDate) {
                  setEndValue(
                    moment(startValue)
                      .add(1, "days")
                      .utcOffset(0, false)
                      .format("MM/DD/YYYY")
                  );
                  setDateRangeDisplay({
                    ...dateRangeDisplay,
                    end: moment(startValue).add(1, "days").format("MM/DD/YYYY"),
                  });
                  getDocuments(
                    null,
                    null,
                    moment(startValue).add(1, "days").format("YYYY-MM-DD")
                  );
                } else {
                  setEndValue(
                    moment(value).utcOffset(0, false).format("MM/DD/YYYY")
                  );
                  setDateRangeDisplay({
                    ...dateRangeDisplay,
                    end: moment(value).format("MM/DD/YYYY"),
                  });
                  getDocuments(
                    null,
                    null,
                    null,
                    moment(value).format("YYYY-MM-DD")
                  );
                }
                setDocumentsListLoaded(false);
              }}
              placeholder=" mm/dd/yyyy"
              renderDay={handleRenderDay}
              InputProps={handleStyles(window.screen.width, false)}
              PopoverProps={{
                anchorOrigin: {
                  horizontal: "left",
                  vertical: "bottom",
                },
                transformOrigin: {
                  horizontal: "left",
                  vertical: "top",
                },
                style: {
                  left: "-35px",
                  border: "2px soid red",
                },
              }}
            />
          </MuiPickersUtilsProvider>
        </EndDateWrapper>

        <Clear
          onClick={() => {
            setStartValue(null);
            setEndValue(null);
            setDateRangeDisplay();
            setShowMobileFilterView(false);
            getDocuments(undefined, undefined, undefined, undefined, {
              clearFilters: true,
            });
            setDisplayDocList([]);
            setDocumentsListLoaded(false);
            handleSegmentBtn("Clear button", {});
          }}
        >
          Clear
        </Clear>
      </DateRangeWrapper>
    </Container>
  );
}

export default filterMobileView;
