import { Route, Routes } from "@solidjs/router";
import { Component, lazy } from "solid-js";
import RegisterSuccessful from "./RegisterSuccessful";

const About = lazy(() => import("./About"));
const Login = lazy(() => import("./Login"));
const Register = lazy(() => import("./Register"));
const Frame = lazy(() => import("./Frame"));
const ProductList = lazy(() => import("./ProductList"));
const Product = lazy(() => import("./Product"));
const Cart = lazy(() => import("./Cart"));
const ReceiptList = lazy(() => import("./ReceiptList"));
const User = lazy(() => import("./User"));

const App: Component = () => {
  return (
    <Routes>
      <Route path="/about" component={About} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/register_successful" component={RegisterSuccessful} />
      <Route path="/" component={Frame}>
        <Route path={["/", "/products"]} component={ProductList} />
        <Route path="/products/:id" component={Product} />
        <Route path="/cart" component={Cart} />
        <Route path="/receipts" component={ReceiptList} />
        <Route path="/user" component={User} />
      </Route>
    </Routes>
  );
};

export default App;
