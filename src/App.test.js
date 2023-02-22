import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from "react-router-dom";
import App from './App';

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: () => ({
    pathname: "localhost:3000/healthfirst"
  })
}));

describe("Render app", () => {

  test('renders react customer front end app', async () => {
    const renderComponent = await waitFor(async () => render(
      <BrowserRouter >
        <App />
      </BrowserRouter >
    ));
    const { findByText, getByTestId } = renderComponent;
    let linkElement = await findByText(/Login/i);
    expect(linkElement).toBeInTheDocument();
  });
})

