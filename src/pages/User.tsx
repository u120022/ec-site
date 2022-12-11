import { A } from "@solidjs/router";
import { Component, createResource, Show } from "solid-js";
import { service } from "../Service";
import { useToken } from "./TokenContext";

const UserHandle: Component = () => {
  const [token] = useToken();

  return (
    <Show
      when={token()}
      keyed={true}
      fallback={<div class="text-slate-600">ログインが必要です。</div>}
    >
      {(token) => <User token={token} />}
    </Show>
  );
};

// ユーザ情報を表示
const User: Component<{
  token: string;
}> = (props) => {
  const [user] = createResource(
    async () => await service.getUserPrivate(props.token)
  );

  return (
    <div class="space-y-3">
      <div class="text-2xl font-bold">ユーザ情報</div>

      <Show when={user()} keyed={true}>
        {(user) => (
          <>
            <div>
              <div class="font-bold">氏名</div>
              <div>{user.name}</div>
            </div>

            <div>
              <div class="font-bold">メールアドレス</div>
              <div>{user.email}</div>
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
          </>
        )}
      </Show>
    </div>
  );
};

export default UserHandle;
