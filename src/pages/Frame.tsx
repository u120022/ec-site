import { A, Outlet } from "@solidjs/router";
import { Component } from "solid-js";

const Frame: Component = () => {
  return (
    <div class="flex min-h-[100vh] flex-col">
      <div class="sticky top-0 mb-6 w-full bg-white">
        <div class="flex gap-6 p-6">
          <A href="/">ec-site</A>
          <div class="flex-grow"></div>
          <A href="/products">ストア</A>
          <A href="/cart">カート</A>
          <A href="/receipts">購入履歴</A>
          <div>個人情報</div>
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
