import React, { useEffect, useRef, useState } from 'react';
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import { useHistory } from 'react-router-dom';
import { withRouter, useLocation } from 'react-router';
import { useSelector } from "react-redux";
import styled from "styled-components";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import {
  List, ListItem, ListItemIcon, ListItemText, Collapse,
  Hidden, Divider,
} from "@material-ui/core";
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles, ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { useClient } from "@splitsoftware/splitio-react";
import LongLoadSpinner from "./components/common/longLoadSpinner";
import {
  SHOW_DOC, SHOW_CLAIMS, SHOW_AUTHS, SHOW_COVERAGE_AND_BENEFITS, SHOW_MEMBER_ID_CARD, SHOW_PRIMARY_CARE_PROVIDER, SHOW_MYHEALTH, SHOW_HOME, SHOW_PAYMENTS, SHOW_PAYMENTS_REACT_APP, PAYMENTS_ACL, BINDER_ACL, SHOW_PCP_SUB_NAV, SHOW_TRANSLATION_LINKS, SHOW_HEALTH_ASSESMENT_SURVEY, SHOW_MY_HEALTH_CHECKLIST, SHOW_NOW_POW, OTC_WIDGET_PAGE, SHOW_MY_REWARDS,
} from "./constants/splits";
import { FeatureTreatment } from "./libs/featureFlags";
import { useAppContext } from './AppContext';
import { useCoachMarksContext } from './components/coachMarks/homePageCoachMarks/coachMarksContext';
import { AnalyticsPage, AnalyticsTrack } from "./components/common/segment/analytics";
import { ANALYTICS_TRACK_TYPE, ANALYTICS_TRACK_CATEGORY } from "./constants/segment";
import { useLogout } from './hooks/useLogout';
import { usePaymentsModalContext } from './context/paymentsModalContext';
import { purgePaymentsSessionData } from './components/payments/paymentPortal';
import { generateCardType } from './components/overTheCounter/utils';
import { getSplitAttributesForHOHPlan } from './utils/misc';
import { useSplitEval } from './hooks/useSplitEval';

const LINK_TYPE = { external: "External", cc: "CC" };

const useStyles = (top) => makeStyles((theme) => ({
  root: {
    "& .MuiPaper-root": {
      backgroundColor: "white !important",
    },
    "& .MuiListItemIcon-root": {
      minWidth: "32px !important",
      paddingRight: "16px",
    },
  },
  drawerPaper: (props) => ({
    overflowY: 'scroll',
  }),
  drawerPaperRelative: {
    top: `${top}px !important`,
    overflow: "scroll",
    maxHeight: `calc(100% - ${top}px)`,
    '@media (min-width : 768px)': {
      maxHeight: `calc(100% - ${top}px)`,
    },
  },
  gutters: {
    padding: "8px 0px 8px 22px !important",
  },
  listMaxHeight: {
    overflow: "auto",
    maxHeight: "57%",
  },
  customElevation4:{
    boxShadow:'none'
  },
}));
const theme = createMuiTheme({
  props: {
    MuiButtonBase: {
      disableRipple: true,
    },
  },
});

function AppBarComponent() {
  const [mobileDrawerTop, setMobileDrawerTop] = useState(204);
  const classes = useStyles(mobileDrawerTop)();
  const customerInfo = useSelector((state) => state.customerInfo);
  const [openUserCard, setOpenUserCard] = useState(false);
  const userName = (`${customerInfo.data.firstName} ${customerInfo.data.lastName ? customerInfo.data.lastName : ""}`);
  const { firstName } = customerInfo.data;
  const [homeMobileItems, setHomeMobileItems] = useState(false);
  const [findCareMobileItems, setFindCareMobileItems] = useState(false);
  const [myHealthMobileItems, setmyHealthMobileItems] = useState(false);
  const [showPaymentFlag, setShowPaymentFlag] = useState(false);
  const history = useHistory();
  const { MIX_REACT_LOFL_LANGUAGE_EN_URL } = process.env;
  const { MIX_REACT_LOFL_LANGUAGE_ES_URL } = process.env;
  const { MIX_REACT_LOFL_LANGUAGE_ZH_URL } = process.env;
  const { MIX_REACT_PAYMENTS_BASE_URL } = process.env;
  const { MIX_REACT_BINDER_BASE_URL } = process.env;
  const [loaderShow, setLoaderShow] = useState(sessionStorage.getItem("longLoad"));
  const { drawerOpen, setDrawerOpen, globalError } = useAppContext();
  const {
    currentStep, setCurrentStep, run, setRun, setIsStart,
  } = useCoachMarksContext();
  const [showReward, setShowReward] = useState(false);
  const appBarRef = useRef(null);
  const [appBarPosition, setAppBarPosition] = useState("relative");
  const [paymentsEnabled, setPaymentsEnabled] = useState(false);
  const [binderEnabled, setBinderEnabled] = useState(false);
  const [rewardsEnabled, setRewardsEnabled] = useState(false);
  const [reactPaymentsPortalEnabled, setReactPaymentsPortalEnabled] = useState(false);
  const location = useLocation();
  const { resetPaymentsModal } = usePaymentsModalContext();
  const [loadSplit, setLoadSplit] = useState({ treatment: 'control', config: null });
  const otcCardType = generateCardType(customerInfo?.data?.hohPlans);
  const { MIX_REACT_APP_BINDER_SITE_HREF } = process.env;
  let nav;
  const splitEval = useSplitEval();

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : null;
    setMobileDrawerTop(appBarRef.current?.getBoundingClientRect().y + appBarRef.current?.getBoundingClientRect().height);
  }, [drawerOpen]);

  useEffect(() => {
    const longLoad = sessionStorage.getItem("longLoad");
    setLoaderShow(longLoad);
  }, [sessionStorage.getItem("longLoad")]);

  const splitAttributes = {
    memberId: customerInfo.data.memberId,
    customerId: customerInfo.data.customerId,
    lob: customerInfo.data.sessLobCode,
    companyCode: customerInfo.data.companyCode,
    benefitPackage: customerInfo.data.benefitPackage,
    membershipStatus: customerInfo.data.membershipStatus,
    accountStatus: customerInfo.data.accountStatus,
  };

  const splitHookClient = useClient();

  useEffect(() => {
    if (loadSplit.treatment !== "control") return;
    splitAttribute();
  }, [loadSplit]);

  const splitAttribute = () => {
    customerInfo.data.accountStatus === "NON-MEMBER" ? splitTreatment(getSplitAttributesForHOHPlan(customerInfo.data,null)) :
    customerInfo.data.hohPlans.forEach((value, index) => {
      splitTreatment(getSplitAttributesForHOHPlan(customerInfo.data, index));
    });
  };

 
  const splitTreatment = (attributes) =>{
    const paymentsEnabledTreatment = splitHookClient.getTreatmentWithConfig(
      PAYMENTS_ACL,
      attributes,
    );
    const binderEnabledTreatment = splitHookClient.getTreatmentWithConfig(
      BINDER_ACL,
      attributes,
    );
    const showReactPaymentsPortal = splitHookClient.getTreatmentWithConfig(
      SHOW_PAYMENTS_REACT_APP,
      attributes,
    );
    const rewardsEnabledTreatment = splitHookClient.getTreatmentWithConfig(
      SHOW_MY_REWARDS,
      attributes,
    );

    checkTreatment(paymentsEnabledTreatment, binderEnabledTreatment, showReactPaymentsPortal, rewardsEnabledTreatment);
  };

  const checkTreatment = (paymentsEnabledTreatment, binderEnabledTreatment, showReactPaymentsPortal, rewardsEnabledTreatment) => {
    setLoadSplit(paymentsEnabledTreatment);
    if (!splitHookClient || paymentsEnabledTreatment.treatment === "control" || binderEnabledTreatment.treatment === "control" || showReactPaymentsPortal.treatment === "control") return;
    setPaymentsEnabled(paymentsEnabledTreatment.treatment === "off" ? false : paymentsEnabledTreatment.treatment === "on" ? setShowPaymentFlag(true) : false);
    setBinderEnabled(binderEnabledTreatment.treatment === "off" ? false : binderEnabledTreatment.treatment === "on" ? setShowPaymentFlag(true) : false);
    setRewardsEnabled(rewardsEnabledTreatment.treatment === "off" ? false : rewardsEnabledTreatment.treatment === "on" ? setShowReward(true) : false);
    setReactPaymentsPortalEnabled(showReactPaymentsPortal.treatment === "off" ? false : showReactPaymentsPortal.treatment === "on");
  };

  const getLangURLPrefix = (lang) => {
    switch (lang) {
      case 'es':
        return 'https://es.';
      case 'zh':
        return 'https://zh.';
    }
    return 'https://';
  };

  const checkPaymentsACLs = () => {
    if(customerInfo?.data?.accountStatus === 'NON-MEMBER'){return true;}
    let showPayments = false;
    customerInfo.data.hohPlans.forEach((plan) => {
      let planAttrs = {
        memberId: plan?.MemberId,
        lob: plan?.LOBCode,
        membershipStatus: plan?.MembershipStatus,
        benefitPackage: plan?.BenefitPackage,
        accountStatus: customerInfo?.data?.accountStatus,
        companyCode: plan?.CompanyNumber,
      };
      let paymentsEnabledTreatment = splitHookClient.getTreatmentWithConfig(PAYMENTS_ACL, planAttrs);
      let binderEnabledTreatment = splitHookClient.getTreatmentWithConfig(BINDER_ACL, planAttrs);
      showPayments = (showPayments || paymentsEnabledTreatment.treatment === "on" || binderEnabledTreatment.treatment === "on");
    });
    return showPayments;
  }

  const paymentsClickLogic = () => {
    history.push('/payments');
  }

  const getUserProfile = () => (

    <NavRightUser
      tabIndex={0}
      open={openUserCard}
      onClick={() => setOpenUserCard(!openUserCard)}
      onBlur={() => setOpenUserCard(false)}
      >
      <UserIcon alt="" src={`/react/images/icn-user.svg`} />
      <UserName>{firstName?.toLowerCase()}</UserName>
      <UserCard onClick={(e) => e.stopPropagation()} open={openUserCard}>
        <CardIcon alt="" src={`/react/images/icn-user.svg`} />
        <InlineInnerContainer>
          <Name>{userName}</Name>
          <Member>
            Member ID:
            {customerInfo.data.memberId}
          </Member>
          <SetDiv>
            <SettImg alt="" style={{ display: 'inline-block' }} src={`/react/images/icn-gear.svg`} />
            <Settings onClick={(e) => {
              handleClick(e, '/settings', '', 'Account Settings', 'Account Settings');
              setOpenUserCard(false);
            }}
            >
              Account Settings
            </Settings>
          </SetDiv>
          <DocLink />
          {showReward
              && (
              <SetDiv>
                <SettImg alt="" style={{ display: 'inline-block' }} src={`/react/images/icn-coin.svg`} />
                <Settings onClick={(e) => {
                  handleClick(e, '/my-rewards', '', 'My Rewards', 'My Rewards');
                  setOpenUserCard(false);
                }}
                >
                  My Rewards
                </Settings>
              </SetDiv>
              )}
        </InlineInnerContainer>
        <HorizontalDivider />
        <Logout
          type="button"
          onMouseDown={(e) => {
            e.stopPropagation();
            handleClick(e, 'member-logout', '', 'Log Out', 'Log Out');
          }}
        >
          Log Out
        </Logout>
      </UserCard>
    </NavRightUser>

  );

  const logoutApi = useLogout();

  const homeChildNavOptions = [{
    label: "Home",
    labelForSegment: "Home",
    href: "/home",
    treatmentName: SHOW_HOME,
  }, {
    label: "Member ID Card",
    labelForSegment: "Member ID Card",
    href: "/idcard",
    treatmentName: SHOW_MEMBER_ID_CARD,
  }, {
    label: "Coverage & Benefits",
    labelForSegment: "Coverage & Benefits",
    href: "/coverage-and-benefits",
    treatmentName: SHOW_COVERAGE_AND_BENEFITS,
  }, {
    label: otcCardType === "Flex" ? "Flex Benefit" : otcCardType,
    labelForSegment: "OTC",
    href: "/otc-widget",
    treatmentName: OTC_WIDGET_PAGE,
  }, {
    label: "Claims",
    labelForSegment: "Claims",
    href: "/claims",
    treatmentName: SHOW_CLAIMS,
  }, {
    label: "Authorizations",
    labelForSegment: "Authorizations",
    href: "/authorizations",
    treatmentName: SHOW_AUTHS,
  }];

  const [navItems, setNavItems] = useState([
    {
      activeIcon: `/react/images/icn-hf-logo.svg`,
      inactiveIcon: `/react/images/icn-hf-logo.svg`,
      label: "",
      labelForSegment: "LOGO",
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
      label: "My Plan",
      labelForSegment: "My Plan",
      type: "navItem",
      href: "/home",
      childNavs: homeChildNavOptions,
      coachmark: null,
      mobileCoachmark: "myPlanMobileNav-coachmark",
      treatmentName: null,
    },
    {
      activeIcon: `/react/images/icn-search-active.svg`,
      inactiveIcon: `/react/images/icn-solid-search.svg`,
      label: "Find Care",
      labelForSegment: "Find Care",
      type: "navItem",
      href: "/findcare",
      childNavs: [{
        label: "Search For Care",
        labelForSegment: "Search For Care",
        href: "/findcare",
        treatmentName: SHOW_PRIMARY_CARE_PROVIDER,
      }, {
        label: "Primary Care Provider",
        labelForSegment: "Primary Care Provider",
        href: "/pcp",
        treatmentName: SHOW_PCP_SUB_NAV,
      }],
      coachmark: "findCareNavItem-coachmark",
      mobileCoachmark: "findCareMobileNav-coachmark",
      treatmentName: SHOW_PRIMARY_CARE_PROVIDER,
    },
    {
      activeIcon: `/react/images/icn-cash-active.svg`,
      inactiveIcon: `/react/images/icn-cash.svg`,
      label: "Payments",
      labelForSegment: "Payments",
      type: "navItem",
      href: "/payments",
      childNavs: [],
      coachmark: "paymentsNavItem-coachmark",
      mobileCoachmark: "paymentsMobileNav-coachmark",
      treatmentName: SHOW_PAYMENTS,
    },
    {
      activeIcon: `/react/images/icn-my-health-active.svg`,
      inactiveIcon: `/react/images/icn-my-health.svg`,
      label: "My Health",
      labelForSegment: "My Health",
      type: "navItem",
      href: "/my-health",
      childNavs: [{
        label: "My Health",
        labelForSegment: "My Health",
        href: "/my-health",
        treatmentName: SHOW_MYHEALTH,
      }, {
        label: "Annual Health Assessment",
        labelForSegment: "Annual Health Assessment",
        href: "/my-health/annual-health-assessment",
        treatmentName: SHOW_HEALTH_ASSESMENT_SURVEY,
      }, {
        label: "My Health Checklist",
        labelForSegment: "My Health Checklist",
        href: "/my-health/my-health-checklist",
        treatmentName: SHOW_MY_HEALTH_CHECKLIST,
      }, {
        label: "Community Resources",
        labelForSegment: "Community Resources",
        href: "/my-health/community-resources",
        treatmentName: SHOW_NOW_POW,
      }],
      coachmark: "myHealthNavItem-coachmark",
      mobileCoachmark: "myHealthMobileNav-coachmark",
      treatmentName: SHOW_MYHEALTH,
    },
  ]);

  const tabStyle = {
    default: {
      // move styling out of index.css and into here
    },
    active: {
      // move styling out of index.css and into here
    },
  };

  // useEffect(() => {
  //   if (Object.keys(customerInfo.data).length > 0) {
  //     displayTabCheck()
  //   }
  // }, [customerInfo.data, drawerOpen]);

  const [selectedParentTab, setSelectedParentTab] = useState(navItems[1].href);
  const [selectedChildTab, setSelectedChildTab] = useState(navItems[1].childNavs[0].href);

  const handleClick = (e, param, clickType, eachNavLabel, labelForSegment) => {
    e.preventDefault();
    if (drawerOpen) {
      setDrawerOpen(!drawerOpen);
    }
    resetPaymentsModal();
    handleSegmentBtn(param, eachNavLabel, labelForSegment);
    if (['/claims', '/authorizations', '/coverage-and-benefits', '/home', '/idcard', '/my-health', '/findcare', '/pcp', '/my-health/annual-health-assessment', '/my-health/my-health-checklist', '/my-health', '/my-health/community-resources', '/my-rewards', '/otc-widget'].some((x) => x === param)) {
      history.push(param);
    } else if (param === '/settings') {
      history.push({
        pathname: '/settings',
        state: { sideBarIndex: 0 },
      });
    } else if (param === "/document-center") {
      history.push({
        pathname: "/document-center",
      });
    } else if (param === 'member-logout') {
      analytics.reset();
      sessionStorage.removeItem(`persist:${window.location.host}_PROVIDER_APP`);
      purgePaymentsSessionData();
      try {
        ProviderDirectoryWidget.invalidateStore();
      } catch (e) {
        console.log("Nothing to invalidate");
      }
      sessionStorage.removeItem("currentMemberId");
      logoutApi();
    } else if (param === '/payments') {
      paymentsClickLogic();
    } else {
      sessionStorage.setItem("longLoad", true);
      window.location.href = param;
    }
    clickType === 'child' && setSelectedChildTab(param);
    clickType === 'parent' && setSelectedParentTab(param);
    const homeWrapper = document.getElementsByClassName("wrapper");
    homeWrapper && homeWrapper[0]?.remove();
  };

  useEffect(() => {
    if (window.location.pathname === '/pcp' || window.location.pathname === '/search' || window.location.pathname === '/details') {
      setSelectedParentTab('/findcare');
      setSelectedChildTab(window.location.pathname);
    } else if (['/claims', '/authorizations', '/coverage-and-benefits', '/idcard', '/home'].some((x) => x === window.location.pathname)) {
      setSelectedParentTab('/home');
      setSelectedChildTab(window.location.pathname);
    } else if (['/my-health/annual-health-assessment', '/my-health/my-health-checklist', '/my-health', '/my-health/community-resources'].some((x) => x === window.location.pathname)) {
      setSelectedParentTab('/my-health');
      setSelectedChildTab(window.location.pathname);
    } else {
      setSelectedParentTab(window.location.pathname);
      setSelectedChildTab(window.location.pathname);
    }
  }, [window.location.href]);
  const [value, setValue] = React.useState(0);
  const handlTabs = (e, value) => {
    setValue(value);
  };

  const checkSplit = (label) => {
    if (showPaymentFlag && label === "Payments") {
      return undefined;
    }
    return splitAttributes;
  };

  const getParentNav = () => (
    <div id="navbar" style={{ display: 'flex', height: '64px', paddingLeft: "15px" }}>
      <Tabs value={value} TabIndicatorProps={{ style: { position: "absolute", left: "-999px" } }} onChange={handlTabs}>
        {navItems.map((eachNav, index) => (
          eachNav.treatmentName ? (
            <FeatureTreatment
              key={`${eachNav.treatmentName}_${index}`}
              treatmentName={eachNav.treatmentName}
              onLoad={() => { }}
              onTimedout={() => { }}
              attributes={checkSplit(eachNav.label)}
            >
              <>
                { !checkPaymentsACLs() && eachNav.label === "Payments" ? null
                  : (
                    <Tab
                      key={`${eachNav.href}_${index}`}
                      style={selectedParentTab === eachNav.href ? tabStyle.active : tabStyle.default}
                      label={eachNav.label}
                      onClick={(e) => handleClick(e, eachNav.href, 'parent', eachNav?.type === 'logo' ? 'Logo' : eachNav?.label, eachNav?.labelForSegment)}
                      icon={selectedParentTab === eachNav.href ? <LogoImg alt="" src={eachNav.activeIcon} /> : <LogoImg alt="" src={eachNav.inactiveIcon} />}
                      value={value}
                      className={selectedParentTab === eachNav.href ? `tab-active ${eachNav?.coachmark}` : `tab-inactive ${eachNav?.coachmark}`}
                    />
                  )}
              </>
            </FeatureTreatment>
          )
            : (
              <Tab
                key={`${eachNav.href}_${index}`}
                style={selectedParentTab === eachNav.href ? tabStyle.active : tabStyle.default}
                label={eachNav.label}
                onClick={(e) => handleClick(e, eachNav.href, 'parent', eachNav?.type === 'logo' ? 'Logo' : eachNav?.label, eachNav.labelForSegment)}
                icon={selectedParentTab === eachNav.href ? <LogoImg alt="" src={eachNav.activeIcon} /> : <LogoImg alt="" src={eachNav.inactiveIcon} />}
                value={value}
                className={selectedParentTab === eachNav.href ? `tab-active ${eachNav?.coachmark}` : `tab-inactive ${eachNav?.coachmark}`}
              />
            )
        ))}
      </Tabs>
      <Toolbar style={{ marginLeft: 'auto' }}>
        {getUserProfile()}
      </Toolbar>
    </div>
  );

  const getChildNav = () => {
    let childNavs; let
      currentTab;
    if (['/claims', '/authorizations', '/coverage-and-benefits', '/idcard', '/home'].some((x) => x === window.location.pathname)) {
      currentTab = navItems[1];
      childNavs = currentTab?.childNavs;
    } else if (window.location.pathname === '/findcare' || window.location.pathname === '/pcp') {
      currentTab = navItems[2];
      childNavs = currentTab?.childNavs;
    } else if (window.location.pathname === '/my-health' || window.location.pathname === '/my-health/community-resources' || window.location.pathname === '/my-health/annual-health-assessment' || window.location.pathname === "/my-health/my-health-checklist") {
      currentTab = navItems[4];
      childNavs = currentTab?.childNavs;
    } else if (window.location.pathname === '/communityResources' || window.location.pathname === '/testout') {
      currentTab = navItems[4];
      childNavs = currentTab?.childNavs;
    } else {
      childNavs = null;
    }
    return (
      !globalError && childNavs && childNavs.length > 0 ? (
        <div id="subnavbar">
          <Tabs
            value={false}
            TabIndicatorProps={{
              style: { background: "#3e7128" },
            }}
            className="reactNavMenu-coachmark"
            style={{ display: "inline-flex" }}
          >
            {childNavs && childNavs.length > 0 && childNavs.map((eachNav, ind) => (
              //harcoding for this case, will need to revaluated using featureTreatment for nav items vs useSplitEval hook.
              eachNav.treatmentName === OTC_WIDGET_PAGE || eachNav.treatmentName === SHOW_HEALTH_ASSESMENT_SURVEY ?
              (
                splitEval.evaluateSplitByName(eachNav.treatmentName) &&  <Tab
                  label={eachNav.label}
                  onClick={(e) => handleClick(e, eachNav.href, 'child', eachNav?.label, eachNav.labelForSegment)}
                  value={eachNav.href}
                  className={selectedChildTab === eachNav.href ? 'child-tab-active' : 'child-tab-inactive'}
                />
              )
              :
              eachNav.treatmentName
                ? (
                  <FeatureTreatment
                    key={`${eachNav.treatmentName}_${ind}`}
                    treatmentName={eachNav.treatmentName}
                    onLoad={() => { }}
                    onTimedout={() => { }}
                    attributes={splitAttributes}
                  >
                    <Tab
                      label={eachNav.label}
                      onClick={(e) => handleClick(e, eachNav.href, 'child', eachNav?.label, eachNav.labelForSegment)}
                      value={eachNav.href}
                      className={selectedChildTab === eachNav.href ? 'child-tab-active' : 'child-tab-inactive'}
                    />
                  </FeatureTreatment>
                )
                : (
                  <Tab
                    key={`${eachNav.treatmentName}_${ind}`}
                    label={eachNav.label}
                    onClick={(e) => handleClick(e, eachNav.href, 'child', eachNav?.label, eachNav.labelForSegment)}
                    value={eachNav.href}
                    className={selectedChildTab === eachNav.href ? 'child-tab-active' : 'child-tab-inactive'}
                  />
                )

            ))}

          </Tabs>
        </div>
      )
        : null
    );
  };

  const handleCoachMarks = () => {
    if (run) {
      if (currentStep === 0 && !drawerOpen) {
        setHomeMobileItems(true);
        setCurrentStep(1);
        setRun(false);

        setTimeout(() => {
          setRun(true);
        }, 400);
      } else if (currentStep === 0 && drawerOpen) {
        setRun(false);
        setIsStart(true);
      }
    }
  };

  const handleDrawerOpen = () => {
    setDrawerOpen(!drawerOpen);
    handleCoachMarks();
  };

  const onCollapseExpand = (e, href, clickElement) => {
    e.stopPropagation();
    if (href === '/home' && clickElement === 'parent') {
      setHomeMobileItems(!homeMobileItems);
    } else if (href === '/findcare' && clickElement === 'parent') {
      setFindCareMobileItems(!findCareMobileItems);
    } else if (href === '/my-health' && clickElement === 'parent') {
      setmyHealthMobileItems(!myHealthMobileItems);
    }
  };
  const handleClickMobile = (e, href, clickElement, eachNavLabel, labelForSegment) => {
    if (drawerOpen) {
      setDrawerOpen(!drawerOpen);
    }
    sessionStorage.setItem("longLoad", true);
    handleSegmentBtn(href, eachNavLabel, labelForSegment);
    if (href === '/home' && clickElement === 'parent') {
      setSelectedParentTab(href);
      setSelectedChildTab(navItems.find((x) => x.href === href && x.type === 'navItem').childNavs[0].href);
      window.location.href = href;
    } else if (href === '/findcare' && clickElement === 'parent') {
      setSelectedParentTab(href);
      // setSelectedChildTab(navItems.find(x => x.href === href).childNavs[0].href)
      window.location.href = href;
    } else if (href === '/payments') {
      paymentsClickLogic();
    } else {
      window.location.href = href;
    }
    const homeWrapper = document.getElementsByClassName("wrapper");
    homeWrapper && homeWrapper[0]?.remove();

    if (clickElement === 'child') {
      if (['/claims', '/authorizations', '/coverage-and-benefits', '/idcard'].some((x) => x === href)) {
        history.push(href);
        setSelectedParentTab('/home');
      } else {
        history.push(href);
      }
    }
    // call app segment API
  };

  const handleSegmentBtn = (href, eachNavLabel, labelForSegment) => {
    // Segment Track
    AnalyticsPage();
    AnalyticsTrack(
      `${labelForSegment} ` + `button clicked`,
      customerInfo,
      {
        raw_text: eachNavLabel,
        // "destination_url": href === "/payments" ? customerInfo.data.paymentsUrl : window.location.origin + href,
        destination_url: window.location.origin + href,
        description: labelForSegment,
        category: ANALYTICS_TRACK_CATEGORY.navBar,
        type: ANALYTICS_TRACK_TYPE.buttonClicked,
        targetMemberId: customerInfo?.data?.memberId,
        location: {
          desktop: {
            width: 960,
            value: href === "member-logout" || href === "/settings" ? "right" : "top",
          },
          tablet: {
            width: 768,
            value: "right",
          },
          mobile: {
            width: 0,
            value: "right",
          },
        },
      },
    );
  };

  function DocLink(props) {
    const featureTreatment = (
      <FeatureTreatment
        key="12313213"
        treatmentNames={[SHOW_DOC]}
        treatmentName={SHOW_DOC}
        onLoad={() => {}}
        onTimedout={() => {}}
        attributes={
                    {
                      lob: customerInfo.data?.sessLobCode,
                      membershipStatus: customerInfo.data?.membershipStatus,
                      accountStatus: customerInfo.data?.accountStatus,
                      companyCode: customerInfo.data?.hohPlans?.map((plan) => plan.CompanyNumber),
                      benefitPackage: customerInfo.data?.hohPlans?.map((plan) => plan.BenefitPackage),
                    }
                }
      >
        <DocLinkComp {...props} />
      </FeatureTreatment>
    );

    return featureTreatment;
  }

  function DocLinkComp(props) {
    const { featureconfig } = props || {};
    useEffect(() => {}, [featureconfig]);

    return (
      <SetDiv>
        <SettImg
          alt=""
          style={{ display: "inline-block", width: '19px', height: '19px' }}
          src={`/react/images/icn-document-center.svg`}
        />

        <Settings
          onClick={(e) => {
            handleClick(
              e,
              "/document-center",
              "",
              "Document Center",
              "Document Center",
            );
            setOpenUserCard(false);
          }}
        >
          Document Center
        </Settings>
      </SetDiv>
    );
  }
  // Iterate over all HohPlans - Check those any of those come back as true - display payments.both false - dont display

  const displayNavMenu = () => {
    nav = [...navItems];
    const myHomeObj = nav.find((x) => x.href === '/home' && x.type === 'navItem');
    const findCareObj = nav.find((x) => x.href === '/findcare' && x.type === 'navItem');
    const myHealthObj = nav.find((x) => x.href === '/my-health' && x.type === 'navItem');
    // if (window.location.pathname === "/search" || window.location.pathname === "/details") {
    //   findCareObj.childNavs = []
    // }
    return (
      <>
        <CardNav>
          <IconContainer>
            <ImgIcon alt="" src={`/react/images/icn-user.svg`} />
          </IconContainer>
          <InlineInnerContainer>
            <Name>{userName}</Name>
            <Member>
              Member ID:
              {customerInfo.data.memberId}
            </Member>
            <SetDiv>
              <SettImg alt="" src={`/react/images/icn-gear.svg`} />
              <Settings
                onClick={(e) => handleClick(e, '/settings', '', 'Account Settings', 'Account Settings')}
              >
                Account Settings
              </Settings>
            </SetDiv>
            <DocLink />
            {showReward
              && (
              <SetDiv>
                <SettImg alt="" style={{ display: 'inline-block' }} src={`/react/images/icn-coin.svg`} />
                <Settings onClick={(e) => {
                  handleClick(e, '/my-rewards', '', 'My Rewards', 'My Rewards');
                  setOpenUserCard(false);
                }}
                >
                  My Rewards
                </Settings>
              </SetDiv>
              )}
          </InlineInnerContainer>
        </CardNav>
        <HorizontalDivider />
        <List className={classes.listMaxHeight}>
          {navItems.map((eachNav, index) => {
            if (index > 0) {
              return (
                <React.Fragment key={`${eachNav.href}`}>
                  {
                  eachNav.treatmentName
                    ? (
                      <FeatureTreatment
                        key={`${eachNav?.treatmentName}_${index}`}
                        treatmentName={eachNav?.treatmentName}
                        onLoad={() => { }}
                        onTimedout={() => { }}
                        attributes={splitAttributes}
                      >
                        <>
                          {(!checkPaymentsACLs() && eachNav.label === "Payments") ? null
                            : (
                              <div className={`${eachNav?.mobileCoachmark}`}>
                                <ListItem className={classes.gutters} onClick={(e) => handleClickMobile(e, eachNav.href, 'parent', eachNav?.label, eachNav?.labelForSegment)} button key={eachNav.href}>
                                  <ListItemIcon>
                                    {
                            eachNav.href === '/home'
                            && (
                            <>
                              {
                                (window.location.pathname === eachNav.href || myHomeObj.childNavs.find((cNav) => cNav.href === window.location.pathname))
                                  ? <LogoImg alt="" src={eachNav.activeIcon} />
                                  : <LogoImg alt="" src={eachNav.inactiveIcon} />
                              }
                            </>
                            )
                          }
                                    {
                            eachNav.href === '/findcare'
                            && (
                            <>
                              {
                                (window.location.pathname === eachNav.href || findCareObj.childNavs.find((cNav) => cNav.href === window.location.pathname) || selectedParentTab === eachNav.href)
                                  ? <LogoImg alt="" src={eachNav.activeIcon} />
                                  : <LogoImg alt="" src={eachNav.inactiveIcon} />
                              }
                            </>
                            )
                          }
                                    {
                            eachNav.href === '/my-health'
                            && (
                            <>
                              {
                                (window.location.pathname === eachNav.href || myHealthObj.childNavs.find((cNav) => cNav.href === window.location.pathname) || selectedParentTab === eachNav.href)
                                  ? <LogoImg alt="" src={eachNav.activeIcon} />
                                  : <LogoImg alt="" src={eachNav.inactiveIcon} />
                              }
                            </>
                            )
                          }
                                    {
                            eachNav.href !== '/findcare' && eachNav.href !== '/home' && eachNav.href !== '/my-health'
                                && (
                                  window.location.pathname === eachNav.href
                                    ? <LogoImg alt="" src={eachNav.activeIcon} />
                                    : <LogoImg alt="" src={eachNav.inactiveIcon} />)

                          }
                                  </ListItemIcon>
                                  <ListItemText className={selectedParentTab === eachNav.href ? `tab-active` : `tab-inactive`}>
                                    {eachNav.label}
                                  </ListItemText>

                                  {eachNav.type === 'navItem' && ['/home'].some((x) => x === eachNav.href) && (
                                  <ListItemIcon onClick={(e) => onCollapseExpand(e, eachNav.href, 'parent')}>
                                    <LogoImg alt="" src={((eachNav.href === '/home' && homeMobileItems) || (eachNav.href === '/my-health' && myHealthMobileItems) || eachNav.href === '/findcare' && findCareMobileItems) ? `/react/images/icn-up-arrow.svg` : `/react/images/icn-down-arrow.svg`} />
                                  </ListItemIcon>
                                  )}
                                  {eachNav.type === 'navItem' && ['/findcare'].some((x) => x === eachNav.href) && !(window.location.pathname === "/search" || window.location.pathname === "/details") && (

                                  <ListItemIcon onClick={(e) => onCollapseExpand(e, eachNav.href, 'parent')}>
                                    <LogoImg alt="" src={((eachNav.href === '/home' && homeMobileItems) || (eachNav.href === '/my-health' && myHealthMobileItems) || eachNav.href === '/findcare' && findCareMobileItems) ? `/react/images/icn-up-arrow.svg` : `/react/images/icn-down-arrow.svg`} />
                                  </ListItemIcon>
                                  )}
                                  {eachNav.type === 'navItem' && ['/my-health'].some((x) => x === eachNav.href) && (

                                  <ListItemIcon onClick={(e) => onCollapseExpand(e, eachNav.href, 'parent')}>
                                    <LogoImg alt="" src={((eachNav.href === '/home' && homeMobileItems) || (eachNav.href === '/my-health' && myHealthMobileItems) || (eachNav.href === '/' && findCareMobileItems)) ? `/react/images/icn-up-arrow.svg` : `/react/images/icn-down-arrow.svg`} />
                                  </ListItemIcon>
                                  )}
                                </ListItem>
                                {
                      eachNav.href === '/home' && eachNav.type === 'navItem' && (
                        <Collapse in={homeMobileItems} timeout="auto" unmountOnExit key={myHomeObj.href} component="li">
                          <List>
                            {myHomeObj.childNavs && myHomeObj.childNavs.length > 0 && myHomeObj.childNavs.map((childNav, childInd) => (
                              childNav.treatmentName
                                ? (
                                  <FeatureTreatment
                                    key={`${childNav.treatmentName}_${childInd}`}
                                    treatmentName={childNav.treatmentName}
                                    onLoad={() => { }}
                                    onTimedout={() => { }}
                                    attributes={splitAttributes}
                                  >
                                    <ListItem className={classes.gutters} onClick={(e) => handleClickMobile(e, childNav.href, 'child', childNav?.label, childNav?.labelForSegment)} button>
                                      <ListItemIcon>{selectedChildTab === childNav.href ? <LogoImg alt="" src={childNav.activeIcon} /> : <LogoImg alt="" src={childNav.inactiveIcon} />}</ListItemIcon>
                                      <ListItemText className={selectedChildTab === childNav.href ? 'child-tab-active' : 'child-tab-inactive'}>{childNav.label}</ListItemText>
                                    </ListItem>
                                  </FeatureTreatment>
                                ) : (
                                  <ListItem key={`${childNav.treatmentName}_${childInd}`} className={classes.gutters} onClick={(e) => handleClickMobile(e, childNav.href, 'child', childNav?.label, childNav?.labelForSegment)} button>
                                    <ListItemIcon>{selectedChildTab === childNav.href ? <LogoImg alt="" src={childNav.activeIcon} /> : <LogoImg alt="" src={childNav.inactiveIcon} />}</ListItemIcon>
                                    <ListItemText className={selectedChildTab === childNav.href ? 'child-tab-active' : 'child-tab-inactive'}>{childNav.label}</ListItemText>
                                  </ListItem>
                                )
                            ))}
                          </List>
                          <HorizontalDivider />
                        </Collapse>
                      )
                    }
                              </div>
                            )}
                        </>
                      </FeatureTreatment>
                    )
                    : (
                      <div key={index} className={`${eachNav?.mobileCoachmark}`}>
                        <ListItem className={classes.gutters} onClick={(e) => handleClickMobile(e, eachNav.href, 'parent', eachNav?.label, eachNav?.labelForSegment)} button key={index}>
                          <ListItemIcon>
                            {
                           eachNav.href === '/home'
                           && (
                           <>
                             {
                               (window.location.pathname === eachNav.href || myHomeObj.childNavs.find((cNav) => cNav.href === window.location.pathname))
                                 ? <LogoImg alt="" src={eachNav.activeIcon} />
                                 : <LogoImg alt="" src={eachNav.inactiveIcon} />
                             }
                           </>
                           )
                         }
                            {
                           eachNav.href === '/findcare'
                           && (
                           <>
                             {
                               (window.location.pathname === eachNav.href || findCareObj.childNavs.find((cNav) => cNav.href === window.location.pathname) || selectedParentTab === eachNav.href)
                                 ? <LogoImg alt="" src={eachNav.activeIcon} />
                                 : <LogoImg alt="" src={eachNav.inactiveIcon} />
                             }
                           </>
                           )
                         }

                            {
                           eachNav.href === '/my-health'
                           && (
                           <>
                             {
                               (window.location.pathname === eachNav.href || myHealthObj.childNavs.find((cNav) => cNav.href === window.location.pathname) || selectedParentTab === eachNav.href)
                                 ? <LogoImg alt="" src={eachNav.activeIcon} />
                                 : <LogoImg alt="" src={eachNav.inactiveIcon} />
                             }
                           </>
                           )
                         }

                            {
                           eachNav.href !== '/findcare' && eachNav.href !== '/home' && eachNav.href !== '/my-health'
                               && (
                                 window.location.pathname === eachNav.href
                                   ? (
                                     <LogoImg alt="" src={eachNav.activeIcon} />
                                   )
                                   : <LogoImg alt="" src={eachNav.inactiveIcon} />
                               )
                         }
                          </ListItemIcon>
                          <ListItemText className={selectedParentTab === eachNav.href ? `tab-active` : `tab-inactive`}>
                            {eachNav.label}
                          </ListItemText>

                          {eachNav.type === 'navItem' && ['/home'].some((x) => x === eachNav.href) && (
                          <ListItemIcon onClick={(e) => onCollapseExpand(e, eachNav.href, 'parent')}>
                            <LogoImg alt="" src={((eachNav.href === '/home' && homeMobileItems) || eachNav.href === '/findcare' && findCareMobileItems) ? `/react/images/icn-up-arrow.svg` : `/react/images/icn-down-arrow.svg`} />
                          </ListItemIcon>
                          )}
                          {eachNav.type === 'navItem' && ['/findcare'].some((x) => x === eachNav.href) && !(window.location.pathname === "/search" || window.location.pathname === "/details") && (

                          <ListItemIcon onClick={(e) => onCollapseExpand(e, eachNav.href, 'parent')}>
                            <LogoImg alt="" src={((eachNav.href === '/home' && homeMobileItems) || eachNav.href === '/findcare' && findCareMobileItems) ? `/react/images/icn-up-arrow.svg` : `/react/images/icn-down-arrow.svg`} />
                          </ListItemIcon>
                          )}
                          {eachNav.type === 'navItem' && ['/my-health'].some((x) => x === eachNav.href) && (

                          <ListItemIcon onClick={(e) => onCollapseExpand(e, eachNav.href, 'parent')}>
                            <LogoImg alt="" src={((eachNav.href === '/home' && homeMobileItems) || (eachNav.href === '/my-health' && myHealthMobileItems) || eachNav.href === '/findcare' && findCareMobileItems) ? `/react/images/icn-up-arrow.svg` : `/react/images/icn-down-arrow.svg`} />
                          </ListItemIcon>
                          )}
                        </ListItem>
                        {
                     eachNav.href === '/home' && eachNav.type === 'navItem' && (
                       <Collapse in={homeMobileItems} timeout="auto" unmountOnExit key={myHomeObj.href} component="li">
                         <List>
                           {myHomeObj.childNavs && myHomeObj.childNavs.length > 0 && myHomeObj.childNavs.map((childNav, childInd) => (
                           childNav.treatmentName === OTC_WIDGET_PAGE || childNav.treatmentName === SHOW_HEALTH_ASSESMENT_SURVEY?
                              (
                                splitEval.evaluateSplitByName(childNav.treatmentName) &&
                                <ListItem className={classes.gutters} onClick={(e) => handleClickMobile(e, childNav.href, 'child', childNav?.label)} button>
                                  <ListItemIcon>{selectedChildTab === childNav.href ? <LogoImg alt="" src={childNav.activeIcon} /> : <LogoImg alt="" src={childNav.inactiveIcon} />}</ListItemIcon>
                                  <ListItemText className={selectedChildTab === childNav.href ? 'child-tab-active' : 'child-tab-inactive'}>{childNav.label}</ListItemText>
                                </ListItem>
                              ):
                             childNav.treatmentName
                               ? (
                                 <FeatureTreatment
                                   key={`${childNav.treatmentName}_${childInd}`}
                                   treatmentName={childNav.treatmentName}
                                   onLoad={() => { }}
                                   onTimedout={() => { }}
                                   attributes={splitAttributes}
                                 >
                                   <ListItem className={classes.gutters} onClick={(e) => handleClickMobile(e, childNav.href, 'child', childNav?.label)} button>

                                     <ListItemIcon>{selectedChildTab === childNav.href ? <LogoImg alt="" src={childNav.activeIcon} /> : <LogoImg alt="" src={childNav.inactiveIcon} />}</ListItemIcon>
                                     <ListItemText className={selectedChildTab === childNav.href ? 'child-tab-active' : 'child-tab-inactive'}>{childNav.label}</ListItemText>
                                   </ListItem>
                                 </FeatureTreatment>
                               ) : (
                                 <ListItem key={`${childNav.treatmentName}_${childInd}`} className={classes.gutters} onClick={(e) => handleClickMobile(e, childNav.href, 'child', childNav?.label, childNav?.labelForSegment)} button>
                                   <ListItemIcon>{selectedChildTab === childNav.href ? <LogoImg alt="" src={childNav.activeIcon} /> : <LogoImg alt="" src={childNav.inactiveIcon} />}</ListItemIcon>
                                   <ListItemText className={selectedChildTab === childNav.href ? 'child-tab-active' : 'child-tab-inactive'}>{childNav.label}</ListItemText>
                                 </ListItem>
                               )
                           ))}
                         </List>
                         <HorizontalDivider />
                       </Collapse>
                     )
                   }
                      </div>
                    )
}
                  {
                    eachNav.href === '/findcare' && eachNav.type === 'navItem' && (
                      <Collapse in={findCareMobileItems} timeout="auto" unmountOnExit key={findCareObj.href} component="li">
                        <List>
                          {findCareObj.childNavs && findCareObj.childNavs.length > 0 && findCareObj.childNavs.map((childNav, childInd) => (
                            childNav.treatmentName
                              ? (
                                <FeatureTreatment
                                  treatmentName={childNav.treatmentName}
                                  key={`${childNav.treatmentName}_${childInd}`}
                                  onLoad={() => { }}
                                  onTimedout={() => { }}
                                  attributes={splitAttributes}
                                >
                                  <ListItem className={classes.gutters} onClick={(e) => handleClickMobile(e, childNav.href, 'child', childNav?.label, childNav?.labelForSegment)} button>
                                    <ListItemIcon>{selectedChildTab === childNav.href ? <LogoImg alt="" src={childNav.activeIcon} /> : <LogoImg alt="" src={childNav.inactiveIcon} />}</ListItemIcon>
                                    <ListItemText className={selectedChildTab === childNav.href ? 'child-tab-active' : 'child-tab-inactive'}>{childNav.label}</ListItemText>
                                  </ListItem>
                                </FeatureTreatment>
                              ) : (
                                <ListItem className={classes.gutters} onClick={(e) => handleClickMobile(e, childNav.href, 'child', childNav?.label, childNav?.labelForSegment)} button>
                                  <ListItemIcon>{selectedChildTab === childNav.href ? <LogoImg alt="" src={childNav.activeIcon} /> : <LogoImg alt="" src={childNav.inactiveIcon} />}</ListItemIcon>
                                  <ListItemText className={selectedChildTab === childNav.href ? 'child-tab-active' : 'child-tab-inactive'}>{childNav.label}</ListItemText>
                                </ListItem>
                              )
                          ))}
                        </List>
                        <HorizontalDivider />
                      </Collapse>
                    )
                  }
                  {
                    eachNav.href === '/my-health' && eachNav.type === 'navItem' && (
                      <Collapse in={myHealthMobileItems} timeout="auto" unmountOnExit key={myHealthObj.href} component="li">
                        <List>
                          {myHealthObj.childNavs && myHealthObj.childNavs.length > 0 && myHealthObj.childNavs.map((childNav, childInd) => (
                            childNav.treatmentName
                              ? (
                                <FeatureTreatment
                                  treatmentName={childNav.treatmentName}
                                  key={`${childNav.treatmentName}_${childInd}`}
                                  onLoad={() => { }}
                                  onTimedout={() => { }}
                                  attributes={splitAttributes}
                                >
                                  <ListItem className={classes.gutters} onClick={(e) => handleClickMobile(e, childNav.href, 'child', childNav?.label, childNav?.labelForSegment)} button>
                                    <ListItemIcon>{selectedChildTab === childNav.href ? <LogoImg alt="" src={childNav.activeIcon} /> : <LogoImg alt="" src={childNav.inactiveIcon} />}</ListItemIcon>
                                    <ListItemText className={selectedChildTab === childNav.href ? 'child-tab-active' : 'child-tab-inactive'}>{childNav.label}</ListItemText>
                                  </ListItem>
                                </FeatureTreatment>
                              ) : (
                                <ListItem className={classes.gutters} onClick={(e) => handleClickMobile(e, childNav.href, 'child', childNav?.label, childNav?.labelForSegment)} button>
                                  <ListItemIcon>{selectedChildTab === childNav.href ? <LogoImg alt="" src={childNav.activeIcon} /> : <LogoImg alt="" src={childNav.inactiveIcon} />}</ListItemIcon>
                                  <ListItemText className={selectedChildTab === childNav.href ? 'child-tab-active' : 'child-tab-inactive'}>{childNav.label}</ListItemText>
                                </ListItem>
                              )
                          ))}
                        </List>
                        <HorizontalDivider />
                      </Collapse>
                    )

                  }

                </React.Fragment>
              );
            }
          })}
        </List>

      </>
    );
  };

  return (
    !customerInfo.loading && (
    <>
      <LongLoadSpinner show={loaderShow} />
      <Hidden only={["xs", "sm"]}>
        <AppBar position="sticky" className="no-print" style={{ color: 'black', zIndex: 500, boxShadow:'none' }}>
          {getParentNav()}
          {getChildNav()}
        </AppBar>
      </Hidden>
      <Hidden only={["xl", "lg", "md"]}>
        <AppBar
          ref={appBarRef}
          position="fixed"
          style={{ color: 'black', zIndex: 200, position: appBarPosition }}
        >
          <ThemeProvider theme={theme}>
            <Toolbar style={{ justifyContent: 'space-between', backgroundColor: 'white' }}>
              <LogoImg
                alt=""
                src={`/react/images/icn-hf-logo.svg`}
                onClick={() => {
                  sessionStorage.setItem("longLoad", true);
                  handleSegmentBtn('/logo', 'Logo', 'Logo');
                  window.location.href = '/home';
                  // call app segment API
                }}
              />
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="end"
                onClick={handleDrawerOpen}
                className={`navbar-hamburger-coachmarks no-print ${drawerOpen && 'drawer-is-open-coachmarks'}`}
              >
                {!drawerOpen ? <MobileHamburgerImg alt="" src={`/react/images/icn-hamburger.svg`} />
                  : <MobileCloseImg alt="" src={`/react/images/icn-close.svg`} />}
              </IconButton>
            </Toolbar>
          </ThemeProvider>
          <div className={classes.root}>
            <DrawerOverlay display={String(drawerOpen)}>
              <Drawer
                id="mobileDrawer"
                variant="persistent"
                anchor="right"
                open={drawerOpen}
                classes={{ paper: appBarPosition === "relative" ? classes.drawerPaperRelative : classes.drawerPaper }}
              >
                <StickyDrawer>
                  <Divider />
                  {displayNavMenu()}
                </StickyDrawer>
                <Bottom>
                  <HorizontalDivider />
                  <NavLogoutContainer>
                    <NavLogout
                      route="JSON"
                      onClick={(e) => { handleClick(e, 'member-logout', '', 'Log Out', 'Log Out'); }}
                    >
                      {' '}
                      Log Out
                    </NavLogout>
                  </NavLogoutContainer>
                </Bottom>
              </Drawer>
            </DrawerOverlay>
          </div>
        </AppBar>
      </Hidden>
    </>
    )
  );
}

const DrawerOverlay = styled.div`
  position:fixed;
  display:${({ display }) => (display != "false" ? "block" : "none")};
  left:0;
  background-color: rgba(0, 42, 74, 0.72);
  width: 100%;
  height: 100%;
`;
const StickyDrawer = styled.div`
  position:sticky;
  top:0;

  display: flex;
  flex-direction: column;
`;

const HorizontalDivider = styled.div`
  height: 1px;
  background-color: #d8d8d8;
  width:100%
`;

const LogoImg = styled.img`
`;

const MobileHamburgerImg = styled.img`
  float:right;
  height: 24px;
  width:  24px;
}
`;
const MobileCloseImg = styled.img`
  float:right;
  height: 16px;
  width:  16px;
}
`;

const Name = styled.div`
  font-family: "museo-sans", san-serif;
  font-size: 16px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: 0.27px;
  color: #003863;
`;

const CardIcon = styled.img`
  display: list-item;
  border-radius: 50%;
  position: relative;
  overflow: hidden;
  text-align: center;
  background-color: #d8d8d8;
  padding: 15px;
  margin-top: 15px;
`;

const InlineInnerContainer = styled.div`
  padding: 8px;
  width: 100%;
`;

const Member = styled.div`
  font-family: "museo-sans", san-serif;
  font-size: 14px;
  font-weight: 300;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: normal;
  color: #474b55;
`;

const Lang = styled.a`
  font-family: "museo-sans", san-serif;
  font-size: 16px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.75;
  letter-spacing: normal;
  color: #008bbf;
  cursor: pointer;
  color:${(props) => (!props.active ? '#008bbf !important' : '#AAAAAA  !important')};
  pointer-events: auto;
  &:hover{
    text-decoration:none;
  }
`;

const SetDiv = styled.div`
    display: flex;
    justify-content: left;
    align-items: center;
    margin: auto 16px;
    /* border: 2px solid red; */
    @media only screen and (max-width: 768px) {
        justify-content: start;
        align-items: center;
    }
`;

const SettImg = styled.img`
    width: 20px;
    height: 20px;
    /* border: 2px solid red; */

    img{
        display: block;
        width: 100%;
        height: 100%;
        object-fit: contain;
    }
`;

const Settings = styled.span`
  color: #008bbf;
  font-size: 14px;
  font-weight: 500;
  font-family: "museo-sans",san-serif;
  font-stretch: normal;
  font-style: normal;
  line-height: 3;
  letter-spacing: normal;
  margin-left: 8px;
  cursor: pointer;
  &:hover {
    color: #2A6A9E;
    border-radius: 4px;
    text-decoration: underline;
  }
`;

const NavRightUser = styled.div`
  float: right;
  display: flex;
  margin: 15px;
  padding: 8px;
  ${(props) => props.open && 'border-radius: 4px;  border: solid 1px #d8d8d8;'};
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
    border-radius: 4px;
  }
  cursor: pointer;
`;

const UserIcon = styled.img`
  width: 24px;
  height: 24px;
  display: list-item;
  border-radius: 50%;
  object-fit: scale-down;
  position: relative;
  overflow: hidden;
  background-color: #d8d8d8;
`;

const UserName = styled.span`
  font-family: "museo-sans", san-serif;
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.71;
  letter-spacing: normal;
  color: #474b55;
  margin-left: 8px;
  text-transform: capitalize;
`;

export const UserCard = styled.div`
  display: block;
  cursor: default;
  opacity:${(props) => (props.open ? "1" : "0")};
  pointer-events:${(props) => (props.open ? "auto" : "none")};
  position: absolute;
  right: 39px;
  top: 66px;
  border-radius: 4px;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, .23);
  background-color: #ffffff;
  list-style-type: none;
  width: 300px;
  text-align: -webkit-center;
  text-align: -moz-center;
`;

export const Logout = styled.button`
  font-family: "museo-sans", san-serif;
  font-size: 14px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 2;
  letter-spacing: -0.06px;
  text-align: center;
  color: #ffffff;
  border-radius: 4px;
  border:0px;
  background-color: #3e7128;
  width: 85%;
  margin: 15px;
  cursor: pointer;
  &:hover{
    background-color: #1e5b0f;
    box-shadow: inset 0 -2px 0 0 #30591e;
    text-decoration: none;
    color: #ffffff !important;
    border-color: #1e5b0f;
    -webkit-appearance: none !important;
  }
`;
const NavLogoutContainer = styled.div`
padding:16px;
`;
export const NavLogout = styled.button`
  font-family: "museo-sans", san-serif;
  font-size: 14px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 2;
  letter-spacing: -0.06px;
  text-align: center;
  color: #ffffff;
  border-radius: 4px;
  border:0px;
  background-color: #3e7128;
  width: 100%;
  cursor: pointer;
`;

export const Bottom = styled.div`
  margin-top:auto;
  margin-bottom:0px;
`;

const CardNav = styled.div`
  display: flex;
  cursor: pointer;
  background-color: #ffffff;
  padding: 1rem;
`;

const IconContainer = styled.div`
  width: 50px;
  height: 50px;
  margin-right: 3px;
  display: list-item;
  border-radius: 50%;
  text-align: -webkit-center;

  ::marker {
    color: transparent;
  }
`;

const ImgIcon = styled.img`
  width: 32px;
  height: 32px;
  display: list-item;
  border-radius: 50%;
  object-fit: scale-down;
  position: relative;
  overflow: hidden;
  background-color: #f4f4f4;
`;

export default withRouter(AppBarComponent);
