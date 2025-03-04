import { WalletList } from '@/components/WalletList';
import { getMyWallet, getOrders } from '@/queries/queries';
import { OrderTableBody } from './OrderTableBody';
import {
  Table,
  TableHead,
  TableHeadCell,
} from 'flowbite-react';

export default async function OrdersListPage({
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

  const orders = await getOrders(walletId);
  return (
    <div className="flex flex-col space-y-5 flex-grow">
      <article className="format">
        <h1>Minhas Ordens</h1>
      </article>
      <div className="overflow-x-auto w-full">
        <Table className="w-full max-h-full table-fixed">
          <TableHead>
            <TableHeadCell>Ativo</TableHeadCell>
            <TableHeadCell>Preço</TableHeadCell>
            <TableHeadCell>Quantidade</TableHeadCell>
            <TableHeadCell>Tipo</TableHeadCell>
            <TableHeadCell>Status</TableHeadCell>
          </TableHead>
          <OrderTableBody orders={orders} walletId={walletId} />
        </Table>
      </div>
    </div>
  );
}
