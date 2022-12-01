import { useSearchParams } from "@solidjs/router";
import { Accessor, Component, createMemo, For } from "solid-js";

const Pagenate: Component<{ maxPageCount: Accessor<number> }> = (props) => {
  const [params, setParams] = useSearchParams();
  const page = () => parseInt(params.page) || 0;

  const setPage = (page: number) => {
    const validPage = Math.max(0, Math.min(page, props.maxPageCount() - 1));
    setParams({ ...params, page: validPage });
  };

  const items = createMemo(() =>
    Array.from({ length: props.maxPageCount() }, (_, i) => i)
  );

  return (
    <div>
      <button onClick={(_) => setPage(page() - 1)} class="mx-3 p-3">
        &lt
      </button>
      <For each={items()}>
        {(x) => (
          <button onClick={(_) => setPage(x)} class="mx-3 p-3">
            {x + 1}
          </button>
        )}
      </For>
      <button onClick={(_) => setPage(page() + 1)} class="mx-3 p-3">
        &gt
      </button>
    </div>
  );
};

export default Pagenate;
