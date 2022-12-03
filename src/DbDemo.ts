import { db } from "./Db";

export const populate = () => {
	// ユーザー
	db.users.bulkAdd([
		{
			name: "Alice",
			email: "alice@example.com",
			password: "alice",
		},
		{
			name: "Bob",
			email: "bob@example.com",
			password: "bob",
		}
	]);

	// 商品
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
		{
			name: "Item 4",
			desc: "This is item!",
			pic: "",
			date: new Date("2022-11-29T06:00:00"),
			value: 3000,
			count: 9,
		},
		{
			name: "Item 5",
			desc: "This is item!",
			pic: "",
			date: new Date("2022-11-29T06:00:00"),
			value: 3000,
			count: 9,
		},
		{
			name: "Item 6",
			desc: "This is item!",
			pic: "",
			date: new Date("2022-11-29T06:00:00"),
			value: 3000,
			count: 9,
		},
		{
			name: "Item 7",
			desc: "This is item!",
			pic: "",
			date: new Date("2022-11-29T06:00:00"),
			value: 3000,
			count: 9,
		},
		{
			name: "Item 8",
			desc: "This is item!",
			pic: "",
			date: new Date("2022-11-29T06:00:00"),
			value: 3000,
			count: 9,
		},
		{
			name: "Item 9",
			desc: "This is item!",
			pic: "",
			date: new Date("2022-11-29T06:00:00"),
			value: 3000,
			count: 9,
		},
		{
			name: "Item 10",
			desc: "This is item!",
			pic: "",
			date: new Date("2022-11-29T06:00:00"),
			value: 3000,
			count: 9,
		},
	]);
};
