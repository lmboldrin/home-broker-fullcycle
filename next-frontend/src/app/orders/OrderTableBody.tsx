'use client';

import { TableBody } from 'flowbite-react';
import { TableOrderRow } from './TableOrderRow';
import { OrderSync } from './OrderSync';
import { useOrderStore } from '@/store';
import { Order } from '@/models';

export function OrderTableBody(props: { orders: Order[], walletId: string }) {
  const { orders: initialOrders , walletId } = props;
  const ordersFound = useOrderStore((state) => state.orders);

  const orders = ordersFound.length > 0 ? ordersFound : initialOrders;

  return (
    <>
      <TableBody>
        {orders.map((order, key) => (
          <TableOrderRow key={key} order={order} />
        ))}
      </TableBody>
      <OrderSync walletId={walletId} />
    </>
  );
}
