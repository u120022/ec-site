import { db } from "./Db";

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
      const cartItem = await db.cartItems.get(productId);
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
        await db.cartItems.update(cartItem.productId, cartItem);
      }
    });
  }

  // 商品をカートから取り出す
  async popFromCart(productId: number, count: number) {
    await db.transaction("rw", db.cartItems, async () => {
      const cartItem = await db.cartItems.get(productId);

      // 存在しない場合は直ちに終了
      if (!cartItem) {
        return;
      }

      // カート内在庫数が0になった場合は削除して終了
      if (cartItem.count - count <= 0) {
        db.cartItems.delete(cartItem.productId);
        return;
      }

      cartItem.count -= count;
      await db.cartItems.update(cartItem.productId, cartItem);
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
    return await db.cartItems.get(productId);
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
}

export const service = new Service();
