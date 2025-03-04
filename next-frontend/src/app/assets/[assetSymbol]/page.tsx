import { AssetShow } from '@/components/AssetShow';
import { OrderForm } from '@/components/OrderForm';
import { TabsItem } from '@/components/Tabs';
import { OrderType } from '@/models';
import { Card, Tabs } from 'flowbite-react';
import { AssetChartComponent } from './AssetChartComponent';
import { WalletList } from '@/components/WalletList';
import { getAsset, getAssetDailies, getMyWallet } from '@/queries/queries';
import { Time } from 'lightweight-charts';
import { AssetPrice } from './AssetPrice';
import { AssetSync } from '@/components/AssetSync';

export default async function AssetDashboard({
  params,
  searchParams,
}: {
  params: Promise<{ assetSymbol: string }>;
  searchParams: Promise<{ walletId: string }>;
}) {
  const { assetSymbol } = await params;
  const { walletId } = await searchParams;

  if (!walletId) {
    return <WalletList />;
  }

  const wallet = await getMyWallet(walletId);

  if (!wallet) {
    return <WalletList />;
  }

  const asset = await getAsset(assetSymbol);
  const assetDailies = await getAssetDailies(assetSymbol);
  const chartData = assetDailies.map((assetDaily) => ({
    time: (Date.parse(assetDaily.date) / 1000) as Time,
    value: assetDaily.price,
  }));
  return (
    <div className="flex flex-col space-y-5 flex-grow">
      <div className="flex flex-col space-y-2">
        <AssetShow asset={asset} />
        <AssetPrice asset={asset} />
      </div>
      <div className="grid grid-cols-5 flex-grow gap-2">
        <div className="col-span-2">
          <Card>
            <Tabs>
              <TabsItem
                active
                title={<div className="text-blue-700">Comprar</div>}
              >
                <OrderForm
                  asset={asset}
                  walletId={walletId}
                  type={OrderType.BUY}
                />
              </TabsItem>
              <TabsItem title={<div className="text-red-700">Vender</div>}>
                <OrderForm
                  asset={asset}
                  walletId={walletId}
                  type={OrderType.SELL}
                />
              </TabsItem>
            </Tabs>
          </Card>
        </div>
        <div className="col-span-3 flex flex-grow">
          <AssetChartComponent asset={asset} data={chartData}/>
        </div>
      </div>
      <AssetSync assetsSymbols={[assetSymbol]} />
    </div>
  );
}
