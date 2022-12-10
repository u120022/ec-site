import { A } from "@solidjs/router";
import { Component, createResource, For, Show } from "solid-js";
import { CartItemDto } from "../Dto";
import { service } from "../Service";
import PagenateBar from "./PagenateBar";
import { useToken } from "./TokenContext";
import { calcMaxPageCount, useSearchParamInt } from "./Utils";

// 1ページに表示される数
const COUNT_PER_PAGE = 8;

// カート内アイテムの一覧をリスト表示
const CartItemList: Component = () => {
  const [token] = useToken();

  const [page, setPage] = useSearchParamInt("page", 0);

  // カート内アイテムの総額を取得
  const [totalValue, { refetch: refetchTotalValue }] = createResource(
    async () => await service.getTotalValueInCart(token())
  );

  // カート内アイテムを取得
  const [cartItems, { refetch: refetchCartItems }] = createResource(
    page,
    async (page) => await service.getCartItems(token(), page, COUNT_PER_PAGE)
  );

  // 表示の更新
  const refetch = async () => {
    await refetchTotalValue();
    await refetchCartItems();
    await refetchCount();
  };

  // カート内アイテムを削除
  const popFromCart = async (id: number, count: number) => {
    await service.popFromCart(token(), id, count);
    await refetch();
  };

  // カート内アイテムを購入
  const purchaceInCart = async () => {
    // await service.purchaseInCart();
    await refetch();
  };

  // ページ数を計算
  const [count, { refetch: refetchCount }] = createResource(
    async () => await service.getCartItemCount(token())
  );
  const maxPageCount = () => calcMaxPageCount(count(), COUNT_PER_PAGE);

  // カート内に商品が1つでもあるか確認
  const exists = () => {
    const current = cartItems();

    if (!current) return false;

    return 0 < current.length;
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
            {(x) => (
              <CartItem
                cartItem={x}
                popFromCart={(count) => popFromCart(x.productId, count)}
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

          <Show when={totalValue()} keyed={true}>
            {(totalValue) => (
              <div class="text-xl text-rose-600">
                &yen {totalValue.toLocaleString()}
              </div>
            )}
          </Show>
        </div>

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
  cartItem: CartItemDto;
  popFromCart: (count: number) => void;
}> = (props) => {
  // カート内アイテムから商品情報の取得
  const [product] = createResource(
    async () => await service.getProduct(props.cartItem.productId)
  );

  // 1種類のカート内アイテムを1つ削除
  const popFromCart = () => {
    props.popFromCart(1);
  };

  // 1種類のカート内アイテムをすべて削除
  const popFromCartAll = () => {
    props.popFromCart(props.cartItem.count);
  };

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
              href={"/products/" + props.cartItem.productId}
            >
              {product.name}
            </A>

            <div class="flex justify-between">
              <div class="text-xl">
                個数: {props.cartItem.count.toLocaleString()}
              </div>
              <div class="text-xl text-rose-600">
                &yen {product.value.toLocaleString()}
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
      )}
    </Show>
  );
};

export default CartItemList;
