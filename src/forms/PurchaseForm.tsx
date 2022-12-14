import { useNavigate } from "@solidjs/router";
import { Component, createResource, createSignal, For, Show } from "solid-js";
import { createStore } from "solid-js/store";
import { AddressDto, PaymentDto } from "../Dto";
import { PurchaseFormModel } from "../FormModels";
import Pagenator from "../pages/Pagenator";
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

  const [form, setForm] = createStore<PurchaseFormModel>({
    addressId: undefined,
    paymentId: undefined,
  });
  const [formError, setFormError] = createSignal("");

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
    </div>
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
              <button
                onClick={(_) => props.setAddressId(address.id)}
                class="w-full text-start"
              >
                <AddressCard address={address} />
              </button>
            </Show>
          )}
        </For>

        <Pagenator
          value={page()}
          onChange={setPage}
          maxCount={maxPageCount()}
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
              <button
                class="w-full text-start"
                onClick={(_) => props.setPaymentId(payment.id)}
              >
                <PaymentCard payment={payment} />
              </button>
            </Show>
          )}
        </For>

        <Pagenator
          value={page()}
          onChange={setPage}
          maxCount={maxPageCount()}
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
