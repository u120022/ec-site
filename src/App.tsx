import { Route, Router, Routes } from "@solidjs/router";
import { Component, lazy } from "solid-js";
import { DataProvider } from "./DataContext";

const Intro = lazy(() => import("./Intro"));
const Home = lazy(() => import("./Home"));

const App: Component = () => {
  return (
    <DataProvider>
      <Router>
        <Routes>
          <Route path="/" component={Intro} />
          <Route path="/home" component={Home} />
        </Routes>
      </Router>
    </DataProvider>
  );
};

export default App;
