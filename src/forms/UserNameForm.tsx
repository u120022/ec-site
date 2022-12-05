import Cookies from "js-cookie";
import { Component, createResource, createSignal, Show } from "solid-js";
import { createStore } from "solid-js/store";
import { UserNameFormModel } from "../FormModels";
import { service } from "../Service";

const UserNameForm: Component = () => {
  const [form, setForm] = createStore<UserNameFormModel>({ name: "" });
  const [formError, setFormError] = createSignal("");

  const token = () => Cookies.get("SESSION_TOKEN");
  const [user] = createResource(
    token,
    async (token) => await service.getUser(token)
  );

  const onSubmit = async () => {
    const status = await service.updateUser(token(), { name: form.name });

    if (status != "SUCCESSFUL") {
      setFormError("名前の変更に失敗しました。");
      return;
    }

    setForm({ name: "" });
  };

  return (
    <Show when={user()}>
      <form class="space-y-3" onSubmit={onSubmit} method="dialog">
        <div>
          <div class="font-bold">現在の氏名</div>
          <div>{user().name}</div>
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
    </Show>
  );
};

export default UserNameForm;
