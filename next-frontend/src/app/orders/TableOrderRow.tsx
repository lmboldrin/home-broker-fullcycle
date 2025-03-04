'use client';

import { AssetShow } from "@/components/AssetShow";
import { OrderStatusBadge } from "@/components/OrderStatusBadge";
import { OrderTypeBadge } from "@/components/OrderTypeBadge";
import { Order } from "@/models";
import { useOrderStore } from "@/store";
import { TableCell, TableRow } from "flowbite-react/components/Table";
import { useShallow } from "zustand/shallow";

export const TableOrderRow = (props: { order: Order }) => {
    const { order: orderProp } = props;

    const orderFound = useOrderStore(
        useShallow((state) => state.orders.find((o) => o._id === orderProp._id))
    );
    const order = orderFound ? orderFound : orderProp;
    console.log(order);
    return (
        <TableRow>
            <TableCell>
              <AssetShow asset={order.asset} />
            </TableCell>
            <TableCell>R$ {order.price}</TableCell>
            <TableCell>{order.shares}</TableCell>
            <TableCell>
              <OrderTypeBadge type={order.type} />
            </TableCell>
            <TableCell>
              <OrderStatusBadge status={order.status} />
            </TableCell>
        </TableRow>
    );
}