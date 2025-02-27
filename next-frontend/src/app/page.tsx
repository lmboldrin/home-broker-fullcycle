import {
  Table,
  TableBody,
  TableHead,
  TableHeadCell,
} from 'flowbite-react';
import { WalletList } from '@/components/WalletList';
import { getMyWallet } from '@/queries/queries';
import { AssetSync } from '@/components/AssetSync';
import { TableWalletAssetRow } from './TableWalletAssetRow';

export default async function MyWalletListPage({
  searchParams,
}: {
  searchParams: Promise<{ walletId: string }>;
}) {
  const { walletId } = await searchParams;

  if (!walletId) {
    return <WalletList />;
  }

  const wallet = await getMyWallet(walletId);

  if (!wallet) {
    return <WalletList />;
  }

  console.log(wallet);
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
              <TableWalletAssetRow key={key} walletAsset={walletAsset} walletId={walletId} />
            ))}
          </TableBody>
        </Table>
      </div>
      <AssetSync assetsSymbols={wallet.assets.map((walletAsset) => walletAsset.asset.symbol)} />
    </div>
  );
}
