import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import Joyride, { ACTIONS, EVENTS, STATUS, LIFECYCLE } from "react-joyride";
import FirstTimeScreen from "./firstTimeScreen";
import EndTourScreen from "./endTourScreen";
import RetakeTourButton from "./retakeTourButton";
import Tooltip from "./tooltip";
import { mobileStepsState, desktopStepsState } from "./tourSteps";
import { DESKTOP, MOBILE, WIDTH_TABLET, HAS_PASSED_TOUR } from "./consts";
import { useAppContext } from "../../../AppContext";
import { useCoachMarksContext } from "./coachMarksContext";
import { AnalyticsTrack } from "../../../components/common/segment/analytics";
import {
  ANALYTICS_TRACK_TYPE,
  ANALYTICS_TRACK_CATEGORY,
} from "../../../constants/segment";
const HomePageCoachMarks = () => {
  const customerInfo = useSelector((state) => state.customerInfo);

  const { memberId } = useSelector((state) => state.customerInfo.data);
  const { drawerOpen, setDrawerOpen } = useAppContext();
  const {
    run,
    setRun,
    isEnd,
    setIsEnd,
    isStart,
    setIsStart,
    currentStep,
    setCurrentStep,
    hasPassedTour,
    setHasPassedTour,
    steps,
    setSteps,
    screenWidth,
    setScreenWidth,
    menuIsOpen,
    setMenuIsOpen,
  } = useCoachMarksContext();
  const [latestExistedStep, setLatestExistedStep] = useState(null);
  const firstName = customerInfo?.data?.hohPlans[0]
    ? customerInfo.data.hohPlans[0].FirstName
    : customerInfo?.data?.firstName;
  // check if tour was already taken by the user
  useEffect(() => {
    if (memberId) {
      const hasPassedTourList = getPassedUsers();
      if (hasPassedTourList.includes(memberId)) {
        setHasPassedTour(true);
      } else {
        setHasPassedTour(false);
      }
    }
  }, [memberId]);

  useEffect(() => {
    if (steps.type === MOBILE) {
      if (currentStep === 0) return;
      setDrawerOpen(menuIsOpen);
    }
  }, [menuIsOpen]);

  // set steps depending on screen width
  useEffect(() => {
    const screenWidth = window.innerWidth;
    setScreenWidth(window.innerWidth);
    if (screenWidth <= WIDTH_TABLET) {
      setSteps({ type: MOBILE, list: mobileStepsState });
    } else {
      setSteps({ type: DESKTOP, list: desktopStepsState });
    }
  }, []);

  // handle resize
  useEffect(() => {
    function handleResize() {
      // reset tour states on resize
      setRun(false);
      setIsStart(true);
      setIsEnd(false);
      setCurrentStep(0);
      setLatestExistedStep(null);
      if (steps.type === MOBILE) {
        setMenuIsOpen(false);
        if (drawerOpen) setDrawerOpen(false);
      }
      // handle resize
      const screenWidth = window.innerWidth;
      setScreenWidth(window.innerWidth);
      if (screenWidth <= WIDTH_TABLET) {
        setSteps({ type: MOBILE, list: mobileStepsState });
      } else {
        setSteps({ type: DESKTOP, list: desktopStepsState });
      }
    }

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  });

  const handleJoyrideCallback = (data) => {
    const { action, index, status, type, lifecycle, step } = data;

    const scrollToTop = () => {
      document.body.scrollTop = document.documentElement.scrollTop = 0;
    };
    // scroll to top to position the tooltip correctly
    scrollToTop();

    if (
      lifecycle === LIFECYCLE.COMPLETE &&
      action === ACTIONS.PREV &&
      index === 0
    ) {
      setIsStart(true);
      return setRun(false);
    }

    if (action === ACTIONS.CLOSE) {
      return handleEndTour();
    }

    if (status === STATUS.FINISHED) {
      setRun(false);
      setIsEnd(true);
      return;
    }

    if (lifecycle === LIFECYCLE.TOOLTIP) {
      setLatestExistedStep(index);
    }

    if (
      lifecycle === LIFECYCLE.READY &&
      (action === ACTIONS.NEXT || action === ACTIONS.PREV)
    ) {
      if (steps.type === MOBILE && index === 0 && action === ACTIONS.PREV) {
        setMenuIsOpen(false);
        setDrawerOpen(false);
        setRun(false);
        setCurrentStep(0);
        setLatestExistedStep(0);
        setIsStart(true);
      }

      if (index !== 1) {
        if (step.hideMobileMenu === true && menuIsOpen) {
          setMenuIsOpen(false);
        }

        if (step.hideMobileMenu === false && !menuIsOpen) {
          setMenuIsOpen(true);
        }
      }
    }

    if ([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND].includes(type)) {
      const stepIndex = index + (action === ACTIONS.PREV ? -1 : 1);
      if (action === ACTIONS.PREV) {
        if (
          steps.type === MOBILE &&
          !steps.list[stepIndex].hideMobileMenu &&
          !menuIsOpen &&
          stepIndex !== 0
        ) {
          setMenuIsOpen(true);
          setRun(false);
          setTimeout(() => {
            setRun(true);
          }, 400);
        }
      }
      if (
        steps.type === MOBILE &&
        action === ACTIONS.NEXT &&
        steps.list[stepIndex]?.delayed
      ) {
        if (steps.list[stepIndex]?.hideMobileMenu) setMenuIsOpen(false);
        if (EVENTS.TARGET_NOT_FOUND !== type) {
          setRun(false);
          setTimeout(() => {
            setRun(true);
          }, 400);
        }
      }
      setCurrentStep(stepIndex);
      setIsStart(false);
    } else if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setRun(false);
    }
  };

  const handleStart = () => {
    setIsStart(false);
    setRun(true);
    setLatestExistedStep(null);
  };

  const handleGoBack = () => {
    setCurrentStep(latestExistedStep);
    setIsEnd(false);
    setRun(true);
  };

  const savePassedUsers = (list) => {
    localStorage.setItem(HAS_PASSED_TOUR, JSON.stringify(list));
  };

  const getPassedUsers = () => {
    return localStorage.getItem(HAS_PASSED_TOUR)
      ? JSON.parse(localStorage.getItem(HAS_PASSED_TOUR))
      : [];
  };

  const handleEndTour = () => {
    const usersPassedList = getPassedUsers();
    if (!usersPassedList.includes(memberId)) {
      usersPassedList.push(memberId);
      savePassedUsers(usersPassedList);
    }
    setRun(false);
    setIsEnd(false);
    setHasPassedTour(true);
    setCurrentStep(0);
    setLatestExistedStep(null);
  };

  const handleRetakeTour = () => {
    setHasPassedTour(false);
    setIsStart(true);
    setCurrentStep(0);
    setLatestExistedStep(null);
    handleSegmentBtn();
  };
  const handleSegmentBtn = () => {
    // Segment Track
    AnalyticsTrack("Take Tour Button Clicked", customerInfo, {
      raw_text: "Take Tour Button",
      description: "Take Tour Button",
      destination_url: "N/A",
      category: ANALYTICS_TRACK_CATEGORY.home,
      type: ANALYTICS_TRACK_TYPE.buttonClicked,
      targetMemberId: customerInfo?.data?.memberId,
      // Anyway we can use Theme here?
      location: {
        desktop: {
          width: 1024,
          value: "right bottom",
        },
        tablet: {
          width: 768,
          value: "right bottom",
        },
        mobile: {
          width: 0,
          value: "right bottom",
        },
      },
    });
  };
  return (
    <Wrapper className="homePageCoachMarks">
      {hasPassedTour && (
        <RetakeTourButton handleRetakeTour={handleRetakeTour} />
      )}
      {!hasPassedTour && (
        <div>
          <Joyride
            steps={steps.list}
            tooltipComponent={Tooltip}
            disableScrolling={false}
            showProgress={true}
            continuous={true}
            run={run}
            styles={{
              options: {
                zIndex: 1101,
              },
            }}
            callback={handleJoyrideCallback}
            stepIndex={currentStep}
            disableCloseOnEsc
            disableOverlayClose
          />
          {isStart && firstName && (
            <FirstTimeScreen
              visible={isStart}
              handleStart={handleStart}
              handleEndTour={handleEndTour}
              firstName={firstName}
              steps={steps}
              screenWidth={screenWidth}
            />
          )}
          {isEnd && (
            <EndTourScreen
              goBack={handleGoBack}
              handleEndTour={handleEndTour}
            />
          )}
        </div>
      )}
    </Wrapper>
  );
};

export const Wrapper = styled.div`
  position: relative;
`;

export default HomePageCoachMarks;
