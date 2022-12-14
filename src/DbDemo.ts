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
      name: "白い箱の梱包",
      desc: "",
      pic: "/products/PXL_20221215_024756016.webp",
      date: new Date("2022-11-30T06:00:00"),
      price: 1000,
      quantity: 10,
    },
    {
      name: "Anker USB-C ケーブル 65W",
      desc: "",
      pic: "/products/PXL_20221215_024748578.webp",
      date: new Date("2022-11-30T06:00:00"),
      price: 8000,
      quantity: 10,
    },
    {
      name: "無印 スチール脚 10cm",
      desc: "",
      pic: "/products/PXL_20221215_024740312.webp",
      date: new Date("2022-11-30T06:00:00"),
      price: 3000,
      quantity: 10,
    },
    {
      name: "Microsoft Surface用 キーボード",
      desc: "",
      pic: "/products/PXL_20221215_024304194.webp",
      date: new Date("2022-11-30T06:00:00"),
      price: 10000,
      quantity: 10,
    },
    {
      name: "亀登製作所 革製 ペンケース",
      desc: "",
      pic: "/products/PXL_20221215_024806010.webp",
      date: new Date("2022-11-30T06:00:00"),
      price: 3000,
      quantity: 10,
    },
    {
      name: "GELD Silent 12 + 14 x 2 ケースファン",
      desc: "",
      pic: "/products/PXL_20221212_034242566.webp",
      date: new Date("2022-11-30T06:00:00"),
      price: 6200,
      quantity: 10,
    },
    {
      name: "Crucial NVMe M.2 SSD 500GB SSDストレージ",
      desc: "",
      pic: "/products/PXL_20221212_034231888.webp",
      date: new Date("2022-11-30T06:00:00"),
      price: 9600,
      quantity: 10,
    },
    {
      name: "Google Pixel 6a スマートフォン",
      desc: "",
      pic: "/products/PXL_20221212_034224523.webp",
      date: new Date("2022-11-30T06:00:00"),
      price: 61000,
      quantity: 10,
    },
    {
      name: "LS280 RGB LED照明",
      desc: "",
      pic: "/products/PXL_20221212_034215567.webp",
      date: new Date("2022-11-30T06:00:00"),
      price: 4200,
      quantity: 10,
    },
    {
      name: "SANWA SUPLY ヘッドホンフック",
      desc: "",
      pic: "/products/PXL_20221212_034206351.webp",
      date: new Date("2022-11-30T06:00:00"),
      price: 1000,
      quantity: 10,
    },
    {
      name: "RENA PENCIL スタイラスペン",
      desc: "",
      pic: "/products/PXL_20221212_034156828.webp",
      date: new Date("2022-11-30T06:00:00"),
      price: 5500,
      quantity: 10,
    },
    {
      name: "JVC XXシリーズ 有線イヤホン",
      desc: "",
      pic: "/products/PXL_20221212_034138478.webp",
      date: new Date("2022-11-30T06:00:00"),
      price: 4700,
      quantity: 10,
    },
    {
      name: "Logicool MX ERGO 無線トラックボールマウス",
      desc: "",
      pic: "/products/PXL_20221212_034129644.webp",
      date: new Date("2022-11-30T06:00:00"),
      price: 13000,
      quantity: 10,
    },
    {
      name: "Logicool MX KEYS 無線キーボード",
      desc: "",
      pic: "/products/PXL_20221212_034119055.webp",
      date: new Date("2022-11-30T06:00:00"),
      price: 15000,
      quantity: 10,
    },
    {
      name: "Anker 65W ACアダプタ",
      desc: "",
      pic: "/products/PXL_20221212_034108282.webp",
      date: new Date("2022-11-30T06:00:00"),
      price: 11000,
      quantity: 10,
    },
    {
      name: "Anker USB-C ハブ",
      desc: "",
      pic: "/products/PXL_20221212_034101064.webp",
      date: new Date("2022-11-30T06:00:00"),
      price: 12500,
      quantity: 10,
    },
    {
      name: "電源ケーブル",
      desc: "",
      pic: "/products/PXL_20221212_034046580.webp",
      date: new Date("2022-11-30T06:00:00"),
      price: 3000,
      quantity: 10,
    },
    {
      name: "RGB LED照明",
      desc: "",
      pic: "/products/PXL_20221212_034015691.webp",
      date: new Date("2022-11-30T06:00:00"),
      price: 5000,
      quantity: 10,
    },
    {
      name: "Microsoft Surface Pro 8",
      desc: "",
      pic: "/products/PXL_20221212_033643753.webp",
      date: new Date("2022-11-30T06:00:00"),
      price: 150000,
      quantity: 10,
    },
    {
      name: "AKG K240 ヘッドホン",
      desc: "",
      pic: "/products/PXL_20221212_033633142.webp",
      date: new Date("2022-11-30T06:00:00"),
      price: 12000,
      quantity: 10,
    },
    {
      name: "Google Pixel 6用 ケース",
      desc: "",
      pic: "/products/PXL_20221212_033625771.webp",
      date: new Date("2022-11-30T06:00:00"),
      price: 3100,
      quantity: 10,
    },
    {
      name: "PERLSMITH Full Motion TV Wall Mount モニターアーム",
      desc: "",
      pic: "/products/PXL_20221212_033616595.webp",
      date: new Date("2022-11-30T06:00:00"),
      price: 3500,
      quantity: 10,
    },
    {
      name: "70x35cmと書かれた梱包",
      desc: "",
      pic: "/products/PXL_20221212_033601964.webp",
      date: new Date("2022-11-30T06:00:00"),
      price: 1000,
      quantity: 10,
    },
    {
      name: "Logicool MX PALM REST パームレスト",
      desc: "",
      pic: "/products/PXL_20221212_033556038.webp",
      date: new Date("2022-11-30T06:00:00"),
      price: 8000,
      quantity: 10,
    },
    {
      name: "Amazon Akindle Whitepaper 電子書籍リーダー",
      desc: "",
      pic: "/products/PXL_20221212_033549300.webp",
      date: new Date("2022-11-30T06:00:00"),
      price: 16000,
      quantity: 10,
    },
    {
      name: "IVANKY Display Port v1.4 ケーブル",
      desc: "",
      pic: "/products/PXL_20221212_033541932.webp",
      date: new Date("2022-11-30T06:00:00"),
      price: 10000,
      quantity: 10,
    },
  ]);
};
