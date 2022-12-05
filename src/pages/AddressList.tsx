import { useSearchParams } from "@solidjs/router";
import Cookies from "js-cookie";
import { Component, createResource, Index, Show } from "solid-js";
import { createStore } from "solid-js/store";
import { AddressModel } from "../Models";
import { service } from "../Service";
import PagenateBar from "./PagenateBar";

const COUNT_PER_PAGE = 8;

// 住所一覧のリスト表示
const AddressList: Component = () => {
  // URLを解析
  const [params, setParams] = useSearchParams();
  const page = () => parseInt(params.page) || 0;
  const setPage = (page: number) => setParams({ ...params, page });

  // 住所一覧を取得
  const token = () => Cookies.get("SESSION_TOKEN");
  const [addresses, { refetch: refetchAddresses }] = createResource(
    () => ({ token: token(), page: page() }),
    async ({ token, page }) =>
      await service.getAddresses(token, page, COUNT_PER_PAGE)
  );

  const [form, setForm] = createStore({
    name: "",
    country: "",
    address: "",
    zipcode: "",
  });

  // 住所を作成
  const createAddress = async () => {
    const address = {
      name: form.name,
      country: form.country,
      address: form.address,
      zipcode: form.zipcode,
    };
    await service.createAddress(token(), address);
    await refetchAddresses();
    await refetchCount();
    setForm({ name: "", country: "", address: "", zipcode: "" });
  };

  // 住所を削除
  const deleteAddress = async (id: number) => {
    await service.deleteAddress(token(), id);
    await refetchAddresses();
    await refetchCount();
  };

  // ページ数を計算
  const [count, { refetch: refetchCount }] = createResource(
    token,
    async (token) => await service.getAddressCount(token)
  );
  const maxPageCount = () => Math.ceil(count() / COUNT_PER_PAGE);

  return (
    <div class="space-y-3">
      <div class="text-2xl font-bold">住所</div>

      <Show
        when={addresses()}
        fallback={<div class="text-slate-600">住所が存在しません。</div>}
      >
        <Index each={addresses()}>
          {(x) => <AddressCard address={x} deleteAddress={deleteAddress} />}
        </Index>
      </Show>

      <div class="rounded border border-slate-300 p-3">
        <form class="space-y-3" method="dialog" onSubmit={createAddress}>
          <div>住所を追加する。</div>

          <div>
            <div>氏名</div>
            <input
              type="text"
              required
              class="rounded border border-slate-300 p-2"
              value={form.name}
              onInput={(e) => setForm({ name: e.currentTarget.value })}
            />
          </div>

          <div>
            <div>国名</div>
            <input
              type="text"
              required
              class="rounded border border-slate-300 p-2"
              value={form.country}
              onInput={(e) => setForm({ country: e.currentTarget.value })}
            />
          </div>

          <div>
            <div>住所</div>
            <input
              type="text"
              required
              class="rounded border border-slate-300 p-2"
              value={form.address}
              onInput={(e) => setForm({ address: e.currentTarget.value })}
            />
          </div>

          <div>
            <div>郵便番号</div>
            <input
              type="text"
              required
              class="rounded border border-slate-300 p-2"
              value={form.zipcode}
              onInput={(e) => setForm({ zipcode: e.currentTarget.value })}
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

// 住所のリスト項目
const AddressCard: Component<{
  address: () => AddressModel;
  deleteAddress: (id: number) => Promise<void>;
}> = (props) => {
  const deleteAddress = async () => {
    await props.deleteAddress(props.address().id);
  };

  return (
    <div class="space-y-3 rounded border border-slate-300 p-3">
      <div class="flex">
        <div class="basis-1/4 font-bold">氏名</div>
        <div class="flex-grow">{props.address().name}</div>
      </div>

      <div class="flex">
        <div class="basis-1/4 font-bold">国名</div>
        <div class="flex-grow">{props.address().country}</div>
      </div>

      <div class="flex">
        <div class="basis-1/4 font-bold">住所</div>
        <div class="flex-grow">{props.address().address}</div>
      </div>

      <div class="flex">
        <div class="basis-1/4 font-bold">郵便番号</div>
        <div class="flex-grow">{props.address().zipcode}</div>
      </div>

      <div class="border-b border-slate-300"></div>

      <div>
        <button class="text-rose-600" onClick={deleteAddress}>
          削除
        </button>
      </div>
    </div>
  );
};

export default AddressList;
