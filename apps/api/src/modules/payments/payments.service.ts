import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaymentStatus } from '@mesterpont/database';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async createPayment(taskId: string, userId: string) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: { client: true, tasker: true },
    });

    if (!task || task.clientId !== userId) {
      throw new BadRequestException('Task not found or unauthorized');
    }

    if (!task.finalAmount) {
      throw new BadRequestException('Task does not have a final amount');
    }

    const amount = Number(task.finalAmount);
    const platformFee = amount * 0.15; // 15% platform fee
    const taskerPayout = amount - platformFee;

    // TODO: Integrate with SimplePay API here
    // For MVP, we'll create a mock payment

    const payment = await this.prisma.payment.create({
      data: {
        taskId,
        clientId: userId,
        taskerId: task.taskerId,
        amount,
        platformFee,
        taskerPayout,
        paymentProvider: 'simplepay',
        status: PaymentStatus.PENDING,
      },
    });

    // In production, return SimplePay redirect URL
    return {
      id: payment.id,
      amount,
      status: payment.status,
      paymentUrl: `https://sandbox.simplepay.hu/payment/${payment.id}`, // Mock URL
    };
  }

  async holdPayment(paymentId: string) {
    return this.prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: PaymentStatus.HELD,
        heldAt: new Date(),
      },
    });
  }

  async releasePayment(paymentId: string) {
    const payment = await this.prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: PaymentStatus.RELEASED,
        releasedAt: new Date(),
      },
      include: {
        tasker: {
          include: {
            taskerProfile: true,
          },
        },
      },
    });

    // Update tasker earnings
    if (payment.tasker?.taskerProfile) {
      await this.prisma.taskerProfile.update({
        where: { userId: payment.taskerId },
        data: {
          totalEarnings: {
            increment: payment.taskerPayout,
          },
          completedTasks: {
            increment: 1,
          },
        },
      });
    }

    return payment;
  }

  async refundPayment(paymentId: string) {
    return this.prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: PaymentStatus.REFUNDED,
      },
    });
  }
}
