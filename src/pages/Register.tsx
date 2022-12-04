import { useNavigate } from "@solidjs/router";
import { Component, createSignal } from "solid-js";
import { service } from "../Service";
import { createForm } from "./form/Validation";

// ユーザーの新規登録フォーム
const Register: Component = () => {
  const form = createForm();
  const [registerError, setRegisterError] = createSignal("");

  // 新規登録を実行
  const navigate = useNavigate();
  const register = async () => {
    // バリデーションチェック
    if (!form.validate()) return;

    // カスタムバリデーションチェック
    if (form.fields.password != form.fields.confirmPassword) {
      setRegisterError("パスワード(確認用)が異なります。");
      return;
    }

    const status = await service.registerUser(
      form.fields.name,
      form.fields.email,
      form.fields.password
    );

    // 新規登録が失敗した場合(メールアドレスが既に存在する場合)
    if (status == "EXISTED_EMAIL") {
      setRegisterError("既に存在するメールアドレスです。");
      return;
    }

    // 新規登録が失敗した場合
    if (status != "SUCCESSFUL") {
      setRegisterError("新規登録に失敗しました。");
      return;
    }

    // 登録完了ページに移動
    navigate("/register_successful", { replace: true });
  };

  return (
    <div class="flex min-h-[100vh] min-w-[1024px]">
      <div class="mx-auto flex basis-1/3 flex-col">
        <div class="my-auto rounded border border-slate-300 p-12">
          <form
            class="flex flex-col gap-6"
            method="dialog"
            novalidate
            onSubmit={register}
          >
            <div>
              <div class="text-3xl font-bold">新規登録</div>
              <span class="text-rose-600">{registerError()}</span>
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
              <label>氏名</label>
              <input
                name="name"
                type="text"
                class="w-full rounded border border-slate-300 p-2"
                required
                ref={form.register}
              />
              <span class="text-rose-600">{form.errors.name}</span>
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

            <div>
              <label>パスワード(確認用)</label>
              <input
                name="confirmPassword"
                type="password"
                class="w-full rounded border border-slate-300 p-2"
                required
                ref={form.register}
              />
              <span class="text-rose-600">{form.errors.confirmPassword}</span>
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
