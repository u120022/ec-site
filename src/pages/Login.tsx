import { A, useNavigate } from "@solidjs/router";
import { Component, createSignal } from "solid-js";
import { service } from "../Service";
import Cookie from "js-cookie";
import { createStore } from "solid-js/store";

interface LoginFormModel {
  email: string;
  password: string;
}

// ユーザーのログインフォーム
const Login: Component = () => {
  const [form, setForm] = createStore<LoginFormModel>({
    email: "",
    password: "",
  });
  const [formError, setFormError] = createSignal("");

  const navigate = useNavigate();
  const login = async () => {
    const token = await service.login(form.email, form.password);

    if (!token) {
      setFormError("ログインに失敗しました。");
      return;
    }

    Cookie.set("SESSION_TOKEN", token);
    navigate("/", { replace: true });
  };

  return (
    <div class="flex min-h-[100vh] min-w-[1024px]">
      <div class="mx-auto flex basis-1/3 flex-col">
        <div class="my-auto rounded border border-slate-300 p-12">
          <form class="flex flex-col gap-6" method="dialog" onSubmit={login}>
            <div>
              <div class="text-3xl font-bold">ログイン</div>
              <span class="text-rose-600">{formError()}</span>
            </div>

            <div>
              <label>メールアドレス</label>
              <input
                type="email"
                class="w-full rounded border border-slate-300 p-2"
                required
                value={form.email}
                onInput={(e) => setForm({ email: e.currentTarget.value })}
              />
            </div>

            <div>
              <label>パスワード</label>
              <input
                type="password"
                class="w-full rounded border border-slate-300 p-2"
                required
                value={form.password}
                onInput={(e) => setForm({ password: e.currentTarget.value })}
              />
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
