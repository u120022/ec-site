import { A, Link } from "@solidjs/router";
import { Component, createResource, For, Show } from "solid-js";
import { CartItemDto } from "../Dto";
import { service } from "../Service";
import PagenateBar from "./PagenateBar";
import { useToken } from "./TokenContext";
import { calcMaxPageCount, useSearchParamInt } from "./Utils";

const CartItemListHandle: Component = () => {
  const [token] = useToken();

  return (
    <Show
      when={token()}
      keyed={true}
      fallback={<div class="text-slate-600">ログインが必要です。</div>}
    >
      {(token) => <CartItemList token={token} />}
    </Show>
  );
};

// 1ページに表示される数
const COUNT_PER_PAGE = 8;

// カート内アイテムの一覧をリスト表示
const CartItemList: Component<{
  token: string;
}> = (props) => {
  const [page, setPage] = useSearchParamInt("page", 0);

  // カート内アイテムを取得
  const [cartItems, { refetch: refetchCartItems }] = createResource(
    page,
    async (page) =>
      await service.getCartItems(props.token, page, COUNT_PER_PAGE)
  );

  // カート内に商品が1つでもあるか確認
  const exists = () => {
    const current = cartItems();
    if (!current) return false;
    return 0 < current.length;
  };

  // ページ数を計算
  const [count, { refetch: refetchCount }] = createResource(
    async () => await service.getCartItemCount(props.token)
  );
  const maxPageCount = () => calcMaxPageCount(count(), COUNT_PER_PAGE);

  // カート内アイテムを削除
  const popFromCart = async (id: number, quantity: number) => {
    await service.popFromCart(props.token, id, quantity);
    await refetch();
  };

  // カート内アイテムの総額を取得
  const [totalPrice, { refetch: refetchTotalPrice }] = createResource(
    async () => await service.getTotalPriceInCart(props.token)
  );

  // 表示の更新
  const refetch = async () => {
    await refetchTotalPrice();
    await refetchCartItems();
    await refetchCount();
  };

  return (
    <div class="space-y-6">
      <div class="text-2xl font-bold">カート内</div>

      <Show
        when={exists()}
        fallback={
          <div class="text-slate-600">カート内の商品はありません。</div>
        }
      >
        <div class="space-y-3">
          <For each={cartItems()}>
            {(cartItem) => (
              <CartItem
                cartItem={cartItem}
                popFromCart={() => popFromCart(cartItem.productId, 1)}
                clearFromCart={() =>
                  popFromCart(cartItem.productId, cartItem.quantity)
                }
              />
            )}
          </For>
        </div>

        <div class="p-3 text-center">
          <PagenateBar
            page={page()}
            onSetPage={setPage}
            maxPageCount={maxPageCount()}
          />
        </div>

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

        <div class="justify-between text-center">
          <Link
            href="/ec-site/purchase"
            class="rounded bg-blue-600 p-3 text-white"
          >
            購入手続き
          </Link>
        </div>
      </Show>
    </div>
  );
};

// カート内アイテムのリスト項目
const CartItem: Component<{
  cartItem: CartItemDto;
  popFromCart: () => void;
  clearFromCart: () => void;
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

            <div class="space-x-3">
              <button class="text-rose-600" onClick={props.popFromCart}>
                1つ削除
              </button>
              <button class="text-rose-600" onClick={props.clearFromCart}>
                すべて削除
              </button>
            </div>
          </div>
        </div>
      )}
    </Show>
  );
};

export default CartItemListHandle;
