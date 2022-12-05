import { A, useSearchParams } from "@solidjs/router";
import {
  Component,
  createMemo,
  createResource,
  createSignal,
  Index,
  Show,
} from "solid-js";
import { ReceiptItemModel, ReceiptModel } from "../Models";
import { service } from "../Service";
import PagenateBar from "./PagenateBar";
import { useToken } from "./TokenContext";

// 1ページに表示する購入履歴の数
const COUNT_PER_PAGE = 8;

// 購入履歴をリスト表示
const ReceiptList: Component = () => {
  const [params, setParams] = useSearchParams();
  const page = () => parseInt(params.page) || 0;
  const setPage = (page: number) => setParams({ ...params, page });

  const [token] = useToken();

  // レシート一覧を取得
  const [receipts] = createResource(
    () => ({ token: token(), page: page() }),
    async ({ token, page }) =>
      await service.getReceipts(token, page, COUNT_PER_PAGE)
  );

  // 総ページ数を計算
  const [count] = createResource(
    token,
    async (token) => await service.getReceiptCount(token)
  );
  const maxPageCount = () => Math.ceil(count() / COUNT_PER_PAGE);

  return (
    <div class="space-y-6">
      <div class="text-2xl font-bold">購入履歴</div>

      <Show
        when={0 < count()}
        fallback={<div class="text-slate-600">購入履歴はありません。</div>}
      >
        <div class="space-y-3">
          <Index each={receipts()}>{(x) => <Receipt receipt={x} />}</Index>
        </div>
      </Show>

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

// 購入履歴のリスト項目
// 1つの購入の購入商品一覧をリスト表記
const Receipt: Component<{
  receipt: () => ReceiptModel;
}> = (props) => {
  const [page, setPage] = createSignal(0);
  const [token] = useToken();

  // 1回の購入の購入商品一覧を取得
  const [receiptItems] = createResource(
    () => ({ token: token(), id: props.receipt().id, page: page() }),
    async ({ token, id, page }) =>
      await service.getReceiptItems(token, id, page, COUNT_PER_PAGE)
  );

  // 1回の購入の購入商品の数を取得
  const [count] = createResource(
    () => ({ token: token(), id: props.receipt().id }),
    async ({ token, id }) => await service.getReceiptItemCount(token, id)
  );
  const maxPageCount = createMemo(() => Math.ceil(count() / COUNT_PER_PAGE));

  return (
    <div class="space-y-3 rounded border border-slate-300 p-3">
      <div class="text-xl font-bold">
        {props.receipt().date.toLocaleString()}
      </div>
      <div class="text-rose-600">
        &yen {props.receipt().value.toLocaleString()}
      </div>

      <div class="border-b border-slate-300"></div>

      <div class="space-y-3">
        <Index each={receiptItems()}>
          {(x) => <ReceiptItem receiptItem={x} />}
        </Index>
      </div>

      <Show when={1 < maxPageCount()}>
        <div class="text-center">
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

// 購入商品のリスト項目
const ReceiptItem: Component<{
  receiptItem: () => ReceiptItemModel;
}> = (props) => {
  // 商品の情報を取得
  const [product] = createResource(
    () => props.receiptItem().productId,
    async (id) => await service.getProduct(id)
  );

  return (
    <Show when={product()}>
      <div class="flex gap-3">
        <img
          class="aspect-[3/4] basis-1/12 bg-slate-100"
          src={product().pic}
          alt="product picture"
        />

        <div class="flex-grow">
          <A
            class="text-xl font-bold"
            href={"/products/" + props.receiptItem().receiptId}
          >
            {product().name}
          </A>

          <div class="flex justify-between">
            <div>個数: {props.receiptItem().count.toLocaleString()}</div>
            <div class="text-rose-600">
              &yen {props.receiptItem().value.toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </Show>
  );
};

export default ReceiptList;
