import { Component, Show } from "solid-js";

// ページの表示と操作を行うコンポーネント
const PagenateBar: Component<{
  page: () => number;
  setPage: (page: number) => void;
  maxPageCount: () => number;
}> = (props) => {
  // 次のページに変更
  const next = () => {
    const nextPage = props.page() + 1;
    if (nextPage < props.maxPageCount()) props.setPage(nextPage);
  };

  // 前のページに変更
  const prev = () => {
    const prevPage = props.page() - 1;
    if (0 <= prevPage) props.setPage(prevPage);
  };

  return (
    <Show when={1 < props.maxPageCount()}>
      <div class="space-x-6">
        <button onClick={prev} class="p-3">
          &lt
        </button>
        <span class="p-3">
          {props.page() + 1} / {props.maxPageCount()}
        </span>
        <button onClick={next} class="p-3">
          &gt
        </button>
      </div>
    </Show>
  );
};

export default PagenateBar;
