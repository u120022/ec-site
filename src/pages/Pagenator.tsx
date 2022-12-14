import { Component, Show } from "solid-js";

// ページの表示と操作を行うコンポーネント
const Pagenator: Component<{
  value: number;
  onChange: (value: number) => void;
  maxCount: number;
}> = (props) => {
  // 次のページに変更
  const next = () => {
    const nextPage = props.value + 1;
    if (nextPage < props.maxCount) props.onChange(nextPage);
  };

  // 前のページに変更
  const prev = () => {
    const prevPage = props.value - 1;
    if (0 <= prevPage) props.onChange(prevPage);
  };

  return (
    <Show when={1 < props.maxCount}>
      <div class="space-x-6 text-center">
        <button onClick={prev} class="p-3">
          &lt
        </button>
        <span class="p-3">
          {props.value + 1} / {props.maxCount}
        </span>
        <button onClick={next} class="p-3">
          &gt
        </button>
      </div>
    </Show>
  );
};

export default Pagenator;
