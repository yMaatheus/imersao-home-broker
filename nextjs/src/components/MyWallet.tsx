import { WalletAsset } from '@/app/models'
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from '@/components/flowbite-components'
import Link from 'next/link'

async function getWalletAssets(wallet_id: string): Promise<WalletAsset[]> {
  const response = await fetch(
    `http://host.docker.internal:3000/wallets/${wallet_id}/assets`, {
      // cache: 'no-store', processamento sem cache
      next: {
        // revalidate: isHomeBrokerClosed() ? 60 * 60 : 5,
        revalidate: 1,
      }
    }
  )
  return response.json()
}
 
export async function MyWallet(props: { wallet_id: string }) {
  const walletAssets = await getWalletAssets(props.wallet_id)
  return (
    <Table>
    <TableHead>
      <TableHeadCell>Nome</TableHeadCell>
      <TableHeadCell>Preço R$</TableHeadCell>
      <TableHeadCell>Quant.</TableHeadCell>
      <TableHeadCell>
        <span className="sr-only">Comprar/Vender</span>
      </TableHeadCell>
    </TableHead>
    <TableBody className="divide-y">
      {walletAssets!.map((walletAsset, key) => (
        <TableRow className="border-gray-700 bg-gray-800" key={key}>
          <TableCell className="whitespace-nowrap font-medium text-white">
            {walletAsset.Asset.id} ({walletAsset.Asset.symbol})
          </TableCell>
          <TableCell>{walletAsset.Asset.price}</TableCell>
          <TableCell>{walletAsset.shares}</TableCell>
          <TableCell>
            <Link
              className="font-medium hover:underline text-cyan-500"
              href={`/${props.wallet_id}/home-broker/${walletAsset.Asset.id}`}
            >
              Comprar/Vender
            </Link>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
  )
}
