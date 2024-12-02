import React from "react";
import ReactDOM from "react-dom/client";
// import "./index.css";
import App from "./App";
// import { ThemeProvider } from "@emotion/react";
// import theme from "./configs/theme";
import store from "./store";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
console.log(process.env.NODE_ENV);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter basename="/superadmin">
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
