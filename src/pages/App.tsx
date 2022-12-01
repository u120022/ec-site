import { Route, Routes } from "@solidjs/router";
import { Component, lazy } from "solid-js";

const About = lazy(() => import("./About"));
const Frame = lazy(() => import("./Frame"));
const ProductList = lazy(() => import("./ProductList"));
const Product = lazy(() => import("./Product"));
const Cart = lazy(() => import("./Cart"));
const ReceiptList = lazy(() => import("./ReceiptList"));

const App: Component = () => {
  return (
    <Routes>
      <Route path="/about" component={About} />
      <Route path="/" component={Frame}>
        <Route path={["/", "/products"]} component={ProductList} />
        <Route path="/products/:id" component={Product} />
        <Route path="/cart" component={Cart} />
        <Route path="/receipts" component={ReceiptList} />
      </Route>
    </Routes>
  );
};

export default App;
