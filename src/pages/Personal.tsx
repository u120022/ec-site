import { A, Outlet, useNavigate } from "@solidjs/router";
import Cookies from "js-cookie";
import { Component } from "solid-js";
import { service } from "../Service";

const Personal: Component = () => {
  const sessionToken = () => Cookies.get("SESSION_TOKEN");

  const navigate = useNavigate();
  const logout = async () => {
    // 現在のセッションを削除
    await service.deleteSession(sessionToken());

    // Cookieからトークンを削除する
    Cookies.remove("SESSION_TOKEN");
    navigate("/", { replace: true });
  };

  return (
    <div class="flex gap-6">
      <div class="basis-1/5">
        <div class="flex flex-col gap-3">
          <A href="/personal/user" class="rounded bg-slate-100 p-3">
            ユーザ情報の表示・編集
          </A>
          <A href="/personal/address" class="rounded bg-slate-100 p-3">
            住所の表示・編集
          </A>
          <A href="/personal/payment" class="rounded bg-slate-100 p-3">
            支払い方法の表示・編集
          </A>
          <A href="/personal/session" class="rounded bg-slate-100 p-3">
            セッションの表示・編集
          </A>
          <A href="#" class="rounded bg-slate-100 p-3" onClick={logout}>
            ログアウト
          </A>
        </div>
      </div>

      <div class="flex-grow">
        <Outlet />
      </div>
    </div>
  );
};

export default Personal;
