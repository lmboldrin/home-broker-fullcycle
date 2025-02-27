import { create } from "zustand";
import { Asset } from "./models";

export type AssetStore = {
    assets: Asset[];
    //addAsset: (asset: Asset) => void;
    updateAsset: (asset: Asset) => void;
    //removeAsset: (asset: Asset) => void;
}

export const useAssetStore = create<AssetStore>((set) => ({
    assets: [],
    updateAsset: (asset) => set((state) => {
        const index = state.assets.findIndex((a) => a.symbol === asset.symbol);
        if (index === -1) {
            return {
                assets: [...state.assets, asset]
            }
        }
        const newAssets = [...state.assets];
        newAssets[index] = asset;
        return {
            assets: newAssets
        }

    })
}));

