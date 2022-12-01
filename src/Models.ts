export interface ProductModel {
  id?: number;
  name: string;
  desc: string;
  pic: string;
  date: Date;
  value: number;
  count: number;
}

export interface CommentModel {
  id?: number;
  productId: number;
  body: string;
  date: Date;
}

export interface CartItemModel {
  productId: number;
  count: number;
}

export interface ReceiptModel {
  id?: number;
  value: number;
  date: Date;
}

export interface ReceiptItemModel {
  receiptId: number;
  productId: number;
  value: number;
  count: number;
}
