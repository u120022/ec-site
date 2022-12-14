import { Component, createResource, For, Show } from "solid-js";
import { PaymentDto } from "../Dto";
import PaymentForm from "../forms/PaymentForm";
import { service } from "../Service";
import Pagenator from "./Pagenator";
import { useToken } from "./TokenContext";
import { calcMaxPageCount, useSearchParamInt } from "./Utils";

const PaymentListHandle: Component = () => {
  const [token] = useToken();

  return (
    <Show
      when={token()}
      keyed={true}
      fallback={<div class="text-slate-600">ログインが必要です。</div>}
    >
      {(token) => <PaymentList token={token} />}
    </Show>
  );
};

const COUNT_PER_PAGE = 8;

// 支払い方法一覧のリスト表示
const PaymentList: Component<{
  token: string;
}> = (props) => {
  // URLを解析
  const [page, setPage] = useSearchParamInt("page", 0);

  const [payments, { refetch: refetchPayments }] = createResource(
    page,
    async (page) => await service.getPayments(props.token, page, COUNT_PER_PAGE)
  );

  // 表示を更新
  const refetch = async () => {
    await refetchPayments();
    await refetchCount();

    if (maxPageCount() <= page()) setPage(maxPageCount() - 1);
  };

  const deletePayment = async (id: number) => {
    await service.deletePayment(props.token, id);
    refetch();
  };

  // ページ数を計算
  const [count, { refetch: refetchCount }] = createResource(
    async () => await service.getPaymentCount(props.token)
  );
  const maxPageCount = () => calcMaxPageCount(count(), COUNT_PER_PAGE);

  return (
    <div class="space-y-3">
      <div class="text-2xl font-bold">支払い方法</div>

      <For each={payments()}>
        {(payment) => (
          <PaymentCard
            payment={payment}
            deletePayment={() => deletePayment(payment.id)}
          />
        )}
      </For>

      <div class="rounded border border-slate-300 p-3">
        <PaymentForm token={props.token} onSubmit={refetch} />
      </div>

      <Pagenator value={page()} onChange={setPage} maxCount={maxPageCount()} />
    </div>
  );
};

// 支払い方法のリスト項目
const PaymentCard: Component<{
  payment: PaymentDto;
  deletePayment: () => void;
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

      <div class="border-b border-slate-300"></div>

      <div>
        <button class="text-rose-600" onClick={props.deletePayment}>
          削除
        </button>
      </div>
    </div>
  );
};

export default PaymentListHandle;
