import { createDexieArrayQuery, createDexieSignalQuery } from "solid-dexie";
import { db } from "./Db";

export class Service {
	constructor() { }

	// 商品一覧を取得
	getProucts(count: number) {
		return createDexieArrayQuery(() => db.products.limit(count).toArray());
	}

	// キーから商品を取得
	getProduct(id: number) {
		return createDexieSignalQuery(() => db.products.get(id));
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
	getComments(productId: number, count: number) {
		return createDexieArrayQuery(() =>
			db.comments.where({ productId }).limit(count).toArray()
		);
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
	getCartItems(count: number) {
		return createDexieArrayQuery(() => db.cartItems.limit(count).toArray());
	}

	// カート内商品を購入
	async purchaseCartItem() {
		await db.transaction("rw", db.cartItems, db.products, db.receipts, db.receiptItems, async () => {

			// カートが空の場合は直ちに終了
			if (await db.cartItems.count() == 0) return;

			// 整合性確認
			// 無効な場合は直ちに終了 (TODO: 原因を出力)
			await db.cartItems.each(async cartItem => {
				const product = await db.products.get(cartItem.productId);
				if (product.count < cartItem.count) {
					return;
				}
			});

			// レシートを発行
			const date = new Date();

			// 合計金額の計算
			let value = 0;
			await db.cartItems.each(async cartItem => {
				const product = await db.products.get(cartItem.productId);
				value += product.value * cartItem.count;
			});

			const receiptId = await db.receipts.add({ date, value }) as number;

			// 購入商品の関連付けと在庫数の処理
			await db.cartItems.each(async cartItem => {
				const product = await db.products.get(cartItem.productId);

				// 購入商品をレシートに関連付ける
				await db.receiptItems.add({
					receiptId, productId: cartItem.productId, value: product.value, count: cartItem.count
				});

				// 購入商品の在庫数を計算
				product.count -= cartItem.count;
				db.products.update(product.id, product);
			});

			// カートを空にする
			await db.cartItems.clear()
		});
	}

	// レシート一覧を取得
	getReceipts(count: number) {
		return createDexieArrayQuery(() => db.receipts.limit(count).toArray());
	}

	// 購入商品一覧を取得
	getReceiptItems(receiptId: number, count: number) {
		return createDexieArrayQuery(() => db.receiptItems.where({ receiptId }).limit(count).toArray());
	}
}

export const service = new Service();
