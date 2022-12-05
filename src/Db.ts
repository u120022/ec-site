import Dexie, { Table } from "dexie";
import { populate } from "./DbDemo";
import {
  AddressModel,
  PaymentModel,
  CartItemModel,
  CommentModel,
  ProductModel,
  ReceiptItemModel,
  ReceiptModel,
  SessionModel,
  UserModel,
} from "./Models";

export class Db extends Dexie {
  products!: Table<ProductModel>;
  comments!: Table<CommentModel>;
  cartItems!: Table<CartItemModel>;
  receipts!: Table<ReceiptModel>;
  receiptItems!: Table<ReceiptItemModel>;
  users!: Table<UserModel>;
  addresses!: Table<AddressModel>;
  payments!: Table<PaymentModel>;
  sessions!: Table<SessionModel>;

  constructor() {
    super("Db");

    this.version(1).stores({
      products: "++id",
      comments: "++id, productId",
      cartItems: "++id, &productId",
      receipts: "++id",
      receiptItems: "++id, receiptId, productId",
      users: "++id, &email",
      addresses: "++id, userId",
      payments: "++id, userId",
      sessions: "&token, userId",
    });
  }
}

export const db = new Db();

// デモデータの挿入
db.on("populate", populate);
