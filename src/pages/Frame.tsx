import { A, Outlet } from "@solidjs/router";
import Cookies from "js-cookie";
import { Component, createResource, Show } from "solid-js";
import { service } from "../Service";

const Frame: Component = () => {
  // ユーザ認証を行う
  const sessionToken = () => Cookies.get("SESSION_TOKEN");
  const [user] = createResource(
    sessionToken,
    async (token) => await service.getUser(token)
  );

  return (
    <div class="flex min-h-[100vh] min-w-[1024px]  flex-col">
      <div class="sticky top-0 mb-6 flex gap-3 border-b border-slate-300 bg-white p-3">
        <A class="p-3" href="/">
          ec-site
        </A>

        <div class="flex-grow"></div>

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
          <A class="p-3" href="/user">
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
