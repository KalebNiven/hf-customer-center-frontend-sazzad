import styled from "styled-components";
import useOnClickOutside from "../documents/useOnClickOutside";

import React, { useState, useEffect, useRef } from "react";
import { useMediaQuery, useTheme, Hidden } from "@material-ui/core";
import Pagination from "../common/pagination";
import DataTable from "react-data-table-component";
import { useHistory } from "react-router-dom";
import { LanguageSelect, Language } from "../common/styles";
import DocGeneralBlock from "../coverageBenefits/formsAndDocuments/docGeneralBlock";
import CommonlyUsedForm from "./commonlyUsedForm";
import {
  Container,
  Main,
  MyDocuments,
  SubTitle,
  HrLine,
  TableDataUI,
  NoData,
} from "./style";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import DocumentType from "./documentType";
import DocumentsCenterPage from "../../pages/documents-center/DocumentsCenterPage";
import { useDispatch, useSelector } from "react-redux";
import { requestCCFormsDocs } from "../../store/actions";

const FormsAndDocuments = (props) => {
  const dispatch = useDispatch();

  const [navItems, setNavItems] = useState([
    {
      activeIcon: `/react/images/icn-hf-logo.svg`,
      inactiveIcon: `/react/images/icn-hf-logo.svg`,
      label: "Forms and Plan Documents",
      labelForSegment: "Forms and Plan Documents",
      type: "logo",
      href: "/forms-and-documents",
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
      href: "/document-center",
      childNavs: null,
      coachmark: null,
      mobileCoachmark: "myPlanMobileNav-coachmark",
      treatmentName: null,
    },
  ]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));

  const history = useHistory();
  const [RowId, setRowID] = useState();
  const [menuOpen, setMenuOpen] = useState(false);
  const [benfBtnIndex, setBenfBtnIndex] = useState(null);
  const [genBtnIndex, setGenBtnIndex] = useState(null);
  const languageModelRef = useRef();
  const [selectedTab, setSelectedTab] = useState(navItems[0].href);
  const ccForms = useSelector((state) => state.ccFormsDoc);
  const customerInfo = useSelector((state) => state.customerInfo);

  useEffect(() => {
    const data = {
      memberId: customerInfo.data.memberId,
      benefitPackage: customerInfo.data.benefitPackage,
      companyCode: customerInfo.data.companyCode,
      lob: customerInfo.data.sessLobCode,
      groupNumber: customerInfo.data.groupNumber,
      year: 2024,
    };
    dispatch(requestCCFormsDocs(data));
  }, []);

  useEffect(() => {
    sessionStorage.setItem("longLoad", false);
  }, []);

  const handleClick = (href) => {
    setSelectedTab(href);
  };

  return (
    <Container>
      <MyDocuments isMobile={isMobile}>Forms and Documents</MyDocuments>
      {ccForms?.ccFormsDocDetails?.data != null ? (
        <>
          {" "}
          {isMobile ? (
            <>
              <SubTitle>Select a Document Type</SubTitle>
              <DocumentType />
            </>
          ) : (
            <Main>
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
                    onClick={() => handleClick(eachNav.href)}
                    className={
                      selectedTab == eachNav.href
                        ? "child-tab-active"
                        : "child-tab-inactive"
                    }
                  />
                ))}
              </Tabs>
              <HrLine />

              {selectedTab === "/document-center" ? (
                <DocumentsCenterPage />
              ) : (
                <>
                  <MyDocuments>Forms and Plan Document</MyDocuments>
                  <SubTitle>Commonly Used Forms</SubTitle>
                  <Wrapper>
                    <CommonlyUsedForm
                      data={
                        ccForms?.ccFormsDocDetails?.data[0]
                          .cc_commonly_used_forms
                      }
                    />
                  </Wrapper>
                  <SubTitle>General Forms</SubTitle>
                  <DocsList
                    data={ccForms?.ccFormsDocDetails?.data[0].cc_general_forms}
                  />
                  <SubTitle>Plan Documents</SubTitle>
                  <DocsList
                    data={ccForms?.ccFormsDocDetails?.data[0].cc_plan_documents}
                  />
                  <SubTitle>Additional Resources</SubTitle>
                  <DocsList
                    data={
                      ccForms?.ccFormsDocDetails?.data[0]
                        .cc_additional_resources
                    }
                  />
                </>
              )}
            </Main>
          )}{" "}
        </>
      ) : null}
    </Container>
  );
};

const DocsList = (props) => {
  const [isOpen, setIsOpen] = useState();
  const [RowName, setRowName] = useState();

  const languageModelRef = useRef(null);

  useOnClickOutside(languageModelRef, (event) => {
    //if(event.toElement.contains())
    console.log(
      "event",
      event.target.contains(languageModelRef.current),
      languageModelRef.current,
      event.target
    );
    if (event.target.contains(languageModelRef.current)) {
      setRowName();
    }
  });

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
          ref={languageModelRef}
          className="download"
          onClick={() => {
            setIsOpen(true), setRowName(row.Name);
          }}
        >
          <img
            className="download-icon"
            src="/react/images/download_pdf.svg"
          ></img>

          <LanguageSelect isOpen={row.Name === RowName} last={false}>
            <Language
              onClick={() => {
                console.log("clicked ");
                window.open(row.assetUrl.en);
              }}
            >
              English
            </Language>

            <Language onClick={() => window.open(row.assetUrl.es)}>
              Spanish
            </Language>

            <Language onClick={() => window.open(row.assetUrl.zh)}>
              Chinese
            </Language>
          </LanguageSelect>
        </a>
      ),
      name: "",
      maxWidth: "60px",
    },
  ];

  return (
    <TableDataUI>
      <Hidden only={["xs"]}>
        <DataTable
          noHeader={true}
          data={props.data}
          columns={columns}
          defaultSortAsc={false}
          noDataComponent={<NoData />}
          style={{
            boxShadow: "0 2px 8px 0 #d8d8d8",
            borderRadius: "4px",
            display: "inline",
          }} 
          customStyles={customStyles}
        />
      </Hidden>
    </TableDataUI>
  );
};

const Index = (props) => {
  return <FormsAndDocuments />;
};

export default Index;

const Wrapper = styled.div`
  display: flex;
`;
