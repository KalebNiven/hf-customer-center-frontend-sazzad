import React, { useEffect } from "react";
import styled from "styled-components";
import ReactDOM from "react-dom";
import { SHOW_MORE_TOOLS } from "./constants/splits";
import { FeatureTreatment } from "./libs/featureFlags";
import store from "./store/store";
import { Provider, useSelector, useDispatch } from "react-redux";
import { requestCustomerInfo } from "./store/actions";
import { getSplitAttributes } from "./utils/misc";

const MoreTools = () => {
  const { MIX_REACT_OKTA_HEALTHX_SAML_LINK } = process.env;
  const dispatch = useDispatch();
  const customerInfo = useSelector((state) => state.customerInfo);

  useEffect(() => {
    dispatch(requestCustomerInfo());
  }, []);

  const splitAttributes = getSplitAttributes(customerInfo?.data);

  const MoreToolsWrapper = styled.div`
    box-shadow: 0 2px 8px 0 #d8d8d8;
    border: none;
    width: 100%;
    border-radius: 4px;
    margin-bottom: 1.5rem;
  `;

  const ButtonIcon = styled.a`
    box-sizing: border-box;
    display: inline-block;
    color: #ffffff;
    font-size: 14px;
    font-weight: bold;
    letter-spacing: -0.08px;
    line-height: 28px;
    text-align: center;
    border-radius: 4px;
    border-color: #3e7128;
    background-color: #3e7128;
    box-shadow: inset 0 -2px 0 0 #30591e;
    padding: 4px 32px;
    -webkit-appearance: none !important;
    &:hover {
      cursor: pointer;
      color: #fff;
      text-decoration: none;
      background-color: #1e5b0f;
    }
  `;
  const Card = styled.div`
    padding: 24px 16px;
    border-radius: 4px;
    box-shadow: 0 2px 8px 0 var(--lighter-grey);
    background-color: var(--white);
  `;
  const Message = styled.p`
    font-family: "museo-sans", sans-serif !important;
    font-weight: 500;
    color: #474b55;
    font-size: 14px;
    letter-spacing: 0;
    line-height: 16px;
    margin-bottom: 1.5rem !important;
  `;

  return (
    <FeatureTreatment
      treatmentName={SHOW_MORE_TOOLS}
      onLoad={() => {}}
      onTimedout={() => {}}
      attributes={splitAttributes}
    >
      <MoreToolsWrapper>
        <Card>
          <Message>
            Click <b>More Tools</b> if you need to submit a general question or
            form.
          </Message>
          <ButtonIcon
            src="/react/images/buttons-medium-primary-green.svg"
            href={MIX_REACT_OKTA_HEALTHX_SAML_LINK}
            target="_blank"
            segment-track="External Service Launched"
            segment-props={JSON.stringify({
              service_name: "healthX",
              raw_text: "More Tools",
              destination_url: MIX_REACT_OKTA_HEALTHX_SAML_LINK,
            })}
          >
            More Tools
          </ButtonIcon>
        </Card>
      </MoreToolsWrapper>
    </FeatureTreatment>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <MoreTools />
    </Provider>
  </React.StrictMode>,
  document.getElementById("moreTools")
);

export default ReactDOM.render;
