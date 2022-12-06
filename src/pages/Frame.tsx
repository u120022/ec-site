import { A, Outlet, useSearchParams } from "@solidjs/router";
import { Component, createResource, Show } from "solid-js";
import { service } from "../Service";
import { useToken } from "./TokenContext";

const Frame: Component = () => {
  const [params, setParams] = useSearchParams();
  const [token] = useToken();
  const [user] = createResource(
    token,
    async (token) => await service.getUser(token)
  );

  const setSearchQuery = (search: string) => {
    setParams({ search });
  };

  return (
    <div class="flex min-h-[100vh] min-w-[1024px]  flex-col">
      <div class="sticky top-0 mb-6 flex gap-3 border-b border-slate-300 bg-white p-3">
        <A class="p-3" href="/">
          ec-site
        </A>

        <div class="flex-grow"></div>

        <input
          placeholder="検索"
          type="search"
          class="rounded border border-slate-300 p-2"
          onChange={(e) => setSearchQuery(e.currentTarget.value)}
        />

        <A class="p-3" href="/products">
          ストア
        </A>
        <A class="p-3" href="/cart">
          カート
        </A>
        <A class="p-3" href="/receipts">
          購入履歴
        </A>

        <Show
          when={user()}
          fallback={
            <A class="p-3" href="/login">
              ログイン
            </A>
          }
        >
          <A class="p-3" href="/personal">
            {user().name}
          </A>
        </Show>
      </div>

      <div class="container mx-auto p-3">
        <Outlet />
      </div>

      <div class="flex-grow"></div>

      <div class="mt-12 bg-slate-100 p-3 text-slate-600">
        <div class="flex justify-center gap-3">
          <A class="p-3" href="/">
            ec-site
          </A>
        </div>
        <div class="flex justify-center gap-3">
          <A class="p-3" href="/about">
            このサイトについて
          </A>
        </div>
      </div>
    </div>
  );
};

export default Frame;
