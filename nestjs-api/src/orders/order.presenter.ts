import { AssetPresenter } from '../assets/asset.presenter';
import { Asset } from '../assets/entities/asset.entity';
import { Order } from './entities/order.entity';

export class OrderPresenter {
  constructor(
    private order: Order & { asset: Asset },
  ) {}

  toJSON() {
    return {
      _id: this.order._id,
      asset: new AssetPresenter(this.order.asset).toJSON(),
      shares: this.order.shares,
      partial: this.order.partial,
      type: this.order.type,
      status: this.order.status,
      price: this.order.price,
    };
  }
}
