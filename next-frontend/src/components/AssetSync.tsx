'use client';

import { Asset } from "@/models";
import { socket } from "@/socket.io";
import { useAssetStore } from "@/store";
import { useEffect } from "react";

export function AssetSync(props: { assetsSymbols: string[]}){

    const { assetsSymbols } = props;
    const updateAsset = useAssetStore((state) => state.updateAsset);
    useEffect(() => {
        socket.connect();
        socket.emit("joinAssets", { symbols: assetsSymbols});
        socket.on("assets/priceUpdated", (asset: Asset) => {
            console.log(asset);
            updateAsset(asset);
        });

        return () =>{
            socket.emit("leaveAssets", { symbols: assetsSymbols});
            socket.off("assets/priceUpdated");
     }
    }, [assetsSymbols, updateAsset]);

    return null;
}