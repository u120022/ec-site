import {
  Component,
  createContext,
  createEffect,
  createSignal,
  useContext,
} from "solid-js";
import { service } from "../../Service";
import ProductList from "./View";

export interface ProductListModel {
  getFilter: () => string;
  setFilter: (value: string) => void;
  getOrderBy: () => string;
  setOrderBy: (value: string) => void;
  getPage: () => number;
  setPage: (value: number) => void;
  getMaxPageCount: () => number | undefined;
  getProducts: () => ProductModel[] | undefined;
}

export interface ProductModel {
  id: number;
  name: string;
  pic: string;
  price: number;
  salesAmount: number;
  favoriteCount: number;
  bookmarkCount: number;
}

export const context = createContext<ProductListModel>();

export function useHandle() {
  const model = useContext(context);
  if (model == undefined) throw new Error("Has not context provider!");
  return model;
}

export const Handle: Component = () => {
  const countPerPage = 16;

  const [getFilter, setFilter] = createSignal("");
  const [getOrderBy, setOrderBy] = createSignal("sales_amount_des");
  const [getPage, setPage] = createSignal(0);
  const [getProducts, setProducts] = createSignal<ProductModel[]>();
  const [getMaxPageCount, setMaxPageCount] = createSignal<number>();

  createEffect(async () => {
    const productDtos = await service.getProducts(getPage(), countPerPage, {
      filter: getFilter(),
      orderBy: getOrderBy(),
    });
    const products: ProductModel[] = [];
    for (const product of productDtos) {
      const salesAmount = await service.getSalesAmount(product.id);
      const favoriteCount = await service.getFavoriteCountByProduct(product.id);
      const bookmarkCount = await service.getBookmarkCountByProduct(product.id);
      products.push({ ...product, salesAmount, favoriteCount, bookmarkCount });
    }
    setProducts(products);
  });

  createEffect(async () => {
    const count = await service.getProductCount({ filter: getFilter() });
    setMaxPageCount(Math.ceil(count / countPerPage));
  });

  const model: ProductListModel = {
    getFilter,
    setFilter,
    getOrderBy,
    setOrderBy,
    getPage,
    setPage,
    getProducts,
    getMaxPageCount,
  };

  return (
    <context.Provider value={model}>
      <ProductList />
    </context.Provider>
  );
};

export default Handle;
