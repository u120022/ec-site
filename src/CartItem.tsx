import { Component, For } from "solid-js";
import { CartItemModel, useData } from "./DataContext";

const CartItemCard: Component<{ cartItem: CartItemModel }> = (props) => {
	const data = useData();

	const submit_0 = () => {
		data.popFromCart(props.cartItem.product, 1);
	};

	const submit_1 = () => {
		data.popFromCart(props.cartItem.product, props.cartItem.count);
	};

	return (
		<div class="border border-black p-3 m-3">
			<div>{props.cartItem.product.name}</div>
			<div>{props.cartItem.count}</div>
			<div>
				<button onClick={submit_0} class="text-rose-600">1つ削除</button>
			</div>
			<div>
				<button onClick={submit_1} class="text-rose-600">すべて削除</button>
			</div>
		</div>
	);
};

const CartItemList: Component = () => {
	const data = useData();

	const submit = () => {
		data.buyAllCartItem();
	};

	return (
		<div>
			<div class="font-bold">カート内のアイテム</div>
			<For each={data.cartItemList()}>
				{(x) => <CartItemCard cartItem={x} />}
			</For>
			<button onClick={submit} class="font-bold text-blue-600">購入</button>
		</div>
	);
};

export default CartItemList;
