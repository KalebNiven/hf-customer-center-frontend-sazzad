import "jest-styled-components";
import "@testing-library/jest-dom";

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";

import { AppContextProvider } from "../../AppContext";
import createMockReduxStore from "../../test-resources/createMockReduxStore";
import DigitalForm, { DIGITAL_FORM_WIDGET_SCRIPT_ID } from "./digitalForm";

describe("Digital form widget", () => {
  let store;

  beforeEach(() => {
    store = createMockReduxStore();
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: jest.fn().mockImplementation(() =>
          JSON.stringify({
            idToken: { idToken: "mock_id_token" },
            accessToken: { accessToken: "mock_access_token" },
          }),
        ),
      },
    });
  });

  it("renders correctly", () => {
    const { asFragment } = render(
      <AppContextProvider>
        <Provider store={store}>
          <DigitalForm />
        </Provider>
      </AppContextProvider>,
    );

    expect(asFragment()).toMatchSnapshot();
  });

  describe("Widget loading", () => {
    const mockPush = jest.fn();
    const mockIsMounted = jest.fn();
    const mockMount = jest.fn();
    const store = createMockReduxStore();

    const renderedDom = (
      <AppContextProvider>
        <Provider store={store}>
          <Router
            history={{
              push: mockPush,
              listen(listener) {},
              location: { pathname: "/otc-widget" },
            }}
          >
            <DigitalForm ignoreSplit={true} />
          </Router>
        </Provider>
      </AppContextProvider>
    );

    beforeEach(() => {
      Object.defineProperty(window, "localStorage", {
        value: {
          getItem: jest.fn().mockImplementation(() =>
            JSON.stringify({
              idToken: { idToken: "mock_id_token" },
              accessToken: { accessToken: "mock_access_token" },
            }),
          ),
        },
      });

      window.digitalFormsWidget = {
        isMounted: mockIsMounted,
        mount: mockMount,
      };
    });

    it("Loads script correctly", async () => {
      render(renderedDom);

      await waitFor(() => {
        // find loaded script
        expect(
          screen.getByTestId(DIGITAL_FORM_WIDGET_SCRIPT_ID),
        ).toBeInTheDocument();

        // should check ismounted and call mount function
        expect(mockIsMounted).toHaveBeenCalled();
        expect(mockMount).toHaveBeenCalled();
      });
    });
  });
});
