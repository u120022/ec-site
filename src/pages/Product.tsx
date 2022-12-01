import { useParams, useSearchParams } from "@solidjs/router";
import {
  Accessor,
  Component,
  createResource,
  createSignal,
  Index,
  Show,
} from "solid-js";
import { service } from "../Service";
import Pagenate from "./Pagenate";

// 商品の詳細を表示
const Product: Component = () => {
  const params = useParams();
  const id = () => parseInt(params.id);

  // 商品の情報を取得
  // idが変更されると更新
  const [product] = createResource(id, async (id: number) =>
    service.getProduct(id)
  );

  const [cartItem, { refetch }] = createResource(id, async (id: number) =>
    service.getCartItem(id)
  );

  // 商品を1つだけカートに入れる
  const pushToCart = async () => {
    await service.pushToCart(id(), 1);
    await refetch();
  };

  return (
    <div>
      <Show when={product()}>
        <div class="flex">
          <div class="basis-1/2 p-3">
            <img
              src={product().pic}
              class="aspect-[3/4] w-full"
              onError={(e) => (e.currentTarget.src = "/fallback.webp")}
            />
          </div>

          <div class="basis-1/2 p-3">
            <div class="flex h-full flex-col">
              <div class="mb-3 text-4xl font-bold">{product().name}</div>
              <div class="mb-3 text-2xl text-rose-600">
                \\ {product().value.toLocaleString()}
              </div>
              <div class="mb-3">在庫数: {product().count}</div>

              <div class="mb-3 border-b border-slate-300"></div>

              <div class="text-xl">{product().desc}</div>

              <div class="flex-grow"></div>

              <div class="mx-auto flex">
                <div>
                  <button
                    class="rounded bg-yellow-400 p-3"
                    onClick={(_) => pushToCart()}
                  >
                    カートに入れる
                  </button>
                </div>

                <Show when={cartItem()}>
                  <div class="p-3">カート内に{cartItem().count}個</div>
                </Show>
              </div>
            </div>
          </div>
        </div>

        <div class="h-[2rem]"></div>

        <ReviewList productId={() => product().id} />
      </Show>
    </div>
  );
};

// 1ページに表示するコメントの数
const COUNT_PER_PAGE = 10;

// 1種類の商品のレビュー一覧をリスト表示
const ReviewList: Component<{ productId: Accessor<number> }> = (props) => {
  const [params] = useSearchParams();
  const page = () => parseInt(params.page) || 0;

  // コメントを取得
  // productIdかpageが変更されると更新
  const [comments, { refetch }] = createResource(
    () => ({ id: props.productId(), page: page() }),
    async ({ id, page }) => await service.getComments(id, page, COUNT_PER_PAGE)
  );

  // ページ数を計算
  // productIdが変更されると更新
  const [count] = createResource(
    props.productId,
    async (id: number) => await service.getCommentCount(id)
  );
  const maxPageCount = () => Math.ceil(count() / COUNT_PER_PAGE);

  // コメント投稿フォーム
  const [text, setText] = createSignal("");
  const createComment = async () => {
    await service.createComment(props.productId(), text());
    await refetch();
    setText("");
  };

  return (
    <div class="p-3">
      <div class="mb-5 text-2xl font-bold">レビュー</div>

      <ul class="mb-5 space-y-3">
        <Index
          each={comments()}
          fallback={
            <li class="text-slate-600">この商品にレビューはありません。</li>
          }
        >
          {(x) => (
            <li>
              <div>
                {x().body} ({x().date.toLocaleString()})
              </div>
            </li>
          )}
        </Index>
      </ul>

      <div class="mb-5 rounded border border-slate-300 p-3">
        <div class="mb-3">レビューを投稿する</div>

        <textarea
          rows={8}
          placeholder="テキストを入力。"
          class="mb-3 w-full resize-none rounded border border-slate-300 p-3"
          value={text()}
          onInput={(e) => setText(e.currentTarget.value)}
        />

        <button
          class="rounded bg-blue-600 py-2 px-3 text-white"
          onClick={(_) => createComment()}
        >
          投稿
        </button>
      </div>

      <div class="text-center">
        <Pagenate maxPageCount={maxPageCount} />
      </div>
    </div>
  );
};

export default Product;
