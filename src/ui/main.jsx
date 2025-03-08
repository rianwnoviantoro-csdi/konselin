import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "@radix-ui/themes/styles.css";
import App from "./App.jsx";
import { Route, HashRouter as Router, Routes } from "react-router-dom";
import { store } from "./redux/store.jsx";
import { Provider } from "react-redux";
import { Theme } from "@radix-ui/themes";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Theme>
      <Provider store={store}>
        <Router>
          <Routes>
            <Route path="/*" element={<App />} />
          </Routes>
        </Router>
      </Provider>
    </Theme>
  </StrictMode>
);
