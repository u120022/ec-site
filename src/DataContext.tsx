import {
	Accessor,
	createContext,
	createSignal,
	ParentComponent,
	useContext,
} from "solid-js";

export type DataModel = {
	productList: Accessor<ProductModel[]>;
	cartItemList: Accessor<CartItemModel[]>;
	transactionList: Accessor<TransactionModel[]>;
	postComment: (product: ProductModel, content: string) => void;
	deleteComment: (comment: CommentModel) => void,
	getComment: (product: ProductModel) => CommentModel[],
	pushToCart: (product: ProductModel, count: number) => void;
	popFromCart: (product: ProductModel, count: number) => void;
	buyAllCartItem: () => void;
};

export type ProductModel = {
	cat: string;
	name: string;
	desc: string;
	pic: undefined | URL,
	startDate: Date,
	value: number;
	count: number;
};

export type CommentModel = {
	product: ProductModel,
	content: string,
	date: Date,
}

export type CartItemModel = {
	product: ProductModel;
	count: number;
};

export type TransactionModel = {
	date: Date,
	productList: ProductModel[];
}

export const DataContext = createContext<DataModel>();

export const DataProvider: ParentComponent = (props) => {
	const [productList, setProductList] = createSignal([
		{ cat: "Item", name: "Item 1", desc: "This is item 1.", pic: undefined, startDate: new Date("2022-11-28T06:00:00"), value: 1000, count: 10 },
		{ cat: "Item", name: "Item 2", desc: "This is item 2.", pic: undefined, startDate: new Date("2022-11-27T12:00:00"), value: 1100, count: 4 },
		{ cat: "Item", name: "Item 3", desc: "This is item 3.", pic: undefined, startDate: new Date("2022-11-30T06:00:00"), value: 3000, count: 100 },
	]);

	const [commentList, setCommentList] = createSignal<CommentModel[]>([]);

	const [cartItemList, setCartItemList] = createSignal<CartItemModel[]>([]);

	const [transactionList, setTransactionList] = createSignal<TransactionModel[]>([]);

	const postComment = (product: ProductModel, content: string) => {
		const date = new Date();
		setCommentList(prev => [...prev, { product, content, date }]);
	}

	const deleteComment = (comment: CommentModel) => {
		setCommentList(prev => prev.filter(x => x != comment));
	};

	const getComment = (product: ProductModel) => {
		return commentList().filter(x => x.product == product);
	}

	const pushToCart = (product: ProductModel, count: number) => {
		const list = [...cartItemList()];
		const i = list.findIndex((x) => x.product == product);
		if (i != -1) {
			if (product.count < list[i].count + count) return;

			list[i] = { ...list[i] };
			list[i].count += count;
		} else {
			if (product.count < count) return;

			list.push({ product, count });
		}
		setCartItemList(list);
	};

	const popFromCart = (product: ProductModel, count: number) => {
		const list = [...cartItemList()];
		const i = list.findIndex((x) => x.product == product);
		if (i != -1) {
			list[i] = { ...list[i] };
			list[i].count -= count;

			if (list[i].count <= 0) list.splice(i, 1);
		}
		setCartItemList(list);
	};

	const buyAllCartItem = () => {
		if (cartItemList().length == 0) return;

		const list = [...productList()];

		for (const cartItem of cartItemList())
			for (let i = 0; i < list.length; i++)
				if (cartItem.product == list[i]) {
					if (list[i].count < cartItem.count) return;

					list[i] = { ...list[i] };
					list[i].count -= cartItem.count;
				}

		const transaction = { date: new Date(), productList: [] };
		for (const cartItem of cartItemList()) {
			transaction.productList.push(cartItem.product);
		}
		setTransactionList(prev => [...prev, transaction]);

		setProductList(list);
		setCartItemList([]);
	};

	const dataModel: DataModel = {
		productList,
		cartItemList,
		transactionList,
		postComment,
		deleteComment,
		getComment,
		pushToCart,
		popFromCart,
		buyAllCartItem,
	};

	return (
		<DataContext.Provider value={dataModel}>
			{props.children}
		</DataContext.Provider>
	);
};

export const useData = () => useContext(DataContext);
