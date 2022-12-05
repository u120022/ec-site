import { useNavigate } from "@solidjs/router";
import { Component, createSignal } from "solid-js";
import { service } from "../Service";
import { createStore } from "solid-js/store";

interface RegisterFormModel {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// ユーザーの新規登録フォーム
const Register: Component = () => {
  const [form, setForm] = createStore<RegisterFormModel>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [formError, setFormError] = createSignal("");

  const navigate = useNavigate();
  const register = async () => {
    if (form.password != form.confirmPassword) {
      setFormError("パスワード(確認用)が異なります。");
      return;
    }

    const status = await service.registerUser(
      form.name,
      form.email,
      form.password
    );

    if (status == "EXISTED_EMAIL") {
      setFormError("既に存在するメールアドレスです。");
      return;
    }

    if (status != "SUCCESSFUL") {
      setFormError("新規登録に失敗しました。");
      return;
    }

    navigate("/register_successful", { replace: true });
  };

  return (
    <div class="flex min-h-[100vh] min-w-[1024px]">
      <div class="mx-auto flex basis-1/3 flex-col">
        <div class="my-auto rounded border border-slate-300 p-12">
          <form class="flex flex-col gap-6" method="dialog" onSubmit={register}>
            <div>
              <div class="text-3xl font-bold">新規登録</div>
              <span class="text-rose-600">{formError()}</span>
            </div>

            <div>
              <label>氏名</label>
              <input
                type="text"
                class="w-full rounded border border-slate-300 p-2"
                required
                value={form.name}
                onInput={(e) => setForm({ name: e.currentTarget.value })}
              />
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

            <div>
              <label>パスワード(確認用)</label>
              <input
                name="confirmPassword"
                type="password"
                class="w-full rounded border border-slate-300 p-2"
                required
                value={form.confirmPassword}
                onInput={(e) =>
                  setForm({ confirmPassword: e.currentTarget.value })
                }
              />
            </div>

            <input
              type="submit"
              class="w-full rounded bg-blue-600 p-3 text-white"
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
