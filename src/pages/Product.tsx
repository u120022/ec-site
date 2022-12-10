import { Component, createResource, createSignal, For, Show } from "solid-js";
import { CommentDto, ProductDto } from "../Dto";
import CommentForm from "../forms/CommentForm";
import { service } from "../Service";
import PagenateBar from "./PagenateBar";
import { useToken } from "./TokenContext";
import { calcMaxPageCount, useParamInt } from "./Utils";

// 商品の詳細を表示
const Product: Component = () => {
  const id = useParamInt("id", undefined);

  const [token] = useToken();

  const [product] = createResource(id, async (id) => service.getProduct(id));

  const [cartItem, { refetch: refetchCartItem }] = createResource(
    id,
    async (id) => await service.getCartItem(token(), id)
  );

  const pushToCart = async () => {
    await service.pushToCart(token(), id(), 1);
    await refetchCartItem();
  };

  return (
    <div class="space-y-6">
      <Show when={product()} keyed={true}>
        {(product) => (
          <>
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

                <div class="mx-auto space-x-3">
                  <button
                    class="rounded bg-blue-600 p-3 text-white"
                    onClick={pushToCart}
                  >
                    カートに入れる
                  </button>

                  <Show when={cartItem()} keyed={true}>
                    {(cartItem) => (
                      <span class="p-3">
                        カート内に{cartItem.count.toLocaleString()}個
                      </span>
                    )}
                  </Show>
                </div>
              </div>
            </div>

            <CommentList product={product} />
          </>
        )}
      </Show>
    </div>
  );
};

// 1ページに表示するコメントの数
const COUNT_PER_PAGE = 10;

// 1種類の商品のコメント一覧をリスト表示
const CommentList: Component<{
  product: ProductDto;
}> = (props) => {
  // ページの状態を保持
  const [page, setPage] = createSignal(0);

  // コメント一覧を取得
  // productIdかpageが変更されると更新
  const [comments, { refetch: refetchComments }] = createResource(
    () => ({ id: props.product.id, page: page() }),
    async ({ id, page }) => await service.getComments(id, page, COUNT_PER_PAGE)
  );

  // ページ数を計算
  // productIdが変更されると更新
  const [count, { refetch: refetchCount }] = createResource(
    props.product.id,
    async (id) => await service.getCommentCount(id)
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
        <CommentForm productId={props.product.id} onSubmit={refetch} />
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
  return (
    <div>
      {props.comment.body} {props.comment.date.toLocaleString()}
    </div>
  );
};

export default Product;
