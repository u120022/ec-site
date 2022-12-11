import { Component, Show } from "solid-js";
import UserEmailForm from "../forms/UserEmailForm";
import UserNameForm from "../forms/UserNameForm";
import UserPasswordForm from "../forms/UserPasswordForm";
import { useToken } from "./TokenContext";

// ユーザ情報の変更フォーム
const UserModify: Component = () => {
  const [token] = useToken();

  return (
    <Show
      when={token()}
      keyed={true}
      fallback={<div class="text-slate-600">ログインが必要です。</div>}
    >
      {(token) => (
        <div class="space-y-3">
          <div class="text-2xl font-bold">ユーザ情報の変更</div>
          <UserNameForm token={token} />
          <div class="border-b border-slate-300"></div>
          <UserEmailForm token={token} />
          <div class="border-b border-slate-300"></div>
          <UserPasswordForm token={token} />
        </div>
      )}
    </Show>
  );
};

export default UserModify;
