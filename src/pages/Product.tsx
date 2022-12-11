import { Component, createResource, For, Show } from "solid-js";
import { CommentDto } from "../Dto";
import CommentForm from "../forms/CommentForm";
import { service } from "../Service";
import PagenateBar from "./PagenateBar";
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
  const [product] = createResource(async () =>
    service.getProduct(props.productId)
  );

  const [token] = useToken();

  return (
    <Show when={product()} keyed={true}>
      {(product) => (
        <div class="space-y-6">
          <div class="flex gap-6">
            <img
              src={product.pic}
              class="aspect-[3/4] basis-1/2 bg-slate-100"
              alt="product picture"
            />

            <div class="flex basis-1/2 flex-col gap-3">
              <div class="text-4xl font-bold">{product.name}</div>
              <div class="text-2xl text-rose-600">
                &yen {product.value.toLocaleString()}
              </div>
              <div>在庫数: {product.count.toLocaleString()}</div>

              <div class="border-b border-slate-300"></div>

              <div class="text-xl">{product.desc}</div>

              <div class="flex-grow"></div>

              <div class="mx-auto">
                <Show
                  when={token()}
                  keyed={true}
                  fallback={
                    <div class="text-slate-600">
                      購入にはログインが必要です。
                    </div>
                  }
                >
                  {(token) => (
                    <ProductPushToCart
                      token={token}
                      productId={props.productId}
                    />
                  )}
                </Show>
              </div>
            </div>
          </div>

          <Show when={token()} keyed={true}>
            {(token) => (
              <CommentList token={token} productId={props.productId} />
            )}
          </Show>
        </div>
      )}
    </Show>
  );
};

const ProductPushToCart: Component<{
  productId: number;
  token: string;
}> = (props) => {
  const [cartItem, { refetch: refetchCartItem }] = createResource(
    async () => await service.getCartItem(props.token, props.productId)
  );

  const pushToCart = async () => {
    await service.pushToCart(props.token, props.productId, 1);
    await refetchCartItem();
  };

  return (
    <div class="flex gap-3">
      <button class="rounded bg-blue-600 p-3 text-white" onClick={pushToCart}>
        カートに入れる
      </button>

      <Show when={cartItem()} keyed={true}>
        {(cartItem) => (
          <div class="p-3">カート内に{cartItem.count.toLocaleString()}個</div>
        )}
      </Show>
    </div>
  );
};

// 1ページに表示するコメントの数
const COUNT_PER_PAGE = 10;

// 1種類の商品のコメント一覧をリスト表示
const CommentList: Component<{
  productId: number;
  token: string;
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

  return (
    <div class="space-y-3">
      <div class="text-2xl font-bold">コメント</div>

      <div class="space-y-3">
        <For each={comments()}>{(x) => <Comment comment={x} />}</For>
      </div>

      <div class="rounded border border-slate-300 p-3">
        <CommentForm
          token={props.token}
          productId={props.productId}
          onSubmit={refetch}
        />
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

// コメントの表示
const Comment: Component<{
  comment: CommentDto;
}> = (props) => {
  const [user] = createResource(
    async () => await service.getUserPublic(props.comment.userId)
  );

  return (
    <div class="flex gap-3">
      <Show when={user()} keyed={true}>
        {(user) => <div class="font-bold">{user.name}</div>}
      </Show>

      <div>{props.comment.body}</div>

      <div class="text-slate-600">{props.comment.date.toLocaleString()}</div>
    </div>
  );
};

export default ProductHandle;
