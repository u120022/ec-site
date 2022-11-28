import { Component, createSignal, For } from "solid-js";
import { ProductModel, useData } from "./DataContext";

const ProductCard: Component<{ product: ProductModel }> = (props) => {
	const data = useData();

	const [text, setText] = createSignal("");

	const post = () => {
		data.postComment(props.product, text());
		setText("");
	}

	const submit = () => {
		data.pushToCart(props.product, 1);
	};

	const commentList = () => {
		return data.getComment(props.product);
	}

	return (
		<div class="border border-black m-3 p-3">
			<div>商品名: {props.product.name}</div>
			<div>説明: {props.product.desc}</div>
			<div>値段: {props.product.value}</div>
			<div>個数: {props.product.count}</div>

			<ul>
				<For each={commentList()}>
					{x => <li>{x.content}</li>}
				</For>
			</ul>
			<div>
				<input class="border border-black" type="text" value={text()} onInput={e => setText(e.currentTarget.value)} />
				<button onClick={post} class="font-bold">投稿</button>
			</div>

			<button onClick={submit} class="text-blue-600">カートに入れる</button>
		</div>
	);
};

const ProductList: Component = () => {
	const data = useData();

	return (
		<div>
			<div class="font-bold">商品一覧</div>
			<ul>
				<For each={data.productList()}>{(x) => <ProductCard product={x} />}</For>
			</ul>
		</div>
	);
};

export default ProductList;
