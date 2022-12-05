import { Component } from "solid-js";
import UserEmailForm from "../forms/UserEmailForm";
import UserNameForm from "../forms/UserNameForm";
import UserPasswordForm from "../forms/UserPasswordForm";

// ユーザ情報の変更フォーム
const UserModify: Component = () => {
  return (
    <div class="space-y-3">
      <div class="text-2xl font-bold">ユーザ名の変更</div>
      <UserNameForm />
      <div class="border-b border-slate-300"></div>
      <UserEmailForm />
      <div class="border-b border-slate-300"></div>
      <UserPasswordForm />
    </div>
  );
};

export default UserModify;
