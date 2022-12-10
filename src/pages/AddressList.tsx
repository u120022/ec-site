import { Component, createResource, For } from "solid-js";
import AddressForm from "../forms/AddressForm";
import { AddressModel } from "../Models";
import { service } from "../Service";
import PagenateBar from "./PagenateBar";
import { useToken } from "./TokenContext";
import { calcMaxPageCount, useSearchParamInt } from "./Utils";

const COUNT_PER_PAGE = 8;

// 住所一覧のリスト表示
const AddressList: Component = () => {
  // URLを解析
  const [page, setPage] = useSearchParamInt("page", 0);

  const [token] = useToken();

  const [addresses, { refetch: refetchAddresses }] = createResource(
    page,
    async (page) => await service.getAddresses(token(), page, COUNT_PER_PAGE)
  );

  // 表示を更新
  const refetch = async () => {
    await refetchAddresses();
    await refetchCount();
  };

  const deleteAddress = async (id: number) => {
    await service.deleteAddress(token(), id);
    await refetch();
  };

  // ページ数を計算
  const [count, { refetch: refetchCount }] = createResource(
    async () => await service.getAddressCount(token())
  );
  const maxPageCount = () => calcMaxPageCount(count(), COUNT_PER_PAGE);

  return (
    <div class="space-y-3">
      <div class="text-2xl font-bold">住所</div>

      <For each={addresses()}>
        {(address) => (
          <AddressCard
            address={address}
            deleteAddress={() => deleteAddress(address.id)}
          />
        )}
      </For>

      <div class="rounded border border-slate-300 p-3">
        <AddressForm onSubmit={refetch} />
      </div>

      <div class="p-3 text-center">
        <PagenateBar
          page={page()}
          onSetPage={setPage}
          maxPageCount={maxPageCount()}
        />
      </div>
    </div>
  );
};

// 住所のリスト項目
const AddressCard: Component<{
  address: AddressModel;
  deleteAddress: () => void;
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

      <div class="border-b border-slate-300"></div>

      <div>
        <button class="text-rose-600" onClick={props.deleteAddress}>
          削除
        </button>
      </div>
    </div>
  );
};

export default AddressList;
