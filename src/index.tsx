/* @refresh reload */
import "./index.css";
import { render } from "solid-js/web";

import App from "./pages/App";
import { Router } from "@solidjs/router";

render(
  () => (
    <Router>
      <App />
    </Router>
  ),
  document.getElementById("root") as HTMLElement
);
