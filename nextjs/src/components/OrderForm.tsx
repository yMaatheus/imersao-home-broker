import { revalidateTag } from 'next/cache'

async function initTransaction(formData: FormData) {
  'use server'
  const shares = formData.get('shares')
  const price = formData.get('price')
  const asset_id = formData.get('asset_id')
  const wallet_id = formData.get('wallet_id')
  const type = formData.get('type')

  const response = await fetch(
    `http://localhost:8000/wallets/${wallet_id}/orders`, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        shares,
        price,
        asset_id,
        type,
        status: 'OPEN',
        Asset: {
          id: asset_id,
          symbol: 'PETR4',
          price: 30,
        },
      }),
    }
  )
  revalidateTag(`orders-wallet-${wallet_id}`)
  return await response.json()
}

export function OrderForm(props: { asset_id: string; wallet_id: string }) {
  return (
    <div>
      <h1>Order Form</h1>
      <form action={initTransaction}>
        <input name="asset_id" type="hidden" value={props.asset_id} />
        <input name="wallet_id" type="hidden" value={props.wallet_id} />
        <input name="type" type="hidden" value="BUY" />
        <input
          name="shares"
          type="number"
          min={1}
          step={1}
          placeholder="quantidade"
        />
        <br />
        <input
          name="price"
          type="number"
          min={1}
          step={0.1}
          placeholder="preço"
        />
        <br />
        <button>Comprar</button>
      </form>
    </div>
  )
}
