import { Component } from "solid-js";
import { createStore } from "solid-js/store";
import { useToken } from "../pages/TokenContext";
import { service } from "../Service";

const PaymentForm: Component<{
  onSubmit?: () => void;
}> = (props) => {
  const [form, setForm] = createStore({
    cardNumber: "",
    holderName: "",
    expirationDate: "",
    securityCode: "",
  });

  const [token] = useToken();

  // 支払い方法を作成
  const onSubmit = async () => {
    const payment = {
      cardNumber: form.cardNumber,
      holderName: form.holderName,
      expirationDate: form.expirationDate,
      securityCode: form.securityCode,
    };
    await service.createPayment(token(), payment);

    setForm({
      cardNumber: "",
      holderName: "",
      expirationDate: "",
      securityCode: "",
    });

    if (props.onSubmit) props.onSubmit();
  };

  return (
    <form class="space-y-3" method="dialog" onSubmit={onSubmit}>
      <div>支払い方法を追加する。(クレジット・デビットカード)</div>

      <div>
        <div>カード番号</div>
        <input
          type="text"
          required
          class="rounded border border-slate-300 p-2"
          value={form.cardNumber}
          onInput={(e) => setForm({ cardNumber: e.currentTarget.value })}
        />
      </div>

      <div>
        <div>カード名義</div>
        <input
          type="text"
          required
          class="rounded border border-slate-300 p-2"
          value={form.holderName}
          onInput={(e) => setForm({ holderName: e.currentTarget.value })}
        />
      </div>

      <div>
        <div>有効期間</div>
        <input
          type="text"
          required
          class="rounded border border-slate-300 p-2"
          value={form.expirationDate}
          onInput={(e) => setForm({ expirationDate: e.currentTarget.value })}
        />
      </div>

      <div>
        <div>セキュリティコード(CVV/CSV)</div>
        <input
          type="text"
          required
          class="rounded border border-slate-300 p-2"
          value={form.securityCode}
          onInput={(e) => setForm({ securityCode: e.currentTarget.value })}
        />
      </div>

      <input type="submit" class="rounded bg-blue-600 p-3 py-2 text-white" />
    </form>
  );
};

export default PaymentForm;
