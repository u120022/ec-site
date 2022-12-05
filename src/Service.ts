import { db } from "./Db";
import { genHashSHA256 } from "./Hash";

export class Service {
  // 商品一覧を取得
  async getProucts(page: number, count: number) {
    return await db.products
      .offset(page * count)
      .limit(count)
      .toArray();
  }

  // 商品数を取得
  async getProductCount() {
    return await db.products.count();
  }

  // キーから商品を取得
  async getProduct(id: number) {
    return await db.products.get(id);
  }

  // コメントを追加
  async createComment(productId: number, body: string) {
    // 文字列でないもしくは16文字以下の場合は終了
    if (!body || body.length < 16) return;

    const date = new Date();

    await db.comments.add({ productId, body, date });
  }

  // コメントを削除
  async deleteComment(id: number) {
    await db.comments.delete(id);
  }

  // コメント一覧を取得
  async getComments(productId: number, page: number, count: number) {
    return await db.comments
      .where({ productId })
      .offset(page * count)
      .limit(count)
      .toArray();
  }

  // コメント数を取得
  async getCommentCount(productId: number) {
    return await db.comments.where({ productId }).count();
  }

  // 商品をカートに追加
  async pushToCart(productId: number, count: number) {
    await db.transaction("rw", db.cartItems, db.products, async () => {
      const cartItem = await db.cartItems.get({ productId });
      const product = await db.products.get(productId);

      // 存在しない場合は追加して終了
      if (!cartItem) {
        // カート内在庫数が商品在庫数を上回らないようにする
        if (count <= product.count) {
          await db.cartItems.add({ productId, count });
        }
        return;
      }

      cartItem.count += count;

      // カート内在庫数が商品在庫数を上回らないようにする
      if (cartItem.count <= product.count) {
        await db.cartItems.update(cartItem.id, cartItem);
      }
    });
  }

  // 商品をカートから取り出す
  async popFromCart(productId: number, count: number) {
    await db.transaction("rw", db.cartItems, async () => {
      const cartItem = await db.cartItems.get({ productId });

      // 存在しない場合は直ちに終了
      if (!cartItem) {
        return;
      }

      // カート内在庫数が0になった場合は削除して終了
      if (cartItem.count - count <= 0) {
        db.cartItems.delete(cartItem.id);
        return;
      }

      cartItem.count -= count;
      await db.cartItems.update(cartItem.id, cartItem);
    });
  }

  // カート内商品一覧を取得
  async getCartItems(page: number, count: number) {
    return await db.cartItems
      .offset(page * count)
      .limit(count)
      .toArray();
  }

  // カート内商品を取得
  async getCartItem(productId: number) {
    return await db.cartItems.get({ productId });
  }

  // カート内商品の総数を取得
  async getCartItemCount() {
    return await db.cartItems.count();
  }

  // カート内総数の合計金額を計算
  async getTotalValueInCart() {
    let value = 0;
    await db.transaction("r", db.cartItems, db.products, async () => {
      await db.cartItems.each(async (cartItem) => {
        const product = await db.products.get(cartItem.productId);
        value += product.value * cartItem.count;
      });
    });
    return value;
  }

  // カート内商品を購入
  async purchaseInCart() {
    await db.transaction(
      "rw",
      db.cartItems,
      db.products,
      db.receipts,
      db.receiptItems,
      async () => {
        // カートが空の場合は直ちに終了
        if ((await db.cartItems.count()) == 0) return;

        // 整合性確認
        // 無効な場合は直ちに終了 (TODO: 原因を出力)
        await db.cartItems.each(async (cartItem) => {
          const product = await db.products.get(cartItem.productId);
          if (product.count < cartItem.count) {
            return;
          }
        });

        // レシートを発行
        const date = new Date();

        // 合計金額の計算
        let value = 0;
        await db.cartItems.each(async (cartItem) => {
          const product = await db.products.get(cartItem.productId);
          value += product.value * cartItem.count;
        });

        const receiptId = (await db.receipts.add({ date, value })) as number;

        // 購入商品の関連付けと在庫数の処理
        await db.cartItems.each(async (cartItem) => {
          const product = await db.products.get(cartItem.productId);

          // 購入商品をレシートに関連付ける
          await db.receiptItems.add({
            receiptId,
            productId: cartItem.productId,
            value: product.value,
            count: cartItem.count,
          });

          // 購入商品の在庫数を計算
          product.count -= cartItem.count;
          db.products.update(product.id, product);
        });

        // カートを空にする
        await db.cartItems.clear();
      }
    );
  }

  // レシート一覧を取得
  async getReceipts(page: number, count: number) {
    return await db.receipts
      .offset(page * count)
      .limit(count)
      .toArray();
  }

  // レシートの総数を取得
  async getReceiptCount() {
    return await db.receipts.count();
  }

  // 購入商品一覧を取得
  async getReceiptItems(receiptId: number, page: number, count: number) {
    return await db.receiptItems
      .where({ receiptId })
      .offset(page * count)
      .limit(count)
      .toArray();
  }

  // 購入商品の数を取得
  async getReceiptItemCount(receiptId: number) {
    return await db.receiptItems.where({ receiptId }).count();
  }

  // ユーザの新規登録
  async registerUser(name: string, email: string, password: string) {
    // 名前が0文字の場合は直ちに終了
    if (name.length == 0) return "INVALID";

    // Eメールが0文字の場合は直ちに終了
    if (email.length == 0) return "INVALID";

    // 既に存在するメールの場合は直ちに終了
    const count = await db.users.where({ email }).count();
    if (0 < count) return "EXISTED_EMAIL";

    // パスワードが0文字の場合は直ちに終了
    if (password.length == 0) return "INVALID";

    // パスワードをダイジェスト値として保存
    const digest = await genHashSHA256(password);

    await db.users.add({ name, digest, email });
    return "SUCCESSFUL";
  }

  // ユーザの取得
  async getUser(token: string) {
    if (!token) return undefined;
    const session = await db.sessions.get(token);
    return await db.users.get(session.userId);
  }

  // ユーザ情報の変更
  async updateUser(
    token: string,
    params: { name?: string; email?: string; password?: string }
  ) {
    const user = await this.getUser(token);
    if (!user) return;

    // 氏名の変更
    if (params.name) {
      if (params.name.length == 0) return "INVALID";
      user.name = params.name;
    }

    // メールの変更
    if (params.email) {
      if (params.email.length == 0) return "INVALID";

      const count = await db.users.where({ email: params.email }).count();
      if (0 < count) return "EXISTED_EMAIL";

      user.email = params.email;
    }

    // パスワードの変更
    if (params.password) {
      if (params.password.length == 0) return "INVALID";

      const digest = await genHashSHA256(params.password);
      user.digest = digest;
    }

    db.users.update(user.id, user);
    return "SUCCESSFUL";
  }

  // セッションの生成
  async login(email: string, password: string) {
    // 該当するユーザが存在しない場合は直ちに終了
    const user = await db.users.get({ email });
    if (!user) return undefined;

    // パスワードのダイジェスト値が異なる場合は直ちに終了
    const digest = await genHashSHA256(password);
    if (user.digest != digest) return undefined;

    // (注意)トークンをUUIDv4として生成
    const token = crypto.randomUUID();
    const date = new Date();
    await db.sessions.add({ token, userId: user.id, date });
    return token;
  }

  // セッションの削除
  async deleteSession(token: string) {
    await db.sessions.delete(token);
  }

  // セッション一覧を取得
  async getSessions(token: string, page: number, count: number) {
    const user = await this.getUser(token);

    if (!user) return undefined;

    return await db.sessions
      .where({ userId: user.id })
      .offset(page * count)
      .limit(count)
      .toArray();
  }
  // セッションの数を所得
  async getSessionCount(token: string) {
    const user = await this.getUser(token);

    if (!user) return undefined;

    return await db.sessions.where({ userId: user.id }).count();
  }

  // 住所の一覧を取得
  async getAddresses(token: string, page: number, count: number) {
    const user = await this.getUser(token);

    if (!user) return undefined;

    return await db.addresses
      .where({ userId: user.id })
      .offset(page * count)
      .limit(count)
      .toArray();
  }

  // 住所の数を取得
  async getAddressCount(token: string) {
    const user = await this.getUser(token);

    if (!user) return undefined;

    return await db.addresses.where({ userId: user.id }).count();
  }

  // 住所を削除
  async deleteAddress(token: string, id: number) {
    const user = await this.getUser(token);

    if (!user) return undefined;

    const address = await db.addresses.get(id);

    if (!address) return undefined;
    if (address.userId != user.id) return undefined;

    await db.addresses.delete(address.id);
  }

  // 住所を作成
  async createAddress(
    token: string,
    address: { name: string; country: string; address: string; zipcode: string }
  ) {
    const user = await this.getUser(token);

    if (!user) return undefined;

    await db.addresses.add({ ...address, userId: user.id });
  }

  // 支払い方法の一覧を取得
  async getPayments(token: string, page: number, count: number) {
    const user = await this.getUser(token);

    if (!user) return undefined;

    return await db.payments
      .where({ userId: user.id })
      .offset(page * count)
      .limit(count)
      .toArray();
  }

  // 支払い方法の数を取得
  async getPaymentCount(token: string) {
    const user = await this.getUser(token);

    if (!user) return undefined;

    return await db.payments.where({ userId: user.id }).count();
  }

  // 支払い方法を削除
  async deletePayment(token: string, id: number) {
    const user = await this.getUser(token);

    if (!user) return undefined;

    const payment = await db.payments.get(id);

    if (!payment) return undefined;
    if (payment.userId != user.id) return undefined;

    await db.payments.delete(payment.id);
  }

  // 支払い方法を作成
  async createPayment(
    token: string,
    payment: {
      cardNumber: string;
      holderName: string;
      expirationDate: string;
      securityCode: string;
    }
  ) {
    const user = await this.getUser(token);

    if (!user) return undefined;

    await db.payments.add({ ...payment, userId: user.id });
  }
}

export const service = new Service();
