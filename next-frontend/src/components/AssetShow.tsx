import { Asset } from "@/models";
import Image from "next/image";

export function AssetShow(props: {asset: Asset}) {
    const { asset } = props;
    return (
    <div className="flex space-x-1">
        <div className="content-center">
          <Image 
          src={asset.imageUrl} 
          alt={asset.symbol} 
          width={30} 
          height={30}/>
        </div>
        <div className="flex flex-col text-small">
          <span>{asset.name}</span>
          <span>{asset.symbol}</span>
        </div>
    </div>
    );
}
