import { Component, Show } from "solid-js";
import PurchaseForm from "../forms/PurchaseForm";
import { useToken } from "./TokenContext";

const Purchase: Component = () => {
  const [token] = useToken();

  return (
    <Show
      when={token()}
      keyed={true}
      fallback={<div class="text-slate-600">ログインしてください。</div>}
    >
      {(token) => <PurchaseForm token={token} />}
    </Show>
  );
};

export default Purchase;
