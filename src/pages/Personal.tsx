import { A, Outlet, useNavigate } from "@solidjs/router";
import { Component } from "solid-js";
import { service } from "../Service";
import { useToken } from "./TokenContext";

const Personal: Component = () => {
  const navigate = useNavigate();
  const [token, setToken] = useToken();

  const logout = async () => {
    const current = token();
    if (!current) return;

    await service.deleteSession(current);

    setToken(undefined);

    navigate("/ec-site", { replace: true });
  };

  return (
    <div class="flex gap-6">
      <div class="basis-1/5">
        <div class="flex flex-col gap-3">
          <A href="/ec-site/personal/user" class="rounded bg-slate-100 p-3">
            ユーザ情報の表示・編集
          </A>
          <A
            href="/ec-site/personal/addresses"
            class="rounded bg-slate-100 p-3"
          >
            住所の表示・編集
          </A>
          <A href="/ec-site/personal/payments" class="rounded bg-slate-100 p-3">
            支払い方法の表示・編集
          </A>
          <A href="/ec-site/personal/sessions" class="rounded bg-slate-100 p-3">
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
