import { A } from "@solidjs/router";
import { Component, createResource, For, Show } from "solid-js";
import { service } from "../Service";
import PagenateBar from "./PagenateBar";
import { useToken } from "./TokenContext";
import { calcMaxPageCount, useSearchParamInt } from "./Utils";

const BookmarkListHandle: Component = () => {
  const [token] = useToken();

  return (
    <Show
      when={token()}
      keyed={true}
      fallback={<div class="text-slate-600">ログインが必要です。</div>}
    >
      {(token) => <BookmarkList token={token} />}
    </Show>
  );
};

// 1ページに表示される数
const COUNT_PER_PAGE = 8;

// ブックマーク登録一覧をリスト表示
const BookmarkList: Component<{
  token: string;
}> = (props) => {
  const [page, setPage] = useSearchParamInt("page", 0);

  const [bookmarks, { refetch: refetchBookmarks }] = createResource(
    page,
    async (page) =>
      await service.getBookmarks(props.token, page, COUNT_PER_PAGE)
  );

  // ページ数を計算
  const [count, { refetch: refetchCount }] = createResource(
    async () => await service.getBookmarkCount(props.token)
  );
  const maxPageCount = () => calcMaxPageCount(count(), COUNT_PER_PAGE);

  const exists = () => {
    const current = count();
    if (!current) return false;
    return 0 < current;
  };

  const removeBookmark = async (id: number) => {
    await service.removeBookmark(props.token, id);
    await refetch();
  };

  // 表示の更新
  const refetch = async () => {
    await refetchBookmarks();
    await refetchCount();

    if (maxPageCount() <= page()) setPage(maxPageCount() - 1);
  };

  return (
    <div class="space-y-6">
      <div class="text-2xl font-bold">ブックマーク登録された商品</div>

      <Show
        when={exists()}
        fallback={
          <div class="text-slate-600">
            ブックマーク登録された商品はありません。
          </div>
        }
      >
        <div class="space-y-3">
          <For each={bookmarks()}>
            {(bookmark) => (
              <Bookmark
                productId={bookmark.productId}
                removeBookmark={() => removeBookmark(bookmark.productId)}
              />
            )}
          </For>
        </div>

        <div class="p-3 text-center">
          <PagenateBar
            page={page()}
            onSetPage={setPage}
            maxPageCount={maxPageCount()}
          />
        </div>
      </Show>
    </div>
  );
};

// アイテムのリスト項目
const Bookmark: Component<{
  productId: number;
  removeBookmark: () => void;
}> = (props) => {
  const [product] = createResource(
    async () => await service.getProduct(props.productId)
  );

  return (
    <Show
      when={product()}
      keyed={true}
      fallback={<div class="flex aspect-[9/2] gap-6 bg-slate-100"></div>}
    >
      {(product) => (
        <div class="flex gap-6">
          <img
            class="aspect-[3/4] basis-1/6 bg-slate-100"
            src={product.pic}
            alt="product picture"
          />

          <div class="flex-grow space-y-3">
            <A
              class="text-2xl font-bold"
              href={"/ec-site/products/" + props.productId}
            >
              {product.name}
            </A>

            <div class="text-xl text-rose-600">
              &yen {product.price.toLocaleString()}
            </div>

            <div class="border-b border-slate-300"></div>

            <div class="space-x-3">
              <button class="text-rose-600" onClick={props.removeBookmark}>
                削除
              </button>
            </div>
          </div>
        </div>
      )}
    </Show>
  );
};

export default BookmarkListHandle;
