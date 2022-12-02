import { A, Outlet } from "@solidjs/router";
import { Component } from "solid-js";

const Frame: Component = () => {
  return (
    <div class="flex min-h-[100vh] flex-col">
      <div class="sticky top-0 mb-6 w-full border-b border-slate-300 bg-white">
        <div class="flex gap-3 p-3">
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
          <A class="p-3" href="/">
            個人情報
          </A>
        </div>
      </div>

      <div class="container mx-auto min-w-[1024px]">
        <Outlet />
      </div>

      <div class="h-[4rem]"></div>

      <div class="mt-auto w-full bg-slate-100 p-6 text-center text-slate-600">
        <div class="mb-3 text-center">ec-site</div>
        <A href="/about">このサイトについて</A>
      </div>
    </div>
  );
};

export default Frame;
