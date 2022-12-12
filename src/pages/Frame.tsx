import { A, Outlet } from "@solidjs/router";
import { Component, createResource, Show } from "solid-js";
import { service } from "../Service";
import { useToken } from "./TokenContext";

const Frame: Component = () => {
  const [token] = useToken();

  return (
    <div class="flex min-h-[100vh] min-w-[1024px] flex-col">
      <div class="sticky top-0 mb-6 flex gap-3 bg-[#fff4] p-3 shadow backdrop-blur">
        <A class="p-3 font-bold" href="/ec-site">
          ec-site
        </A>

        <div class="flex-grow"></div>

        <A class="p-3 font-bold" href="/ec-site/products">
          ストア
        </A>
        <A class="p-3 font-bold" href="/ec-site/bookmarks">
          ブックマーク
        </A>
        <A class="p-3 font-bold" href="/ec-site/cart">
          カート
        </A>
        <A class="p-3 font-bold" href="/ec-site/receipts">
          購入履歴
        </A>

        <Show
          when={token()}
          keyed={true}
          fallback={<DisabledLoginStatusView />}
        >
          {(token) => <LoginStatusView token={token} />}
        </Show>
      </div>

      <div class="container mx-auto p-3">
        <Outlet />
      </div>

      <div class="flex-grow"></div>

      <div class="mt-12 bg-slate-100 p-3 text-slate-600">
        <div class="flex justify-center gap-3">
          <A class="p-3" href="/ec-site">
            ec-site
          </A>
        </div>
        <div class="flex justify-center gap-3">
          <A class="p-3" href="/">
            このサイトについて
          </A>
        </div>
      </div>
    </div>
  );
};

const LoginStatusView: Component<{
  token: string;
}> = (props) => {
  const [user] = createResource(
    async () => await service.getUserPrivate(props.token)
  );

  return (
    <Show when={user()} keyed={true} fallback={<DisabledLoginStatusView />}>
      {(user) => (
        <A class="p-3 font-bold" href="/ec-site/personal">
          {user.name}
        </A>
      )}
    </Show>
  );
};

const DisabledLoginStatusView: Component = () => {
  return (
    <A class="p-3 font-bold" href="/ec-site/login">
      ログイン
    </A>
  );
};

export default Frame;
