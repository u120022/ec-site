import { useSearchParams } from "@solidjs/router";
import Cookies from "js-cookie";
import { Component, createResource, Index, Show } from "solid-js";
import { SessionModel } from "../Models";
import { service } from "../Service";
import PagenateBar from "./PagenateBar";

const COUNT_PER_PAGE = 8;

// セッション一覧を表示
const SessionList: Component = () => {
  // URLのパラメータを解析
  const [params, setParams] = useSearchParams();
  const page = () => parseInt(params.page) || 0;
  const setPage = (page: number) => setParams({ ...params, page });

  // セッションを取得
  const token = () => Cookies.get("SESSION_TOKEN");
  const [sessions, { refetch: refetchSession }] = createResource(
    () => ({ token: token(), page: page() }),
    async ({ token, page }) =>
      await service.getSessions(token, page, COUNT_PER_PAGE)
  );

  // セッションの削除
  const deleteSession = async (_token: string) => {
    // 現在のセッションは削除しない
    if (_token == token()) return;

    await service.deleteSession(_token);
    await refetchSession();
    await refetchCount();
  };

  // ページ数を計算
  const [count, { refetch: refetchCount }] = createResource(
    token,
    async (token) => await service.getSessionCount(token)
  );
  const maxPageCount = () => Math.ceil(count() / COUNT_PER_PAGE);

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

        <Show when={1 < maxPageCount()}>
          <div class="p-3 text-center">
            <PagenateBar
              page={page}
              setPage={setPage}
              maxPageCount={maxPageCount}
            />
          </div>
        </Show>
      </Show>
    </div>
  );
};

// セッション一覧のリスト項目
const SessionCard: Component<{
  session: () => SessionModel;
  deleteSession: (token: string) => Promise<void>;
}> = (props) => {
  const token = () => Cookies.get("SESSION_TOKEN");

  // セッションを削除する
  const deleteSession = async () => {
    await props.deleteSession(props.session().token);
  };

  return (
    <div class="flex justify-between rounded border border-slate-300 p-3">
      <div>ログイン: {props.session().date.toLocaleString()}</div>

      <Show
        when={props.session().token != token()}
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
