import { Component, For } from "solid-js";
import { TransactionModel, useData } from "./DataContext";

const TransactionCard: Component<{ transaction: TransactionModel }> = props => {
	return (
		<div class="border border-black p-3 m-3">
			<div>購入</div>
			<div>{props.transaction.date.toLocaleString()}</div>
			<ul>
				<For each={props.transaction.productList}>
					{x => <li>{x.name}: {x.value} x {x.count}</li>}
				</For>
			</ul>
		</div>
	)
};

const TransactionList: Component = () => {
	const data = useData();

	return (
		<div>
			<div class="font-bold">購入履歴</div>
			<ul>
				<For each={data.transactionList()}>
					{x => <TransactionCard transaction={x} />}
				</For>
			</ul>
		</div>
	);
};

export default TransactionList;
