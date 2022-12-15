import { A } from "@solidjs/router";
import gsap from "gsap";
import { Component, createEffect, For, onMount, Show } from "solid-js";
import Pagenator from "../Pagenator";
import { ProductModel, useHandle } from "./Handle";

const ProductList: Component = () => {
  const handle = useHandle();

  const getAvailable = () => {
    if (handle.getProducts() == undefined) return false;
    if (handle.getMaxPageCount() == undefined) return false;
    return true;
  };

  const getProducts = () => {
    const value = handle.getProducts();
    if (value == undefined) throw new Error();
    return value;
  };

  const getMaxPageCount = () => {
    const value = handle.getMaxPageCount();
    if (value == undefined) throw new Error();
    return value;
  };

  const setFilter = (value: string) => {
    handle.setFilter(value);
    handle.setPage(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const setOrderBy = (value: string) => {
    handle.setOrderBy(value);
    handle.setPage(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 商品の読み込み完了時にアニメーションを開始
  createEffect(() => {
    if (!getAvailable()) return;
    gsap.from(".fade-in-each", { opacity: 0, y: 10, stagger: 0.1 });
  });

  return (
    <div class="space-y-6">
      <div class="slide-in flex gap-3">
        <div class="flex-grow"></div>
        <select
          class="appearance-none rounded-xl bg-slate-100 px-4 py-2 focus:outline-0"
          value={handle.getOrderBy()}
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
          class="w-[16rem] rounded-xl bg-slate-100 px-4 py-2 focus:outline-0"
          value={handle.getFilter()}
          onChange={(e) => setFilter(e.currentTarget.value)}
        />
      </div>

      <Show when={getAvailable()} keyed>
        <div class="grid grid-cols-4 gap-6">
          <For each={getProducts()}>{(x) => <ProductCard product={x} />}</For>
        </div>

        <Pagenator
          value={handle.getPage()}
          onChange={handle.setPage}
          maxCount={getMaxPageCount()}
        />
      </Show>
    </div>
  );
};

const ProductCard: Component<{
  product: ProductModel;
}> = (props) => {
  return (
    <A href={"/ec-site/products/" + props.product.id}>
      <div class="fade-in-each space-y-3 p-3">
        <img
          class="aspect-[3/4] w-full rounded bg-slate-100"
          src={props.product.pic}
          alt="product picture"
        />

        <div class="text-xl font-bold">{props.product.name}</div>
        <div class="text-xl text-rose-600">
          &yen {props.product.price.toLocaleString()}
        </div>

        <div class="flex gap-3">
          <div>販売数: {props.product.salesAmount.toLocaleString()}</div>

          <div>お気に入り: {props.product.favoriteCount.toLocaleString()}</div>

          <div>
            ブックマーク: {props.product.bookmarkCount.toLocaleString()}
          </div>
        </div>
      </div>
    </A>
  );
};

export default ProductList;
