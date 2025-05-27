import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "styled-components";
import GlobalStyle from "./styles/GlobalStyle";
import theme from "./styles/theme";
import Router from "./Router";
import "./index.css";
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  // <React.StrictMode>
  <ThemeProvider theme={theme}>
    <GlobalStyle />
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  </ThemeProvider>,
  // </React.StrictMode>,
);
