import Cookies from "js-cookie";
import { Component, createResource, createSignal, Show } from "solid-js";
import { createStore } from "solid-js/store";
import { service } from "../Service";

// ユーザ情報の変更フォーム
const UserModify: Component = () => {
  const token = () => Cookies.get("SESSION_TOKEN");
  const [user, { refetch: refetchUser }] = createResource(
    token,
    async (token) => await service.getUser(token)
  );

  const modifyName = async (name: string) => {
    const status = await service.updateUser(token(), { name });
    await refetchUser();
    return status;
  };

  const modifyEmail = async (email: string) => {
    const status = await service.updateUser(token(), { email });
    await refetchUser();
    return status;
  };

  const modifyPassword = async (password: string) => {
    const status = await service.updateUser(token(), { password });
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

interface UserNameFormModel {
  name: string;
}

// 氏名の変更フォーム
const UserModifyName: Component<{
  name: () => string;
  modifyName: (
    value: string
  ) => Promise<"INVALID" | "EXISTED_EMAIL" | "SUCCESSFUL">;
}> = (props) => {
  const [form, setForm] = createStore<UserNameFormModel>({ name: "" });
  const [formError, setFormError] = createSignal("");

  const onSubmit = async () => {
    const status = await props.modifyName(form.name);

    if (status != "SUCCESSFUL") {
      setFormError("名前の変更に失敗しました。");
      return;
    }

    setForm({ name: "" });
  };

  return (
    <form class="space-y-3" onSubmit={onSubmit} method="dialog">
      <div>
        <div class="font-bold">現在の氏名</div>
        <div>{props.name()}</div>
      </div>

      <div>
        <span class="text-rose-600">{formError()}</span>
      </div>

      <div>
        <div>変更先の氏名</div>
        <input
          type="text"
          class="block rounded border border-slate-300 p-2"
          required
          value={form.name}
          onInput={(e) => setForm({ name: e.currentTarget.value })}
        />
      </div>

      <input type="submit" class="text-blue-600" />
    </form>
  );
};

interface UserEmailFormModel {
  email: string;
}

// メールアドレスの変更フォーム
const UserModifyEmail: Component<{
  email: () => string;
  modifyEmail: (
    value: string
  ) => Promise<"INVALID" | "EXISTED_EMAIL" | "SUCCESSFUL">;
}> = (props) => {
  const [form, setForm] = createStore<UserEmailFormModel>({ email: "" });
  const [formError, setFormError] = createSignal("");

  const onSubmit = async () => {
    const status = await props.modifyEmail(form.email);

    if (status == "EXISTED_EMAIL") {
      setFormError("既に存在するメールアドレスです。");
      return;
    }

    if (status != "SUCCESSFUL") {
      setFormError("メールアドレスの変更に失敗しました。");
      return;
    }

    setForm({ email: "" });
  };

  return (
    <form method="dialog" onSubmit={onSubmit} class="space-y-3">
      <div>
        <div class="font-bold">現在のメールアドレス</div>
        <div>{props.email()}</div>
      </div>

      <div>
        <span class="text-rose-600">{formError()}</span>
      </div>

      <div>
        <div>変更先のメールアドレス</div>
        <input
          type="email"
          class="block rounded border border-slate-300 p-2"
          required
          value={form.email}
          onInput={(e) => setForm({ email: e.currentTarget.value })}
        />
      </div>

      <input type="submit" class="text-blue-600" />
    </form>
  );
};

interface UserPasswordFormModel {
  password: string;
  confirmPassword: string;
}

// パスワードの変更フォーム
const UserModifyPassword: Component<{
  modifyPassword: (
    value: string
  ) => Promise<"INVALID" | "EXISTED_EMAIL" | "SUCCESSFUL">;
}> = (props) => {
  const [form, setForm] = createStore<UserPasswordFormModel>({
    password: "",
    confirmPassword: "",
  });
  const [formError, setFormError] = createSignal("");

  const onSubmit = async () => {
    if (form.password != form.confirmPassword) {
      setFormError("パスワード(確認用)が違います。");
      return;
    }

    const status = await props.modifyPassword(form.password);

    if (status != "SUCCESSFUL") {
      setFormError("パスワードの変更に失敗しました。");
      return;
    }

    setForm({ password: "", confirmPassword: "" });
  };

  return (
    <form class="space-y-3" onSubmit={onSubmit} method="dialog">
      <div>
        <div class="font-bold">現在のパスワード</div>
        <div>表示できません。</div>
      </div>

      <div>
        <span class="text-rose-600">{formError()}</span>
      </div>

      <div>
        <div>変更先のパスワード</div>
        <input
          type="password"
          class="block rounded border border-slate-300 p-2"
          required
          value={form.password}
          onInput={(e) => setForm({ password: e.currentTarget.value })}
        />
      </div>

      <div>
        <div>変更先のパスワード(確認用)</div>
        <input
          type="password"
          class="block rounded border border-slate-300 p-2"
          required
          value={form.confirmPassword}
          onInput={(e) => setForm({ confirmPassword: e.currentTarget.value })}
        />
      </div>

      <input type="submit" class="text-blue-600" />
    </form>
  );
};

export default UserModify;
