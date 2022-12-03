import { useParams } from "@solidjs/router";
import { Component, createResource, createSignal, Index, Show } from "solid-js";
import { service } from "../Service";
import PagenateBar from "./PagenateBar";

// 商品の詳細を表示
const Product: Component = () => {
	const params = useParams();
	const id = () => parseInt(params.id);

	// 商品の情報を取得
	// idが変更されると更新
	const [product] = createResource(
		id,
		async (id) => service.getProduct(id)
	);

	// カート内商品の情報を取得
	const [cartItem, { refetch }] = createResource(
		id,
		async (id) => service.getCartItem(id)
	);

	// 商品を1つだけカートに入れる
	const pushToCart = async () => {
		await service.pushToCart(id(), 1);
		await refetch();
	};

	return (
		<div class="space-y-6">
			<Show when={product()}>
				<div class="flex gap-6">
					<img
						src={product().pic}
						class="aspect-[3/4] basis-1/2 bg-slate-100"
						alt="product picture"
					/>

					<div class="basis-1/2 flex flex-col gap-3">
						<div class="text-4xl font-bold">{product().name}</div>
						<div class="text-2xl text-rose-600">
							&yen {product().value.toLocaleString()}
						</div>
						<div>在庫数: {product().count.toLocaleString()}</div>

						<div class="border-b border-slate-300"></div>

						<div class="text-xl">{product().desc}</div>

						<div class="flex-grow"></div>

						<div class="mx-auto space-x-3">
							<button
								class="rounded bg-blue-600 p-3 text-white"
								onClick={pushToCart}
							>
								カートに入れる
							</button>

							<Show when={cartItem()}>
								<span class="p-3">
									カート内に{cartItem().count.toLocaleString()}個
								</span>
							</Show>
						</div>
					</div>
				</div>

				<ReviewList productId={() => product().id} />
			</Show>
		</div>
	);
};

// 1ページに表示するコメントの数
const COUNT_PER_PAGE = 10;

// 1種類の商品のレビュー一覧をリスト表示
const ReviewList: Component<{
	productId: () => number;
}> = (props) => {
	// ページの状態を保持
	const [page, setPage] = createSignal(0);

	// レビュー一覧を取得
	// productIdかpageが変更されると更新
	const [comments, { refetch: refetchComments }] = createResource(
		() => ({ id: props.productId(), page: page() }),
		async ({ id, page }) => await service.getComments(id, page, COUNT_PER_PAGE)
	);

	// ページ数を計算
	// productIdが変更されると更新
	const [count, { refetch: refetchCount }] = createResource(
		props.productId,
		async (id) => await service.getCommentCount(id)
	);
	const maxPageCount = () => Math.ceil(count() / COUNT_PER_PAGE);

	// コメント投稿フォーム
	const [text, setText] = createSignal("");
	const createComment = async () => {
		await service.createComment(props.productId(), text());
		await refetchComments();
		await refetchCount();
		setText("");
	};

	return (
		<div class="space-y-3">
			<div class="text-2xl font-bold">レビュー</div>

			<Show
				when={0 < count()}
				fallback={
					<div class="text-slate-600">この商品にレビューはありません。</div>
				}
			>
				<ul class="space-y-3">
					<Index each={comments()}>
						{(x) => (
							<li>
								{x().body} ({x().date.toLocaleString()})
							</li>
						)}
					</Index>
				</ul>
			</Show>

			<div class="rounded border border-slate-300 p-3 space-y-3">
				<div class="">レビューを投稿する</div>

				<textarea
					rows={8}
					placeholder="テキストを入力。"
					class="w-full resize-none rounded border border-slate-300 p-2"
					value={text()}
					onInput={(e) => setText(e.currentTarget.value)}
				/>

				<button
					class="rounded bg-blue-600 p-3 py-2 text-white"
					onClick={createComment}
				>
					投稿
				</button>
			</div>

			<Show when={1 < maxPageCount()}>
				<div class="p-3 text-center">
					<PagenateBar
						page={page}
						setPage={setPage}
						maxPageCount={maxPageCount}
					/>
				</div>
			</Show>
		</div>
	);
};

export default Product;
