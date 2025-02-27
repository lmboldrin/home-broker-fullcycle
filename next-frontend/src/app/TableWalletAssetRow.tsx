'use client';

import { AssetShow } from '@/components/AssetShow';
import { WalletAsset } from '@/models';
import { useAssetStore } from '@/store';
import { Button, TableCell, TableRow } from 'flowbite-react';
import Link from 'next/link';
import { useShallow } from 'zustand/shallow';

export function TableWalletAssetRow(props: {
  walletAsset: WalletAsset;
  walletId: string;
}) {
  const { walletAsset, walletId } = props;

  const assetFound = useAssetStore(
    useShallow((state) =>
      state.assets.find((a) => a.symbol === walletAsset.asset.symbol)
    )
  );
  const asset = assetFound ? assetFound : walletAsset.asset;

  return (
    <TableRow>
      <TableCell>
        <AssetShow asset={asset} />
      </TableCell>
      <TableCell>R$ {asset.price}</TableCell>
      <TableCell>{walletAsset.shares}</TableCell>
      <TableCell>
        <Button
          color="light"
          as={Link}
          href={`/assets/${asset.symbol}?walletId=${walletId}`}
        >
          Comprar/Vender
        </Button>
      </TableCell>
    </TableRow>
  );
}
