import {
  AddressModel,
  CartItemModel,
  CommentModel,
  PaymentModel,
  ProductModel,
  ReceiptItemModel,
  ReceiptModel,
  SessionModel,
  UserModel,
} from "./Models";

export interface ProductDto {
  id: number;
  name: string;
  desc: string;
  pic: string;
  date: Date;
  value: number;
  count: number;
}

export const toProductDto = (model: ProductModel) =>
  ({
    id: model.id as number,
    name: model.name,
    desc: model.desc,
    pic: model.pic,
    date: model.date,
    value: model.value,
    count: model.count,
  } as ProductDto);

export interface CommentDto {
  id: number;
  userId: number;
  productId: number;
  body: string;
  date: Date;
}

export const toCommentDto = (model: CommentModel) =>
  ({
    id: model.id as number,
    userId: model.userId,
    productId: model.productId,
    body: model.body,
    date: model.date,
  } as CommentDto);

export interface CartItemDto {
  id: number;
  userId: number;
  productId: number;
  count: number;
}

export const toCartItemDto = (model: CartItemModel) =>
  ({
    id: model.id as number,
    userId: model.userId,
    productId: model.productId,
    count: model.count,
  } as CartItemDto);

export interface ReceiptDto {
  id: number;
  userId: number;
  addressId: number;
  paymentId: number;
  value: number;
  date: Date;
}

export const toReceiptDto = (model: ReceiptModel) =>
  ({
    id: model.id as number,
    userId: model.userId,
    addressId: model.addressId,
    paymentId: model.paymentId,
    value: model.value,
    date: model.date,
  } as ReceiptDto);

export interface ReceiptItemDto {
  id: number;
  userId: number;
  receiptId: number;
  productId: number;
  value: number;
  count: number;
}

export const toReceiptItemDto = (model: ReceiptItemModel) =>
  ({
    id: model.id as number,
    userId: model.userId,
    receiptId: model.receiptId,
    productId: model.productId,
    value: model.value,
    count: model.count,
  } as ReceiptItemDto);

export interface UserPublicDto {
  id: number;
  name: string;
}

export const toUserPublicDto = (model: UserModel) =>
  ({
    id: model.id,
    name: model.name,
  } as UserPublicDto);

export interface UserPrivateDto {
  id: number;
  name: string;
  email: string;
  digest: string;
}

export const toUserPrivateDto = (model: UserModel) =>
  ({
    id: model.id,
    name: model.name,
    email: model.email,
    digest: model.digest,
  } as UserPrivateDto);

export interface SessionDto {
  token: string;
  userId: number;
  date: Date;
}

export const toSessionDto = (model: SessionModel) =>
  ({
    token: model.token,
    userId: model.userId,
    date: model.date,
  } as SessionDto);

export interface AddressDto {
  id: number;
  userId: number;
  name: string;
  country: string;
  address: string;
  zipcode: string;
}

export const toAddressDto = (model: AddressModel) =>
  ({
    id: model.id as number,
    userId: model.userId,
    name: model.name,
    country: model.country,
    address: model.address,
    zipcode: model.zipcode,
  } as AddressDto);

export interface PaymentDto {
  id: number;
  userId: number;
  cardNumber: string;
  holderName: string;
  expirationDate: string;
  securityCode: string;
}

export const toPaymentDto = (model: PaymentModel) =>
  ({
    id: model.id as number,
    userId: model.userId,
    cardNumber: model.cardNumber,
    holderName: model.holderName,
    expirationDate: model.expirationDate,
    securityCode: model.securityCode,
  } as PaymentDto);
