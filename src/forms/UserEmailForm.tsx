import Cookies from "js-cookie";
import { Component, createResource, createSignal, Show } from "solid-js";
import { createStore } from "solid-js/store";
import { UserEmailFormModel } from "../FormModels";
import { service } from "../Service";

const UserEmailForm: Component = () => {
  const [form, setForm] = createStore<UserEmailFormModel>({ email: "" });
  const [formError, setFormError] = createSignal("");

  const token = () => Cookies.get("SESSION_TOKEN");
  const [user] = createResource(
    token,
    async (token) => await service.getUser(token)
  );

  const onSubmit = async () => {
    const status = await service.updateUser(token(), { email: form.email });

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
    <Show when={user()}>
      <form method="dialog" onSubmit={onSubmit} class="space-y-3">
        <div>
          <div class="font-bold">現在のメールアドレス</div>
          <div>{user().email}</div>
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
    </Show>
  );
};

export default UserEmailForm;
