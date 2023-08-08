export const SHOW_CLAIMS = "CustomerCenter_ShowClaimsScreen";
export const SHOW_AUTHS = "CustomerCenter_ShowAuthorizationsScreen";
export const SHOW_COVERAGE_AND_BENEFITS = "CustomerCenter_ShowCoverageAndBenefitsScreen";
export const SHOW_PRIMARY_CARE_PROVIDER = "CustomerCenter_ShowPrimaryCareProvider";
export const SHOW_FORMS_AND_DOCS = "CustomerCenter_ShowFormsAndDocs";
export const SHOW_MORE_TOOLS = "CustomerCenter_ShowMoreTools";
export const SHOW_ID_CARD = "CustomerCenter_ShowIDCard";
export const SHOW_HEALTH_ASSESMENT_SURVEY = "CustomerCenter_ShowHealthAssesmentSurvey";
export const SHOW_COACH_MARKS = "CustomerCenter_ShowCoachMarks";
export const SHOW_MEMBER_ID_CARD = "CustomerCenter_ShowMemberIdCard";
export const SHOW_MAIL_ID_CARD = "CustomerCenter_ShowMailIdCard";
export const SHOW_SUBMIT_CLAIM_BUTTON = "CustomerCenter_ShowSubmitClaim";
export const SHOW_CHAT_WIDGET = "CustomerCenter_ShowChatWidget";
export const SHOW_NOW_POW = "CustomerCenter_ShowNowPow";
export const SHOW_MANAGE_PRESCRIPTIONS = "CustomerCenter_ShowManagePrescriptions";
export const SHOW_VISION_BENEFITS = "CustomerCenter_ShowVisionBenefits";
export const SHOW_LAUNCH_TELEDOC = "CustomerCenter_ShowLaunchTeleDoc";
export const SHOW_SILVER_SNEAKERS= "CustomerCenter_ShowSilverSneakers";
export const SHOW_HEALTH_HSA = "CustomerCenter_ShowHealthHSA";
export const SHOW_NATIONSHEARING = "CustomerCenter_ShowNationsHearing";
export const SHOW_DENTAQUEST = "CustomerCenter_ShowDentaQuest";
export const SHOW_OTCNETWORK = "CustomerCenter_ShowOTCNetwork";
export const SHOW_NATIONSOTC = "CustomerCenter_ShowNationsOTC";
export const SHOW_MYHEALTH = "CustomerCenter_ShowHealth";
export const SHOW_ESTIMATECOST = "CustomerCenter_ShowEstimateCost";
export const SHOW_SUGGESTION_CARDS = "CustomerCenter_ShowSuggestionCards";
export const SHOW_EXTERNAL_LINK_CARDS = "CustomerCenter_ShowExternalLinkCards";
export const SHOW_SLIDES = "CustomerCenter_ShowSlides";
export const SHOW_HOME = "CustomerCenter_ShowHome";
export const SHOW_PAYMENTS = "CustomerCenter_ShowPayments";
export const PAYMENTS_ACL = "CustomerCenter_PaymentsACL";
export const BINDER_ACL = "CustomerCenter_BinderACL";
export const SHOW_GLOBAL_ALERTS = "CustomerCenter_GlobalAlerts";
export const SHOW_OTC_LEARN_MORE_PAGES = "CustomerCenter_OTCLearnMorePages";
export const SHOW_CONTACT_INFO = "CustomerCenter_ContactInfoPreferenceCenter";
export const SHOW_CONTACT_INFO_PM_WIDGET = "CustomerCenter_ContactInfoPreferenceCenter_Widget";
export const SHOW_PCP_SUB_NAV = "CustomerCenter_PcpSubNav";
export const SHOW_PAPERLESS_WIDGET = "CustomerCenter_Paperless_Widget";
export const SHOW_SIGNATURE_CHECKLIST = "CustomerCenter_Signature_Checklist";
export const SHOW_YEARTODATE_CLAIMS = "CustomerCenter_YeartoDate";
export const SHOW_BENEFIT_GRID = "CustomerCenter_Benefitgrid";
export const SHOW_PAYMENTS_REACT_APP = "CustomerCenter_ReactPaymentPortal";
export const SHOW_COVERAGE_AND_BENEFITS_VIDEOS = "CustomerCenter_CoverageAndBenefitsVideos";
export const SHOW_CLAIMS_EXPLANATION_OF_BENEFITS = "CustomerCenter_ExplanationOfBenefits";
export const SHOW_OTC_CARD_HOME_PAGE = "CustomerCenter_OTC_Card_HomePage";
export const SHOW_OTC_CARD_ACTIVATION_PAGE = "CustomerCenter_OTC_Card_ActivationPage";
export const SHOW_SHOP_ONLINE_HOME_PAGE = "CustomerCenter_ShopOnline_HomePage";
export const SHOW_COST_ESTIMATOR_WIDGET = "CustomerCenter_ShowCostEstimatorWidget";
export const SHOW_OTC_LEARN_MORE_BUTTON = "CustomerCenter_OTC_Card_LearnMore_Button_HomePage";
export const SHOW_OTC_BENEFITS_CENTER_BUTTON = "CustomerCenter_OTC_Card_Benefits_Center_Button_HomePage";
export const SHOW_OTC_ACTIVATE_BUTTON = "CustomerCenter_OTC_Card_Activate_Button_HomePage";
export const SHOW_DOC = "CustomerCenter_ShowDocumentCenter";
export const SHOW_OTC_CLAIM_REIMBURSEMENT_BUTTON = "CustomerCenter_OTC_Claim_Reimbursement_Button_HomePage";
export const SHOW_MANAGE_PRESCRIPTIONS_MEMBERSHIP_TREATMENTS = "CustomerCenter_ShowManagePrescriptionsMembershipTreatment";
// return a list of the above featureflag names
export const getFeatureFlagList = () => {
  return [SHOW_DOC, SHOW_CLAIMS, SHOW_AUTHS, SHOW_MORE_TOOLS, SHOW_MAIL_ID_CARD,
    SHOW_MEMBER_ID_CARD, SHOW_HEALTH_ASSESMENT_SURVEY, SHOW_COVERAGE_AND_BENEFITS,
    SHOW_SUBMIT_CLAIM_BUTTON, SHOW_CONTACT_INFO, SHOW_PAPERLESS_WIDGET,
    SHOW_FORMS_AND_DOCS, SHOW_PRIMARY_CARE_PROVIDER, SHOW_ID_CARD, SHOW_COACH_MARKS, SHOW_CHAT_WIDGET, SHOW_NOW_POW
    , SHOW_MANAGE_PRESCRIPTIONS,SHOW_YEARTODATE_CLAIMS, SHOW_BENEFIT_GRID,
    SHOW_VISION_BENEFITS, SHOW_LAUNCH_TELEDOC, SHOW_SILVER_SNEAKERS, SHOW_HEALTH_HSA, SHOW_NATIONSHEARING, SHOW_DENTAQUEST, SHOW_OTCNETWORK, SHOW_NATIONSOTC,
    SHOW_MYHEALTH, SHOW_ESTIMATECOST, SHOW_SUGGESTION_CARDS, SHOW_EXTERNAL_LINK_CARDS, SHOW_SLIDES, SHOW_HOME, SHOW_PAYMENTS, PAYMENTS_ACL, BINDER_ACL, SHOW_GLOBAL_ALERTS, SHOW_OTC_LEARN_MORE_PAGES, SHOW_CONTACT_INFO_PM_WIDGET,
    SHOW_PCP_SUB_NAV, SHOW_SIGNATURE_CHECKLIST, SHOW_PAYMENTS_REACT_APP, SHOW_COVERAGE_AND_BENEFITS_VIDEOS, 
    SHOW_CLAIMS_EXPLANATION_OF_BENEFITS, SHOW_OTC_CARD_HOME_PAGE, SHOW_OTC_CARD_ACTIVATION_PAGE, SHOW_SHOP_ONLINE_HOME_PAGE, SHOW_CLAIMS_EXPLANATION_OF_BENEFITS, SHOW_COST_ESTIMATOR_WIDGET,
    SHOW_OTC_LEARN_MORE_BUTTON,SHOW_OTC_CLAIM_REIMBURSEMENT_BUTTON, SHOW_OTC_BENEFITS_CENTER_BUTTON, SHOW_OTC_ACTIVATE_BUTTON, SHOW_MANAGE_PRESCRIPTIONS_MEMBERSHIP_TREATMENTS
  ];
};