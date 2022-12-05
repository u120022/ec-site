import { useSearchParams } from "@solidjs/router";
import Cookies from "js-cookie";
import { Component, createResource, Index, Show } from "solid-js";
import { createStore } from "solid-js/store";
import { PaymentModel } from "../Models";
import { service } from "../Service";
import PagenateBar from "./PagenateBar";

const COUNT_PER_PAGE = 8;

// 支払い方法一覧のリスト表示
const PaymentList: Component = () => {
  // URLを解析
  const [params, setParams] = useSearchParams();
  const page = () => parseInt(params.page) || 0;
  const setPage = (page: number) => setParams({ ...params, page });

  // 支払い方法一覧を取得
  const token = () => Cookies.get("SESSION_TOKEN");
  const [payments, { refetch: refetchPayments }] = createResource(
    () => ({ token: token(), page: page() }),
    async ({ token, page }) =>
      await service.getPayments(token, page, COUNT_PER_PAGE)
  );

  const [form, setForm] = createStore({
    cardNumber: "",
    holderName: "",
    expirationDate: "",
    securityCode: "",
  });

  // 支払い方法を作成
  const createPayment = async () => {
    const payment = {
      cardNumber: form.cardNumber,
      holderName: form.holderName,
      expirationDate: form.expirationDate,
      securityCode: form.securityCode,
    };
    await service.createPayment(token(), payment);
    await refetchPayments();
    await refetchCount();
    setForm({
      cardNumber: "",
      holderName: "",
      expirationDate: "",
      securityCode: "",
    });
  };

  // 支払い方法を削除
  const deletePayment = async (id: number) => {
    await service.deletePayment(token(), id);
    await refetchPayments();
    await refetchCount();
  };

  // ページ数を計算
  const [count, { refetch: refetchCount }] = createResource(
    token,
    async (token) => await service.getPaymentCount(token)
  );
  const maxPageCount = () => Math.ceil(count() / COUNT_PER_PAGE);

  return (
    <div class="space-y-3">
      <div class="text-2xl font-bold">支払い方法</div>

      <Show
        when={payments()}
        fallback={<div class="text-slate-600">支払い方法が存在しません。</div>}
      >
        <Index each={payments()}>
          {(x) => <PaymentCard payment={x} deletePayment={deletePayment} />}
        </Index>
      </Show>

      <div class="rounded border border-slate-300 p-3">
        <form class="space-y-3" method="dialog" onSubmit={createPayment}>
          <div>支払い方法を追加する。(クレジット・デビットカード)</div>

          <div>
            <div>カード番号</div>
            <input
              type="text"
              required
              class="rounded border border-slate-300 p-2"
              value={form.cardNumber}
              onInput={(e) => setForm({ cardNumber: e.currentTarget.value })}
            />
          </div>

          <div>
            <div>カード名義</div>
            <input
              type="text"
              required
              class="rounded border border-slate-300 p-2"
              value={form.holderName}
              onInput={(e) => setForm({ holderName: e.currentTarget.value })}
            />
          </div>

          <div>
            <div>有効期間</div>
            <input
              type="text"
              required
              class="rounded border border-slate-300 p-2"
              value={form.expirationDate}
              onInput={(e) =>
                setForm({ expirationDate: e.currentTarget.value })
              }
            />
          </div>

          <div>
            <div>セキュリティコード(CVV/CSV)</div>
            <input
              type="text"
              required
              class="rounded border border-slate-300 p-2"
              value={form.securityCode}
              onInput={(e) => setForm({ securityCode: e.currentTarget.value })}
            />
          </div>

          <input
            type="submit"
            class="rounded bg-blue-600 p-3 py-2 text-white"
          />
        </form>
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
    </div>
  );
};

// 支払い方法のリスト項目
const PaymentCard: Component<{
  payment: () => PaymentModel;
  deletePayment: (id: number) => Promise<void>;
}> = (props) => {
  const deletePayment = async () => {
    await props.deletePayment(props.payment().id);
  };

  return (
    <div class="space-y-3 rounded border border-slate-300 p-3">
      <div class="flex">
        <div class="basis-1/4 font-bold">カード番号</div>
        <div class="flex-grow">表示できません。</div>
      </div>

      <div class="flex">
        <div class="basis-1/4 font-bold">カード名義</div>
        <div class="flex-grow">{props.payment().holderName}</div>
      </div>

      <div class="flex">
        <div class="basis-1/4 font-bold">有効期間</div>
        <div class="flex-grow">{props.payment().expirationDate}</div>
      </div>

      <div class="flex">
        <div class="basis-1/4 font-bold">セキュリティコード(CVV/CSV)</div>
        <div class="flex-grow">表示できません。</div>
      </div>

      <div class="border-b border-slate-300"></div>

      <div>
        <button class="text-rose-600" onClick={deletePayment}>
          削除
        </button>
      </div>
    </div>
  );
};

export default PaymentList;
