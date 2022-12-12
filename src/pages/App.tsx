import { Route, Routes } from "@solidjs/router";
import { Component, lazy } from "solid-js";
import RegisterSuccessful from "./RegisterSuccessful";
import { TokenProvider } from "./TokenContext";

const About = lazy(() => import("./About"));
const Login = lazy(() => import("./Login"));
const Register = lazy(() => import("./Register"));
const Frame = lazy(() => import("./Frame"));
const Overview = lazy(() => import("./Overview"));
const ProductList = lazy(() => import("./ProductList"));
const Product = lazy(() => import("./Product"));
const BookmarkList = lazy(() => import("./BookmarkList"));
const CartItemList = lazy(() => import("./CartItemList"));
const Purchase = lazy(() => import("./Purchase"));
const ReceiptList = lazy(() => import("./ReceiptList"));
const Personal = lazy(() => import("./Personal"));
const User = lazy(() => import("./User"));
const UserModify = lazy(() => import("./UserModify"));
const AddressList = lazy(() => import("./AddressList"));
const PaymentList = lazy(() => import("./PaymentList"));
const SessionList = lazy(() => import("./SessionList"));

const App: Component = () => {
  return (
    <TokenProvider>
      <Routes>
        <Route path="/" component={About} />
        <Route path="/ec-site">
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/register_successful" component={RegisterSuccessful} />
          <Route path="/" component={Frame}>
            <Route path="/" component={Overview} />
            <Route path="/products" component={ProductList} />
            <Route path="/products/:product_id" component={Product} />
            <Route path="/bookmarks" component={BookmarkList} />
            <Route path="/cart" component={CartItemList} />
            <Route path="/purchase" component={Purchase} />
            <Route path="/receipts" component={ReceiptList} />
            <Route path="/personal" component={Personal}>
              <Route path={["/", "/user"]} component={User} />
              <Route path="/user_modify" component={UserModify} />
              <Route path="/addresses" component={AddressList} />
              <Route path="/payments" component={PaymentList} />
              <Route path="/sessions" component={SessionList} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </TokenProvider>
  );
};

export default App;
