import React, { useState, useEffect, useRef } from "react";
import { Box, useMediaQuery, useTheme, Hidden } from "@material-ui/core";
import Pagination from "../common/pagination";
import DataTable from "react-data-table-component";
import CommonlyUsedForm from "./commonlyUsedForm";
import {
  Container,
  Main,
  MyDocuments,
  SubTitle,
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
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

const FormsAndDocuments = (props) => {


  useEffect(() => {
    sessionStorage.setItem("longLoad", false)
  }, [])


  // for test  purpose
  const data =[{
    id: 7,
    Name: "Authorization to Release Protected Health Information (PHI) Form",
    },{
      id: 7,
      Name: "Appointment of Representative (AOR) Form",
    }]

  const [navItems, setNavItems] = useState([
    {
      activeIcon: `/react/images/icn-hf-logo.svg`,
      inactiveIcon: `/react/images/icn-hf-logo.svg`,
      label: "Forms and Plan Documents",
      labelForSegment: "Forms and Plan Documents",
      type: "logo",
      href: "/home",
      childNavs: [],
      coachmark: null,
      mobileCoachmark: null,
      treatmentName: null,
    },
    {
      activeIcon: `/react/images/icn-my-plan-active.svg`,
      inactiveIcon: `/react/images/ico-plan.svg`,
      label: "Plan Communications",
      labelForSegment: "Plan Communications",
      type: "navItem",
      href: "/home",
      childNavs: null,
      coachmark: null,
      mobileCoachmark: "myPlanMobileNav-coachmark",
      treatmentName: null,
    },
  ]);

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

  const MobileColumns = [
    {
      id: "download",
      selector: (row) => (
        <a
          className="download"
          onClick={(e) => {
            handleSegmentBtn("Download button", row);

            window.open(
              `/documents/${
                row.NodeID ? row.NodeID : row.DocumentID
              }?isNodeId=${row.NodeID ? "true" : "false"}`,
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
            {row.Name}
          </div>
        </div>
      ),

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
              `/documents/${
                row.NodeID ? row.NodeID : row.DocumentID
              }?isNodeId=${row.NodeID ? "true" : "false"}`,
              "_blank"
            );
          }}
        >
          <img
            className="download-icon"
            src="/react/images/download_pdf.svg"
          />
        </a>
      ),
      name: "",
      maxWidth: "60px",
    },
  ];

  return (
    <Container>
      <Main>
        <MyDocuments>Forms and Documents</MyDocuments>
        <Tabs
          value={false}
          TabIndicatorProps={{
            style: { background: "#3e7128" },
          }}
          className="reactNavMenu-coachmark"
          style={{ display: "inline-flex" }}
        >
          {navItems.map((eachNav, index) => (
            <Tab
              label={eachNav.label}
              value={eachNav.href}
              className={true ? "child-tab-active" : "child-tab-inactive"}
            />
          ))}
        </Tabs>
        <HrLine />
        <MyDocuments>Forms and Plan Document</MyDocuments>
        <SubTitle>Commonly Used Forms</SubTitle>
        <CommonlyUsedForm/>
        <SubTitle>General Forms</SubTitle>
        <TableDataUI>
          <Hidden only={["xs"]}>
            <DataTable
              noHeader={true}
              data={data}
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
              onChangeRowsPerPage={(currentRowsPerPage) => {
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
                  handleSegmentBtn(segmentMessage, undefined, segmentMessage);
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
                handleSegmentBtn("Download button", row);
                window.open(
                  `/documents/${
                    row.NodeID ? row.NodeID : row.DocumentID
                  }?isNodeId=${row.NodeID ? "true" : "false"}`,
                  "_blank"
                );
              }}
              customStyles={customStyles}
            />
          </Hidden>

          <Hidden only={["xl", "lg", "md", "sm"]}>
            <DataTable
              noHeader={true}
               data={data}
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
              onChangeRowsPerPage={(currentRowsPerPage) => {
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
                  handleSegmentBtn(segmentMmessage, undefined, segmentMmessage);
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
                handleSegmentBtn("Download button", row);
                window.open(
                  `/documents/${
                    row.NodeID ? row.NodeID : row.DocumentID
                  }?isNodeId=${row.NodeID ? "true" : "false"}`,
                  "_blank"
                );
              }}
              customStyles={customStyles}
            />
          </Hidden>
        </TableDataUI>
      </Main>
    </Container>
  );
};

const Index = (props) => {
  return <FormsAndDocuments />;
};

export default Index;
