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
  userId: number;
  productId: number;
  body: string;
  date: Date;
}

export interface CartItemModel {
  id?: number;
  userId: number;
  productId: number;
  count: number;
}

export interface ReceiptModel {
  id?: number;
  userId: number;
  addressId: number;
  paymentId: number;
  value: number;
  date: Date;
}

export interface ReceiptItemModel {
  id?: number;
  userId: number;
  receiptId: number;
  productId: number;
  value: number;
  count: number;
}

export interface UserModel {
  id?: number;
  name: string;
  email: string;
  digest: string;
}

export interface SessionModel {
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
}

export interface PaymentModel {
  id?: number;
  userId: number;
  cardNumber: string;
  holderName: string;
  expirationDate: string;
  securityCode: string;
}
