import { Wallet } from "@/models";
import { Button, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from "flowbite-react";
import { AssetShow } from "@/components/AssetShow";

export async function getMyWallet(walletId: string): Promise<Wallet>{
  const response = await fetch(`http://localhost:3000/wallets/${walletId}`)
  return response.json()
}

export default async function MyWalletListPage({searchParams}: {searchParams: Promise<{walletId: string}>;}) {
  const { walletId } = await searchParams
  const wallet = await getMyWallet(walletId);
  console.log(wallet)
  return (
      <div className="flex flex-col space-y-5 flex-grow">
        <article className="format">
          <h1>Minha Carteira</h1>
        </article>
        <div className="overflow-x-auto w-full">
          <Table className="w-full max-h-full table-fixed">
            <TableHead>
              <TableHeadCell>Ativo</TableHeadCell>
              <TableHeadCell>Cotação</TableHeadCell>
              <TableHeadCell>Quantidade</TableHeadCell>
              <TableHeadCell>Comprar/Vender</TableHeadCell>
            </TableHead>
            <TableBody>
              {wallet.assets.map((walletAsset, key) => (
                <TableRow key={key}>
                <TableCell>
                  <AssetShow asset={walletAsset.asset} />
                </TableCell>
                <TableCell>R$ {walletAsset.asset.price}</TableCell>
                <TableCell>{walletAsset.shares}</TableCell>
                <TableCell>
                  <Button color="light">Comprar/Vender</Button>
                </TableCell>
              </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
  );
}
