'use client';

import { AssetShow } from '@/components/AssetShow';
import { Asset } from '@/models';
import { useAssetStore } from '@/store';
import { Button, TableCell, TableRow } from 'flowbite-react';
import Link from 'next/link';
import { useShallow } from 'zustand/shallow';

export function TableAssetRow(props: { asset: Asset; walletId: string }) {
  const { asset: assetProp, walletId } = props;

  const assetFound = useAssetStore(
    useShallow((state) => state.assets.find((a) => a.symbol === assetProp.symbol))
  );
  const asset = assetFound ? assetFound : assetProp;

  return (
    <TableRow>
      <TableCell>
        <AssetShow asset={asset} />
      </TableCell>
      <TableCell>R$ {asset.price}</TableCell>
      <TableCell>
        <Button
          color="light"
          as={Link}
          href={`assets/${asset.symbol}?walletId=${walletId}`}
        >
          Comprar/Vender
        </Button>
      </TableCell>
    </TableRow>
  );
}
