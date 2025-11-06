import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagesService } from './messages.service';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
})
export class MessagesGateway {
  @WebSocketServer()
  server: Server;

  constructor(private messagesService: MessagesService) {}

  @SubscribeMessage('joinConversation')
  handleJoinConversation(
    @MessageBody() data: { conversationId: string },
    @ConnectedSocket() client: Socket
  ) {
    client.join(data.conversationId);
    console.log(`Client joined conversation: ${data.conversationId}`);
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @MessageBody()
    data: { conversationId: string; senderId: string; content: string },
    @ConnectedSocket() client: Socket
  ) {
    const message = await this.messagesService.sendMessage(
      data.conversationId,
      data.senderId,
      data.content
    );

    // Broadcast to all clients in the conversation
    this.server.to(data.conversationId).emit('newMessage', message);

    return message;
  }

  @SubscribeMessage('markAsRead')
  async handleMarkAsRead(@MessageBody() data: { messageId: string }) {
    return this.messagesService.markAsRead(data.messageId);
  }
}
