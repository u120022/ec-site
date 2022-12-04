import { A } from "@solidjs/router";
import { Component } from "solid-js";

const Attention: Component = () => {
  return (
    <div class="p-6">
      <div>授業の課題で制作したテストサイトです。</div>
      <br />
      <div class="font-bold">説明</div>
      <div>架空のECサイトとして制作されました。</div>
      <br />
      <div class="font-bold">注意事項(必ず読んでください)</div>
      <div>
        バックエンドサーバが存在しないため、ブラウザ上で動作するようなバックエンドスタブ(ブラウザのJavaScriptランタイムで動くようなもの)を代替として利用します。
      </div>
      <div>
        そのため本来存在すべきバックエンドとの相違点として次が挙げられます。
      </div>
      <ul class="list-inside list-decimal">
        <li>
          有効なEメール・住所・クレジットカードの確認機能は実装していません。入力形式のバリデーションチェックを通るものはすべて許容します。
        </li>
        <li>
          データの永続化はブラウザのIndexedDBを利用して行われるため、別コンピュータ上での操作は自コンピュータに反映されることはありません。(ただし、同コンピュータ同ブラウザの場合は使用するデータベースが共有されます。)
        </li>
        <li>
          商品の購入によって購入額の請求や商品が発送されることはありません。
        </li>
        <li>
          ユーザ認証には簡易的なセッション認証を行います。トークン生成はUUIDv4でありCSRF対策を行っていません。
        </li>
      </ul>
      <br />
      <div class="font-bold">その他</div>
      <div>
        正常に動作しない場合はブラウザで当サイトのサイトデータの消去を試してください。
      </div>
      <div>
        データーベースの初期化を行う場合はブラウザで当サイトのIndexedDBを消去してください。
      </div>
      <div>
        初期・初期化後のデータベースには次のユーザが登録されています。そのほかユーザ作成も可能です。
      </div>
      <ul class="list-inside list-decimal">
        <li>
          <div>名前: Alice</div>
          <div>Eメール: alice@example.com</div>
          <div>パスワード: alice</div>
        </li>
        <li>
          <div>名前: Bob</div>
          <div>Eメール: bob@example.com</div>
          <div>パスワード: bob</div>
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
