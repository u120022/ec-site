import { Component, createResource, createSignal, Show } from "solid-js";
import { createStore } from "solid-js/store";
import { UserNameFormModel } from "../FormModels";
import { service } from "../Service";

const UserNameForm: Component<{
  token: string;
  onSubmit?: () => void;
}> = (props) => {
  const [user] = createResource(
    async () => await service.getUserPrivate(props.token)
  );

  const [form, setForm] = createStore<UserNameFormModel>({ name: "" });
  const [formError, setFormError] = createSignal("");

  const onSubmit = async () => {
    const status = await service.updateUser(props.token, { name: form.name });

    if (status != "SUCCESSFUL") {
      setFormError("名前を変更できませんでした。");
      return;
    }

    setForm({ name: "" });

    if (props.onSubmit) props.onSubmit();
  };

  return (
    <Show when={user()} keyed>
      {(user) => (
        <form class="space-y-3" onSubmit={onSubmit} method="dialog">
          <div>
            <div class="font-bold">現在の氏名</div>
            <div>{user.name}</div>
          </div>

          <div class="text-rose-600">{formError()}</div>

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
      )}
    </Show>
  );
};

export default UserNameForm;
