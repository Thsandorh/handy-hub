import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Messages')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('messages')
export class MessagesController {
  constructor(private messagesService: MessagesService) {}

  @Get('conversation/task/:taskId')
  async getOrCreateConversation(@Param('taskId') taskId: string) {
    return this.messagesService.getOrCreateConversation(taskId);
  }

  @Get('conversation/:conversationId')
  async getMessages(@Param('conversationId') conversationId: string) {
    return this.messagesService.getMessages(conversationId);
  }

  @Post('conversation/:conversationId')
  async sendMessage(
    @Param('conversationId') conversationId: string,
    @Request() req,
    @Body() body: { content: string }
  ) {
    return this.messagesService.sendMessage(
      conversationId,
      req.user.userId,
      body.content
    );
  }
}
