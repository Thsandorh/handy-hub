import { Controller, Post, Put, Body, Param, UseGuards, Request } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Payments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post('task/:taskId')
  async createPayment(@Param('taskId') taskId: string, @Request() req) {
    return this.paymentsService.createPayment(taskId, req.user.userId);
  }

  @Put(':id/hold')
  async holdPayment(@Param('id') id: string) {
    return this.paymentsService.holdPayment(id);
  }

  @Put(':id/release')
  async releasePayment(@Param('id') id: string) {
    return this.paymentsService.releasePayment(id);
  }

  @Put(':id/refund')
  async refundPayment(@Param('id') id: string) {
    return this.paymentsService.refundPayment(id);
  }
}
