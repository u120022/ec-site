import { Component, createResource, For, Show } from "solid-js";
import { SessionModel } from "../Models";
import { service } from "../Service";
import PagenateBar from "./PagenateBar";
import { useToken } from "./TokenContext";
import { calcMaxPageCount, useSearchParamInt } from "./Utils";

const SessionListHandle: Component = () => {
  const [token] = useToken();

  return (
    <Show
      when={token()}
      keyed={true}
      fallback={<div class="text-slate-600">ログインが必要です。</div>}
    >
      {(token) => <SessionList token={token} />}
    </Show>
  );
};

const COUNT_PER_PAGE = 8;

// セッション一覧を表示
const SessionList: Component<{
  token: string;
}> = (props) => {
  // URLのパラメータを解析
  const [page, setPage] = useSearchParamInt("page", 0);

  // セッションを取得
  const [sessions, { refetch: refetchSession }] = createResource(
    page,
    async (page) => await service.getSessions(props.token, page, COUNT_PER_PAGE)
  );

  // セッションの削除
  const deleteSession = async (_token: string) => {
    await service.deleteSession(_token);
    await refetchSession();
    await refetchCount();
  };

  // ページ数を計算
  const [count, { refetch: refetchCount }] = createResource(
    async () => await service.getSessionCount(props.token)
  );
  const maxPageCount = () => calcMaxPageCount(count(), COUNT_PER_PAGE);

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

      <div class="space-y-3">
        <For each={sessions()}>
          {(session) => (
            <Show
              when={session.token != props.token}
              fallback={<CurrentSessionCard session={session} />}
            >
              <SessionCard
                session={session}
                deleteSession={() => deleteSession(session.token)}
              />
            </Show>
          )}
        </For>
      </div>

      <div class="p-3 text-center">
        <PagenateBar
          page={page()}
          onSetPage={setPage}
          maxPageCount={maxPageCount()}
        />
      </div>
    </div>
  );
};

// セッション一覧のリスト項目
const SessionCard: Component<{
  session: SessionModel;
  deleteSession: () => void;
}> = (props) => {
  return (
    <div class="flex justify-between rounded border border-slate-300 p-3">
      <div>ログイン: {props.session.date.toLocaleString()}</div>

      <button class="text-rose-600" onClick={props.deleteSession}>
        セッションを削除
      </button>
    </div>
  );
};

const CurrentSessionCard: Component<{
  session: SessionModel;
}> = (props) => {
  return (
    <div class="flex justify-between rounded border border-slate-300 bg-slate-100 p-3">
      <div>ログイン: {props.session.date.toLocaleString()}</div>
    </div>
  );
};

export default SessionListHandle;
