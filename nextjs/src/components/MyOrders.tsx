import { WalletAsset } from "@/app/models";

async function getOrders(wallet_id: string): Promise<WalletAsset[]> {
  const response = await fetch(
    `http://localhost:8000/wallets/${wallet_id}/orders`
  );
  return response.json();
}
 
export default async function MyOrders(props: { wallet_id: string }) {
  const orders = await getOrders(props.wallet_id);
  return (
      <ul>
        {orders.map((order) => (
          <li key={order.id}>
            {order.Asset.id} - {order.shares} - R${" "} 
            {order.Asset.price}
          </li>
        ))}
      </ul>
  );
}