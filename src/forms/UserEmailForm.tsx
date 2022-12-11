import { Component, createResource, createSignal, Show } from "solid-js";
import { createStore } from "solid-js/store";
import { UserEmailFormModel } from "../FormModels";
import { service } from "../Service";

const UserEmailForm: Component<{
  token: string;
  onSubmit?: () => void;
}> = (props) => {
  const [user, { refetch: refetchUser }] = createResource(
    async () => await service.getUserPrivate(props.token)
  );

  const [form, setForm] = createStore<UserEmailFormModel>({ email: "" });
  const [formError, setFormError] = createSignal("");

  const onSubmit = async () => {
    const status = await service.updateUser(props.token, { email: form.email });

    if (status != "SUCCESSFUL") {
      setFormError("メールアドレスを変更できませんでした。");
      return;
    }

    setForm({ email: "" });

    await refetchUser();

    if (props.onSubmit) props.onSubmit();
  };

  return (
    <Show when={user()} keyed>
      {(user) => (
        <form method="dialog" onSubmit={onSubmit} class="space-y-3">
          <div>
            <div class="font-bold">現在のメールアドレス</div>
            <div>{user.email}</div>
          </div>

          <div class="text-rose-600">{formError()}</div>

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
      )}
    </Show>
  );
};

export default UserEmailForm;
