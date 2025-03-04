'use client';

import { Order } from "@/models";
import { socket } from "@/socket.io";
import { useOrderStore } from "@/store";
import { useEffect } from "react";

export function OrderSync(props: { walletId: string }) {
  const { walletId } = props;
  const updateOrder = useOrderStore((state) => state.updateOrder);
  const addOrder = useOrderStore((state) => state.addOrder);
  useEffect(() => {
    socket.connect();
    socket.emit("joinOrdersList", { walletId: walletId });
    socket.on("orders/listUpdated", (order: Order) => {
      const exists = useOrderStore.getState().orders.some(
        (o) => o._id === order._id
      );
      if (exists) {
        updateOrder(order);
      } else {
        addOrder(order);
      }
    });
    return () => {
      socket.emit("leaveOrdersList", { walletId: walletId });
      socket.off("orders/listUpdated");
    };
  }, [walletId, addOrder, updateOrder]);
  return null;
} 