import { useSearchParams } from "@solidjs/router";
import { Accessor, Component, createResource, Index } from "solid-js";
import { ReceiptModel } from "../Models";
import { service } from "../Service";
import Pagenate from "./Pagenate";

// 1ページに表示する購入履歴の数
const COUNT_PER_PAGE = 8;

// 購入履歴をリスト表示
const ReceiptList: Component = () => {
  const [params] = useSearchParams();
  const page = () => parseInt(params.page) || 0;

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
        <Pagenate maxPageCount={maxPageCount} />
      </div>
    </div>
  );
};

// 購入履歴のリスト項目
const Receipt: Component<{ receipt: Accessor<ReceiptModel> }> = (props) => {
  // 1回の購入の購入商品一覧を取得
  const [receiptItems] = createResource(
    () => props.receipt().id,
    async (id: number) => await service.getReceiptItems(id, 0, 20)
  );

  return (
    <div class="rounded border border-slate-300 p-3">
      <div class="mb-3 text-xl font-bold">
        {props.receipt().date.toLocaleString()}
      </div>
      <div class="mb-3 text-rose-600">
        \\ {props.receipt().value.toLocaleString()}
      </div>

      <div class="mb-3 border-b border-slate-300"></div>

      <Index each={receiptItems()}>
        {(x) => (
          <div>
            \\ {x().value.toLocaleString()} x {x().count}
          </div>
        )}
      </Index>
    </div>
  );
};

export default ReceiptList;
