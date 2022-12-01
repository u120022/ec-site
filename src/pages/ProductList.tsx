import { A, useSearchParams } from "@solidjs/router";
import { Accessor, Component, createResource, Index } from "solid-js";
import { ProductModel } from "../Models";
import { service } from "../Service";
import Pagenate from "./Pagenate";

// 1ページに表示する商品の数
const COUNT_PER_PAGE = 8;

// 商品の一覧をグリッド表示
const ProductList: Component = () => {
  const [params] = useSearchParams();
  const page = () => parseInt(params.page) || 0;

  // 商品を取得
  // pageが変更されると更新
  const [products] = createResource(
    page,
    async (page: number) => await service.getProucts(page, COUNT_PER_PAGE)
  );

  // ページ数を計算
  const [count] = createResource(async () => await service.getProductCount());
  const maxPageCount = () => Math.ceil(count() / COUNT_PER_PAGE);

  return (
    <div>
      <div class="flex">
        <div class="basis-1/5 p-3">
          <ul class="space-y-3">
            <li class="rounded bg-slate-100 p-3">ホーム</li>
            <li class="rounded bg-slate-100 p-3">おすすめ</li>
            <li class="rounded bg-slate-100 p-3">急上昇</li>
            <li class="rounded bg-slate-100 p-3">セール中</li>
          </ul>
        </div>

        <div class="flex-grow">
          <div class="p-3">
            <div class="grid grid-cols-4 gap-3">
              <Index each={products()}>
                {(x) => <ProductCard product={x} />}
              </Index>
            </div>
          </div>

          <div class="h-[2rem]"></div>

          <div class="p-3 text-center">
            <Pagenate maxPageCount={maxPageCount} />
          </div>
        </div>
      </div>
    </div>
  );
};

// 商品のグリッド項目
const ProductCard: Component<{ product: Accessor<ProductModel> }> = (props) => {
  return (
    <div>
      <A href={"/products/" + props.product().id}>
        <img
          class="aspect-[3/4] w-full"
          src={props.product().pic}
          onError={(e) => (e.currentTarget.src = "/fallback.webp")}
        />

        <div class="h-[0.5rem]"></div>

        <div>{props.product().name}</div>
        <div class="text-rose-600">
          \\ {props.product().value.toLocaleString()}
        </div>
      </A>
    </div>
  );
};

export default ProductList;
