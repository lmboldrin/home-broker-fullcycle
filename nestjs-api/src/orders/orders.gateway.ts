import { OrderPresenter } from './order.presenter';
import { OrderType } from './entities/order.entity';
import { OrdersService } from './orders.service';
import { Server } from 'socket.io';
import { OnGatewayInit, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { merge } from 'rxjs';
import { Logger } from '@nestjs/common';

@WebSocketGateway({ cors: true })
export class OrdersGateway implements OnGatewayInit {

  logger = new Logger(OrdersGateway.name);
  
  constructor(private ordersService: OrdersService) { }

 afterInit(server: Server) {
    // Mescla os observables de atualização e criação de orders
    merge(
      this.ordersService.subscribeOrderListUpdates(),
      this.ordersService.subscribeOrderCreatedEvents()
    ).subscribe((order) => {
      (async () => {
        // Assume que order.wallet pode ser um objeto com _id ou já ser a string walletId
        const walletId = typeof order.wallet === 'object' ? order.wallet._id : order.wallet;
        // Emite o evento apenas para a sala identificada pelo walletId
        const orderToEmit = await this.ordersService.findOne(order._id);
        server.to(walletId.toString()).emit('orders/listUpdated', new OrderPresenter(orderToEmit).toJSON());
      })().catch(error => this.logger.error('Error processing order update', error));
    });
  }

  @SubscribeMessage('orders/create')
  async handleMessage(client: any, payload: {
    assetId: string,
    walletId: string,
    type: OrderType,
    shares: number,
    price: number
  }
  ) {
    const order = await this.ordersService.create({
      assetId: payload.assetId,
      walletId: payload.walletId,
      type: payload.type,
      shares: payload.shares,
      price: payload.price,
    });
    return order;
  }
  

  @SubscribeMessage('joinOrdersList')
  handleJoinOrdersList(client: any, payload: { walletId: string }) {
    client.join(payload.walletId);
    this.logger.log(`Client ${client.id} joined orders list: ${payload.walletId}`);

  }

  @SubscribeMessage('leaveOrdersList')
  handleLeaveOrdersList(client: any, payload: { walletId: string }) {
    client.leave(payload.walletId);
    this.logger.log(`Client ${client.id} left orders list: ${payload.walletId}`);
  }
}
