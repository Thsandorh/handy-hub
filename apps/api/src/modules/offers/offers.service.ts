import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TasksService } from '../tasks/tasks.service';
import { CreateOfferDto } from '@mesterpont/types';
import { OfferStatus, TaskStatus } from '@mesterpont/database';

@Injectable()
export class OffersService {
  constructor(
    private prisma: PrismaService,
    private tasksService: TasksService
  ) {}

  async create(userId: string, dto: CreateOfferDto) {
    // Check if task exists and is open
    const task = await this.prisma.task.findUnique({
      where: { id: dto.taskId },
    });

    if (!task || task.status !== TaskStatus.OPEN) {
      throw new BadRequestException('Task is not available for offers');
    }

    // Check if user already made an offer
    const existingOffer = await this.prisma.offer.findUnique({
      where: {
        taskId_taskerId: {
          taskId: dto.taskId,
          taskerId: userId,
        },
      },
    });

    if (existingOffer) {
      throw new BadRequestException('You already made an offer for this task');
    }

    return this.prisma.offer.create({
      data: {
        taskId: dto.taskId,
        taskerId: userId,
        proposedAmount: dto.proposedAmount,
        message: dto.message,
        status: OfferStatus.PENDING,
      },
      include: {
        tasker: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
            taskerProfile: {
              select: {
                averageRating: true,
                completedTasks: true,
              },
            },
          },
        },
      },
    });
  }

  async accept(offerId: string, userId: string) {
    const offer = await this.prisma.offer.findUnique({
      where: { id: offerId },
      include: {
        task: true,
      },
    });

    if (!offer || offer.task.clientId !== userId) {
      throw new BadRequestException('Offer not found or unauthorized');
    }

    if (offer.status !== OfferStatus.PENDING) {
      throw new BadRequestException('Offer is no longer available');
    }

    // Accept this offer
    await this.prisma.offer.update({
      where: { id: offerId },
      data: { status: OfferStatus.ACCEPTED },
    });

    // Reject all other offers for this task
    await this.prisma.offer.updateMany({
      where: {
        taskId: offer.taskId,
        id: { not: offerId },
      },
      data: { status: OfferStatus.REJECTED },
    });

    // Assign tasker to task
    await this.tasksService.assignTasker(
      offer.taskId,
      offer.taskerId,
      Number(offer.proposedAmount)
    );

    return { success: true, message: 'Offer accepted' };
  }

  async reject(offerId: string, userId: string) {
    const offer = await this.prisma.offer.findUnique({
      where: { id: offerId },
      include: {
        task: true,
      },
    });

    if (!offer || offer.task.clientId !== userId) {
      throw new BadRequestException('Offer not found or unauthorized');
    }

    await this.prisma.offer.update({
      where: { id: offerId },
      data: { status: OfferStatus.REJECTED },
    });

    return { success: true, message: 'Offer rejected' };
  }

  async getOffersByTask(taskId: string) {
    return this.prisma.offer.findMany({
      where: { taskId },
      include: {
        tasker: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
            taskerProfile: {
              select: {
                averageRating: true,
                completedTasks: true,
                bio: true,
              },
            },
          },
        },
      },
      orderBy: {
        proposedAmount: 'asc',
      },
    });
  }
}
