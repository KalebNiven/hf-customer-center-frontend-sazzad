import React, { useEffect, useRef, useState } from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import styled from "styled-components";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
} from "@material-ui/core";
import { Hidden, Divider } from "@material-ui/core";
import Drawer from "@material-ui/core/Drawer";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { AnalyticsPage, AnalyticsTrack } from "../common/segment/analytics";
import {
  ANALYTICS_TRACK_TYPE,
  ANALYTICS_TRACK_CATEGORY,
} from "../../constants/segment";
import { useLogout } from "../../hooks/useLogout";
import LongLoadSpinner from "../common/longLoadSpinner";
import { FeatureTreatment } from "../../libs/featureFlags";
import { useAppContext } from "../../AppContext";
import { getSplitAttributes } from "../../utils/misc";

const useStyles = (top) =>
  makeStyles((theme) => ({
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
      overflowY: "scroll",
    }),
    drawerPaperRelative: {
      top: `${top}px !important`,
      overflow: "scroll",
      maxHeight: `calc(100% - ${top}px)`,
      "@media (min-width : 768px)": {
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
  }));
const theme = createMuiTheme({
  props: {
    MuiButtonBase: {
      disableRipple: true,
    },
  },
});
const ErrorNavBar = () => {
  const [mobileDrawerTop, setMobileDrawerTop] = useState(204);
  const classes = useStyles(mobileDrawerTop)();
  const customerInfo = useSelector((state) => state.customerInfo);
  const [openUserCard, setOpenUserCard] = useState(false);
  const userName =
    customerInfo.data.firstName + " " + customerInfo.data.lastName;
  const firstName = customerInfo?.data?.hohPlans[0]
    ? customerInfo.data.hohPlans[0].FirstName
    : customerInfo?.data?.firstName;
  const [homeMobileItems, setHomeMobileItems] = useState(false);
  const [findCareMobileItems, setFindCareMobileItems] = useState(false);
  const history = useHistory();
  const { MIX_REACT_LOFL_LANGUAGE_EN_URL } = process.env;
  const { MIX_REACT_LOFL_LANGUAGE_ES_URL } = process.env;
  const { MIX_REACT_LOFL_LANGUAGE_ZH_URL } = process.env;
  const [loaderShow, setLoaderShow] = useState(
    sessionStorage.getItem("longLoad"),
  );
  const { drawerOpen, setDrawerOpen, globalError } = useAppContext();
  const appBarRef = useRef(null);
  const [appBarPosition, setAppBarPosition] = useState("relative");
  let nav;

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : null;
    setMobileDrawerTop(
      appBarRef.current?.getBoundingClientRect().y +
        appBarRef.current?.getBoundingClientRect().height,
    );
  }, [drawerOpen]);

  useEffect(() => {
    const longLoad = sessionStorage.getItem("longLoad");
    setLoaderShow(longLoad);
  }, [sessionStorage.getItem("longLoad")]);

  const splitAttributes = getSplitAttributes(customerInfo?.data);

  const getUserProfile = () => {
    return (
      <NavRightUser
        tabIndex={0}
        open={openUserCard}
        onClick={() => setOpenUserCard(!openUserCard)}
        onBlur={() => setOpenUserCard(false)}
      >
        <UserIcon src={`${window.location.origin}/react/images/icn-user.svg`} />
        <UserName>{firstName?.toLowerCase()}</UserName>
        <UserCard onClick={(e) => e.stopPropagation()} open={openUserCard}>
          <CardIcon
            src={`${window.location.origin}/react/images/icn-user.svg`}
          />
          <InlineInnerContainer>
            <Name>{userName}</Name>
            <Member>Member ID: {customerInfo.data.memberId}</Member>
          </InlineInnerContainer>
          <HorizontalDivider />
          <Logout
            type="button"
            onMouseDown={(e) => {
              e.stopPropagation();
              handleClick(e, "member-logout", "", "Log Out", "Log Out");
            }}
          >
            Log Out
          </Logout>
        </UserCard>
      </NavRightUser>
    );
  };

  const logoutApi = useLogout();

  const [navItems, setNavItems] = useState([
    {
      activeIcon: `${window.location.origin}/react/images/icn-hf-logo.svg`,
      inactiveIcon: `${window.location.origin}/react/images/icn-hf-logo.svg`,
      label: "",
      labelForSegment: "",
      type: "logo",
      href: "/home",
      childNavs: [],
      coachmark: null,
      mobileCoachmark: null,
      treatmentName: null,
    },
  ]);

  const tabStyle = {
    default: {
      //move styling out of index.css and into here
    },
    active: {
      //move styling out of index.css and into here
    },
  };

  // useEffect(() => {
  //   if (Object.keys(customerInfo.data).length > 0) {
  //     displayTabCheck()
  //   }
  // }, [customerInfo.data, drawerOpen]);

  const handleClick = (e, param, clickType, eachNavLabel, labelForSegment) => {
    e.preventDefault();
    if (drawerOpen) {
      setDrawerOpen(!drawerOpen);
    }
    handleSegmentBtn(param, eachNavLabel, labelForSegment);
    if (["/home"].some((x) => x === param)) {
      window.location.href = param;
    } else if (param === "/settings") {
      history.push({
        pathname: "/settings",
        state: { sideBarIndex: 0 },
      });
    } else if (param === "member-logout") {
      analytics.reset();
      sessionStorage.removeItem(`persist:${window.location.host}_PROVIDER_APP`);
      try {
        ProviderDirectoryWidget.invalidateStore();
      } catch (e) {
        console.log("Nothing to invalidate");
      }
      sessionStorage.removeItem("currentMemberId");
      logoutApi();
    } else {
      sessionStorage.setItem("longLoad", true);
      window.location.href = param;
    }
    const homeWrapper = document.getElementsByClassName("wrapper");
    homeWrapper && homeWrapper[0]?.remove();
  };

  const [value, setValue] = React.useState(0);
  const handlTabs = (e, value) => {
    setValue(value);
  };

  const getParentNav = () => {
    return (
      <div
        id="navbar"
        style={{
          display: "flex",
          height: "64px",
          paddingLeft: "15px",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Tabs
          value={value}
          TabIndicatorProps={{
            style: { position: "absolute", left: "-999px" },
          }}
          onChange={handlTabs}
        >
          {navItems.map((eachNav, index) => {
            return eachNav.treatmentName ? (
              <FeatureTreatment
                key={`${eachNav.treatmentName}_${index}`}
                treatmentName={eachNav.treatmentName}
                onLoad={() => {}}
                onTimedout={() => {}}
                attributes={splitAttributes}
              >
                <Tab
                  key={`${eachNav.href}_${index}`}
                  style={tabStyle.default}
                  label={eachNav.label}
                  onClick={(e) =>
                    handleClick(
                      e,
                      eachNav.href,
                      "parent",
                      eachNav?.type === "logo" ? "Logo" : eachNav?.label,
                      eachNav?.labelForSegment,
                    )
                  }
                  icon={<LogoImg src={eachNav.inactiveIcon} />}
                  value={value}
                  className={`tab-inactive ${eachNav?.coachmark}`}
                />
              </FeatureTreatment>
            ) : (
              <Tab
                key={`${eachNav.href}_${index}`}
                style={tabStyle.default}
                label={eachNav.label}
                onClick={(e) =>
                  handleClick(
                    e,
                    eachNav.href,
                    "parent",
                    eachNav?.type === "logo" ? "Logo" : eachNav?.label,
                    eachNav.labelForSegment,
                  )
                }
                icon={<LogoImg src={eachNav.inactiveIcon} />}
                value={value}
                className={`tab-inactive ${eachNav?.coachmark}`}
              />
            );
          })}
        </Tabs>
        <Toolbar style={{ marginLeft: "auto" }}>{getUserProfile()}</Toolbar>
      </div>
    );
  };

  const getChildNav = () => {
    let childNavs, currentTab;

    if (
      [
        "/claims",
        "/authorizations",
        "/coverage-and-benefits",
        "/idcard",
        "/home",
      ].some((x) => x === window.location.pathname)
    ) {
      currentTab = navItems[1];
      childNavs = currentTab?.childNavs;
    } else if (
      window.location.pathname === "/findcare" ||
      window.location.pathname === "/pcp"
    ) {
      currentTab = navItems[2];
      childNavs = currentTab?.childNavs;
    } else {
      childNavs = null;
    }
    return !globalError && childNavs && childNavs.length > 0 ? (
      <div id="subnavbar">
        <Tabs
          value={false}
          TabIndicatorProps={{
            style: { background: "#3e7128" },
          }}
          className="reactNavMenu-coachmark"
          style={{ display: "inline-flex" }}
        >
          {childNavs &&
            childNavs.length > 0 &&
            childNavs.map((eachNav, ind) => {
              return eachNav.treatmentName ? (
                <FeatureTreatment
                  key={`${eachNav.treatmentName}_${ind}`}
                  treatmentName={eachNav.treatmentName}
                  onLoad={() => {}}
                  onTimedout={() => {}}
                  attributes={splitAttributes}
                >
                  <Tab
                    label={eachNav.label}
                    onClick={(e) =>
                      handleClick(
                        e,
                        eachNav.href,
                        "child",
                        eachNav?.label,
                        eachNav.labelForSegment,
                      )
                    }
                    value={eachNav.href}
                    className={"child-tab-inactive"}
                  />
                </FeatureTreatment>
              ) : (
                <Tab
                  key={`${eachNav.treatmentName}_${ind}`}
                  label={eachNav.label}
                  onClick={(e) =>
                    handleClick(
                      e,
                      eachNav.href,
                      "child",
                      eachNav?.label,
                      eachNav.labelForSegment,
                    )
                  }
                  value={eachNav.href}
                  className={"child-tab-inactive"}
                />
              );
            })}
        </Tabs>
      </div>
    ) : null;
  };

  const handleDrawerOpen = () => {
    setDrawerOpen(!drawerOpen);
    handleCoachMarks();
  };

  const onCollapseExpand = (e, href, clickElement) => {
    e.stopPropagation();
    if (href === "/home" && clickElement === "parent") {
      setHomeMobileItems(!homeMobileItems);
    } else if (href === "/findcare" && clickElement === "parent") {
      setFindCareMobileItems(!findCareMobileItems);
    }
  };
  const handleClickMobile = (
    e,
    href,
    clickElement,
    eachNavLabel,
    labelForSegment,
  ) => {
    if (drawerOpen) {
      setDrawerOpen(!drawerOpen);
    }
    sessionStorage.setItem("longLoad", true);
    handleSegmentBtn(href, eachNavLabel, labelForSegment);
    if (href === "/home" && clickElement === "parent") {
      window.location.href = href;
    } else if (href === "/findcare" && clickElement === "parent") {
      // setSelectedChildTab(navItems.find(x => x.href === href).childNavs[0].href)
      window.location.href = href;
    } else {
      window.location.href = href;
    }
    const homeWrapper = document.getElementsByClassName("wrapper");
    homeWrapper && homeWrapper[0]?.remove();

    if (clickElement === "child") {
      if (
        [
          "/claims",
          "/authorizations",
          "/coverage-and-benefits",
          "/idcard",
        ].some((x) => x === href)
      ) {
        history.push(href);
      } else {
        window.location.href = href;
      }
    }
    //call app segment API
  };

  const handleSegmentBtn = (href, eachNavLabel, labelForSegment) => {
    // Segment Track
    AnalyticsPage();
    AnalyticsTrack(labelForSegment + " " + "button clicked", customerInfo, {
      raw_text: eachNavLabel,
      // "destination_url": href === "/payments" ? customerInfo.data.paymentsUrl : window.location.origin + href,
      destination_url: window.location.origin + href,
      description: labelForSegment,
      category: ANALYTICS_TRACK_CATEGORY.navBar,
      type: ANALYTICS_TRACK_TYPE.linkClicked,
      targetMemberId: customerInfo?.data?.memberId,
      location: {
        desktop: {
          width: 960,
          value:
            href === "member-logout" || href === "/settings" ? "right" : "top",
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
    });
  };

  const displayNavMenu = () => {
    nav = [...navItems];
    const myHomeObj = nav.find(
      (x) => x.href === "/home" && x.type === "navItem",
    );
    const findCareObj = nav.find(
      (x) => x.href === "/findcare" && x.type === "navItem",
    );
    // if (window.location.pathname === "/search" || window.location.pathname === "/details") {
    //   findCareObj.childNavs = []
    // }
    return (
      <>
        <CardNav>
          <IconContainer>
            <ImgIcon
              src={`${window.location.origin}/react/images/icn-user.svg`}
            />
          </IconContainer>
          <InlineInnerContainer>
            <Name>{userName}</Name>
            <Member>Member ID: {customerInfo.data.memberId}</Member>
          </InlineInnerContainer>
        </CardNav>
        <HorizontalDivider />
        <List className={classes.listMaxHeight}>
          {navItems.map((eachNav, index) => {
            if (index > 0) {
              return (
                <React.Fragment key={`${eachNav.href}`}>
                  {eachNav.treatmentName ? (
                    <FeatureTreatment
                      key={`${eachNav?.treatmentName}_${index}`}
                      treatmentName={eachNav?.treatmentName}
                      onLoad={() => {}}
                      onTimedout={() => {}}
                      attributes={splitAttributes}
                    >
                      <div className={`${eachNav?.mobileCoachmark}`}>
                        <ListItem
                          className={classes.gutters}
                          onClick={(e) =>
                            handleClickMobile(
                              e,
                              eachNav.href,
                              "parent",
                              eachNav?.label,
                              eachNav?.labelForSegment,
                            )
                          }
                          button
                          key={eachNav.href}
                        >
                          <ListItemIcon>
                            {eachNav.href === "/home" && (
                              <>
                                {window.location.pathname === eachNav.href ||
                                myHomeObj.childNavs.find(
                                  (cNav) =>
                                    cNav.href === window.location.pathname,
                                ) ? (
                                  <LogoImg src={eachNav.activeIcon} />
                                ) : (
                                  <LogoImg src={eachNav.inactiveIcon} />
                                )}
                              </>
                            )}
                            {eachNav.href === "/findcare" && (
                              <>{<LogoImg src={eachNav.inactiveIcon} />}</>
                            )}
                            {eachNav.href !== "/findcare" &&
                              eachNav.href !== "/home" &&
                              (window.location.pathname === eachNav.href ? (
                                <LogoImg src={eachNav.activeIcon} />
                              ) : (
                                <LogoImg src={eachNav.inactiveIcon} />
                              ))}
                          </ListItemIcon>
                          <ListItemText className={`tab-inactive`}>
                            {eachNav.label}
                          </ListItemText>

                          {eachNav.type === "navItem" &&
                            ["/home"].some((x) => x === eachNav.href) && (
                              <ListItemIcon
                                onClick={(e) =>
                                  onCollapseExpand(e, eachNav.href, "parent")
                                }
                              >
                                <LogoImg
                                  src={
                                    (eachNav.href === "/home" &&
                                      homeMobileItems) ||
                                    (eachNav.href === "/findcare" &&
                                      findCareMobileItems)
                                      ? `${window.location.origin}/react/images/icn-up-arrow.svg`
                                      : `${window.location.origin}/react/images/icn-down-arrow.svg`
                                  }
                                />
                              </ListItemIcon>
                            )}
                          {eachNav.type === "navItem" &&
                            ["/findcare"].some((x) => x === eachNav.href) &&
                            !(
                              window.location.pathname === "/search" ||
                              window.location.pathname === "/details"
                            ) && (
                              <ListItemIcon
                                onClick={(e) =>
                                  onCollapseExpand(e, eachNav.href, "parent")
                                }
                              >
                                <LogoImg
                                  src={
                                    (eachNav.href === "/home" &&
                                      homeMobileItems) ||
                                    (eachNav.href === "/findcare" &&
                                      findCareMobileItems)
                                      ? `${window.location.origin}/react/images/icn-up-arrow.svg`
                                      : `${window.location.origin}/react/images/icn-down-arrow.svg`
                                  }
                                />
                              </ListItemIcon>
                            )}
                        </ListItem>
                        {eachNav.href === "/home" &&
                          eachNav.type === "navItem" && (
                            <Collapse
                              in={homeMobileItems}
                              timeout="auto"
                              unmountOnExit
                              key={myHomeObj.href}
                              component="li"
                            >
                              <List>
                                {myHomeObj.childNavs &&
                                  myHomeObj.childNavs.length > 0 &&
                                  myHomeObj.childNavs.map(
                                    (childNav, childInd) => {
                                      return childNav.treatmentName ? (
                                        <FeatureTreatment
                                          key={`${childNav.treatmentName}_${childInd}`}
                                          treatmentName={childNav.treatmentName}
                                          onLoad={() => {}}
                                          onTimedout={() => {}}
                                          attributes={splitAttributes}
                                        >
                                          <ListItem
                                            className={classes.gutters}
                                            onClick={(e) =>
                                              handleClickMobile(
                                                e,
                                                childNav.href,
                                                "child",
                                                childNav?.label,
                                                childNav?.labelForSegment,
                                              )
                                            }
                                            button
                                          >
                                            <ListItemIcon>
                                              {
                                                <LogoImg
                                                  src={childNav.inactiveIcon}
                                                />
                                              }
                                            </ListItemIcon>
                                            <ListItemText
                                              className={"child-tab-inactive"}
                                            >
                                              {childNav.label}
                                            </ListItemText>
                                          </ListItem>
                                        </FeatureTreatment>
                                      ) : (
                                        <ListItem
                                          key={`${childNav.treatmentName}_${childInd}`}
                                          className={classes.gutters}
                                          onClick={(e) =>
                                            handleClickMobile(
                                              e,
                                              childNav.href,
                                              "child",
                                              childNav?.label,
                                              childNav?.labelForSegment,
                                            )
                                          }
                                          button
                                        >
                                          <ListItemIcon>
                                            {
                                              <LogoImg
                                                src={childNav.inactiveIcon}
                                              />
                                            }
                                          </ListItemIcon>
                                          <ListItemText
                                            className={"child-tab-inactive"}
                                          >
                                            {childNav.label}
                                          </ListItemText>
                                        </ListItem>
                                      );
                                    },
                                  )}
                              </List>
                              <HorizontalDivider />
                            </Collapse>
                          )}
                      </div>
                    </FeatureTreatment>
                  ) : (
                    <div className={`${eachNav?.mobileCoachmark}`}>
                      <ListItem
                        className={classes.gutters}
                        onClick={(e) =>
                          handleClickMobile(
                            e,
                            eachNav.href,
                            "parent",
                            eachNav?.label,
                            eachNav?.labelForSegment,
                          )
                        }
                        button
                        key={eachNav.href}
                      >
                        <ListItemIcon>
                          {eachNav.href === "/home" && (
                            <>
                              {window.location.pathname === eachNav.href ||
                              myHomeObj.childNavs.find(
                                (cNav) =>
                                  cNav.href === window.location.pathname,
                              ) ? (
                                <LogoImg src={eachNav.activeIcon} />
                              ) : (
                                <LogoImg src={eachNav.inactiveIcon} />
                              )}
                            </>
                          )}
                          {eachNav.href === "/findcare" && (
                            <>{<LogoImg src={eachNav.inactiveIcon} />}</>
                          )}
                          {eachNav.href !== "/findcare" &&
                            eachNav.href !== "/home" &&
                            (window.location.pathname === eachNav.href ? (
                              <>
                                <LogoImg src={eachNav.activeIcon} />
                              </>
                            ) : (
                              <LogoImg src={eachNav.inactiveIcon} />
                            ))}
                        </ListItemIcon>
                        <ListItemText className={`tab-inactive`}>
                          {eachNav.label}
                        </ListItemText>

                        {eachNav.type === "navItem" &&
                          ["/home"].some((x) => x === eachNav.href) && (
                            <ListItemIcon
                              onClick={(e) =>
                                onCollapseExpand(e, eachNav.href, "parent")
                              }
                            >
                              <LogoImg
                                src={
                                  (eachNav.href === "/home" &&
                                    homeMobileItems) ||
                                  (eachNav.href === "/findcare" &&
                                    findCareMobileItems)
                                    ? `${window.location.origin}/react/images/icn-up-arrow.svg`
                                    : `${window.location.origin}/react/images/icn-down-arrow.svg`
                                }
                              />
                            </ListItemIcon>
                          )}
                        {eachNav.type === "navItem" &&
                          ["/findcare"].some((x) => x === eachNav.href) &&
                          !(
                            window.location.pathname === "/search" ||
                            window.location.pathname === "/details"
                          ) && (
                            <ListItemIcon
                              onClick={(e) =>
                                onCollapseExpand(e, eachNav.href, "parent")
                              }
                            >
                              <LogoImg
                                src={
                                  (eachNav.href === "/home" &&
                                    homeMobileItems) ||
                                  (eachNav.href === "/findcare" &&
                                    findCareMobileItems)
                                    ? `${window.location.origin}/react/images/icn-up-arrow.svg`
                                    : `${window.location.origin}/react/images/icn-down-arrow.svg`
                                }
                              />
                            </ListItemIcon>
                          )}
                      </ListItem>
                      {eachNav.href === "/home" &&
                        eachNav.type === "navItem" && (
                          <Collapse
                            in={homeMobileItems}
                            timeout="auto"
                            unmountOnExit
                            key={myHomeObj.href}
                            component="li"
                          >
                            <List>
                              {myHomeObj.childNavs &&
                                myHomeObj.childNavs.length > 0 &&
                                myHomeObj.childNavs.map(
                                  (childNav, childInd) => {
                                    return childNav.treatmentName ? (
                                      <FeatureTreatment
                                        key={`${childNav.treatmentName}_${childInd}`}
                                        treatmentName={childNav.treatmentName}
                                        onLoad={() => {}}
                                        onTimedout={() => {}}
                                        attributes={splitAttributes}
                                      >
                                        <ListItem
                                          className={classes.gutters}
                                          onClick={(e) =>
                                            handleClickMobile(
                                              e,
                                              childNav.href,
                                              "child",
                                              childNav?.label,
                                            )
                                          }
                                          button
                                        >
                                          <ListItemIcon>
                                            {
                                              <LogoImg
                                                src={childNav.inactiveIcon}
                                              />
                                            }
                                          </ListItemIcon>
                                          <ListItemText
                                            className={"child-tab-inactive"}
                                          >
                                            {childNav.label}
                                          </ListItemText>
                                        </ListItem>
                                      </FeatureTreatment>
                                    ) : (
                                      <ListItem
                                        key={`${childNav.treatmentName}_${childInd}`}
                                        className={classes.gutters}
                                        onClick={(e) =>
                                          handleClickMobile(
                                            e,
                                            childNav.href,
                                            "child",
                                            childNav?.label,
                                            childNav?.labelForSegment,
                                          )
                                        }
                                        button
                                      >
                                        <ListItemIcon>
                                          {
                                            <LogoImg
                                              src={childNav.inactiveIcon}
                                            />
                                          }
                                        </ListItemIcon>
                                        <ListItemText
                                          className={"child-tab-inactive"}
                                        >
                                          {childNav.label}
                                        </ListItemText>
                                      </ListItem>
                                    );
                                  },
                                )}
                            </List>
                            <HorizontalDivider />
                          </Collapse>
                        )}
                    </div>
                  )}
                  {eachNav.href === "/findcare" &&
                    eachNav.type === "navItem" && (
                      <Collapse
                        in={findCareMobileItems}
                        timeout="auto"
                        unmountOnExit
                        key={findCareObj.href}
                        component="li"
                      >
                        <List>
                          {findCareObj.childNavs &&
                            findCareObj.childNavs.length > 0 &&
                            findCareObj.childNavs.map((childNav, childInd) => {
                              return childNav.treatmentName ? (
                                <FeatureTreatment
                                  treatmentName={childNav.treatmentName}
                                  key={`${childNav.treatmentName}_${childInd}`}
                                  onLoad={() => {}}
                                  onTimedout={() => {}}
                                  attributes={splitAttributes}
                                >
                                  <ListItem
                                    className={classes.gutters}
                                    onClick={(e) =>
                                      handleClickMobile(
                                        e,
                                        childNav.href,
                                        "child",
                                        childNav?.label,
                                        childNav?.labelForSegment,
                                      )
                                    }
                                    button
                                  >
                                    <ListItemIcon>
                                      {<LogoImg src={childNav.inactiveIcon} />}
                                    </ListItemIcon>
                                    <ListItemText
                                      className={"child-tab-inactive"}
                                    >
                                      {childNav.label}
                                    </ListItemText>
                                  </ListItem>
                                </FeatureTreatment>
                              ) : (
                                <ListItem
                                  className={classes.gutters}
                                  onClick={(e) =>
                                    handleClickMobile(
                                      e,
                                      childNav.href,
                                      "child",
                                      childNav?.label,
                                      childNav?.labelForSegment,
                                    )
                                  }
                                  button
                                >
                                  <ListItemIcon>
                                    {<LogoImg src={childNav.inactiveIcon} />}
                                  </ListItemIcon>
                                  <ListItemText
                                    className={"child-tab-inactive"}
                                  >
                                    {childNav.label}
                                  </ListItemText>
                                </ListItem>
                              );
                            })}
                        </List>
                        <HorizontalDivider />
                      </Collapse>
                    )}
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
      <React.Fragment>
        <LongLoadSpinner show={loaderShow} />
        <Hidden only={["xs", "sm"]}>
          <AppBar
            position="sticky"
            className="no-print"
            style={{ color: "black", zIndex: 500 }}
          >
            {getParentNav()}
            {getChildNav()}
          </AppBar>
        </Hidden>
        <Hidden only={["xl", "lg", "md"]}>
          <AppBar
            ref={appBarRef}
            position="fixed"
            style={{ color: "black", zIndex: 200, position: appBarPosition }}
          >
            <ThemeProvider theme={theme}>
              <Toolbar
                style={{
                  justifyContent: "space-between",
                  backgroundColor: "white",
                }}
              >
                <LogoImg
                  src={`${window.location.origin}/react/images/icn-hf-logo.svg`}
                  onClick={() => {
                    sessionStorage.setItem("longLoad", true);
                    handleSegmentBtn("/logo", "Logo", "Logo");
                    window.location.href = "/home";
                    //call app segment API
                  }}
                />
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="end"
                  onClick={handleDrawerOpen}
                  className={`navbar-hamburger-coachmarks ${
                    drawerOpen && "drawer-is-open-coachmarks"
                  }`}
                >
                  {!drawerOpen ? (
                    <MobileHamburgerImg
                      src={`${window.location.origin}/react/images/icn-hamburger.svg`}
                    />
                  ) : (
                    <MobileCloseImg
                      src={`${window.location.origin}/react/images/icn-close.svg`}
                    />
                  )}
                </IconButton>
              </Toolbar>
            </ThemeProvider>
            <div className={classes.root}>
              <DrawerOverlay display={drawerOpen}>
                <Drawer
                  id="mobileDrawer"
                  variant="persistent"
                  anchor="right"
                  open={drawerOpen}
                  classes={{
                    paper:
                      appBarPosition === "relative"
                        ? classes.drawerPaperRelative
                        : classes.drawerPaper,
                  }}
                  containerStyle={{ background: "white" }}
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
                        onClick={(e) => {
                          handleClick(
                            e,
                            "member-logout",
                            "",
                            "Log Out",
                            "Log Out",
                          );
                        }}
                      >
                        {" "}
                        Log Out
                      </NavLogout>
                    </NavLogoutContainer>
                  </Bottom>
                </Drawer>
              </DrawerOverlay>
            </div>
          </AppBar>
        </Hidden>
      </React.Fragment>
    )
  );
};
const DrawerOverlay = styled.div`
  position: fixed;
  display: ${({ display }) => (display ? "block" : "none")};
  left: 0;
  background-color: rgba(0, 42, 74, 0.72);
  width: 100%;
  height: 100%;
`;
const StickyDrawer = styled.div`
  position: sticky;
  top: 0;

  display: flex;
  flex-direction: column;
`;

const HorizontalDivider = styled.div`
  height: 1px;
  background-color: #d8d8d8;
  width: 100%;
`;

const LogoImg = styled.img``;

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
  display: table-cell;
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
  color: ${(props) =>
    !props.active ? "#008bbf !important" : "#AAAAAA  !important"};
  pointer-events: auto;
  &:hover {
    text-decoration: none;
  }
`;

const NavRightUser = styled.div`
  float: right;
  display: flex;
  margin: 15px;
  padding: 5px;
  ${(props) => props.open && "border-radius: 4px;  border: solid 1px #d8d8d8;"};
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
  margin-left: 10px;
  text-transform: capitalize;
`;

export const UserCard = styled.div`
  display: block;
  cursor: default;
  opacity: ${(props) => (props.open ? "1" : "0")};
  pointer-events: ${(props) => (props.open ? "auto" : "none")};
  position: absolute;
  right: 0px;
  top: 66px;
  border-radius: 4px;
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.23);
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
  border: 0px;
  background-color: #3e7128;
  width: 85%;
  margin: 15px;
  cursor: pointer;
  &:hover {
    background-color: #1e5b0f;
    box-shadow: inset 0 -2px 0 0 #30591e;
    text-decoration: none;
    color: #ffffff !important;
    border-color: #1e5b0f;
    -webkit-appearance: none !important;
  }
`;
const NavLogoutContainer = styled.div`
  padding: 16px;
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
  border: 0px;
  background-color: #3e7128;
  width: 100%;
  cursor: pointer;
`;

export const Bottom = styled.div`
  margin-top: auto;
  margin-bottom: 0px;
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

export default ErrorNavBar;
