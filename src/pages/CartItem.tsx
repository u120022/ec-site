import { Accessor, Component, Index, Show } from "solid-js";
import { CartItemModel } from "../Models";
import { useService } from "../ServiceContext";

const CartItemCard: Component<{ cartItem: Accessor<CartItemModel> }> = props => {
	const service = useService();
	const product = service.getProduct(props.cartItem().productId);

	const popFromCart = async () => {
		await service.popFromCart(props.cartItem().productId, 1);
	};

	const popFromCartAll = async () => {
		await service.popFromCart(props.cartItem().productId, props.cartItem().count);
	};

	return (
		<div class="m-3 border border-black p-3">
			<Show when={product()}>
				<div>商品名: {product().name}</div>
			</Show>
			<div>個数: {props.cartItem().count}</div>
			<button onClick={popFromCart} class="text-rose-600">1つ削除</button>
			<button onClick={popFromCartAll} class="text-rose-600">すべて削除</button>
		</div>
	);
}

const CartItemList: Component = () => {
	const service = useService();
	const cartItems = service.getCartItems(20);

	const purchase = async () => {
		await service.purchaseCartItem();
	};

	return (
		<div>
			<div class="font-bold">カート内のアイテム</div>
			<ul>
				<Index each={cartItems}>
					{x => <li><CartItemCard cartItem={x} /></li>}
				</Index>
			</ul>
			<button onClick={purchase} class="font-bold text-blue-600">
				購入
			</button>
		</div>
	);
};

export default CartItemList;
