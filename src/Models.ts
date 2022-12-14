export interface ProductModel {
  id?: number;
  name: string;
  desc: string;
  pic: string;
  date: Date;
  price: number;
  quantity: number;
}

export interface CommentModel {
  id?: number;
  userId: number;
  productId: number;
  body: string;
  date: Date;
}

export interface CartItemModel {
  id?: number;
  userId: number;
  productId: number;
  quantity: number;
}

export interface ReceiptModel {
  id?: number;
  userId: number;
  addressId: number;
  paymentId: number;
  price: number;
  date: Date;
}

export interface ReceiptItemModel {
  id?: number;
  receiptId: number;
  productId: number;
  price: number;
  quantity: number;
}

export interface UserModel {
  id?: number;
  name: string;
  email: string;
  digest: string;
}

export interface SessionModel {
  id?: number;
  token: string;
  userId: number;
  date: Date;
}

export interface AddressModel {
  id?: number;
  userId: number;
  name: string;
  country: string;
  address: string;
  zipcode: string;
  deleted: 0 | 1;
}

export interface PaymentModel {
  id?: number;
  userId: number;
  cardNumber: string;
  holderName: string;
  expirationDate: string;
  securityCode: string;
  deleted: 0 | 1;
}

export interface FavoriteModel {
  id?: number;
  userId: number;
  productId: number;
}

export interface BookmarkModel {
  id?: number;
  userId: number;
  productId: number;
}
