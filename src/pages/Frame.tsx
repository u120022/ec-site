import { A, Outlet } from "@solidjs/router";
import { Component, createResource, Show } from "solid-js";
import { service } from "../Service";
import { useToken } from "./TokenContext";
import { useSearchParam } from "./Utils";

const Frame: Component = () => {
  const [token] = useToken();

  const [user] = createResource(
    async () => await service.getUserPrivate(token())
  );

  const [filter, setFilter] = useSearchParam("filter", undefined);

  return (
    <div class="flex min-h-[100vh] min-w-[1024px] flex-col">
      <div class="sticky top-0 mb-6 flex gap-3 bg-[#fff4] p-3 shadow backdrop-blur">
        <A class="p-3 font-bold" href="/">
          ec-site
        </A>

        <div class="flex-grow"></div>

        <input
          placeholder="検索"
          type="search"
          class="rounded-xl bg-[#ddd4] px-4 py-2 placeholder:text-[#444]"
          onChange={(e) => setFilter(e.currentTarget.value)}
        />

        <A class="p-3 font-bold" href="/products">
          ストア
        </A>
        <A class="p-3 font-bold" href="/cart">
          カート
        </A>
        <A class="p-3 font-bold" href="/receipts">
          購入履歴
        </A>

        <Show
          when={user()}
          keyed={true}
          fallback={
            <A class="p-3 font-bold" href="/login">
              ログイン
            </A>
          }
        >
          {(user) => (
            <A class="p-3" href="/personal">
              {user.name}
            </A>
          )}
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
