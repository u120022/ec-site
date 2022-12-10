import { A } from "@solidjs/router";
import { Component, createResource, For } from "solid-js";
import { ProductDto } from "../Dto";
import { service } from "../Service";
import PagenateBar from "./PagenateBar";
import { useSearchParamInt, useSearchParam, calcMaxPageCount } from "./Utils";

// 1ページに表示する商品の数
const COUNT_PER_PAGE = 8;

// 商品の一覧をグリッド表示
const ProductList: Component = () => {
  const [page, setPage] = useSearchParamInt("page", 0);
  const [orderBy, setOrderBy] = useSearchParam("order_by", "name");
  const [filter, setFilter] = useSearchParam("filter", undefined);

  // 商品を取得
  // pageが変更されると更新
  const [products] = createResource(
    () => ({ page: page(), filter: filter(), orderBy: orderBy() }),
    async ({ page, filter, orderBy }) =>
      await service.getProucts(page, COUNT_PER_PAGE, { filter, orderBy })
  );

  // ページ数を計算
  const [count] = createResource(
    () => ({ filter: filter() }),
    async ({ filter }) => await service.getProductCount({ filter })
  );
  const maxPageCount = () => calcMaxPageCount(count(), COUNT_PER_PAGE);

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
          <For each={products()}>{(x) => <ProductCard product={x} />}</For>
        </div>

        <div class="p-3 text-center">
          <PagenateBar
            page={page()}
            onSetPage={setPage}
            maxPageCount={maxPageCount()}
          />
        </div>
      </div>
    </div>
  );
};

// 商品のグリッド項目
const ProductCard: Component<{
  product: ProductDto;
}> = (props) => {
  return (
    <A href={"/products/" + props.product.id}>
      <img
        class="aspect-[3/4] w-full bg-slate-100"
        src={props.product.pic}
        alt="product picture"
      />

      <div>{props.product.name}</div>
      <div class="text-rose-600">
        &yen {props.product.value.toLocaleString()}
      </div>
    </A>
  );
};

export default ProductList;
