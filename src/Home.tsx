import { Component } from "solid-js";
import CartItemList from "./CartItem";
import ProductList from "./Product";
import TransactionList from "./Transaction";

const Home: Component = () => {
	return (
		<div class="flex gap-3">
			<ProductList />
			<CartItemList />
			<TransactionList />
		</div>
	);
};

export default Home;
