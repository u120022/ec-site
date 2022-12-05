import { useParams } from "@solidjs/router";
import { Component, createResource, createSignal, Index, Show } from "solid-js";
import CommentForm from "../forms/CommentForm";
import { service } from "../Service";
import PagenateBar from "./PagenateBar";
import { useToken } from "./TokenContext";

// 商品の詳細を表示
const Product: Component = () => {
  const params = useParams();
  const id = () => parseInt(params.id);

  const [token] = useToken();

  // 商品の情報を取得
  // idが変更されると更新
  const [product] = createResource(id, async (id) => service.getProduct(id));

  // カート内商品の情報を取得
  const [cartItem, { refetch }] = createResource(id, async (id) =>
    service.getCartItem(token(), id)
  );

  // 商品を1つだけカートに入れる
  const pushToCart = async () => {
    await service.pushToCart(token(), id(), 1);
    await refetch();
  };

  return (
    <div class="space-y-6">
      <Show when={product()}>
        <div class="flex gap-6">
          <img
            src={product().pic}
            class="aspect-[3/4] basis-1/2 bg-slate-100"
            alt="product picture"
          />

          <div class="flex basis-1/2 flex-col gap-3">
            <div class="text-4xl font-bold">{product().name}</div>
            <div class="text-2xl text-rose-600">
              &yen {product().value.toLocaleString()}
            </div>
            <div>在庫数: {product().count.toLocaleString()}</div>

            <div class="border-b border-slate-300"></div>

            <div class="text-xl">{product().desc}</div>

            <div class="flex-grow"></div>

            <div class="mx-auto space-x-3">
              <button
                class="rounded bg-blue-600 p-3 text-white"
                onClick={pushToCart}
              >
                カートに入れる
              </button>

              <Show when={cartItem()}>
                <span class="p-3">
                  カート内に{cartItem().count.toLocaleString()}個
                </span>
              </Show>
            </div>
          </div>
        </div>

        <CommentList productId={() => product().id} />
      </Show>
    </div>
  );
};

// 1ページに表示するコメントの数
const COUNT_PER_PAGE = 10;

// 1種類の商品のコメント一覧をリスト表示
const CommentList: Component<{
  productId: () => number;
}> = (props) => {
  // ページの状態を保持
  const [page, setPage] = createSignal(0);

  // コメント一覧を取得
  // productIdかpageが変更されると更新
  const [comments, { refetch: refetchComments }] = createResource(
    () => ({ id: props.productId(), page: page() }),
    async ({ id, page }) => await service.getComments(id, page, COUNT_PER_PAGE)
  );

  // ページ数を計算
  // productIdが変更されると更新
  const [count, { refetch: refetchCount }] = createResource(
    props.productId,
    async (id) => await service.getCommentCount(id)
  );
  const maxPageCount = () => Math.ceil(count() / COUNT_PER_PAGE);

  // コメントの表示を更新する
  const refetch = async () => {
    await refetchComments();
    await refetchCount();
  };

  return (
    <div class="space-y-3">
      <div class="text-2xl font-bold">コメント</div>

      <Show
        when={0 < count()}
        fallback={
          <div class="text-slate-600">この商品にコメントはありません。</div>
        }
      >
        <ul class="space-y-3">
          <Index each={comments()}>
            {(x) => (
              <li>
                {x().body} ({x().date.toLocaleString()})
              </li>
            )}
          </Index>
        </ul>
      </Show>

      <div class="rounded border border-slate-300 p-3">
        <CommentForm productId={props.productId} onSubmit={refetch} />
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

export default Product;
