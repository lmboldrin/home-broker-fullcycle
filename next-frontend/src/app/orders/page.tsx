import { Order } from "@/models";
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from "flowbite-react";
import { AssetShow } from "@/components/AssetShow";
import { OrderTypeBadge } from "@/components/OrderTypeBadge";
import { OrderStatusBadge } from "@/components/OrderStatusBadge";

export async function getOrders(walletId: string): Promise<Order[]>{
  const response = await fetch(`http://localhost:3000/orders?walletId=${walletId}`)
  return response.json()
}

export default async function OrdersListPage({searchParams}: {searchParams: Promise<{walletId: string}>;}) {
  const { walletId } = await searchParams
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
            <TableBody>
              {orders.map((order, key) => (
                <TableRow key={key}>
                <TableCell>
                  <AssetShow asset={order.asset} />
                </TableCell>
                <TableCell>R$ {order.price}</TableCell>
                <TableCell>{order.shares}</TableCell>
                <TableCell><OrderTypeBadge type = {order.type}/></TableCell>
                <TableCell><OrderStatusBadge status = {order.status}/></TableCell>
              </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
  );
}
