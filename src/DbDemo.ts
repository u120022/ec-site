import { db } from "./Db";

// デモ用のデータ
export const populate = () => {
  db.users.bulkAdd([
    {
      name: "Alice",
      email: "alice@example.com",
      digest:
        "2bd806c97f0e00af1a1fc3328fa763a9269723c8db8fac4f93af71db186d6e90",
    },
    {
      name: "Bob",
      email: "bob@example.com",
      digest:
        "81b637d8fcd2c6da6359e6963113a1170de795e4b725b84d1e0b4cfd9ec58ce9",
    },
  ]);

  db.addresses.bulkAdd([
    {
      userId: 1,
      name: "Alice",
      country: "German",
      address: "XXXYYYZZZ",
      zipcode: "000-0000",
      deleted: 0,
    },
  ]);

  db.payments.bulkAdd([
    {
      userId: 1,
      cardNumber: "0000-0000-0000-0000",
      holderName: "Alice",
      expirationDate: "03/25",
      securityCode: "000",
      deleted: 0,
    },
  ]);

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
