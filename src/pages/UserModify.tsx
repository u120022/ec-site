import Cookies from "js-cookie";
import { Component, createResource, Show } from "solid-js";
import { createStore } from "solid-js/store";
import { service } from "../Service";
import { createForm } from "./form/Validation";

// ユーザ情報の変更フォーム
const UserModify: Component = () => {
  const sessionToken = () => Cookies.get("SESSION_TOKEN");
  const [user, { refetch: refetchUser }] = createResource(
    sessionToken,
    async (sessionToken) => await service.getUser(sessionToken)
  );

  const modifyName = async (name: string) => {
    const status = await service.updateUser(sessionToken(), { name });
    await refetchUser();
    return status;
  };

  const modifyEmail = async (email: string) => {
    const status = await service.updateUser(sessionToken(), { email });
    await refetchUser();
    return status;
  };

  const modifyPassword = async (password: string) => {
    const status = await service.updateUser(sessionToken(), { password });
    await refetchUser();
    return status;
  };

  return (
    <div class="space-y-3">
      <div class="text-2xl font-bold">ユーザ名の変更</div>

      <Show
        when={user()}
        fallback={
          <div class="text-slate-600">ユーザ情報の取得に失敗しました。</div>
        }
      >
        <UserModifyName name={() => user().name} modifyName={modifyName} />
        <div class="border-b border-slate-300"></div>
        <UserModifyEmail email={() => user().email} modifyEmail={modifyEmail} />
        <div class="border-b border-slate-300"></div>
        <UserModifyPassword modifyPassword={modifyPassword} />
      </Show>
    </div>
  );
};

// 氏名の変更フォーム
const UserModifyName: Component<{
  name: () => string;
  modifyName: (
    value: string
  ) => Promise<"INVALID" | "EXISTED_EMAIL" | "SUCCESSFUL">;
}> = (props) => {
  const form = createForm();
  const [formLog, setFormLog] = createStore({ info: "", error: "" });

  const onSubmit = async () => {
    setFormLog({ info: "", error: "" });

    // バリデーションチェック
    if (!form.validate()) return;

    const status = await props.modifyName(form.fields.name);

    if (status != "SUCCESSFUL") {
      setFormLog({ error: "名前の変更に失敗しました。" });
      return;
    }

    setFormLog({ info: "変更しました。" });
    form.clear();
  };

  return (
    <form class="space-y-3" onSubmit={onSubmit} novalidate method="dialog">
      <div>
        <div class="font-bold">現在の氏名</div>
        <div>{props.name()}</div>
      </div>

      <div>
        <span class="text-green-600">{formLog.info}</span>
        <span class="text-rose-600">{formLog.error}</span>
      </div>

      <div>
        <div>変更先の氏名</div>
        <input
          name="name"
          type="text"
          class="block rounded border border-slate-300 p-2"
          required
          ref={form.register}
        />
        <span class="text-rose-600">{form.errors.name}</span>
      </div>

      <input type="submit" class="text-blue-600" />
    </form>
  );
};

// メールアドレスの変更フォーム
const UserModifyEmail: Component<{
  email: () => string;
  modifyEmail: (
    value: string
  ) => Promise<"INVALID" | "EXISTED_EMAIL" | "SUCCESSFUL">;
}> = (props) => {
  const form = createForm();
  const [formLog, setFormLog] = createStore({ info: "", error: "" });

  const onSubmit = async () => {
    setFormLog({ info: "", error: "" });

    // バリデーションチェック
    if (!form.validate()) return;

    const status = await props.modifyEmail(form.fields.email);

    if (status == "EXISTED_EMAIL") {
      setFormLog({ error: "既に存在するメールアドレスです。" });
      return;
    }

    if (status != "SUCCESSFUL") {
      setFormLog({ error: "メールアドレスの変更に失敗しました。" });
      return;
    }

    setFormLog({ info: "変更しました。" });
    form.clear();
  };

  return (
    <form method="dialog" novalidate onSubmit={onSubmit} class="space-y-3">
      <div>
        <div class="font-bold">現在のメールアドレス</div>
        <div>{props.email()}</div>
      </div>

      <div>
        <span class="text-green-600">{formLog.info}</span>
        <span class="text-rose-600">{formLog.error}</span>
      </div>

      <div>
        <div>変更先のメールアドレス</div>
        <input
          name="email"
          type="email"
          class="block rounded border border-slate-300 p-2"
          required
          ref={form.register}
        />
        <span class="text-rose-600">{form.errors.email}</span>
      </div>

      <input type="submit" class="text-blue-600" />
    </form>
  );
};

// パスワードの変更フォーム
const UserModifyPassword: Component<{
  modifyPassword: (
    value: string
  ) => Promise<"INVALID" | "EXISTED_EMAIL" | "SUCCESSFUL">;
}> = (props) => {
  const form = createForm();
  const [formLog, setFormLog] = createStore({ info: "", error: "" });

  const onSubmit = async () => {
    setFormLog({ info: "", error: "" });

    // バリデーションチェック
    if (!form.validate()) return;

    if (form.fields.password != form.fields.confirmPassword) {
      setFormLog({ error: "パスワード(確認用)が違います。" });
      return;
    }

    const status = await props.modifyPassword(form.fields.password);

    if (status != "SUCCESSFUL") {
      setFormLog({ error: "パスワードの変更に失敗しました。" });
      return;
    }

    setFormLog({ info: "変更しました。" });
    form.clear();
  };

  return (
    <form class="space-y-3" novalidate onSubmit={onSubmit} method="dialog">
      <div>
        <div class="font-bold">現在のパスワード</div>
        <div>表示できません。</div>
      </div>

      <div>
        <span class="text-green-600">{formLog.info}</span>
        <span class="text-rose-600">{formLog.error}</span>
      </div>

      <div>
        <div>変更先のパスワード</div>
        <input
          name="password"
          type="password"
          class="block rounded border border-slate-300 p-2"
          required
          ref={form.register}
        />
        <span class="text-rose-600">{form.errors.password}</span>
      </div>

      <div>
        <div>変更先のパスワード(確認用)</div>
        <input
          name="confirmPassword"
          type="password"
          class="block rounded border border-slate-300 p-2"
          required
          ref={form.register}
        />
        <span class="text-rose-600">{form.errors.confirmPassword}</span>
      </div>

      <input type="submit" class="text-blue-600" />
    </form>
  );
};

export default UserModify;
