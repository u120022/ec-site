import { Component, createResource, createSignal, Show } from "solid-js";
import { createStore } from "solid-js/store";
import { UserPasswordFormModel } from "../FormModels";
import { useToken } from "../pages/TokenContext";
import { service } from "../Service";

const UserNameForm: Component<{
  onSubmit?: () => void;
}> = (props) => {
  const [form, setForm] = createStore<UserPasswordFormModel>({
    password: "",
    confirmPassword: "",
  });
  const [formError, setFormError] = createSignal("");

  const [token] = useToken();
  const [user] = createResource(
    token,
    async (token) => await service.getUser(token)
  );

  const onSubmit = async () => {
    if (form.password != form.confirmPassword) {
      setFormError("パスワード(確認用)が違います。");
      return;
    }

    const status = await service.updateUser(token(), {
      password: form.password,
    });

    if (status != "SUCCESSFUL") {
      setFormError("パスワードの変更に失敗しました。");
      return;
    }

    setForm({ password: "", confirmPassword: "" });

    if (props.onSubmit) props.onSubmit();
  };

  return (
    <Show when={user()}>
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
    </Show>
  );
};

export default UserNameForm;
