import { MyOrders } from '@/components/MyOrders'
import { OrderForm } from '@/components/OrderForm'
import { TabsGroup, TabsItem } from '@/components/flowbite-components'
import { HiArrowUp, HiShoppingCart } from '@/components/react-itens/hi'

export default async function HomeBrokerPage({
  params,
}: {
  params: { wallet_id: string; asset_id: string };
}) {
  return (
    <div>
      <h1>Home Broker</h1>
      <div className="flex flex-row">
        <div className="flex flex-col">
          <div>
            <TabsGroup aria-label="Default tabs" style="pills">
              <TabsItem active title="Comprar" icon={HiShoppingCart}>
                <OrderForm
                  asset_id={params.asset_id}
                  wallet_id={params.wallet_id}
                  type="BUY"
                />
              </TabsItem>
              <TabsItem title="Vender" icon={HiArrowUp}>
                <OrderForm
                  asset_id={params.asset_id}
                  wallet_id={params.wallet_id}
                  type="SELL"
                />
              </TabsItem>
            </TabsGroup>
          </div>
          <div>
            <MyOrders wallet_id={params.wallet_id} />
          </div>
        </div>
        <div>gráfico</div>
      </div>
    </div>
  )
}
