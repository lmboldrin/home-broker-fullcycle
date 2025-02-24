import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderDocument, OrderStatus } from './entities/order.entity';
import { Model } from 'mongoose';
import { Asset } from 'src/assets/entities/asset.entity';

@Injectable()
export class OrdersService {
constructor(@InjectModel(Order.name) private orderSchema: Model<OrderDocument>) {}

  async create(createOrderDto: CreateOrderDto) {
    try{
      return this.orderSchema.create({
        wallet: createOrderDto.walletId,
        asset: createOrderDto.assetId,
        type: createOrderDto.type,
        shares: createOrderDto.shares,
        partial: createOrderDto.shares,
        price: createOrderDto.price,
        status: OrderStatus.PENDING
      });
    }catch(err){
      console.log(err);
      throw new HttpException(
        'Houve um erro ao criar a ordem.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(filter: { walletId: string }) {
    const orders = this.orderSchema.find({wallet: filter.walletId}).populate('asset') as Promise<(Order & {asset: Asset})[]>;
    return orders;
  }

  async findOne(id: string) {
    const order = await this.orderSchema.findById(id).populate('asset') as (Order & {asset: Asset});
    if (!order) {
      throw new HttpException(
        'Não foi encontrado uma ordem com o id informado.',
        HttpStatus.NOT_FOUND
      );
    }
    return order;
  }
}
