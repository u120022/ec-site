import { db } from "./Db";
import { genHashSHA256 } from "./Hash";
import { ProductModel } from "./Models";

type StatusCode = "SUCCESSFUL" | "INVALID";

export class Service {
  // 商品一覧を取得
  async getProucts(page: number, count: number, params?: { search?: string, sortby?: string }) {

		// 並びの順序の指定
		let orderLabel = "name";
		let descending = false;

		switch (params?.sortby) {
			case "name":
				orderLabel = "name";
				descending = false;
				break;

			case "name_des":
				orderLabel = "name";
				descending = true;
				break;

			case "date":
				orderLabel = "date";
				descending = false;
				break;

			case "date_des":
				orderLabel = "date";
				descending = true;
				break;
				
			case "value":
				orderLabel = "value";
				descending = false;
				break;

			case "value_des":
				orderLabel = "value";
				descending = true;
				break;
		}

    const query = db.products
			.orderBy(orderLabel);

		const orderQuery = descending ? query.reverse() : query;

		// 検索フィルター
		const searchFn = (x: ProductModel) => {
			if (!params?.search) return true;

			return x.name
				.replace(" ", "")
				.toLowerCase()
				.includes(params.search.replace(" ", "").toLowerCase());
		}

		return await orderQuery
			.filter(searchFn)
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
  async createComment(token: string, productId: number, body: string) {
    return await db.transaction(
      "rw",
      db.sessions,
      db.users,
      db.comments,
      async () => {
        if (!body || body.length < 16) throw new Error();

        const user = await this.getUser(token);
        if (!user) throw new Error();

        await db.comments.add({
          userId: user.id as number,
          productId,
          body,
          date: new Date(),
        });
      }
    )
			.then<StatusCode>(_ => "SUCCESSFUL")
			.catch<StatusCode>(_ => "INVALID");
  }

  // コメントを削除
  async deleteComment(token: string, id: number) {
    return await db.transaction(
      "rw",
      db.sessions,
      db.users,
      db.comments,
      async () => {
        const user = await this.getUser(token);
        if (!user) throw new Error();

        const comment = await db.comments.get(id);
        if (!comment || comment.userId != user.id) throw new Error();

        await db.comments.delete(id);
      }
    )
			.then<StatusCode>(_ => "SUCCESSFUL")
			.catch<StatusCode>(_ => "INVALID");
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
  async pushToCart(token: string, productId: number, count: number) {
    return await db.transaction(
      "rw",
      db.sessions,
      db.users,
      db.products,
      db.cartItems,
      async () => {
        const product = await db.products.get(productId);
        if (!product) throw new Error();

        const user = await this.getUser(token);
        if (!user) throw new Error();

        const cartItem = await db.cartItems.get({
          userId: user.id as number,
          productId,
        });

        // 存在しない場合は追加して終了
        if (!cartItem) {
          // カート内在庫数が商品在庫数を上回らないようにする
          if (product.count < count) throw new Error();
          await db.cartItems.add({
            userId: user.id as number,
            productId,
            count,
          });
          return;
        }

        // カート内在庫数が商品在庫数を上回らないようにする
        if (product.count < cartItem.count + count) throw new Error();
        cartItem.count += count;
        await db.cartItems.update(cartItem.id as number, cartItem);
      }
    )
			.then<StatusCode>(_ => "SUCCESSFUL")
			.catch<StatusCode>(_ => "INVALID");
  }

  // 商品をカートから取り出す
  async popFromCart(token: string, productId: number, count: number) {
    return await db.transaction(
      "rw",
      db.sessions,
      db.users,
      db.cartItems,
      async () => {
        const user = await this.getUser(token);
        if (!user) throw new Error();

        const cartItem = await db.cartItems.get({
          userId: user.id as number,
          productId,
        });
        if (!cartItem) throw new Error();

        // カート内在庫数が0になった場合は削除して終了
        if (cartItem.count - count <= 0) {
          db.cartItems.delete(cartItem.id as number);
          return;
        }

        cartItem.count -= count;
        await db.cartItems.update(cartItem.id as number, cartItem);
      }
    )
			.then<StatusCode>(_ => "SUCCESSFUL")
			.catch<StatusCode>(_ => "INVALID");
  }

  // カート内商品一覧を取得
  async getCartItems(token: string, page: number, count: number) {
    return await db
      .transaction("r", db.sessions, db.users, db.cartItems, async () => {
        const user = await this.getUser(token);
        if (!user) throw new Error();

        return await db.cartItems
          .where({ userId: user.id as number })
					.reverse()
          .offset(page * count)
          .limit(count)
          .toArray();
      })
      .catch((_) => undefined);
  }

  // カート内商品を取得
  async getCartItem(token: string, productId: number) {
    return await db
      .transaction("r", db.sessions, db.users, db.cartItems, async () => {
        const user = await this.getUser(token);
        if (!user) throw new Error();

        return await db.cartItems.get({ userId: user.id as number, productId });
      })
      .catch((_) => undefined);
  }

  // カート内商品の総数を取得
  async getCartItemCount(token: string) {
    return await db
      .transaction("r", db.sessions, db.users, db.cartItems, async () => {
        const user = await this.getUser(token);
        if (!user) throw new Error();

        return await db.cartItems.where({ userId: user.id as number }).count();
      })
      .catch((_) => undefined);
  }

  // カート内総数の合計金額を計算
  async getTotalValueInCart(token: string) {
    return await db
      .transaction("r", db.products, db.cartItems, async () => {
        const user = await this.getUser(token);
        if (!user) throw new Error();

        let value = 0;

        await db.cartItems
          .where({ userId: user.id as number })
          .each(async (cartItem) => {
            const product = await db.products.get(cartItem.productId);

            if (!product) throw new Error();

            value += product.value * cartItem.count;
          });

        return value;
      })
      .catch((_) => undefined);
  }

  // カート内商品を購入
  async purchaseInCart(token: string, addressId: number, paymentId: number) {
    await db.transaction(
      "rw",
      [
        db.sessions,
        db.users,
        db.products,
        db.cartItems,
        db.receipts,
        db.receiptItems,
        db.addresses,
        db.payments,
      ],
      async () => {
        const user = await this.getUser(token);
        if (!user) throw new Error();

        const address = await db.addresses.get({ userId: user.id as number });
        if (!address || address.id != addressId) throw new Error();

        const payment = await db.payments.get({ userId: user.id as number });
        if (!payment || payment.id != paymentId) throw new Error();

        const cartItems = db.cartItems.where({ userId: user.id as number });

        // カートが空の場合
        if ((await cartItems.count()) == 0) throw new Error();

        // レシートを発行
        const value = await this.getTotalValueInCart(token);
        if (!value) throw new Error();

        const receiptId = (await db.receipts.add({
          userId: user.id as number,
          addressId,
          paymentId,
          date: new Date(),
          value,
        })) as number;

        // 購入商品の関連付けと在庫数の処理
        await cartItems.each(async (cartItem) => {
          const product = await db.products.get(cartItem.productId);
          if (!product || product.count < cartItem.count) throw new Error();

          // 購入商品をレシートに関連付ける
          await db.receiptItems.add({
            userId: user.id as number,
            receiptId,
            productId: cartItem.productId,
            value: product.value,
            count: cartItem.count,
          });

          // 購入商品の在庫数を計算
          product.count -= cartItem.count;
          db.products.update(product.id as number, product);
        });

        // カートを空にする
        await db.cartItems.where({ userId: user.id }).delete();
      }
    )
			.then<StatusCode>(_ => "SUCCESSFUL")
			.catch<StatusCode>(_ => "INVALID");
  }

  // レシート一覧を取得
  async getReceipts(token: string, page: number, count: number) {
    return await db
      .transaction("r", db.sessions, db.users, db.receipts, async () => {
        const user = await this.getUser(token);
        if (!user) throw new Error();

        return await db.receipts
          .where({ userId: user.id as number })
					.reverse()
          .offset(page * count)
          .limit(count)
          .toArray();
      })
      .catch((_) => undefined);
  }

  // レシートの総数を取得
  async getReceiptCount(token: string) {
    return await db
      .transaction("r", db.sessions, db.users, db.receipts, async () => {
        const user = await this.getUser(token);
        if (!user) throw new Error();

        return await db.receipts.where({ userId: user.id }).count();
      })
      .catch((_) => undefined);
  }

  // 購入商品一覧を取得
  async getReceiptItems(
    token: string,
    receiptId: number,
    page: number,
    count: number
  ) {
    return await db
      .transaction(
        "r",
        db.sessions,
        db.users,
        db.receipts,
        db.receiptItems,
        async () => {
          const user = await this.getUser(token);
          if (!user) throw new Error();

          const receipt = await db.receipts.get(receiptId);
          if (!receipt || receipt.userId != user.id) throw new Error();

          return await db.receiptItems
            .where({ receiptId })
            .offset(page * count)
            .limit(count)
            .toArray();
        }
      )
      .catch((_) => undefined);
  }

  // 購入商品の数を取得
  async getReceiptItemCount(token: string, receiptId: number) {
    return await db
      .transaction(
        "r",
        db.sessions,
        db.users,
        db.receipts,
        db.receiptItems,
        async () => {
          const user = await this.getUser(token);
          if (!user) throw new Error();

          const receipt = await db.receipts.get(receiptId);
          if (!receipt || receipt.userId != user.id) throw new Error();

          return await db.receiptItems.where({ receiptId }).count();
        }
      )
      .catch((_) => undefined);
  }

  // ユーザの新規登録
  async registerUser(name: string, email: string, password: string) {
		return await db.transaction("rw", db.users, async () => {
			if (name.length == 0) throw new Error();
			if (email.length == 0) throw new Error();
			if (password.length == 0) throw new Error();

			// 既に存在するメールの場合は終了
			const count = await db.users.where({ email }).count();
			if (0 < count) throw new Error();

			// パスワードをダイジェスト値として保存
			const digest = await genHashSHA256(password);
			await db.users.add({ name, digest, email });
		})
			.then<StatusCode>(_ => "SUCCESSFUL")
			.catch<StatusCode>(_ => "INVALID");
  }

  // ユーザの取得
  async getUser(token: string) {
    return await db
      .transaction("r", db.sessions, db.users, async () => {
        const session = await db.sessions.get(token);

        if (!session) throw new Error();

        return await db.users.get(session.userId);
      })
      .catch((_) => undefined);
  }

  // ユーザ情報の変更
  async updateUser(
    token: string,
    params: { name?: string; email?: string; password?: string }
  ) {
    return await db.transaction("rw", db.sessions, db.users, async () => {
      const user = await this.getUser(token);
      if (!user) throw new Error();

      // 氏名の変更
      if (params.name) {
        if (params.name.length == 0) throw new Error();
        user.name = params.name;
      }

      // メールの変更
      if (params.email) {
        if (params.email.length == 0) throw new Error();

        const count = await db.users.where({ email: params.email }).count();
        if (0 < count) throw new Error();

        user.email = params.email;
      }

      // パスワードの変更
      if (params.password) {
        if (params.password.length == 0) throw new Error();

        const digest = await genHashSHA256(params.password);
        user.digest = digest;
      }

      db.users.update(user.id as number, user);
    })
			.then<StatusCode>(_ => "SUCCESSFUL")
			.catch<StatusCode>(_ => "INVALID");
  }

  // セッションの生成
  async createSession(email: string, password: string) {
    // ダイジェスト値を生成
		// transaction内で実行は不可能
    const digest = await genHashSHA256(password);

    return await db
      .transaction("rw", db.sessions, db.users, async () => {
        // 該当するユーザが存在しない場合は終了
        const user = await db.users.get({ email });
        if (!user) throw new Error();

        // パスワードのダイジェスト値が異なる場合は終了
        if (user.digest != digest) throw new Error();

        // (注意)トークンをUUIDv4として生成
        const token = crypto.randomUUID();
        await db.sessions.add({
          token,
          userId: user.id as number,
          date: new Date(),
        });
        return token;
      })
				.catch(_ => undefined);
  }

  // セッションの削除
  async deleteSession(token: string) {
		return await db.transaction("rw", db.sessions, async () => {
			const session = db.sessions.get(token);
			if (!session) throw new Error();

			await db.sessions.delete(token);
		})
			.then<StatusCode>(_ => "SUCCESSFUL")
			.catch<StatusCode>(_ => "INVALID");
  }

  // セッション一覧を取得
  async getSessions(token: string, page: number, count: number) {
    return await db
      .transaction("r", db.sessions, db.users, async () => {
        const user = await this.getUser(token);
        if (!user) throw new Error();

        return await db.sessions
          .where({ userId: user.id })
          .offset(page * count)
          .limit(count)
          .toArray();
      })
      .catch((_) => undefined);
  }
  // セッションの数を所得
  async getSessionCount(token: string) {
    return await db.transaction("r", db.sessions, db.users, async () => {
      const user = await this.getUser(token);
      if (!user) return undefined;

      return await db.sessions.where({ userId: user.id }).count();
    });
  }

  // 住所の一覧を取得
  async getAddresses(token: string, page: number, count: number) {
    return await db
      .transaction("r", db.sessions, db.users, db.addresses, async () => {
        const user = await this.getUser(token);
        if (!user) throw new Error();

        return await db.addresses
          .where({ userId: user.id })
          .offset(page * count)
          .limit(count)
          .toArray();
      })
      .catch((_) => undefined);
  }

  // 住所の数を取得
  async getAddressCount(token: string) {
    return await db
      .transaction("r", db.sessions, db.users, db.addresses, async () => {
        const user = await this.getUser(token);
        if (!user) throw new Error();

        return await db.addresses.where({ userId: user.id }).count();
      })
      .catch((_) => undefined);
  }

  // 住所を削除
  async deleteAddress(token: string, id: number) {
    return await db.transaction(
      "rw",
      db.sessions,
      db.users,
      db.addresses,
      async () => {
        const user = await this.getUser(token);
        if (!user) throw new Error();

        const address = await db.addresses.get(id);
        if (!address || address.userId != user.id) return undefined;

        await db.addresses.delete(address.id as number);
      }
    )
			.then<StatusCode>(_ => "SUCCESSFUL")
			.catch<StatusCode>(_ => "INVALID");
  }

  // 住所を作成
  async createAddress(
    token: string,
    address: { name: string; country: string; address: string; zipcode: string }
  ) {
    return await db.transaction(
      "rw",
      db.sessions,
      db.users,
      db.addresses,
      async () => {
        const user = await this.getUser(token);
        if (!user) throw new Error();

        await db.addresses.add({ ...address, userId: user.id as number });
      }
    )
			.then<StatusCode>(_ => "SUCCESSFUL")
			.catch<StatusCode>(_ => "INVALID");
  }

  // 支払い方法の一覧を取得
  async getPayments(token: string, page: number, count: number) {
    return await db
      .transaction("r", db.sessions, db.users, db.payments, async () => {
        const user = await this.getUser(token);
        if (!user) throw new Error();

        return await db.payments
          .where({ userId: user.id })
          .offset(page * count)
          .limit(count)
          .toArray();
      })
      .catch((_) => undefined);
  }

  // 支払い方法の数を取得
  async getPaymentCount(token: string) {
    return await db
      .transaction("r", db.sessions, db.users, db.payments, async () => {
        const user = await this.getUser(token);
        if (!user) throw new Error();

        return await db.payments.where({ userId: user.id }).count();
      })
      .catch((_) => undefined);
  }

  // 支払い方法を削除
  async deletePayment(token: string, id: number) {
    return await db.transaction(
      "rw",
      db.sessions,
      db.users,
      db.payments,
      async () => {
        const user = await this.getUser(token);
        if (!user) return undefined;

        const payment = await db.payments.get(id);
        if (!payment || payment.userId != user.id) throw new Error();

        await db.payments.delete(payment.id as number);
      }
    )
			.then<StatusCode>(_ => "SUCCESSFUL")
			.catch<StatusCode>(_ => "INVALID");
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
    return await db.transaction(
      "rw",
      db.sessions,
      db.users,
      db.payments,
      async () => {
        const user = await this.getUser(token);
        if (!user) return undefined;

        await db.payments.add({ ...payment, userId: user.id as number });
      }
    )
			.then<StatusCode>(_ => "SUCCESSFUL")
			.catch<StatusCode>(_ => "INVALID");
  }
}

export const service = new Service();
