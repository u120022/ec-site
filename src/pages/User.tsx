import { Component } from "solid-js";

const User: Component = () => {
  return (
    <div class="flex gap-6">
      <div class="basis-1/5">
        <div class="space-y-3">
          <div class="rounded bg-slate-100 p-3">プロフィールの表示・編集</div>
          <div class="rounded bg-slate-100 p-3">住所の表示・編集</div>
          <div class="rounded bg-slate-100 p-3">支払い方法の表示・編集</div>
        </div>

        <div class="flex-grow"></div>
      </div>
    </div>
  );
};

export default User;
