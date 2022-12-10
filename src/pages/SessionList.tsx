import { Component, createResource, For } from "solid-js";
import { SessionModel } from "../Models";
import { service } from "../Service";
import PagenateBar from "./PagenateBar";
import { useToken } from "./TokenContext";
import { calcMaxPageCount, useSearchParamInt } from "./Utils";

const COUNT_PER_PAGE = 8;

// セッション一覧を表示
const SessionList: Component = () => {
  // URLのパラメータを解析
  const [page, setPage] = useSearchParamInt("page", 0);

  const [token] = useToken();

  // セッションを取得
  const [sessions, { refetch: refetchSession }] = createResource(
    page,
    async (page) => await service.getSessions(token(), page, COUNT_PER_PAGE)
  );

  // セッションの削除
  const deleteSession = async (_token: string) => {
    await service.deleteSession(_token);
    await refetchSession();
    await refetchCount();
  };

  // ページ数を計算
  const [count, { refetch: refetchCount }] = createResource(
    async () => await service.getSessionCount(token())
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
            <SessionCard
              session={session}
              deleteSession={() => deleteSession(session.token)}
            />
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

export default SessionList;
