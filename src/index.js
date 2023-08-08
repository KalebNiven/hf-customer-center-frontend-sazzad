import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "./MuiOverride.css";
import App from "./App"; 
import { BrowserRouter } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import UnrecoverableErrorApp from './components/errors/UnrecoverableErrorApp'
import { deleteAllCookies } from './utils/cookies'

const targetElement = document.getElementById("ReactAppWrapper-wide") || document.getElementById("navbarHolder")  || document.createElement("div");

const resetApp = () => {
  localStorage.clear(); // delete localStorage
  deleteAllCookies(); // delete cookies
  window.location.reload(); // refresh page
}

ReactDOM.render(
  <React.StrictMode>
    <ErrorBoundary FallbackComponent={UnrecoverableErrorApp} onReset={resetApp}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>, targetElement
);

export default ReactDOM.render;
