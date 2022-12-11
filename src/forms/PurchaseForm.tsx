import { A, useNavigate } from "@solidjs/router";
import { Component, createResource, createSignal, For, Show } from "solid-js";
import { createStore } from "solid-js/store";
import { AddressDto, CartItemDto, PaymentDto } from "../Dto";
import { PurchaseFormModel } from "../FormModels";
import PagenateBar from "../pages/PagenateBar";
import { calcMaxPageCount, useSearchParamInt } from "../pages/Utils";
import { service } from "../Service";

// 1ページに表示される数
const COUNT_PER_PAGE = 8;

// カート内アイテムの一覧をリスト表示
const PurchaseForm: Component<{
  token: string;
  onSubmit?: () => void;
}> = (props) => {
  const navigate = useNavigate();

  const [page, setPage] = useSearchParamInt("page", 0);

  const [form, setForm] = createStore<PurchaseFormModel>({
    addressId: undefined,
    paymentId: undefined,
  });
  const [formError, setFormError] = createSignal("");

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

  // 購入を確定する
  const onSubmit = async () => {
    if (!form.addressId) {
      setFormError("住所を選択してください。");
      return;
    }

    if (!form.paymentId) {
      setFormError("支払い方法を選択してください。");
      return;
    }

    const status = await service.purchaseInCart(
      props.token,
      form.addressId,
      form.paymentId
    );

    if (status != "SUCCESSFUL") {
      setFormError("購入できませんでした。");
      return;
    }

    navigate("/ec-site/receipts", { replace: true });

    if (props.onSubmit) props.onSubmit();
  };

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
            {(cartItem) => <CartItem cartItem={cartItem} />}
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

        <AddressSelector
          token={props.token}
          addressId={form.addressId}
          setAddressId={(addressId) => setForm({ addressId })}
        />

        <PaymentSelector
          token={props.token}
          paymentId={form.paymentId}
          setPaymentId={(paymentId) => setForm({ paymentId })}
        />

        <div class="text-rose-600">{formError()}</div>

        <div class="justify-between text-center">
          <button onClick={onSubmit} class="rounded bg-blue-600 p-3 text-white">
            購入
          </button>
        </div>
      </Show>
    </div>
  );
};

// カート内アイテムのリスト項目
const CartItem: Component<{
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

// 住所の選択
const AddressSelector: Component<{
  token: string;
  addressId?: number;
  setAddressId: (addressId?: number) => void;
}> = (props) => {
  const [page, setPage] = useSearchParamInt("address_page", 0);

  const [addresses] = createResource(
    page,
    async (page) =>
      await service.getAddresses(props.token, page, COUNT_PER_PAGE)
  );

  const [count] = createResource(
    async () => await service.getAddressCount(props.token)
  );
  const maxPageCount = () => calcMaxPageCount(count(), COUNT_PER_PAGE);

  // 住所が1つでもあるか確認
  const exists = () => {
    const current = count();
    if (!current) return false;
    return 0 < current;
  };

  return (
    <div class="space-y-3">
      <div class="text-xl font-bold">住所の選択</div>

      <Show
        when={exists()}
        fallback={<div class="text-slate-600">住所が登録されていません。</div>}
      >
        <For each={addresses()}>
          {(address) => (
            <Show
              when={address.id != props.addressId}
              fallback={
                <div class="bg-slate-100">
                  <AddressCard address={address} />
                </div>
              }
            >
              <div
                onClick={(_) => props.setAddressId(address.id)}
                class="cursor-pointer"
              >
                <AddressCard address={address} />
              </div>
            </Show>
          )}
        </For>

        <PagenateBar
          page={page()}
          onSetPage={setPage}
          maxPageCount={maxPageCount()}
        />
      </Show>
    </div>
  );
};

// 住所のリスト項目
const AddressCard: Component<{
  address: AddressDto;
}> = (props) => {
  return (
    <div class="space-y-3 rounded border border-slate-300 p-3">
      <div class="flex">
        <div class="basis-1/4 font-bold">氏名</div>
        <div class="flex-grow">{props.address.name}</div>
      </div>

      <div class="flex">
        <div class="basis-1/4 font-bold">国名</div>
        <div class="flex-grow">{props.address.country}</div>
      </div>

      <div class="flex">
        <div class="basis-1/4 font-bold">住所</div>
        <div class="flex-grow">{props.address.address}</div>
      </div>

      <div class="flex">
        <div class="basis-1/4 font-bold">郵便番号</div>
        <div class="flex-grow">{props.address.zipcode}</div>
      </div>
    </div>
  );
};

// 支払い方法の選択
const PaymentSelector: Component<{
  token: string;
  paymentId?: number;
  setPaymentId: (paymentId?: number) => void;
}> = (props) => {
  const [page, setPage] = useSearchParamInt("payment_page", 0);

  const [payments] = createResource(
    page,
    async (page) => await service.getPayments(props.token, page, COUNT_PER_PAGE)
  );

  const [count] = createResource(
    async () => await service.getPaymentCount(props.token)
  );
  const maxPageCount = () => calcMaxPageCount(count(), COUNT_PER_PAGE);

  // 支払い方法が1つでもあるか確認
  const exists = () => {
    const current = count();
    if (!current) return false;
    return 0 < current;
  };

  return (
    <div class="space-y-3">
      <div class="text-xl font-bold">支払い方法の選択</div>

      <Show
        when={exists()}
        fallback={
          <div class="text-slate-600">支払い方法が登録されていません。</div>
        }
      >
        <For each={payments()}>
          {(payment) => (
            <Show
              when={payment.id != props.paymentId}
              fallback={
                <div class="bg-slate-100">
                  <PaymentCard payment={payment} />
                </div>
              }
            >
              <div
                onClick={(_) => props.setPaymentId(payment.id)}
                class="cursor-pointer"
              >
                <PaymentCard payment={payment} />
              </div>
            </Show>
          )}
        </For>

        <PagenateBar
          page={page()}
          onSetPage={setPage}
          maxPageCount={maxPageCount()}
        />
      </Show>
    </div>
  );
};

// 支払い方法のリスト項目
const PaymentCard: Component<{
  payment: PaymentDto;
}> = (props) => {
  return (
    <div class="space-y-3 rounded border border-slate-300 p-3">
      <div class="flex">
        <div class="basis-1/4 font-bold">カード番号</div>
        <div class="flex-grow">表示できません。</div>
      </div>

      <div class="flex">
        <div class="basis-1/4 font-bold">カード名義</div>
        <div class="flex-grow">{props.payment.holderName}</div>
      </div>

      <div class="flex">
        <div class="basis-1/4 font-bold">有効期間</div>
        <div class="flex-grow">{props.payment.expirationDate}</div>
      </div>

      <div class="flex">
        <div class="basis-1/4 font-bold">セキュリティコード(CVV/CSV)</div>
        <div class="flex-grow">表示できません。</div>
      </div>
    </div>
  );
};

export default PurchaseForm;
