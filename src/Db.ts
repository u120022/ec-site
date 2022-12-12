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
  FavoriteModel,
  BookmarkModel,
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
  favorites!: Table<FavoriteModel>;
  bookmarks!: Table<BookmarkModel>;

  constructor() {
    super("Db");

    this.version(1).stores({
      products: "++id, date, price, quantity",
      comments: "++id, productId",
      cartItems: "++id, userId, [userId+productId]",
      receipts: "++id, userId",
      receiptItems: "++id, receiptId, productId",
      users: "++id, &email",
      addresses: "++id, userId, [userId+deleted]",
      payments: "++id, userId, [userId+deleted]",
      sessions: "++id, &token, userId",
      favorites: "++id, productId, userId, [productId+userId]",
      bookmarks: "++id, productId, userId, [productId+userId]",
    });
  }
}

export const db = new Db();

// デモデータの挿入
db.on("populate", populate);
