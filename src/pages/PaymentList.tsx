import { useSearchParams } from "@solidjs/router";
import { Component, createResource, Index, Show } from "solid-js";
import PaymentForm from "../forms/PaymentForm";
import { PaymentModel } from "../Models";
import { service } from "../Service";
import PagenateBar from "./PagenateBar";
import { useToken } from "./TokenContext";

const COUNT_PER_PAGE = 8;

// 支払い方法一覧のリスト表示
const PaymentList: Component = () => {
  // URLを解析
  const [params, setParams] = useSearchParams();
  const page = () => parseInt(params.page) || 0;
  const setPage = (page: number) => setParams({ ...params, page });

  const [token] = useToken();

  const [payments, { refetch: refetchPayments }] = createResource(
    () => ({ token: token(), page: page() }),
    async ({ token, page }) =>
      await service.getPayments(token, page, COUNT_PER_PAGE)
  );

  // 表示を更新
  const refetch = async () => {
    await refetchPayments();
    await refetchCount();
  };

  const deletePayment = async (id: number) => {
    await service.deletePayment(token(), id);
    refetch();
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
        when={0 < count()}
        fallback={<div class="text-slate-600">支払い方法が存在しません。</div>}
      >
        <Index each={payments()}>
          {(x) => <PaymentCard payment={x} deletePayment={deletePayment} />}
        </Index>
      </Show>

      <div class="rounded border border-slate-300 p-3">
        <PaymentForm onSubmit={refetch} />
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
