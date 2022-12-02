import { A, useSearchParams } from "@solidjs/router";
import { Component, createMemo, createResource, createSignal, Index, Show } from "solid-js";
import { ReceiptItemModel, ReceiptModel } from "../Models";
import { service } from "../Service";
import PagenateBar from "./PagenateBar";

// 1ページに表示する購入履歴の数
const COUNT_PER_PAGE = 8;

// 購入履歴をリスト表示
const ReceiptList: Component = () => {
	const [params, setParams] = useSearchParams();
	const page = () => parseInt(params.page) || 0;
	const setPage = (page: number) => setParams({ ...params, page });

	// レシート一覧を取得
	const [receipts] = createResource(
		page,
		async (page: number) => await service.getReceipts(page, COUNT_PER_PAGE)
	);

	// 総ページ数を計算
	const [count] = createResource(async () => await service.getReceiptCount());
	const maxPageCount = () => Math.ceil(count() / COUNT_PER_PAGE);

	return (
		<div class="p-3">
			<div class="mb-5 text-2xl font-bold">購入履歴</div>

			<div class="mb-5 space-y-6">
				<Index
					each={receipts()}
					fallback={<div class="text-slate-600">購入履歴はありません。</div>}
				>
					{(x) => <Receipt receipt={x} />}
				</Index>
			</div>

			<div class="text-center">
				<PagenateBar
					page={page}
					setPage={setPage}
					maxPageCount={maxPageCount}
				/>
			</div>
		</div>
	);
};

// 購入履歴のリスト項目
// 1つの購入の購入商品一覧をリスト表記
const Receipt: Component<{
	receipt: () => ReceiptModel
}> = (props) => {
	const [page, setPage] = createSignal(0);

	// 1回の購入の購入商品一覧を取得
	const [receiptItems] = createResource(
		() => ({ id: props.receipt().id, page: page() }),
		async ({ id, page }) => await service.getReceiptItems(id, page, COUNT_PER_PAGE)
	);

	// 1回の購入の購入商品の数を取得
	const [count] = createResource(
		() => props.receipt().id,
		async (id: number) => await service.getReceiptItemCount(id)
	);
	const maxPageCount = createMemo(() => Math.ceil(count() / COUNT_PER_PAGE));

	return (
		<div class="rounded border border-slate-300 p-3">
			<div class="mb-3 text-xl font-bold">
				{props.receipt().date.toLocaleString()}
			</div>
			<div class="mb-3 text-rose-600">
				\\ {props.receipt().value.toLocaleString()}
			</div>

			<div class="mb-3 border-b border-slate-300"></div>

			<div class="mb-3 space-y-3">
				<Index each={receiptItems()}>
					{(x) => <ReceiptItem receiptItem={x} />}
				</Index>
			</div>

			<div class="text-center">
				<PagenateBar page={page} setPage={setPage} maxPageCount={maxPageCount} />
			</div>
		</div>
	);
};

// 購入商品のリスト項目
const ReceiptItem: Component<{
	receiptItem: () => ReceiptItemModel
}> = (props) => {
	// 商品の情報を取得
	const [product] = createResource(
		() => props.receiptItem().productId,
		async (id: number) => await service.getProduct(id)
	);

	return (
		<div class="flex gap-6">
			<Show when={product()}>
				<div class="basis-1/6">
					<img
						class="aspect-[3/4] w-full"
						src={product().pic}
						onError={(e) => (e.currentTarget.src = "/fallback.webp")}
					/>
				</div>

				<div class="flex-grow">
					<div class="mb-3 text-2xl font-bold">
						<A href={"/products/" + props.receiptItem().receiptId}>
							{product().name}
						</A>
					</div>

					<div class="mb-3 flex">
						<div class="text-xl">個数: {props.receiptItem().count}</div>
						<div class="flex-grow"></div>
						<div class="text-xl text-rose-600">
							\\ {props.receiptItem().value.toLocaleString()}
						</div>
					</div>

					<div class="mb-3 border-b border-slate-300"></div>
				</div>
			</Show>
		</div>
	);
};

export default ReceiptList;
