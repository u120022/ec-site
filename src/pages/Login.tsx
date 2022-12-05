import { Component } from "solid-js";
import LoginForm from "../forms/LoginForm";

// ユーザーのログインフォーム
const Login: Component = () => {
  return (
    <div class="flex min-h-[100vh] min-w-[1024px]">
      <div class="mx-auto flex basis-1/3 flex-col">
        <div class="my-auto rounded border border-slate-300 p-12">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default Login;
