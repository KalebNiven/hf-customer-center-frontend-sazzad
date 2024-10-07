import "jest-styled-components";
import "@testing-library/jest-dom";

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";

import { AppContextProvider } from "../../../AppContext";
import PCPMiniWidget, { PCP_MINI_WIDGET_SCRIPT_ID } from "./pcpMiniWidget";
import createMockReduxStore from "../../../test-resources/createMockReduxStore";

describe("PCP mini widget", () => {
  let store;

  beforeEach(() => {
    store = createMockReduxStore();
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: jest.fn().mockImplementation(() =>
          JSON.stringify({
            idToken: { idToken: "mock_id_token" },
          }),
        ),
      },
    });
  });

  it("renders correctly", () => {
    const { asFragment } = render(
      <AppContextProvider>
        <Provider store={store}>
          <PCPMiniWidget ignoreSplit={true} />
        </Provider>
      </AppContextProvider>,
    );

    expect(asFragment()).toMatchSnapshot();
  });

  describe("Widget loading", () => {
    const mockPush = jest.fn();
    const store = createMockReduxStore();

    const renderedDom = (
      <AppContextProvider>
        <Provider store={store}>
          <Router
            history={{
              push: mockPush,
              listen(listener) {},
              location: { pathname: "/pcp-mini-widget" },
            }}
          >
            <PCPMiniWidget ignoreSplit={true} />
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
            }),
          ),
        },
      });
    });

    it("Loads script correctly", async () => {
      render(renderedDom);

      await waitFor(() => {
        // find loaded script
        expect(
          screen.getByTestId(PCP_MINI_WIDGET_SCRIPT_ID),
        ).toBeInTheDocument();
      });
    });
  });
});
