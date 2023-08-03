import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
  },
})
export class NotificationsGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('message')
  sendNotificationToUser(
    userId: number,
    message: string,
    @MessageBody() username?: string,
  ) {
    console.log('notification sent:', message);

    const notification = this.server
      .to(`user-${userId}`)
      .emit('notification', message);
    return { notification, username };
  }
}
