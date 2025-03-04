import { create } from "zustand";
import { Asset, Order } from "./models";

export type AssetStore = {
    assets: Asset[];
    //addAsset: (asset: Asset) => void;
    updateAsset: (asset: Asset) => void;
    //removeAsset: (asset: Asset) => void;
}

export type OrderStore = {
    orders: Order[];
    addOrder: (order: Order) => void;
    updateOrder: (order: Order) => void;
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

export const useOrderStore = create<OrderStore>((set) => ({
    orders: [],
    updateOrder: (order) => set((state) => {
        const index = state.orders.findIndex((o) => o._id === order._id);
        if (index === -1) {
            return {
                orders: [...state.orders, order]
            }
        }
        const newOrders = [...state.orders];
        newOrders[index] = order;
        return {
            orders: newOrders
        }
    }),
    addOrder: (order) => set((state) => {
        return {
            orders: [...state.orders, order]
        }
    })
}));

