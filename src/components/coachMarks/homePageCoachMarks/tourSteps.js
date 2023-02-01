export const desktopStepsState = [
    {
      target: '.reactNavMenu-coachmark',
      title: 'View Your Plan Information',
      content: 'Access your Member ID, Benefits, Claims, and Authorizations within My Plan. ',
      isFixed: true,
      disableBeacon: true,
      offset: 0,
      stepType: "desktop",
      spotlightPadding: 0
    },
    {
      target: '.findCareNavItem-coachmark',
      title: 'Find Quality Care',
      content: 'Conveniently find doctors, urgent care centers, pharmacies, and other healthcare providers in our network using our enhanced search tools. ',
      isFixed: true,
      disableBeacon: true,
      offset: -7,
      stepType: "desktop",
      spotlightPadding: -7
    },
    {
      target: '.paymentsNavItem-coachmark',
      title: 'Make Online Payments',
      content: 'Need to make payments? Easily set up automatic payments in our updated payment system.',
      isFixed: true,
      disableBeacon: true,
      offset: -7,
      stepType: "desktop",
      spotlightPadding: -7
    },
    {
      target: '.myHealthNavItem-coachmark',
      title: 'For Your Health',
      content: 'Take your Annual Health Assessment and connect to community resources in your area.',
      isFixed: true,
      disableBeacon: true,
      offset: -7,
      stepType: "desktop",
      spotlightPadding: -7
    },
    {
      target: '.myHealthPlan-coachmark',
      title: 'View Your Member ID Card',
      content: 'Find details about your plan and important contact information.',
      isFixed: true,
      disableBeacon: true,
      offset: 0,
      stepType: "desktop",
      placement: "top",
    },
    {
      target: '.pcp-coachmark',
      title: 'Your Primary Care Provider (PCP)',
      content: 'View or change your PCP.',
      isFixed: true,
      disableBeacon: true,
      offset: 0,
      stepType: "desktop",
      placement: "top"
    },
    {
      target: '.servicesDeck-checkmark',
      title: 'More Access To Care',
      content: 'Explore other health benefits and resources available to you.',
      isFixed: true,
      disableBeacon: true,
      offset: 0,
      stepType: "desktop"
    }
  ]

  export const mobileStepsState = [
    {
      target: '.navbar-hamburger-coachmarks',
      title: 'Menu',
      content: 'Open this menu to navigate to other features. Tap the Menu icon to continue.',
      disableBeacon: true,
      placementBeacon: "bottom",
      spotlightClicks: true,
      hideControlls: true,
      hideMobileMenu: false,
      spotlightPadding: -3,
      offset: -3,
      spotlightClicks: true,
      floaterProps: {
        styles: {
          arrow: {
            margin: "0 10px 0 0"
          }
        }
      }
    },
    {
      target: '.myPlanMobileNav-coachmark',
      title: 'View Your Plan Information',
      content: 'Access your Member ID, Benefits, Claims, and Authorizations within My Plan.',
      isFixed: true,
      disableBeacon: true,
      offset: 0,
      hideMobileMenu: false,
      spotlightClicks: false,
      spotlightPadding: -1
    },
    {
      target: '.findCareMobileNav-coachmark',
      title: 'Find Quality Care',
      content: 'Conveniently find doctors, urgent care centers, pharmacies, and other healthcare providers in our network using our enhanced search tools.',
      isFixed: true,
      disableBeacon: true,
      offset: 0,
      hideMobileMenu: false,
      spotlightClicks: false,
      spotlightPadding: -1
    },
    {
      target: '.paymentsMobileNav-coachmark',
      title: 'Make Online Payments',
      content: 'Need to make payments? Easily set up automatic payments in our updated payment system.',
      isFixed: true,
      disableBeacon: true,
      offset: 0,
      hideMobileMenu: false,
      spotlightClicks: false,
      spotlightPadding: -1
    },
    {
      target: '.myHealthMobileNav-coachmark',
      title: 'For Your Health',
      content: 'Take your Annual Health Assessment and connect to community resources in your area.',
      isFixed: true,
      disableBeacon: true,
      offset: 0,
      hideMobileMenu: false,
      spotlightClicks: false,
      spotlightPadding: -1
    },
    {
      target: '.myHealthPlan-coachmark',
      title: 'View Your Member ID Card',
      content: 'Find details about your plan and important contact information.',
      isFixed: true,
      disableBeacon: true,
      offset: 0,
      hideMobileMenu: true,
      spotlightClicks: false,
      placement: "top",
      delayed: true,
      disableScrolling: true
    },
    {
      target: '.pcp-coachmark',
      title: 'Your Primary Care Provider (PCP)',
      content: 'View or change your PCP.',
      isFixed: true,
      disableBeacon: true,
      offset: 0,
      hideMobileMenu: true,
      spotlightClicks: false,
      placement: "top"
    },
    {
      target: '.servicesDeck-checkmark',
      title: 'More Access To Care',
      content: 'Explore other health benefits and resources available to you.',
      isFixed: true,
      disableBeacon: true,
      offset: 0,
      hideMobileMenu: true,
      spotlightClicks: false,
      placement: "top"
    }
  ]