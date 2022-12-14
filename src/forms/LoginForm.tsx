import { A, useNavigate } from "@solidjs/router";
import { Component, createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import { LoginFormModel } from "../FormModels";
import { service } from "../Service";
import { useToken } from "../pages/TokenContext";

const LoginForm: Component<{
  onSubmit?: () => void;
}> = (props) => {
  const navigate = useNavigate();

  const [token, setToken] = useToken();

  const [form, setForm] = createStore<LoginFormModel>({
    email: "",
    password: "",
  });
  const [formError, setFormError] = createSignal("");

  const onSubmit = async () => {
    const token = await service.createSession(form.email, form.password);

    if (!token) {
      setFormError("ログインできませんでした。");
      return;
    }

    setToken(token);

    navigate("/ec-site", { replace: true });

    if (props.onSubmit) props.onSubmit();
  };

  return (
    <form class="flex flex-col gap-6" method="dialog" onSubmit={onSubmit}>
      <div>
        <div class="text-3xl font-bold">ログイン</div>
        <div class="text-rose-600">{formError()}</div>
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

      <input type="submit" class="w-full rounded bg-blue-600 p-3 text-white" />

      <A class="mx-auto text-blue-600" href="/ec-site/register">
        新規登録
      </A>
    </form>
  );
};

export default LoginForm;
