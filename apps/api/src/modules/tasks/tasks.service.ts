import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto, UpdateTaskDto, TaskFilters } from '@mesterpont/types';
import { TaskStatus } from '@mesterpont/database';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateTaskDto) {
    return this.prisma.task.create({
      data: {
        clientId: userId,
        skillId: dto.skillId,
        title: dto.title,
        description: dto.description,
        locationAddress: dto.locationAddress,
        locationLat: dto.locationLat,
        locationLng: dto.locationLng,
        budgetType: dto.budgetType,
        budgetAmount: dto.budgetAmount,
        scheduledAt: dto.scheduledAt,
        dueDate: dto.dueDate,
        status: TaskStatus.OPEN,
      },
      include: {
        client: true,
        skill: true,
      },
    });
  }

  async findAll(filters?: TaskFilters) {
    const where: any = {};

    if (filters?.skillId) {
      where.skillId = filters.skillId;
    }

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.minBudget || filters?.maxBudget) {
      where.budgetAmount = {};
      if (filters.minBudget) {
        where.budgetAmount.gte = filters.minBudget;
      }
      if (filters.maxBudget) {
        where.budgetAmount.lte = filters.maxBudget;
      }
    }

    if (filters?.budgetType) {
      where.budgetType = filters.budgetType;
    }

    const tasks = await this.prisma.task.findMany({
      where,
      include: {
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
        tasker: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
        skill: true,
        photos: true,
        offers: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Calculate distance if lat/lng provided
    if (filters?.lat && filters?.lng) {
      return tasks
        .map((task) => {
          const distance = this.calculateDistance(
            filters.lat,
            filters.lng,
            Number(task.locationLat),
            Number(task.locationLng)
          );

          return {
            ...task,
            distance,
          };
        })
        .filter((task) => {
          if (filters.radiusKm) {
            return task.distance <= filters.radiusKm;
          }
          return true;
        })
        .sort((a, b) => a.distance - b.distance);
    }

    return tasks;
  }

  async findById(id: string) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: {
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
            phone: true,
          },
        },
        tasker: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
        skill: true,
        photos: true,
        offers: {
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
          orderBy: {
            proposedAmount: 'asc',
          },
        },
      },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  async update(id: string, userId: string, dto: UpdateTaskDto) {
    // Verify ownership
    const task = await this.prisma.task.findUnique({
      where: { id },
    });

    if (!task || task.clientId !== userId) {
      throw new NotFoundException('Task not found or unauthorized');
    }

    return this.prisma.task.update({
      where: { id },
      data: dto,
      include: {
        client: true,
        skill: true,
        photos: true,
      },
    });
  }

  async assignTasker(taskId: string, taskerId: string, finalAmount: number) {
    return this.prisma.task.update({
      where: { id: taskId },
      data: {
        taskerId,
        finalAmount,
        status: TaskStatus.ASSIGNED,
      },
    });
  }

  async updateStatus(taskId: string, status: TaskStatus) {
    const data: any = { status };

    if (status === TaskStatus.COMPLETED) {
      data.completedAt = new Date();
    }

    return this.prisma.task.update({
      where: { id: taskId },
      data,
    });
  }

  // Haversine formula for distance calculation
  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return Math.round(distance * 10) / 10; // Round to 1 decimal
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}
