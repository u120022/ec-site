import { Component } from "solid-js";
import { createStore } from "solid-js/store";
import { CommentFormModel } from "../FormModels";
import { useToken } from "../pages/TokenContext";
import { service } from "../Service";

const CommentForm: Component<{
  productId: number;
  onSubmit?: () => void;
}> = (props) => {
  const [token] = useToken();

  const [form, setForm] = createStore<CommentFormModel>({ body: "" });

  const onSubmit = async () => {
    await service.createComment(token(), props.productId, form.body);

    setForm({ body: "" });

    if (props.onSubmit) props.onSubmit();
  };

  return (
    <form class="space-y-3" method="dialog" onSubmit={onSubmit}>
      <div class="">コメントを投稿する</div>

      <div>
        <textarea
          name="body"
          required
          rows={8}
          minlength={16}
          placeholder="テキストを入力。"
          class="w-full resize-none rounded border border-slate-300 p-2"
          value={form.body}
          onInput={(e) => setForm({ body: e.currentTarget.value })}
        />
      </div>

      <input type="submit" class="rounded bg-blue-600 p-3 py-2 text-white" />
    </form>
  );
};

export default CommentForm;
