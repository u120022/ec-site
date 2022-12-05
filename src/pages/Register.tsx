import { Component } from "solid-js";
import RegisterForm from "../forms/RegisterForm";

// ユーザーの新規登録フォーム
const Register: Component = () => {
  return (
    <div class="flex min-h-[100vh] min-w-[1024px]">
      <div class="mx-auto flex basis-1/3 flex-col">
        <div class="my-auto rounded border border-slate-300 p-12">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
};

export default Register;
