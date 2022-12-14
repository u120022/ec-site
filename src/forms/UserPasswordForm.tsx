import { Component, createResource, createSignal, Show } from "solid-js";
import { createStore } from "solid-js/store";
import { UserPasswordFormModel } from "../FormModels";
import { service } from "../Service";

const UserPasswordForm: Component<{
  token: string;
  onSubmit?: () => void;
}> = (props) => {
  const [user, { refetch: refetchUser }] = createResource(
    async () => await service.getUserPrivate(props.token)
  );

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

    const status = await service.updateUser(props.token, {
      password: form.password,
    });

    if (status != "SUCCESSFUL") {
      setFormError("パスワードを変更できませんでした。");
      return;
    }

    setForm({ password: "", confirmPassword: "" });

    await refetchUser();

    if (props.onSubmit) props.onSubmit();
  };

  return (
    <Show when={user} keyed={true}>
      {(user) => (
        <form class="space-y-3" onSubmit={onSubmit} method="dialog">
          <div>
            <div class="font-bold">現在のパスワード</div>
            <div>表示できません。</div>
          </div>

          <div class="text-rose-600">{formError()}</div>

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
              onInput={(e) =>
                setForm({ confirmPassword: e.currentTarget.value })
              }
            />
          </div>

          <input type="submit" class="text-blue-600" />
        </form>
      )}
    </Show>
  );
};

export default UserPasswordForm;
