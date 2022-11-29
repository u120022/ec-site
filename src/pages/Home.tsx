import { Component } from "solid-js";
import CartItemList from "./CartItem";
import ProductList from "./Product";
import RecieptList from "./Receipt";

const Home: Component = () => {
  return (
    <div class="flex gap-3">
      <ProductList />
      <CartItemList />
      <RecieptList />
    </div>
  );
};

export default Home;
