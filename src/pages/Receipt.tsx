import { Accessor, Component, Index, Show } from "solid-js";
import { ReceiptItemModel, ReceiptModel } from "../Models";
import { useService } from "../ServiceContext";

const ReceiptItemCard: Component<{ receiptItem: Accessor<ReceiptItemModel> }> = props => {
	const service = useService();
	const product = service.getProduct(props.receiptItem().productId);

	return (
		<div>
			<Show when={product()}>
				<div>商品名: {product().name}</div>
				<div>金額: {props.receiptItem().value}, 個数: {props.receiptItem().count}</div>
			</Show>
		</div>
	);
};

const RecieptCard: Component<{ receipt: Accessor<ReceiptModel> }> = props => {
	const service = useService();
	const receiptItems = service.getReceiptItems(props.receipt().id, 20);

	return (
		<div class="m-3 border border-black p-3">
			<div>購入金額: {props.receipt().value}</div>
			<div>日時: {props.receipt().date.toLocaleString()}</div>
			<ul>
				<Index each={receiptItems}>
					{x =>
						<li><ReceiptItemCard receiptItem={x} /></li>
					}
				</Index>
			</ul>
		</div>
	);
};

const RecieptList: Component = () => {
	const service = useService();
	const receipts = service.getReceipts(20);

	return (
		<div>
			<div class="font-bold">購入履歴</div>
			<ul>
				<Index each={receipts}>
					{x =>
						<li><RecieptCard receipt={x} /></li>
					}
				</Index>
			</ul>
		</div>
	);
};

export default RecieptList;
