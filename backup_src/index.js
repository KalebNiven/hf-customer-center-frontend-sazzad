import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "./MuiOverride.css";
import App from "./App"; 
import { BrowserRouter } from "react-router-dom";

const targetElement = document.getElementById("ReactAppWrapper-wide") || document.getElementById("navbarHolder")  || document.createElement("div");

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter >
      <App />
    </BrowserRouter>
  </React.StrictMode>, targetElement
);

export default ReactDOM.render;
