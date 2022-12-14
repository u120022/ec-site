import { A } from "@solidjs/router";
import { Component, createResource, For, Show } from "solid-js";
import { CartItemDto } from "../Dto";
import PurchaseForm from "../forms/PurchaseForm";
import { service } from "../Service";
import Pagenator from "./Pagenator";
import { useToken } from "./TokenContext";
import { calcMaxPageCount, useSearchParamInt } from "./Utils";

const PurchaseHandle: Component = () => {
  const [token] = useToken();

  return (
    <Show
      when={token()}
      keyed={true}
      fallback={<div class="text-slate-600">ログインしてください。</div>}
    >
      {(token) => <Purchase token={token} />}
    </Show>
  );
};

const COUNT_PER_PAGE = 8;

// カート内アイテムの一覧をリスト表示
const Purchase: Component<{
  token: string;
}> = (props) => {
  const [page, setPage] = useSearchParamInt("page", 0);

  // カート内アイテムを取得
  const [cartItems] = createResource(
    page,
    async (page) =>
      await service.getCartItems(props.token, page, COUNT_PER_PAGE)
  );

  // ページ数を計算
  const [count] = createResource(
    async () => await service.getCartItemCount(props.token)
  );
  const maxPageCount = () => calcMaxPageCount(count(), COUNT_PER_PAGE);

  // カート内に商品が1つでもあるか確認
  const exists = () => {
    const current = count();
    if (!current) return false;
    return 0 < current;
  };

  // カート内アイテムの総額を取得
  const [totalPrice] = createResource(
    async () => await service.getTotalPriceInCart(props.token)
  );

  return (
    <div class="space-y-6">
      <div class="text-2xl font-bold">カート内</div>

      <Show
        when={exists()}
        fallback={
          <div class="text-slate-600">カート内に商品がありません。</div>
        }
      >
        <div class="space-y-3">
          <For each={cartItems()}>
            {(cartItem) => <CartItemCard cartItem={cartItem} />}
          </For>
        </div>

        <Pagenator
          value={page()}
          onChange={setPage}
          maxCount={maxPageCount()}
        />

        <div class="flex justify-between">
          <div class="text-xl font-bold">合計金額</div>

          <Show when={totalPrice()} keyed={true}>
            {(totalPrice) => (
              <div class="text-xl text-rose-600">
                &yen {totalPrice.toLocaleString()}
              </div>
            )}
          </Show>
        </div>

        <PurchaseForm token={props.token} />
      </Show>
    </div>
  );
};

// カート内アイテムのリスト項目
const CartItemCard: Component<{
  cartItem: CartItemDto;
}> = (props) => {
  // カート内アイテムから商品情報の取得
  const [product] = createResource(
    async () => await service.getProduct(props.cartItem.productId)
  );

  return (
    <Show when={product()} keyed={true}>
      {(product) => (
        <div class="flex gap-6">
          <img
            class="aspect-[3/4] basis-1/6 bg-slate-100"
            src={product.pic}
            alt="product picture"
          />

          <div class="flex-grow space-y-3">
            <A
              class="text-2xl font-bold"
              href={"/ec-site/products/" + props.cartItem.productId}
            >
              {product.name}
            </A>

            <div class="flex justify-between">
              <div class="text-xl">
                個数: {props.cartItem.quantity.toLocaleString()}
              </div>
              <div class="text-xl text-rose-600">
                &yen {product.price.toLocaleString()}
              </div>
            </div>

            <div class="border-b border-slate-300"></div>
          </div>
        </div>
      )}
    </Show>
  );
};

export default PurchaseHandle;
