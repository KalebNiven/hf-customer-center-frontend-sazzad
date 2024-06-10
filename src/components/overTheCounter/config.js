export const SSO = "SSO";
export const NOTICE = "NOTICE";

export const reimbursementFormsURL = {
  CompleteCare: {
    url:
      "https://assets.healthfirst.org/pdf_b74f836b649623b4dbbbddfd5ea9c06e/2023-otc-plus-claim-reimbursement-form-english?v=0221152540",
  },
  ConnectionHMO: {
    url:
      "https://assets.healthfirst.org/pdf_b74f836b649623b4dbbbddfd5ea9c06e/2023-otc-plus-claim-reimbursement-form-english?v=0221152540",
  },
  LifeImprovements: {
    url:
      "https://assets.healthfirst.org/pdf_b74f836b649623b4dbbbddfd5ea9c06e/2023-otc-plus-claim-reimbursement-form-english?v=0221152540",
  },
  IncreasedBenefits: {
    url:
      "https://assets.healthfirst.org/pdf_b74f836b649623b4dbbbddfd5ea9c06e/2023-otc-plus-claim-reimbursement-form-english?v=0221152540",
  },
  SignatureHMO: { url: "" },
};

export const evidenceOfCoverageURL = {
  CompleteCare: {
    url:
      "https://assets.healthfirst.org/pdf_c70b04fe464de75e13a934468cb5a2e1/2023-completecare-plan-evidence-of-coverage-english",
  },
  ConnectionHMO: {
    url:
      "https://assets.healthfirst.org/pdf_140d0ef8567e108044d667ee9009ebe5/2023-65-plus-plan-evidence-of-coverage-english",
  },
  IncreasedBenefits: {
    url:
      "https://assets.healthfirst.org/pdf_6f4f6a7de0940cd7101f2f969bccd5d8/2023-increased-benefits-plan-evidence-of-coverage-english",
  },
  LifeImprovements: {
    url:
      "https://assets.healthfirst.org/pdf_12f6fd5fb702f04c2054c71ed727e14a/2023-life-improvement-plan-evidence-of-coverage-english",
  },
  SignatureHMO: {
    url:
      "https://assets.healthfirst.org/pdf_60d83c9a26964c1061ff9c1480ec9ae0/2023-signature-hmo-evidence-of-coverage-english",
  },
  SignaturePPO: {
    url:
      "https://assets.healthfirst.org/pdf_7c7b0f07d6ec541c74f9f9c162b2178a/2023-signature-ppo-evidence-of-coverage-english",
  },
};

export const participatingLocationsURL = {
  cvs: {
    url: "https://www.cvs.com/store-locator/landing",
    img: "/react/images/cvs-logo.png",
    type: null,
    label: null,
  },
  duanereade: {
    url: "https://www.walgreens.com/storelocator/find.jsp",
    img: "/react/images/duanereade-logo.svg",
    type: null,
    label: null,
  },
  walmart: {
    url: "https://www.walmart.com/store/finder",
    img: "/react/images/walmart-logo.svg",
    type: null,
    label: null,
  },
  familyDollar: {
    url: "https://www.familydollar.com/store-locator",
    img: "/react/images/family-dollar-logo.svg",
    type: null,
    label: null,
  },
  shopShop: {
    url: "https://stores.stopandshop.com/",
    img: "/react/images/stop-shop-logo.svg",
    type: null,
    label: null,
  },
  riteAid: {
    url: "https://www.riteaid.com/locations/",
    img: "/react/images/rite-aid-logo.svg",
    type: null,
    label: null,
  },
  dollarGeneral: {
    url: "http://www2.dollargeneral.com/About-Us/pages/storelocator.aspx",
    img: "/react/images/dollar-general-logo.svg",
    type: null,
    label: null,
  },
  nations: {
    url: process.env.MIX_REACT_APP_NATIONS_OTC_HREF_V2,
    img: "/react/images/nations-otc-logo.svg",
    type: SSO,
    label: "NationsOTC",
  },
  momsMeals: {
    url: "https://my.momsmeals.com/content/discounted.aspx?code=healthfirst",
    img: "/react/images/moms-meals-logo.svg",
    type: null,
    label: null,
  },
  growNYC: {
    url: "https://www.grownyc.org/greenmarket/ourmarkets",
    img: "/react/images/grow-nyc-logo.svg",
    type: null,
    label: null,
  },
  walgreens: {
    url: "https://www.walgreens.com/storelocator/find.jsp",
    img: "/react/images/walgreens-logo.svg",
    type: null,
    label: null,
  },
  nationsHearing: {
    url: "https://nationshearing.com/healthfirst",
    img: "",
    type: null,
    label: null,
  },
  otcNetwork: {
    url: process.env.MIX_REACT_APP_OTC_NETWORK_HREF_V2,
    img: "",
    type: SSO,
    label: "OTC Network",
  },
};

// valid statusCodes with pending activation
export const VALID_STATUS_CODE_FOR_ACTIVATION = [24, 10, 2, 1, 19];
