import Cookies from "js-cookie";
import { Component, createResource, Index, Show } from "solid-js";
import { SessionModel } from "../Models";
import { service } from "../Service";

// セッション一覧を表示
const SessionList: Component = () => {
  const sessionToken = () => Cookies.get("SESSION_TOKEN");
  const [sessions, { refetch: refetchSession }] = createResource(
    sessionToken,
    async (sessionToken) => await service.getSessions(sessionToken)
  );

  // セッションの削除
  const deleteSession = async (token: string) => {
    // 現在のセッションは削除しない
    if (token == sessionToken()) return;

    await service.deleteSession(token);
    await refetchSession();
  };

  return (
    <div class="space-y-3">
      <div class="text-2xl font-bold">セッション</div>

      <div>
        ログインしているブラウザを表示します。
        <br />
        セッションを削除するとそのブラウザで再ログインが必要になります。
        <br />
        現在のセッションを削除する場合はログアウトしてください。
      </div>

      <Show
        when={sessions()}
        fallback={<div class="text-slate-600">セッションが存在しません。</div>}
      >
        <div class="space-y-3">
          <Index each={sessions()}>
            {(x) => <SessionCard session={x} deleteSession={deleteSession} />}
          </Index>
        </div>
      </Show>
    </div>
  );
};

// セッション一覧のリスト項目
const SessionCard: Component<{
  session: () => SessionModel;
  deleteSession: (token: string) => Promise<void>;
}> = (props) => {
  const sessionToken = () => Cookies.get("SESSION_TOKEN");

  // セッションを削除する
  const deleteSession = async () => {
    await props.deleteSession(props.session().token);
  };

  return (
    <div class="flex justify-between rounded border border-slate-300 p-3">
      <div>ログイン: {props.session().date.toLocaleString()}</div>

      <Show
        when={props.session().token != sessionToken()}
        fallback={<div class="text-slate-600">現在のセッション</div>}
      >
        <button class="text-rose-600" onClick={deleteSession}>
          セッションを削除
        </button>
      </Show>
    </div>
  );
};

export default SessionList;
