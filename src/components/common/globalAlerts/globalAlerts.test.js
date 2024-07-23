import React from "react";
import { Provider } from "react-redux";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { AppContextProvider } from "../../../AppContext";
import GlobalAlerts from "../globalAlerts";
import ExternalSiteModal from "../externalSiteModal";
import "jest-styled-components";
import "@testing-library/jest-dom";
import createMockReduxStore from "../../../test-resources/createMockReduxStore";

describe("Global Alerts", () => {
  let alertsList;
  let store;

  beforeEach(() => {
    store = createMockReduxStore();
    alertsList = [
      {
        id: 1,
        alert_type: "danger",
        published_at: "2022-04-11T17:19:05.000Z",
        created_at: "2022-04-11T10:19:03.000Z",
        updated_at: "2024-07-22T16:20:37.000Z",
        alert_data: {
          id: 1,
          alert_message: "This is a danger message",
          auth_status: null,
          show_alert_icon: false,
          show_alert_close_button: true,
          alert_links: [
            {
              id: 1,
              link_text: "Link",
              link_url: "/claims",
              link_type: "internal",
            },
          ],
        },
      },
      {
        id: 2,
        alert_type: "info",
        published_at: "2024-07-19T13:51:23.000Z",
        created_at: "2024-07-19T13:51:12.000Z",
        updated_at: "2024-07-22T16:21:59.000Z",
        alert_data: {
          id: 5,
          alert_message: "I am an info message.",
          auth_status: "any",
          show_alert_icon: true,
          show_alert_close_button: false,
          alert_links: [
            {
              id: 8,
              link_text: "Click Me",
              link_url: "https://www.google.com",
              link_type: "external",
            },
          ],
        },
      },
    ];
  });

  it("shows the alert message with different configuration", () => {
    render(
      <AppContextProvider>
        <GlobalAlerts alertsList={alertsList} ignoreSplit={true} />
      </AppContextProvider>,
    );
    expect(screen.getByText("This is a danger message")).toBeInTheDocument();
    expect(screen.getByText("Link")).toBeInTheDocument();
    // Icon not shown as show_alert_icon is false
    expect(screen.queryByAltText("banner-icon-1")).not.toBeInTheDocument();
    // Close Icon shown as show_alert_close_button is true
    expect(screen.queryByAltText("banner-close-icon-1")).toBeInTheDocument();

    expect(screen.getByText("I am an info message.")).toBeInTheDocument();
    expect(screen.getByText("Click Me")).toBeInTheDocument();
    // Icon is shown as show_alert_icon is true
    expect(screen.queryByAltText("banner-icon-2")).toBeInTheDocument();
    // Close Icon is not shown as show_alert_close_button is false
    expect(
      screen.queryByAltText("banner-close-icon-2"),
    ).not.toBeInTheDocument();
  });

  it("shows the ExternalLink Modal when an external link is clicked", async () => {
    render(
      <AppContextProvider>
        <GlobalAlerts alertsList={alertsList} ignoreSplit={true} />
        <Provider store={store}>
          <ExternalSiteModal />
        </Provider>
      </AppContextProvider>,
    );
    // Click Me redirects to an external link
    expect(screen.getByText("Click Me")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Click Me"));
    await waitFor(() => {
      expect(
        screen.getByText("You are now navigating away from Healthfirst"),
      ).toBeInTheDocument();
    });
  });

  it("clicking on close button closes the banner", async () => {
    render(
      <AppContextProvider>
        <GlobalAlerts alertsList={alertsList} ignoreSplit={true} />
      </AppContextProvider>,
    );
    // 1st banner is shown
    expect(screen.getByText("This is a danger message")).toBeInTheDocument();
    const closeBtn = screen.queryByAltText("banner-close-icon-1");
    expect(closeBtn).toBeInTheDocument();

    // close button clicked
    fireEvent.click(closeBtn);

    await waitFor(() => {
      // 1st banner is not shown anymore
      expect(
        screen.queryByText("This is a danger message"),
      ).not.toBeInTheDocument();
    });
  });
});
