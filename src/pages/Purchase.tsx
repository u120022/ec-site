import { A, useNavigate } from "@solidjs/router";
import {
  Component,
  createResource,
  createSignal,
  For,
  Match,
  Show,
  Switch,
} from "solid-js";
import { createStore } from "solid-js/store";
import { AddressDto, CartItemDto, PaymentDto } from "../Dto";
import { PurchaseFormModel } from "../FormModels";
import { service } from "../Service";
import PagenateBar from "./PagenateBar";
import { useToken } from "./TokenContext";
import { calcMaxPageCount, useSearchParamInt } from "./Utils";

// 1ページに表示される数
const COUNT_PER_PAGE = 8;

// カート内アイテムの一覧をリスト表示
const Purchase: Component = () => {
  const navigate = useNavigate();

  const [token] = useToken();

  const [page, setPage] = useSearchParamInt("page", 0);

  const [form, setForm] = createStore<PurchaseFormModel>({
    addressId: undefined,
    paymentId: undefined,
  });
  const [formError, setFormError] = createSignal("");

  // カート内アイテムの総額を取得
  const [totalValue] = createResource(
    async () => await service.getTotalValueInCart(token())
  );

  // カート内アイテムを取得
  const [cartItems] = createResource(
    page,
    async (page) => await service.getCartItems(token(), page, COUNT_PER_PAGE)
  );

  // ページ数を計算
  const [count] = createResource(
    async () => await service.getCartItemCount(token())
  );
  const maxPageCount = () => calcMaxPageCount(count(), COUNT_PER_PAGE);

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
      token(),
      form.addressId,
      form.paymentId
    );

    if (status != "SUCCESSFUL") {
      setFormError("購入できませんでした。");
      return;
    }

    navigate("/receipts", { replace: true });
  };

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
          <div class="text-slate-600">カート内に商品がありません。</div>
        }
      >
        <div class="space-y-3">
          <For each={cartItems()}>{(x) => <CartItem cartItem={x} />}</For>
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

        <AddressSelector
          addressId={form.addressId}
          setAddressId={(addressId) => setForm({ addressId })}
        />

        <PaymentSelector
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
          </div>
        </div>
      )}
    </Show>
  );
};

// 住所の選択
const AddressSelector: Component<{
  addressId?: number;
  setAddressId: (addressId?: number) => void;
}> = (props) => {
  const [token] = useToken();

  const [page, setPage] = useSearchParamInt("address_page", 0);

  const [addresses] = createResource(
    page,
    async (page) => await service.getAddresses(token(), page, COUNT_PER_PAGE)
  );

  const [count] = createResource(
    async () => await service.getAddressCount(token())
  );
  const maxPageCount = () => calcMaxPageCount(count(), COUNT_PER_PAGE);

  // 住所が1つでもあるか確認
  const exists = () => {
    const current = addresses();
    if (!current) return false;
    return 0 < current.length;
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
            <Switch>
              <Match when={address.id != props.addressId}>
                <div
                  onClick={(_) => props.setAddressId(address.id)}
                  class="cursor-pointer"
                >
                  <AddressCard address={address} />
                </div>
              </Match>
              <Match when={address.id == props.addressId}>
                <div class="bg-slate-100">
                  <AddressCard address={address} />
                </div>
              </Match>
            </Switch>
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
  paymentId?: number;
  setPaymentId: (paymentId?: number) => void;
}> = (props) => {
  const [token] = useToken();

  const [page, setPage] = useSearchParamInt("payment_page", 0);

  const [payments] = createResource(
    page,
    async (page) => await service.getPayments(token(), page, COUNT_PER_PAGE)
  );

  const [count] = createResource(
    async () => await service.getPaymentCount(token())
  );
  const maxPageCount = () => calcMaxPageCount(count(), COUNT_PER_PAGE);

  // 支払い方法が1つでもあるか確認
  const exists = () => {
    const current = payments();
    if (!current) return false;
    return 0 < current.length;
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
            <Switch>
              <Match when={payment.id != props.paymentId}>
                <div
                  onClick={(_) => props.setPaymentId(payment.id)}
                  class="cursor-pointer"
                >
                  <PaymentCard payment={payment} />
                </div>
              </Match>
              <Match when={payment.id == props.paymentId}>
                <div class="bg-slate-100">
                  <PaymentCard payment={payment} />
                </div>
              </Match>
            </Switch>
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

export default Purchase;
