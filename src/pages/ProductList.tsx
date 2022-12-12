import { A } from "@solidjs/router";
import { Component, createResource, For } from "solid-js";
import { ProductDto } from "../Dto";
import { service } from "../Service";
import PagenateBar from "./PagenateBar";
import { useSearchParamInt, useSearchParam, calcMaxPageCount } from "./Utils";

// 1ページに表示する商品の数
const COUNT_PER_PAGE = 16;

// 商品の一覧をグリッド表示
const ProductList: Component = () => {
  const [page, setPage] = useSearchParamInt("page", 0);
  const [orderBy, setOrderBy] = useSearchParam("order_by", "sales_amount_des");
  const [filter, setFilter] = useSearchParam("filter", "");

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
    <div class="space-y-6">
      <div class="flex gap-3">
        <div class="flex-grow"></div>
        <select
          class="appearance-none rounded-xl bg-slate-100 px-4 py-2"
          value={orderBy()}
          onInput={(e) => setOrderBy(e.currentTarget.value)}
        >
          <option value="date_des">販売開始日(新しい)</option>
          <option value="date_asc">販売開始日(古い)</option>
          <option value="price_des">価格(高い)</option>
          <option value="price_asc">価格(安い)</option>
          <option value="quantity_des">在庫数(多い)</option>
          <option value="quantity_asc">在庫数(少ない)</option>
          <option value="sales_amount_des">販売数(多い)</option>
          <option value="sales_amount_asc">販売数(少ない)</option>
          <option value="favorite_des">お気に入り登録数(多い)</option>
          <option value="favorite_asc">お気に入り登録数(少ない)</option>
          <option value="bookmark_des">ブックマーク登録数(多い)</option>
          <option value="bookmark_asc">ブックマーク登録数(少ない)</option>
        </select>
        <input
          type="search"
          placeholder="検索"
          class="w-[16rem] rounded-xl bg-slate-100 px-4 py-2"
          value={filter()}
          onChange={(e) => setFilter(e.currentTarget.value)}
        />
      </div>

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
  );
};

// 商品のグリッド項目
const ProductCard: Component<{
  product: ProductDto;
}> = (props) => {
  return (
    <A href={"/ec-site/products/" + props.product.id}>
      <img
        class="aspect-[3/4] w-full bg-slate-100"
        src={props.product.pic}
        alt="product picture"
      />

      <div>{props.product.name}</div>
      <div class="text-rose-600">
        &yen {props.product.price.toLocaleString()}
      </div>
    </A>
  );
};

export default ProductList;
