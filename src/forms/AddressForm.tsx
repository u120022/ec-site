import { Component, createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import { service } from "../Service";

const AddressForm: Component<{
  token: string;
  onSubmit?: () => void;
}> = (props) => {
  const [form, setForm] = createStore({
    name: "",
    country: "",
    address: "",
    zipcode: "",
  });
  const [formError, setFormError] = createSignal("");

  const onSubmit = async () => {
    const status = await service.createAddress(props.token, {
      name: form.name,
      country: form.country,
      address: form.address,
      zipcode: form.zipcode,
    });

    if (status != "SUCCESSFUL") {
      setFormError("住所を追加できませんでした。");
      return;
    }

    setForm({ name: "", country: "", address: "", zipcode: "" });

    if (props.onSubmit) props.onSubmit();
  };

  return (
    <form class="space-y-3" method="dialog" onSubmit={onSubmit}>
      <div>
        <div>住所を追加する。</div>
        <div class="text-rose-600">{formError()}</div>
      </div>

      <div>
        <div>氏名</div>
        <input
          type="text"
          required
          class="rounded border border-slate-300 p-2"
          value={form.name}
          onInput={(e) => setForm({ name: e.currentTarget.value })}
        />
      </div>

      <div>
        <div>国名</div>
        <input
          type="text"
          required
          class="rounded border border-slate-300 p-2"
          value={form.country}
          onInput={(e) => setForm({ country: e.currentTarget.value })}
        />
      </div>

      <div>
        <div>住所</div>
        <input
          type="text"
          required
          class="rounded border border-slate-300 p-2"
          value={form.address}
          onInput={(e) => setForm({ address: e.currentTarget.value })}
        />
      </div>

      <div>
        <div>郵便番号</div>
        <input
          type="text"
          required
          class="rounded border border-slate-300 p-2"
          value={form.zipcode}
          onInput={(e) => setForm({ zipcode: e.currentTarget.value })}
        />
      </div>

      <input type="submit" class="rounded bg-blue-600 p-3 py-2 text-white" />
    </form>
  );
};

export default AddressForm;
