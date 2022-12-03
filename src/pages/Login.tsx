import { A, useNavigate } from "@solidjs/router";
import { Component, createSignal } from "solid-js";
import { service } from "../Service";
import Cookie from "js-cookie";

// ユーザーのログインフォーム
const Login: Component = () => {
  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");

  // セッションの生成
  const navigate = useNavigate();
  const login = async () => {
    const token = await service.createSession(email(), password());
    if (token) {
      Cookie.set("TOKEN", token);
      navigate("/", { replace: true });
    }
  };

  return (
    <div class="flex min-h-[100vh] min-w-[1024px]">
      <div class="mx-auto flex basis-1/3 flex-col">
        <div class="my-auto flex flex-col gap-6 rounded border border-slate-300 p-12">
          <div class="text-3xl font-bold">ログイン</div>
          <div>
            <label>メールアドレスまたは電話番号</label>
            <input
              type="text"
              class="w-full rounded border border-slate-300 p-2"
              value={email()}
              onInput={(e) => setEmail(e.currentTarget.value)}
            />
          </div>
          <div>
            <label>パスワード</label>
            <input
              type="password"
              class="w-full rounded border border-slate-300 p-2"
              value={password()}
              onInput={(e) => setPassword(e.currentTarget.value)}
            />
            <A class="text-blue-600" href="/forgetpassword">
              パスワードを忘れた
            </A>
          </div>

          <button
            onClick={login}
            class="w-full rounded bg-blue-600 p-3 text-white"
          >
            次に進む
          </button>

          <A class="mx-auto text-blue-600" href="/register">
            新規登録
          </A>
        </div>
      </div>
    </div>
  );
};

export default Login;
