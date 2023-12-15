import React, { useState, useEffect, useRef } from "react";
import { Container, MyDocuments, Main,HrLine,SubTitle } from "./style";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

const FormsAndDocuments = (props) => {

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
        style={{ display: "inline-flex" }}>
            {navItems.map((eachNav,index) =>(
                 <Tab
                 label={eachNav.label}
                 value={eachNav.href}
                 className={true ? 'child-tab-active' : 'child-tab-inactive'}
               />

            ))}

        </Tabs>
        <HrLine/>
        <MyDocuments>Forms and Plan Document</MyDocuments>
        <SubTitle>General Forms</SubTitle>
      </Main>
    </Container>
  );
};

const Index = (props) => {
  return <FormsAndDocuments />;
};

export default Index;
