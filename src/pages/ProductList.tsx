import { A, useSearchParams } from "@solidjs/router";
import { Component, createResource, Index, Show } from "solid-js";
import { ProductModel } from "../Models";
import { service } from "../Service";
import PagenateBar from "./PagenateBar";

// 1ページに表示する商品の数
const COUNT_PER_PAGE = 8;

// 商品の一覧をグリッド表示
const ProductList: Component = () => {
  const [params, setParams] = useSearchParams();
  const page = () => parseInt(params.page) || 0;
  const setPage = (page: number) => setParams({ page });
  const orderby = () => params.orderby;
  const setOrderBy = (orderby: string) => setParams({ orderby });
  const search = () => params.search;

  // 商品を取得
  // pageが変更されると更新
  const [products] = createResource(
    () => ({ page: page(), search: search(), orderby: orderby() }),
    async ({ page, search, orderby }) =>
      await service.getProucts(page, COUNT_PER_PAGE, { search, orderby })
  );

  // ページ数を計算
  const [count] = createResource(
    search,
    async (search) => await service.getProductCount({ search })
  );
  const maxPageCount = () => Math.ceil(count() / COUNT_PER_PAGE);

  return (
    <div class="flex gap-6">
      <div class="basis-1/5">
        <div class="space-y-3">
          <div
            class="rounded bg-slate-100 p-3"
            onClick={(_) => setOrderBy("value_asc")}
          >
            価格順(昇順)
          </div>
          <div
            class="rounded bg-slate-100 p-3"
            onClick={(_) => setOrderBy("value_des")}
          >
            価格順(後順)
          </div>
          <div
            class="rounded bg-slate-100 p-3"
            onClick={(_) => setOrderBy("date_asc")}
          >
            販売日順(昇順)
          </div>
          <div
            class="rounded bg-slate-100 p-3"
            onClick={(_) => setOrderBy("date_des")}
          >
            販売日順(降順)
          </div>
          <div
            class="rounded bg-slate-100 p-3"
            onClick={(_) => setOrderBy("name_asc")}
          >
            名前順(昇順)
          </div>
          <div
            class="rounded bg-slate-100 p-3"
            onClick={(_) => setOrderBy("name_des")}
          >
            名前順(降順)
          </div>
        </div>
      </div>

      <div class="flex-grow space-y-6">
        <div class="grid grid-cols-4 gap-3">
          <Index each={products()}>{(x) => <ProductCard product={x} />}</Index>
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
    </div>
  );
};

// 商品のグリッド項目
const ProductCard: Component<{
  product: () => ProductModel;
}> = (props) => {
  return (
    <A href={"/products/" + props.product().id}>
      <img
        class="aspect-[3/4] w-full bg-slate-100"
        src={props.product().pic}
        alt="product picture"
      />

      <div>{props.product().name}</div>
      <div class="text-rose-600">
        &yen {props.product().value.toLocaleString()}
      </div>
    </A>
  );
};

export default ProductList;
