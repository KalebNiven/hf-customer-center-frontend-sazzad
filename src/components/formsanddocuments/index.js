import styled from "styled-components";
import useOnClickOutside from "../documents/useOnClickOutside";
import { handleSegmentClick } from "../../libs/segment";
import Spinner from "../common/spinner";
import React, { useState, useEffect, useRef } from "react";
import { useMediaQuery, useTheme, Hidden } from "@material-ui/core";
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import DataTable from "react-data-table-component";
import { LanguageSelect, Language } from "../common/styles";
import CommonlyUsedForm from "./commonlyUsedForm";
import DependentBlock from "../common/dependentBlock";
import { FeatureTreatment } from "../../libs/featureFlags";
import { useClient } from "@splitsoftware/splitio-react";
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
import {
  SHOW_DIGITAL_FORMS,
  SHOW_DOC,
  SHOW_FORMS_AND_DOCS,
} from "../../constants/splits";
import { NoFormsAndDocument } from "./formsAndDocumentErrors";
import DigitalForm from "./digitalForm";
import useQuery from "../../hooks/useQuery";

//Custom theme
const customTheme = createMuiTheme({
  overrides: {
    MuiTab: {
      root: {
        maxWidth: "400px",
      },
    },
  },
});

const FormsAndDocuments = (props) => {
  const dispatch = useDispatch();
  const queryEnvelopeId = useQuery().get("envelopeId");
  const queryEvent = useQuery().get("event");
  const [envelopeId, setEnvelopeId] = useState(null);

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
      treatmentName: SHOW_FORMS_AND_DOCS,
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
  const [selectedTab, setSelectedTab] = useState(navItems[0].href);
  const [templateId, setTemplateId] = useState(null);
  const ccForms = useSelector((state) => state.ccFormsDoc);
  const customerInfo = useSelector((state) => state.customerInfo);
  const { memberId, customerId } = memberSelection;

  const setTab = () => {
    const plansAndDocumentTreatment = splitHookClient.getTreatmentWithConfig(
      SHOW_FORMS_AND_DOCS,
      splitAttributes,
    );

    if (
      plansAndDocumentTreatment.treatment === "off" ||
      plansAndDocumentTreatment.treatment === "control"
    ) {
      setSelectedTab(navItems[1].href);
    }
  };

  const splitAttributes = {
    memberId: customerInfo?.data?.memberId,
    customerId: customerInfo?.data?.customerId,
    lob: customerInfo?.data?.sessLobCode,
    companyCode: customerInfo?.data?.hohPlans?.map(
      (plan) => plan?.CompanyNumber,
    ),
    benefitPackage: customerInfo?.data?.hohPlans?.map(
      (plan) => plan?.BenefitPackage,
    ),
    membershipStatus: customerInfo?.data?.membershipStatus,
    accountStatus: customerInfo?.data?.accountStatus,
  };
  const splitHookClient = useClient();

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
        groupNumber: memberSelection?.groupNumber,
        membershipStatus: memberSelection?.membershipStatus,
        year: memberSelection.memberYear,
      };
      dispatch(requestCCFormsDocs(data));
    }
  }, [memberId]);

  useEffect(() => {
    setMemberSelection({
      ...memberSelection,
      memberId: customerInfo?.data?.hohPlans[0]?.MemberId,
      planName: customerInfo?.data?.hohPlans[0]?.PlanName,
      membershipStatus: customerInfo?.data?.hohPlans[0]?.MembershipStatus,
      membershipEffectiveDate:
        customerInfo?.data?.hohPlans[0]?.MembershipEffectiveDate,
      membershipExpirationDate:
        customerInfo?.data?.hohPlans[0]?.MembershipExpirationDate,
      companyCode: customerInfo.data.companyCode,
      lob: customerInfo.data.sessLobCode,
      groupNumber: customerInfo?.data?.hohPlans[0]?.GroupNumber,
      benefitPackage: customerInfo?.data?.hohPlans[0]?.BenefitPackage,
      firstName: customerInfo?.data?.hohPlans[0]?.FirstName,
      lastName: customerInfo?.data?.hohPlans[0]?.LastName,
      memberYear: customerInfo?.data?.hohPlans[0]?.memberYear,
      customerId: customerInfo?.data?.hohPlans[0]?.CustomerId,
      relationshipType:
        customerInfo?.data?.hohPlans[0]?.relationshipType || "SELF",
    });
  }, [customerInfo]);

  useEffect(() => {
    setTab();
    sessionStorage.setItem("longLoad", false);
  }, []);

  const handleClick = (tab) => {
    setSelectedTab(tab?.href);
    handleSegmentClick(
      tab?.href,
      tab?.labelForSegment,
      tab?.labelForSegment + " Tab Clicked",
      "button",
      "top",
      customerInfo,
      "documentCenter",
    );
  };

  const enableDigitalForms =
    customerInfo?.data?.age >= 18 &&
    customerInfo?.data?.companyCode !== "20" &&
    memberSelection.membershipStatus === "active" &&
    memberSelection.relationshipType === "SELF";

  useEffect(() => {
    if (
      enableDigitalForms &&
      queryEnvelopeId &&
      queryEvent === "signing_complete"
    ) {
      setEnvelopeId(queryEnvelopeId);
    } else if (envelopeId) {
      setEnvelopeId(null);
    }
  }, [queryEnvelopeId, queryEvent, enableDigitalForms]);

  const confirmationWidgetOnBackPressed = () => {
    setEnvelopeId(null);
    setSelectedTab("/forms-and-documents");
  };

  const renderCommonlyUserForms = () => (
    <>
      <SubTitle>Commonly Used Forms</SubTitle>
      <Wrapper>
        <CommonlyUsedForm
          data={ccForms?.ccFormsDocDetails?.data[0].cc_commonly_used_forms}
        />
      </Wrapper>
    </>
  );

  return (
    <Container>
      {(selectedTab === "/forms-and-documents" || envelopeId) &&
      enableDigitalForms ? (
        <FeatureTreatment
          treatmentName={SHOW_DIGITAL_FORMS}
          onLoad={() => {}}
          onTimedout={() => {}}
          attributes={splitAttributes}
        >
          <DigitalForm
            memberId={memberId}
            customerId={customerId}
            templateId={templateId}
            setTemplateId={setTemplateId}
            envelopeId={envelopeId}
            confirmationOnBackPressed={confirmationWidgetOnBackPressed}
            stepperId="dfw-main-stepper"
            confirmationId="dfw-main-confirmation"
            cardsId="dfw-main-cards"
          />
        </FeatureTreatment>
      ) : null}

      {envelopeId ? (
        <div id="dfw-main-confirmation"></div>
      ) : templateId ? ( // showing digital form stepper widget when template is selected
        <div id="dfw-main-stepper"></div>
      ) : (
        <>
          <MyDocuments isMobile={isMobile}>Forms and Documents</MyDocuments>
          <>
            {isMobile ? (
              <>
                <DocumentType />
              </>
            ) : (
              <ThemeProvider theme={customTheme}>
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
                        attributes={splitAttributes}
                      >
                        <Tab
                          label={eachNav.label}
                          value={eachNav.href}
                          onClick={() => handleClick(eachNav)}
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
                    <FeatureTreatment
                      key="forms_and_document_page_feature"
                      treatmentNames={SHOW_FORMS_AND_DOCS}
                      treatmentName={SHOW_FORMS_AND_DOCS}
                      onLoad={() => {}}
                      onTimedout={() => {}}
                      attributes={splitAttributes}
                    >
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
                              minorsOnly={false}
                              activeDepsOnly={false}
                            />
                          }
                        </DependentBlockWrapper>

                        {enableDigitalForms ? (
                          <FeatureTreatment
                            treatmentName={SHOW_DIGITAL_FORMS}
                            onLoad={() => {}}
                            onTimedout={() => {}}
                            attributes={splitAttributes}
                          >
                            <div id="dfw-main-cards"></div>
                          </FeatureTreatment>
                        ) : null}

                        {(ccForms.ccFormsDocDetails?.data?.length === 0 ||
                          ccForms.ccFormsDocDetails?.data?.length ===
                            undefined) &&
                        ccForms.ccFormsDocLoading === false ? (
                          <>
                            {enableDigitalForms ? (
                              <FeatureTreatment
                                treatmentName={SHOW_DIGITAL_FORMS}
                                onLoad={() => {}}
                                onTimedout={() => {}}
                                attributes={splitAttributes}
                                invertBehavior
                              >
                                <NoFormsAndDocument />
                              </FeatureTreatment>
                            ) : (
                              <NoFormsAndDocument />
                            )}
                          </>
                        ) : (
                          <>
                            {ccForms?.ccFormsDocDetails?.data != null &&
                            ccForms.ccFormsDocLoading === false ? (
                              <Main>
                                {enableDigitalForms ? (
                                  <FeatureTreatment
                                    treatmentName={SHOW_DIGITAL_FORMS}
                                    onLoad={() => {}}
                                    onTimedout={() => {}}
                                    attributes={splitAttributes}
                                    invertBehavior
                                  >
                                    {renderCommonlyUserForms()}
                                  </FeatureTreatment>
                                ) : (
                                  <>{renderCommonlyUserForms()}</>
                                )}
                                {!templateId ? (
                                  <>
                                    <SubTitle>General Forms</SubTitle>
                                    <DocsList
                                      data={
                                        ccForms?.ccFormsDocDetails?.data[0]
                                          .cc_general_forms
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
                                  </>
                                ) : null}
                              </Main>
                            ) : (
                              <ProgressWrapper>
                                <Spinner />
                              </ProgressWrapper>
                            )}
                          </>
                        )}
                      </Main>
                    </FeatureTreatment>
                  )}
                </Main>
              </ThemeProvider>
            )}
          </>
        </>
      )}
    </Container>
  );
};

const DocsList = (props) => {
  const [isOpen, setIsOpen] = useState();
  const [RowName, setRowName] = useState();
  const [downloadImage, setDownloadImage] = useState(
    "/react/images/download_pdf.svg",
  );

  const languageModelRef = useRef(null);

  useOnClickOutside(languageModelRef, (event) => {
    if (
      event.target.id !== "download" &&
      event.target.id !== "languageSelection"
    ) {
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

  const handleOpenDocument = (documentName, documentUrl) => {
    handleSegmentClick(
      documentUrl,
      documentName,
      documentName + " Link Clicked",
      "link",
      "bottom",
      "",
      "formsAndDocument",
    );
    setRowName();
    window.open(documentUrl);
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
        <>
          <a
            ref={languageModelRef}
            className="download"
            onClick={() => {
              setIsOpen(true), setRowName(row.Name);
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
          </a>
          <LanguageSelect
            id="languageSelection"
            isOpen={row.Name === RowName}
            last={false}
          >
            {row.assetUrl.en != null && row.assetUrl.en != "" && (
              <Language
                id="languageSelection"
                onClick={() => {
                  handleOpenDocument(row.name, row.assetUrl.en);
                }}
              >
                English
              </Language>
            )}

            {row.assetUrl.es != null && row.assetUrl.es != "" && (
              <Language
                id="languageSelection"
                onClick={() => {
                  handleOpenDocument(row.name, row.assetUrl.es);
                }}
              >
                Spanish
              </Language>
            )}

            {row.assetUrl.zh != null && row.assetUrl.zh != "" && (
              <Language
                id="languageSelection"
                onClick={() => {
                  handleOpenDocument(row.name, row.assetUrl.zh);
                }}
              >
                Chinese
              </Language>
            )}
          </LanguageSelect>
        </>
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
  @media only screen and (min-width: 768px) and (max-width: 1024px) {
    flex-direction: row;
    flex-wrap: wrap;
    width: 100%;
    margin-top: 8px;
  }
`;

const ProgressWrapper = styled.div`
  width: 100%;
  margin-top: 10px;
  margin-bottom: 10px;
`;

const DownloadImg = styled.img`
  margin-left: -81px;
`;
