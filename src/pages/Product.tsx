import { Accessor, Component, createSignal, Index } from "solid-js";
import { useService } from "../ServiceContext";
import { ProductModel } from "../Models";

const ProductCard: Component<{ product: Accessor<ProductModel> }> = (props) => {
	const service = useService();
	const comments = service.getComments(props.product().id, 20);

	const [text, setText] = createSignal("");

	const createComment = async () => {
		await service.createComment(props.product().id, text());

		setText("");
	};

	const deleteComment = async (id: number) => {
		await service.deleteComment(id)
	}

	const pushToCart = async () => {
		await service.pushToCart(props.product().id, 1);
	};

	return (
		<div class="m-3 border border-black p-3">
			<div>商品名: {props.product().name}</div>
			<div>説明: {props.product().desc}</div>
			<div>値段: {props.product().value}</div>
			<div>個数: {props.product().count}</div>

			<ul>
				<Index each={comments}>
					{(x) =>
						<li>{x().body}<button onClick={_ => deleteComment(x().id)}>削除</button></li>
					}
				</Index>
			</ul>
			<div>
				<input
					class="border border-black"
					type="text"
					value={text()}
					onInput={(e) => setText(e.currentTarget.value)}
				/>
				<button onClick={_ => createComment()} class="font-bold">
					投稿
				</button>
			</div>

			<button onClick={_ => pushToCart()} class="text-blue-600">
				カートに入れる
			</button>
		</div>
	);
};

const ProductList: Component = () => {
	const service = useService();
	const products = service.getProucts(20);

	return (
		<div>
			<div class="font-bold">商品一覧</div>
			<ul>
				<Index each={products}>{(x) => <ProductCard product={x} />}</Index>
			</ul>
		</div>
	);
};

export default ProductList;
