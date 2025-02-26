'use client';

import { Asset, Order, OrderType } from '@/models';
import { socket } from '@/socket.io';
import { Button, Label, TextInput } from 'flowbite-react';
import { FormEvent } from 'react';
import { toast } from 'react-toastify';

export function OrderForm(props: {
  asset: Asset;
  walletId: string;
  type: OrderType;
}) {
  const color = props.type === OrderType.BUY ? 'text-blue-700' : 'text-red-700';
  const translatedType = props.type === OrderType.BUY ? 'Compra' : 'Venda';

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    socket.connect();
    const response: Order = await socket.emitWithAck('orders/create', data);
    toast(`Order de ${translatedType} de ${response.shares} ações de ${props.asset.symbol} criada com sucesso!`, { type: 'success', position: "top-right"})
  }

  return (
    <form onSubmit={onSubmit}>
      <input type="hidden" name="assetId" defaultValue={props.asset._id} />
      <input type="hidden" name="walletId" defaultValue={props.walletId} />
      <input type="hidden" name="type" defaultValue={props.type} />
      <div>
        <div className="mb-2">
          <Label htmlFor="shares" value="Quantidade" className={color} />
        </div>
        <TextInput
          id="shares"
          name="shares"
          required
          type="number"
          min={1}
          step={1}
          defaultValue={1}
          color={props.type === OrderType.BUY ? 'info' : 'failure'}
        />
      </div>
      <br />
      <div>
        <div className="mb-2">
          <Label htmlFor="price" value="Preço R$" className={color} />
        </div>
        <TextInput
          id="price"
          name="price"
          required
          type="number"
          min={0}
          step={0.01}
          defaultValue={0.01}
          color={props.type === OrderType.BUY ? 'info' : 'failure'}
        />
      </div>
      <br />
      <Button
        type="submit"
        color={props.type === OrderType.BUY ? 'blue' : 'failure'}
      >
        Confirmar {translatedType}
      </Button>
    </form>
  );
}
