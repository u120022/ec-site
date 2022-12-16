import gsap from "gsap";
import { Component, createEffect, createResource, For, Show } from "solid-js";
import { CommentDto } from "../Dto";
import CommentForm from "../forms/CommentForm";
import { service } from "../Service";
import Pagenator from "./Pagenator";
import { useToken } from "./TokenContext";
import { calcMaxPageCount, useParamInt, useSearchParamInt } from "./Utils";

// 商品の詳細を表示
const ProductHandle: Component = () => {
  const productId = useParamInt("product_id", undefined);

  return (
    <Show
      when={productId()}
      keyed={true}
      fallback={<div class="text-slate-600">商品が見つかりません。</div>}
    >
      {(id) => <Product productId={id} />}
    </Show>
  );
};

const Product: Component<{
  productId: number;
}> = (props) => {
  const [product] = createResource(
    async () => await service.getProduct(props.productId)
  );

  const [salesAmount] = createResource(
    async () => await service.getSalesAmount(props.productId)
  );

  const [favoriteCount, { refetch: refetchFavoriteCount }] = createResource(
    async () => await service.getFavoriteCountByProduct(props.productId)
  );

  const [bookmarkCount, { refetch: refetchBookmarkCount }] = createResource(
    async () => await service.getBookmarkCountByProduct(props.productId)
  );

  const refetch = async () => {
    await refetchFavoriteCount();
    await refetchBookmarkCount();
  };

  const [token] = useToken();

  // アニメーションを登録
  createEffect(() => {
    if (product() == undefined) return;
    gsap.from(".fade-in", { opacity: 0, y: 10 });
    gsap.from(".slide-in-each", { opacity: 0, x: 20, stagger: 0.1 });
  });

  return (
    <Show when={product()} keyed={true}>
      {(product) => (
        <div class="space-y-6">
          <div class="flex gap-6">
            <img
              src={product.pic}
              class="fade-in aspect-[3/4] basis-1/2 bg-slate-100"
              alt="product picture"
            />

            <div class="flex basis-1/2 flex-col gap-3">
              <div class="slide-in-each text-4xl font-bold">{product.name}</div>
              <div class="slide-in-each text-2xl text-rose-600">
                &yen {product.price.toLocaleString()}
              </div>

              <div>
                <div class="slide-in-each flex gap-3">
                  <div>販売開始日: {product.date.toLocaleDateString()}</div>
                  <div>在庫数: {product.quantity.toLocaleString()}</div>
                  <div>
                    販売数:
                    <Show when={salesAmount()} keyed={true} fallback={<>0</>}>
                      {(salesAmount) => <>{salesAmount.toLocaleString()}</>}
                    </Show>
                  </div>
                </div>

                <div class="slide-in-each flex gap-3">
                  <div>
                    お気に入り登録数:
                    <Show when={favoriteCount()} keyed={true} fallback={<>0</>}>
                      {(favoriteCount) => <>{favoriteCount.toLocaleString()}</>}
                    </Show>
                  </div>

                  <div>
                    ブックマーク登録数:
                    <Show when={bookmarkCount()} keyed={true} fallback={<>0</>}>
                      {(bookmarkCount) => <>{bookmarkCount.toLocaleString()}</>}
                    </Show>
                  </div>
                </div>
              </div>

              <div class="slide-in-each border-b border-slate-300"></div>

              <div class="slide-in-each text-xl">{product.desc}</div>

              <div class="flex-grow"></div>

              <Show
                when={token()}
                keyed={true}
                fallback={
                  <div class="slide-in-each text-center text-slate-600">
                    購入にはログインが必要です。
                  </div>
                }
              >
                {(token) => (
                  <ProductInteract
                    token={token}
                    productId={props.productId}
                    onSubmit={refetch}
                  />
                )}
              </Show>
            </div>
          </div>

          <CommentList productId={props.productId} />
        </div>
      )}
    </Show>
  );
};

const ProductInteract: Component<{
  productId: number;
  token: string;
  onSubmit?: () => void;
}> = (props) => {
  const [cartItem, { refetch: refetchCartItem }] = createResource(
    async () => await service.getCartItem(props.token, props.productId)
  );

  const [favorite, { refetch: refetchFavorite }] = createResource(
    async () => await service.hasFavorite(props.token, props.productId)
  );

  const [bookmark, { refetch: refetchBookmark }] = createResource(
    async () => await service.hasBookmark(props.token, props.productId)
  );

  const pushToCart = async () => {
    await service.pushToCart(props.token, props.productId, 1);
    await refetchCartItem();
  };

  const toggleFavorite = async () => {
    if (favorite()) await service.removeFavorite(props.token, props.productId);
    else await service.addFavorite(props.token, props.productId);

    await refetchFavorite();
    if (props.onSubmit) props.onSubmit();
  };

  const toggleBookmark = async () => {
    if (bookmark()) await service.removeBookmark(props.token, props.productId);
    else await service.addBookmark(props.token, props.productId);

    await refetchBookmark();
    if (props.onSubmit) props.onSubmit();
  };

  return (
    <div class="slide-in-each flex gap-3">
      <div class="flex-grow"></div>

      <button
        class="rounded bg-blue-600 p-3 text-white transition active:scale-95 active:bg-blue-400"
        onClick={pushToCart}
      >
        カートに入れる
      </button>

      <Show when={cartItem()} keyed={true}>
        {(cartItem) => (
          <div class="p-3">
            カート内に{cartItem.quantity.toLocaleString()}個
          </div>
        )}
      </Show>

      <div class="flex-grow"></div>

      <button
        class="rounded p-3 transition active:scale-95"
        classList={{
          "text-white bg-blue-600 active:bg-blue-500": favorite(),
          "text-black bg-slate-100 active:bg-slate-200": !favorite(),
        }}
        onClick={toggleFavorite}
      >
        お気に入り
      </button>

      <button
        class="rounded p-3 transition active:scale-95"
        classList={{
          "text-white bg-blue-600 active:bg-blue-500": bookmark(),
          "text-black bg-slate-100 active:bg-slate-200": !bookmark(),
        }}
        onClick={toggleBookmark}
      >
        ブックマーク
      </button>
    </div>
  );
};

// 1ページに表示するコメントの数
const COUNT_PER_PAGE = 10;

// 1種類の商品のコメント一覧をリスト表示
const CommentList: Component<{
  productId: number;
}> = (props) => {
  // ページの状態を保持
  const [page, setPage] = useSearchParamInt("comment_page", 0);

  // コメント一覧を取得
  // productIdかpageが変更されると更新
  const [comments, { refetch: refetchComments }] = createResource(
    page,
    async (page) =>
      await service.getComments(props.productId, page, COUNT_PER_PAGE)
  );

  // ページ数を計算
  // productIdが変更されると更新
  const [count, { refetch: refetchCount }] = createResource(
    async () => await service.getCommentCount(props.productId)
  );
  const maxPageCount = () => calcMaxPageCount(count(), COUNT_PER_PAGE);

  // コメントの表示を更新する
  const refetch = async () => {
    await refetchComments();
    await refetchCount();
  };

  const [token] = useToken();

  return (
    <div class="fade-in space-y-3">
      <div class="text-2xl font-bold">コメント</div>

      <div class="space-y-3">
        <For
          each={comments()}
          fallback={<div class="text-slate-600">コメントはありません。</div>}
        >
          {(x) => <CommentCard comment={x} />}
        </For>
      </div>

      <Show when={token()} keyed={true}>
        {(token) => (
          <div class="rounded border border-slate-300 p-3">
            <CommentForm
              token={token}
              productId={props.productId}
              onSubmit={refetch}
            />
          </div>
        )}
      </Show>

      <Pagenator value={page()} onChange={setPage} maxCount={maxPageCount()} />
    </div>
  );
};

// コメントの表示
const CommentCard: Component<{
  comment: CommentDto;
}> = (props) => {
  const [user] = createResource(
    async () => await service.getUserPublic(props.comment.userId)
  );

  return (
    <div>
      <div class="flex gap-3">
        <Show when={user()} keyed={true}>
          {(user) => <div class="font-bold">{user.name}</div>}
        </Show>

        <div class="text-slate-600">{props.comment.date.toLocaleString()}</div>
      </div>

      <div>{props.comment.body}</div>
    </div>
  );
};

export default ProductHandle;
