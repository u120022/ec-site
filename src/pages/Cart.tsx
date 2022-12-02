import { A, useSearchParams } from "@solidjs/router";
import { Component, createResource, Index, Show } from "solid-js";
import { CartItemModel } from "../Models";
import { service } from "../Service";
import PagenateBar from "./PagenateBar";

// 1ページに表示される数
const COUNT_PER_PAGE = 8;

// カート内アイテムの一覧をリスト表示
const Cart: Component = () => {
  const [params, setParams] = useSearchParams();
  const page = () => parseInt(params.page) || 0;
  const setPage = (page: number) => setParams({ ...params, page });

  // カート内アイテムの総額を取得
  const [totalValue, { refetch: refetchTotalValue }] = createResource(
    async () => await service.getTotalValueInCart()
  );

  // カート内アイテムを取得
  const [cartItems, { refetch: refetchCartItems }] = createResource(
    page,
    async (page: number) => await service.getCartItems(page, COUNT_PER_PAGE)
  );

  // カート内アイテムを削除
  const popFromCart = async (id: number, count: number) => {
    await service.popFromCart(id, count);
    await refetchTotalValue();
    await refetchCartItems();
    await refetchCount();
  };

  // カート内アイテムを購入
  const purchaceInCart = async () => {
    await service.purchaseInCart();
    await refetchTotalValue();
    await refetchCartItems();
    await refetchCount();
  };

  // ページ数を計算
  const [count, { refetch: refetchCount }] = createResource(
    async () => await service.getCartItemCount()
  );
  const maxPageCount = () => Math.ceil(count() / COUNT_PER_PAGE);

  return (
    <div class="p-3">
      <div class="mb-5 text-2xl font-bold">カート内</div>

      <Show
        when={0 < count()}
        fallback={
          <div class="text-slate-600">カート内に商品はありません。</div>
        }
      >
        <div class="mb-5 space-y-6">
          <Index each={cartItems()}>
            {(x) => <CartItem cartItem={x} popFromCart={popFromCart} />}
          </Index>
        </div>

        <div class="text-center">
          <PagenateBar
            page={page}
            setPage={setPage}
            maxPageCount={maxPageCount}
          />
        </div>

        <div class="mb-5 flex">
          <div class="text-xl font-bold">合計金額</div>
          <div class="flex-grow"></div>
          <Show when={totalValue()}>
            <div class="text-xl text-rose-600">
              \\ {totalValue().toLocaleString()}
            </div>
          </Show>
        </div>

        <div class="text-center">
          <button
            onClick={(_) => purchaceInCart()}
            class="rounded bg-yellow-400 p-3"
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
    async (id: number) => await service.getProduct(id)
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
            <A href={"/products/" + props.cartItem().productId}>
              {product().name}
            </A>
          </div>

          <div class="mb-3 flex">
            <div class="text-xl">個数: {props.cartItem().count}</div>
            <div class="flex-grow"></div>
            <div class="text-xl text-rose-600">
              \\ {product().value.toLocaleString()}
            </div>
          </div>

          <div class="mb-3 border-b border-slate-300"></div>

          <div class="space-x-3">
            <button class="text-rose-600" onClick={(_) => popFromCart()}>
              1つ削除
            </button>
            <button class="text-rose-600" onClick={(_) => popFromCartAll()}>
              すべて削除
            </button>
          </div>
        </div>
      </Show>
    </div>
  );
};

export default Cart;
