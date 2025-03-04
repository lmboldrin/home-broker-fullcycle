"use client";

import { useShallow } from "zustand/react/shallow";
import { Asset } from "../../../models";
import { useAssetStore } from "../../../store";

export function AssetPrice(props: { asset: Asset}) {
  const { asset } = props;
  const assetFetched = useAssetStore(
    useShallow((state) => state.assets.find((a) => a.symbol === asset.symbol))
  );
console.log(assetFetched);
  const price = assetFetched ? assetFetched.price : props.asset.price;

  return <div className="ml-2 font-bold text-2xl">R$ {price}</div>;
}
