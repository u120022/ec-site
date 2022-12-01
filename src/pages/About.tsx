import { A } from "@solidjs/router";
import { Component } from "solid-js";

const Attention: Component = () => {
  return (
    <div class="p-6">
      <div>授業の課題で制作したテストサイトです。</div>
      <br />
      <div class="font-bold">説明</div>
      <div>架空のECサービスのサイトとして制作されました。</div>
      <br />
      <div class="font-bold">注意事項(必ず読んでください)</div>
      <div>
        バックエンドが存在しないため、ブラウザ上で動作するようなバックエンドスタブを代替として利用します。
      </div>
      <div>
        そのため本来存在すべきバックエンドとの相違点として次が挙げられます。
      </div>
      <ul class="list-inside list-decimal">
        <li>
          有効な住所・電話番号・Eメール・二段階認証コード・クレジットカードの確認機能は実装していません。入力形式のバリデーションチェックを通るものはすべて許容します。
        </li>
        <li>
          データの永続化はブラウザのIndexedDBを利用して行われるため、別コンピュータ上での操作は自コンピュータに反映されることはありません。(ただし、同コンピュータ同ブラウザの場合は使用するデータベースが共有されるので、複数人によるリクエストなどの模倣が可能です。)
        </li>
        <li>
          商品の購入によって購入額の請求や商品が発送されることはありません。
        </li>
      </ul>
      <br />
      <div class="font-bold">その他</div>
      <div>
        データーベースの初期化を行う場合はブラウザ側で当サイトのIndexedDBを消去してください。
      </div>
      <div>
        初期のデータベースには次のユーザが登録されています。そのほかユーザ作成も可能です。
      </div>
      <ul class="list-inside list-decimal">
        <li>
          <div>Eメール: alice@example.com</div>
          <div>パス: alice</div>
        </li>
        <li>
          <div>Eメール: bob@example.com</div>
          <div>パス: bob</div>
        </li>
      </ul>
      <br />
      <A class="text-blue-600" href="/">
        続ける
      </A>
    </div>
  );
};

export default Attention;
