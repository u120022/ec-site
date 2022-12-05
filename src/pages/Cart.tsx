import { A, useSearchParams } from "@solidjs/router";
import { Component, createResource, Index, Show } from "solid-js";
import { CartItemModel } from "../Models";
import { service } from "../Service";
import PagenateBar from "./PagenateBar";
import { useToken } from "./TokenContext";

// 1ページに表示される数
const COUNT_PER_PAGE = 8;

// カート内アイテムの一覧をリスト表示
const Cart: Component = () => {
  const [params, setParams] = useSearchParams();
  const page = () => parseInt(params.page) || 0;
  const setPage = (page: number) => setParams({ ...params, page });

  const [token] = useToken();

  // カート内アイテムの総額を取得
  const [totalValue, { refetch: refetchTotalValue }] = createResource(
    token,
    async (token) => await service.getTotalValueInCart(token)
  );

  // カート内アイテムを取得
  const [cartItems, { refetch: refetchCartItems }] = createResource(
    () => ({ token: token(), page: page() }),
    async ({ token, page }) =>
      await service.getCartItems(token, page, COUNT_PER_PAGE)
  );

  // カート内アイテムを削除
  const popFromCart = async (id: number, count: number) => {
    await service.popFromCart(token(), id, count);
    await refetchTotalValue();
    await refetchCartItems();
    await refetchCount();
  };

  // カート内アイテムを購入
  const purchaceInCart = async () => {
    // await service.purchaseInCart();
    await refetchTotalValue();
    await refetchCartItems();
    await refetchCount();
  };

  // ページ数を計算
  const [count, { refetch: refetchCount }] = createResource(
    token,
    async (token) => await service.getCartItemCount(token)
  );
  const maxPageCount = () => Math.ceil(count() / COUNT_PER_PAGE);

  return (
    <div class="space-y-6">
      <div class="text-2xl font-bold">カート内</div>

      <Show
        when={0 < count()}
        fallback={
          <div class="text-slate-600">カート内に商品はありません。</div>
        }
      >
        <div class="space-y-3">
          <Index each={cartItems()}>
            {(x) => <CartItem cartItem={x} popFromCart={popFromCart} />}
          </Index>
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

        <Show when={totalValue()}>
          <div class="flex justify-between">
            <div class="text-xl font-bold">合計金額</div>
            <div class="text-xl text-rose-600">
              &yen {totalValue().toLocaleString()}
            </div>
          </div>
        </Show>

        <div class="justify-between text-center">
          <button
            onClick={purchaceInCart}
            class="rounded bg-blue-600 p-3 text-white"
          >
            購入手続き
          </button>
        </div>
      </Show>
    </div>
  );
};

// カート内アイテムのリスト項目
const CartItem: Component<{
  cartItem: () => CartItemModel;
  popFromCart: (id: number, count: number) => Promise<void>;
}> = (props) => {
  // カート内アイテムから商品情報の取得
  const [product] = createResource(
    () => props.cartItem().productId,
    async (id) => await service.getProduct(id)
  );

  // 1種類のカート内アイテムを1つ削除
  const popFromCart = async () => {
    await props.popFromCart(props.cartItem().productId, 1);
  };

  // 1種類のカート内アイテムをすべて削除
  const popFromCartAll = async () => {
    return await props.popFromCart(
      props.cartItem().productId,
      props.cartItem().count
    );
  };

  return (
    <Show when={product()}>
      <div class="flex gap-6">
        <img
          class="aspect-[3/4] basis-1/6 bg-slate-100"
          src={product().pic}
          alt="product picture"
        />

        <div class="flex-grow space-y-3">
          <A
            class="text-2xl font-bold"
            href={"/products/" + props.cartItem().productId}
          >
            {product().name}
          </A>

          <div class="flex justify-between">
            <div class="text-xl">
              個数: {props.cartItem().count.toLocaleString()}
            </div>
            <div class="text-xl text-rose-600">
              &yen {product().value.toLocaleString()}
            </div>
          </div>

          <div class="border-b border-slate-300"></div>

          <div class="space-x-3">
            <button class="text-rose-600" onClick={popFromCart}>
              1つ削除
            </button>
            <button class="text-rose-600" onClick={popFromCartAll}>
              すべて削除
            </button>
          </div>
        </div>
      </div>
    </Show>
  );
};

export default Cart;
