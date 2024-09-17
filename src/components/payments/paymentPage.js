import React, {
  useEffect,
  useState,
  useMemo,
  useCallback,
  useContext,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { SplitContext } from "@splitsoftware/splitio-react";
import { requestSelectPlan } from "../../store/actions";
import { usePaymentsModalContext } from "../../context/paymentsModalContext";
import * as splits from "../../constants/splits";
import {
  getSplitpAttributes,
  handleSegmentBtn,
  getEnabledAccountsAndTreatments,
  accountTreatmentsInit,
} from "./paymentPage.utils";
import GlobalError from "../common/globalErrors/globalErrors";
import Spinner from "../common/spinner";
import BinderPortal from "./binderPortal";
import PaymentPortal from "./paymentPortal";
import GlobalStyle from "../../styles/GlobalStyle";
import {
  PaymentPortalWrapper,
  Banner,
  BrandingContainer,
  BrandingInnerContainer,
  BrandingLeftContainer,
  LeafIcon,
  Div,
  BrandingTitle,
  BrandingRightContainer,
  Container,
  ProgressWrapper,
  PaymentTypeTxt,
  InnerContainer,
  LeftContainer,
  Card,
  Heading,
  Description,
  PaymentButton,
  RightContainer,
  FirstPaymentButton,
} from "./paymentPage.styles";
import styled from "styled-components";

const { MIX_REACT_APP_BINDER_SITE_HREF } = process.env;
const { MIX_REACT_APP_PAYMENT_SITE_HREF } = process.env;

function PaymentPage() {
  const [accountIds, setAccountIds] = useState([]); // Array of MembershipKey or memberId
  const [treatments, setTreatments] = useState([]); // Array of accountTreatments
  const [isLoading, setIsLoading] = useState(true);

  const [showBinderPortal, setShowBinderPortal] = useState(false);
  const [showPaymentPortal, setShowPaymentPortal] = useState(false);

  const dispatch = useDispatch();
  const splitHookContext = useContext(SplitContext);
  const customerInfo = useSelector((state) => state.customerInfo);
  const { paymentsModalState, setPaymentsModalState } =
    usePaymentsModalContext();
  const { accountStatus, memberId, hohPlans } = customerInfo.data ?? "";

  const accountSelectedOnModal = useMemo(
    () => paymentsModalState.membership?.MembershipKey ?? null,
    [paymentsModalState.membership],
  );

  const accountId = useMemo(() => {
    let updatedAccountId = memberId || "NON-MENBER";
    if (accountIds.length > 1 && accountSelectedOnModal)
      updatedAccountId = accountSelectedOnModal;
    if (accountIds.length === 1) updatedAccountId = accountIds[0];
    return updatedAccountId;
  }, [accountIds, accountSelectedOnModal, memberId]);

  const accountTreatments = useMemo(
    () =>
      accountIds.includes(accountId)
        ? treatments[accountIds.indexOf(accountId)]
        : accountTreatmentsInit,
    [treatments, accountId],
  );
  const isBinderEnabled = useMemo(
    () => accountTreatments[splits.BINDER_ACL],
    [accountTreatments],
  );
  const isPaymentsEnabled = useMemo(
    () => accountTreatments[splits.PAYMENTS_ACL],
    [accountTreatments],
  );
  const showGlobalError = useMemo(
    () =>
      !isBinderEnabled &&
      !isPaymentsEnabled &&
      (accountIds.length < 2 || accountSelectedOnModal),
    [isBinderEnabled, isPaymentsEnabled, accountIds, accountSelectedOnModal],
  );

  const onShowPaymentPortal = useCallback(
    (isBtnClick = true) => {
      const isReactAppEnabled =
        accountTreatments[splits.SHOW_PAYMENTS_REACT_APP];
      // analytics
      if (isBtnClick)
        handleSegmentBtn(
          customerInfo,
          "Monthly premium payment",
          !isReactAppEnabled && MIX_REACT_APP_PAYMENT_SITE_HREF,
        );
      // show payments react app
      if (isReactAppEnabled) setShowPaymentPortal(true);
      // or redirect to LAMP
      else window.location.href = MIX_REACT_APP_PAYMENT_SITE_HREF;
    },
    [accountTreatments, customerInfo],
  );

  const onShowBinder = useCallback(
    (isBtnClick = true) => {
      const isReactAppEnabled = accountTreatments[splits.SHOW_BINDER_REACT_APP];
      // analytics
      if (isBtnClick)
        handleSegmentBtn(
          customerInfo,
          "First premium payment",
          !isReactAppEnabled && MIX_REACT_APP_BINDER_SITE_HREF,
        );
      // show binder react app
      if (isReactAppEnabled) setShowBinderPortal(true);
      // or redirect to LAMP
      else window.location.href = MIX_REACT_APP_BINDER_SITE_HREF;
    },
    [accountTreatments, customerInfo],
  );

  // 1. onLoad: get treatment for all accounts -> runs once
  useEffect(() => {
    if (
      accountIds.length > 0 ||
      !isLoading ||
      !splitHookContext.isReady ||
      localStorage.getItem("okta-token-storage") === null
    )
      return;
    sessionStorage.setItem("longLoad", false);
    // get treatments for main account
    const acountSplitAttributes = getSplitpAttributes(
      customerInfo.data,
      accountStatus ?? "",
    );
    const plansAttributes = hohPlans.map((plan) =>
      getSplitpAttributes(plan, accountStatus ?? ""),
    );

    const allAccountsAttributes = [acountSplitAttributes, ...plansAttributes];
    const [updatedAccountIds, updatedTreatments] =
      getEnabledAccountsAndTreatments(
        allAccountsAttributes,
        splitHookContext.client,
      );

    setAccountIds(updatedAccountIds);
    setTreatments(updatedTreatments);
    setIsLoading(false);
  }, [accountIds, isLoading, splitHookContext.isReady, customerInfo]);

  // 2. check if multiple accounts or single account -> runs twice for HoH, once otherwise
  useEffect(() => {
    if (accountIds.length === 0 || accountSelectedOnModal) return;
    if (accountIds.length === 1) dispatch(requestSelectPlan(accountIds[0]));
    if (accountIds.length < 2 || paymentsModalState.showMemberModal) return;

    // open account selection modal
    setPaymentsModalState({
      ...paymentsModalState,
      showMemberModal: true,
      routeLink: "link",
      externalLinkName: "Payments",
    });
    // reset form controls for edge case: displaying modal more than once
    setShowBinderPortal(false);
    setShowPaymentPortal(false);
  }, [accountIds, accountSelectedOnModal, paymentsModalState]);

  // 3. handle ACLs -> runs once
  useEffect(() => {
    if (
      accountIds.length === 0 ||
      (accountIds.length > 1 && !accountSelectedOnModal)
    )
      return;
    if (isBinderEnabled && !isPaymentsEnabled) onShowBinder(false);
    if (!isBinderEnabled && isPaymentsEnabled) onShowPaymentPortal(false);
  }, [accountIds, accountSelectedOnModal, isBinderEnabled, isPaymentsEnabled]);

  if (isLoading) {
    return (
      <Container>
        <ProgressWrapper>
          <Spinner />
        </ProgressWrapper>
      </Container>
    );
  }

  if (showGlobalError) return <GlobalError />;

  if (showBinderPortal) {
    return (
      <PaymentPortalWrapper>
        <BinderPortal />
      </PaymentPortalWrapper>
    );
  }

  if (showPaymentPortal) {
    return (
      <PaymentPortalWrapper>
        <Banner>
          <BrandingContainer>
            <BrandingInnerContainer>
              <BrandingLeftContainer>
                <LeafIcon
                  alt=""
                  type={accountStatus}
                  src="/react/images/leaf-icon@3x.png"
                />
                <Div type={accountStatus}>
                  <BrandingTitle>Payments</BrandingTitle>
                </Div>
              </BrandingLeftContainer>
              <BrandingRightContainer />
            </BrandingInnerContainer>
          </BrandingContainer>
        </Banner>
        <PaymentPortal />
      </PaymentPortalWrapper>
    );
  }

  return (
    <Container>
      <>
        <GlobalStyle />
        <PaymentTypeTxt>
          What type of payment would you like to make?
        </PaymentTypeTxt>
        <InnerContainer>
          <LeftContainer>
            <Card>
              <Heading>Monthly Premium Payment</Heading>
              <Description>
                Make or schedule a one-time payment or set up recurring
                payments.
              </Description>
              <PaymentButton onClick={onShowPaymentPortal}>
                Make a Monthly Premium Payment
              </PaymentButton>
            </Card>
          </LeftContainer>
          <RightContainer>
            <Card>
              <Heading>First Premium Payment for a New Plan</Heading>
              <Description>
                Make your first premium payment to complete enrollment in your
                new plan.*{" "}
              </Description>
              <FirstPaymentButton onClick={onShowBinder}>
                Make a First Premium Payment
              </FirstPaymentButton>
            </Card>
          </RightContainer>
        </InnerContainer>
        <AdditionalInfoText>
          *When you first enroll in a new plan, you make this payment once. Then
          you make monthly premium payments every month to stay enrolled. Please
          note that your first premium payment does not enroll you in recurring
          payments.
        </AdditionalInfoText>
      </>
    </Container>
  );
}

export default PaymentPage;

const AdditionalInfoText = styled.div`
  font-weight: 400;
  font-style: italic;
  color: #474b55;
  line-height: 24px;
  margin: 40px auto 40px auto;
  width: 896px;
  display: flex;
  justify-content: flex-start;
  @media only screen and (max-width: 1024px) {
    width: 100%;
    overflow-wrap: break-word;
  }
`;
