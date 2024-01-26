import styled from "styled-components";
import useOnClickOutside from "../documents/useOnClickOutside";
import { handleSegmentClick } from "../../libs/segment";
import Spinner from "../common/spinner";
import React, { useState, useEffect, useRef } from "react";
import { useMediaQuery, useTheme, Hidden } from "@material-ui/core";
import DataTable from "react-data-table-component";
import { useHistory } from "react-router-dom";
import { LanguageSelect, Language } from "../common/styles";
import CommonlyUsedForm from "./commonlyUsedForm";
import DependentBlock from "../common/dependentBlock";
import { FeatureTreatment } from "../../libs/featureFlags";
import {
  Container,
  Main,
  MyDocuments,
  SubTitle,
  HrLine,
  TableDataUI,
  NoData,
  DependentBlockWrapper,
} from "./style";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import DocumentType from "./documentType";
import DocumentsCenterPage from "../../pages/documents-center/DocumentsCenterPage";
import { useDispatch, useSelector } from "react-redux";
import { requestCCFormsDocs } from "../../store/actions";
import { SHOW_DOC, SHOW_CC_FORMS_AND_DOCS } from "../../constants/splits";
import { NoFormsAndDocument } from "./formsAndDocumentErrors";

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
      treatmentName: SHOW_CC_FORMS_AND_DOCS,
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
      treatmentName: SHOW_DOC,
    },
  ]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
  const [memberSelection, setMemberSelection] = useState({});
  const languageModelRef = useRef();
  const [selectedTab, setSelectedTab] = useState(navItems[0].href);
  const ccForms = useSelector((state) => state.ccFormsDoc);
  const customerInfo = useSelector((state) => state.customerInfo);
  const { memberId } = memberSelection;

  useEffect(() => {
    if (memberId) {
      const data = {
        memberId: memberSelection.memberId
          ? memberSelection.memberId
          : memberSelection.memberId,
        benefitPackage: memberSelection.benefitPackage
          ? memberSelection.benefitPackage
          : memberSelection.benefitPackage,
        companyCode: memberSelection.companyCode
          ? memberSelection.companyCode
          : memberSelection.CompanyNumber,
        lob: memberSelection.lob ? memberSelection.lob : memberSelection.lob,
        groupNumber: memberSelection.groupNumber
          ? memberSelection.groupNumber
          : memberSelection.groupNumber,
        year: memberSelection.memberYear,
      };
      dispatch(requestCCFormsDocs(data));
    }
  }, [memberId]);

  useEffect(() => {
    setMemberSelection({
      ...memberSelection,
      memberId: customerInfo.data.memberId,
      planName: customerInfo.data.planName,
      membershipStatus: customerInfo.data.membershipStatus,
      membershipEffectiveDate: customerInfo.data.membershipEffectiveDate,
      membershipExpirationDate: customerInfo.data.membershipExpirationDate,
      companyCode: customerInfo.data.companyCode,
      lob: customerInfo.data.sessLobCode,
      groupNumber: customerInfo.data.groupNumber,
      benefitPackage: customerInfo.data.benefitPackage,
      firstName: customerInfo.data.firstName,
      lastName: customerInfo.data.lastName,
      memberYear: customerInfo.data.memberYear,
    });
  }, [customerInfo]);

  useEffect(() => {
    sessionStorage.setItem("longLoad", false);
  }, []);

  const handleClick = (href) => {
    setSelectedTab(href);
  };

  return (
    <Container>
      <MyDocuments isMobile={isMobile}>Forms and Documents</MyDocuments>
      <>
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
                <FeatureTreatment
                  key="forms_and_document_page_feature"
                  treatmentNames={[eachNav.treatmentName]}
                  treatmentName={eachNav.treatmentName}
                  onLoad={() => {}}
                  onTimedout={() => {}}
                  attributes={memberSelection}
                >
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
                </FeatureTreatment>
              ))}
            </Tabs>
            <HrLine />

            {selectedTab === "/document-center" ? (
              <DocumentsCenterPage />
            ) : (
              <Main>
                <MyDocuments>Forms and Plan Documents</MyDocuments>
                <DependentBlockWrapper>
                  {
                    <DependentBlock
                      memberSelection={memberSelection}
                      setMemberSelection={setMemberSelection}
                      halfWidth
                      activeOnly={
                        memberSelection?.accountStatus === "active"
                          ? false
                          : true
                      }
                      minorsOnly={true}
                      activeDepsOnly={false}
                    />
                  }
                </DependentBlockWrapper>
                 {((ccForms.ccFormsDocDetails?.data?.length === 0 || ccForms.ccFormsDocDetails?.data?.length === undefined) &&  ccForms.ccFormsDocLoading === false) ? (
                  <NoFormsAndDocument />
                ) : (
                  <>
                    {(ccForms?.ccFormsDocDetails?.data != null &&  ccForms.ccFormsDocLoading === false) ? (
                      <Main>
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
                          data={
                            ccForms?.ccFormsDocDetails?.data[0].cc_general_forms
                          }
                        />
                        <SubTitle>Plan Documents</SubTitle>
                        <DocsList
                          data={
                            ccForms?.ccFormsDocDetails?.data[0]
                              .cc_plan_documents
                          }
                        />
                        <SubTitle>Additional Resources</SubTitle>
                        <DocsList
                          data={
                            ccForms?.ccFormsDocDetails?.data[0]
                              .cc_additional_resources
                          }
                        />
                      </Main>
                    ) : (
                      <ProgressWrapper>
                        <Spinner />
                      </ProgressWrapper>
                    )}
                  </>
                )}
                
              </Main>
            )}
          </Main>
        )}
      </>
    </Container>
  );
};

const DocsList = (props) => {
  const [isOpen, setIsOpen] = useState();
  const [RowName, setRowName] = useState();
  const [downloadImage, setDownloadImage] = useState(
    "/react/images/download_pdf.svg"
  );

  const languageModelRef = useRef(null);

  useOnClickOutside(languageModelRef, (event) => {
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

  const handleOpen = (item) => {
    if (
      (item.assetUrl.en != null || item.assetUrl.en != "") &&
      (item.assetUrl.es === null || item.assetUrl.es === "") &&
      (item.assetUrl.zh === null || item.assetUrl.zh === "")
    ) {
      window.open(item.assetUrl.en);
      handleSegmentClick(
        item.assetUrl.en,
        item.Name,
        link.Name + " Link Clicked",
        "link",
        "bottom",
        "",
        "formsAndDocument"
      );
      setRowName("");
    }
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
            setIsOpen(true), setRowName(row.Name), handleOpen(row);
            setDownloadImage("/react/images/download_blue.svg");
          }}
        >
          {row.Name === RowName ? (
            <DownloadImg
              className="download-icon"
              src="/react/images/download_blue.svg"
            ></DownloadImg>
          ) : (
            <DownloadImg
              className="download-icon"
              src="/react/images/download_pdf.svg"
            ></DownloadImg>
          )}
          <LanguageSelect isOpen={row.Name === RowName} last={false}>
            {row.assetUrl.en != null && row.assetUrl.en != "" && (
              <Language
                onClick={() => {
                  handleSegmentClick(
                    row.assetUrl.en,
                    row.Name,
                    row.Name + " Link Clicked",
                    "link",
                    "bottom",
                    "",
                    "formsAndDocument"
                  );
                  window.open(row.assetUrl.en);
                }}
              >
                English
              </Language>
            )}

            {row.assetUrl.es != null && row.assetUrl.es != "" && (
              <Language
                onClick={() => {
                  handleSegmentClick(
                    row.assetUrl.es,
                    row.Name,
                    row.Name + " Link Clicked",
                    "link",
                    "bottom",
                    "",
                    "formsAndDocument"
                  );
                  window.open(row.assetUrl.es);
                }}
              >
                Spanish
              </Language>
            )}

            {row.assetUrl.zh != null && row.assetUrl.zh != "" && (
              <Language
                onClick={() => {
                  handleSegmentClick(
                    row.assetUrl.zh,
                    row.Name,
                    row.Name + " Link Clicked",
                    "link",
                    "bottom",
                    "",
                    "formsAndDocument"
                  );
                  window.open(row.assetUrl.zh);
                }}
              >
                Chinese
              </Language>
            )}
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

const ProgressWrapper = styled.div`
  width: 100%;
  margin-top: 10px;
  margin-bottom: 10px;
`;

const DownloadImg = styled.img`
  margin-left: -81px;
`;
