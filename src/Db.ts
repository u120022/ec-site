import Dexie, { Table } from "dexie";
import {
	CartItemModel,
	CommentModel,
	ProductModel,
	ReceiptItemModel,
	ReceiptModel,
} from "./Models";

export class Db extends Dexie {
	products!: Table<ProductModel>;
	comments!: Table<CommentModel>;
	cartItems!: Table<CartItemModel>;
	receipts!: Table<ReceiptModel>;
	receiptItems!: Table<ReceiptItemModel>;

	constructor() {
		super("Db");

		this.version(1).stores({
			products: "++id, name, desc, pic, date, value, count",
			comments: "++id, productId, body, date",
			cartItems: "&productId, count",
			receipts: "++id, value, date",
			receiptItems: "[receiptId+productId], value, count",
		});
	}
}

export const db = new Db();

db.on("populate", async () => {
	db.products.bulkAdd([
		{
			name: "Item 1",
			desc: "This is item!",
			pic: "",
			date: new Date("2022-11-29T06:00:00"),
			value: 1000,
			count: 20,
		},
		{
			name: "Item 2",
			desc: "This is item!",
			pic: "",
			date: new Date("2022-11-29T06:00:00"),
			value: 1100,
			count: 10,
		},
		{
			name: "Item 3",
			desc: "This is item!",
			pic: "",
			date: new Date("2022-11-29T06:00:00"),
			value: 3000,
			count: 9,
		},
	]);
});
