import { A } from "@solidjs/router";
import { Component } from "solid-js";

const RegisterSuccessful: Component = () => {
  return (
    <div class="flex min-h-[100vh] min-w-[1024px]">
      <div class="mx-auto flex basis-1/3 flex-col">
        <div class="my-auto rounded border border-slate-300 p-12">
          <div class="flex flex-col gap-3">
            <div class="text-2xl">新規登録が完了しました。</div>
            <A class="text-blue-600" href="/login" replace>
              ログインページに移動
            </A>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterSuccessful;
