import { A } from "@solidjs/router";
import { Component, createResource, Show } from "solid-js";
import { service } from "../Service";
import { useToken } from "./TokenContext";

// ユーザ情報を表示
const User: Component = () => {
  const [token] = useToken();
  const [user] = createResource(
    token,
    async (token) => await service.getUser(token)
  );

  return (
    <div class="space-y-3">
      <div class="text-2xl font-bold">ユーザ情報</div>

      <Show
        when={user()}
        fallback={
          <div class="text-slate-600">ユーザ情報の取得に失敗しました。</div>
        }
      >
        <div>
          <div class="font-bold">氏名</div>
          <div>{user().name}</div>
        </div>

        <div>
          <div class="font-bold">メールアドレス</div>
          <div>{user().email}</div>
        </div>

        <div>
          <div class="font-bold">パスワード</div>
          <div>表示できません。</div>
        </div>

        <div>
          <A href="/personal/user_modify" class="text-blue-600">
            ユーザ情報を変更する
          </A>
        </div>
      </Show>
    </div>
  );
};

export default User;
