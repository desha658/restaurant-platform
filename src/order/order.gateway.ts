import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*', // 👈 مهم عشان يقدر Angular يتصل بيه
  },
})
export class OrderGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`🔌 عميل اتصل: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`❌ عميل فصل الاتصال: ${client.id}`);
  }

  // 👇 لما العميل يرسل طلب جديد
  @SubscribeMessage('newOrder')
  handleNewOrder(@MessageBody() orderData: any) {
    console.log('📦 طلب جديد:', orderData);

    // إرسال الطلب لكل الكاشيرين المتصلين
    this.server.emit('orderCreated', orderData);
  }

  // 👇 لما الكاشير يحدّث حالة الطلب
  @SubscribeMessage('updateOrderStatus')
  handleUpdateStatus(@MessageBody() data: any) {
    console.log('🌀 تحديث حالة الطلب:', data);

    // نبلغ العميل إن الحالة اتغيرت
    this.server.emit('orderStatusUpdated', data);
  }
}
