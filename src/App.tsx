import { Route, Router, Routes } from "@solidjs/router";
import { Component, lazy } from "solid-js";
import { ServiceProvider } from "./ServiceContext";

const Intro = lazy(() => import("./pages/Intro"));
const Home = lazy(() => import("./pages/Home"));

const App: Component = () => {
  return (
    <ServiceProvider>
      <Router>
        <Routes>
          <Route path="/" component={Intro} />
          <Route path="/home" component={Home} />
        </Routes>
      </Router>
    </ServiceProvider>
  );
};

export default App;
