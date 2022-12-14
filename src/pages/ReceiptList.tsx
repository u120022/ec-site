import { A } from "@solidjs/router";
import gsap from "gsap";
import {
  Component,
  createEffect,
  createResource,
  createSignal,
  For,
  onMount,
  Show,
} from "solid-js";
import { ReceiptDto, ReceiptItemDto } from "../Dto";
import { service } from "../Service";
import Pagenator from "./Pagenator";
import { useToken } from "./TokenContext";
import { calcMaxPageCount, useSearchParamInt } from "./Utils";

const ReceiptListHandle: Component = () => {
  const [token] = useToken();

  return (
    <Show
      when={token()}
      keyed={true}
      fallback={<div class="text-slate-600">ログインが必要です。</div>}
    >
      {(token) => <ReceiptList token={token} />}
    </Show>
  );
};
// 1ページに表示する購入履歴の数
const COUNT_PER_PAGE = 8;

// 購入履歴をリスト表示
const ReceiptList: Component<{
  token: string;
}> = (props) => {
  const [page, setPage] = useSearchParamInt("page", 0);

  // レシート一覧を取得
  const [receipts] = createResource(
    page,
    async (page) => await service.getReceipts(props.token, page, COUNT_PER_PAGE)
  );

  // 総ページ数を計算
  const [count] = createResource(
    async () => await service.getReceiptCount(props.token)
  );
  const maxPageCount = () => calcMaxPageCount(count(), COUNT_PER_PAGE);

  // レシートが1つでもあるか確認
  const exists = () => {
    const current = count();
    if (!current) return false;
    return 0 < current;
  };

  // アニメーションを登録
  onMount(() => {
    gsap.from(".slide-in", { opacity: 0, x: 20 });
  });

  createEffect(() => {
    if (receipts() == undefined) return;
    gsap.from(".slide-in-each", { opacity: 0, x: 20, stagger: 0.1 });
  });

  return (
    <div class="space-y-6">
      <div class="slide-in text-2xl font-bold">購入履歴</div>

      <Show
        when={exists()}
        fallback={<div class="text-slate-600">購入履歴はありません。</div>}
      >
        <div class="space-y-3">
          <For each={receipts()}>
            {(receipt) => (
              <ReceiptItemList token={props.token} receipt={receipt} />
            )}
          </For>
        </div>

        <Pagenator
          value={page()}
          onChange={setPage}
          maxCount={maxPageCount()}
        />
      </Show>
    </div>
  );
};

// 購入履歴のリスト項目
// 1つの購入の購入商品一覧をリスト表記
const ReceiptItemList: Component<{
  token: string;
  receipt: ReceiptDto;
}> = (props) => {
  // 複数存在するためURLとバインドしない
  const [page, setPage] = createSignal(0);

  // 1回の購入の購入商品一覧を取得
  const [receiptItems] = createResource(
    page,
    async (page) =>
      await service.getReceiptItems(
        props.token,
        props.receipt.id,
        page,
        COUNT_PER_PAGE
      )
  );

  // 1回の購入の購入商品の数を取得
  const [count] = createResource(
    async () => await service.getReceiptItemCount(props.token, props.receipt.id)
  );
  const maxPageCount = () => calcMaxPageCount(count(), COUNT_PER_PAGE);

  const [address] = createResource(
    async () => await service.getAddress(props.token, props.receipt.addressId)
  );
  const [payment] = createResource(
    async () => await service.getPayment(props.token, props.receipt.paymentId)
  );

  return (
    <div class="slide-in-each space-y-3 rounded border border-slate-300 p-3">
      <div class="text-xl font-bold">{props.receipt.date.toLocaleString()}</div>
      <div class="text-rose-600">
        &yen {props.receipt.price.toLocaleString()}
      </div>

      <div class="border-b border-slate-300"></div>

      <div class="space-y-3">
        <For each={receiptItems()}>
          {(x) => <ReceiptItem receiptItem={x} />}
        </For>
      </div>

      <Pagenator value={page()} onChange={setPage} maxCount={maxPageCount()} />

      <div class="border-b border-slate-300"></div>

      <Show when={address()} keyed>
        {(address) => (
          <div>
            <div class="font-bold">住所</div>
            <div>
              {address.name} {address.country} {address.address}{" "}
              {address.zipcode}
            </div>
          </div>
        )}
      </Show>

      <Show when={payment()} keyed>
        {(payment) => (
          <div>
            <div class="font-bold">支払い方法</div>
            <div>
              {payment.holderName} {payment.expirationDate}
            </div>
          </div>
        )}
      </Show>
    </div>
  );
};

// 購入商品のリスト項目
const ReceiptItem: Component<{
  receiptItem: ReceiptItemDto;
}> = (props) => {
  // 商品の情報を取得
  const [product] = createResource(
    () => props.receiptItem.productId,
    async (id) => await service.getProduct(id)
  );

  return (
    <Show when={product()} keyed={true}>
      {(product) => (
        <div class="flex gap-3">
          <div class="basis-1/12">
            <img
              class="aspect-[3/4] w-full bg-slate-100"
              src={product.pic}
              alt="product picture"
            />
          </div>

          <div class="flex-grow">
            <A
              class="text-xl font-bold"
              href={"/ec-site/products/" + props.receiptItem.productId}
            >
              {product.name}
            </A>

            <div class="flex justify-between">
              <div>個数: {props.receiptItem.quantity.toLocaleString()}</div>
              <div class="text-rose-600">
                &yen {props.receiptItem.price.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      )}
    </Show>
  );
};

export default ReceiptListHandle;
