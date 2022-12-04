import { A, useNavigate } from "@solidjs/router";
import { Component, createSignal } from "solid-js";
import { service } from "../Service";
import Cookie from "js-cookie";
import { createForm } from "./form/Validation";

// ユーザーのログインフォーム
const Login: Component = () => {
  const form = createForm();
  const [loginError, setLoginError] = createSignal("");

  // セッションの生成
  const navigate = useNavigate();
  const login = async () => {
    // バリデーションチェック
    if (!form.validate()) return;

    const sessionToken = await service.login(
      form.fields.email,
      form.fields.password
    );

    // ログインが失敗した場合
    if (!sessionToken) {
      setLoginError("ログインに失敗しました。");
      return;
    }

    Cookie.set("SESSION_TOKEN", sessionToken);
    navigate("/", { replace: true });
  };

  return (
    <div class="flex min-h-[100vh] min-w-[1024px]">
      <div class="mx-auto flex basis-1/3 flex-col">
        <div class="my-auto  rounded border border-slate-300 p-12">
          <form
            class="flex flex-col gap-6"
            method="dialog"
            novalidate
            onSubmit={login}
          >
            <div>
              <div class="text-3xl font-bold">ログイン</div>
              <span class="text-rose-600">{loginError()}</span>
            </div>

            <div>
              <label>メールアドレス</label>
              <input
                name="email"
                type="email"
                class="w-full rounded border border-slate-300 p-2"
                required
                ref={form.register}
              />
              <span class="text-rose-600">{form.errors.email}</span>
            </div>

            <div>
              <label>パスワード</label>
              <input
                name="password"
                type="password"
                class="w-full rounded border border-slate-300 p-2"
                required
                ref={form.register}
              />
              <span class="text-rose-600">{form.errors.password}</span>
            </div>

            <input
              type="submit"
              class="w-full rounded bg-blue-600 p-3 text-white"
            />

            <A class="mx-auto text-blue-600" href="/register">
              新規登録
            </A>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
