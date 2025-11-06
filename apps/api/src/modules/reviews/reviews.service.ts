import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from '@mesterpont/types';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateReviewDto) {
    // Check if review already exists
    const existingReview = await this.prisma.review.findUnique({
      where: {
        taskId_reviewerId: {
          taskId: dto.taskId,
          reviewerId: userId,
        },
      },
    });

    if (existingReview) {
      throw new BadRequestException('You already reviewed this task');
    }

    // Validate rating
    if (dto.rating < 1 || dto.rating > 5) {
      throw new BadRequestException('Rating must be between 1 and 5');
    }

    const review = await this.prisma.review.create({
      data: {
        taskId: dto.taskId,
        reviewerId: userId,
        revieweeId: dto.revieweeId,
        rating: dto.rating,
        comment: dto.comment,
      },
      include: {
        reviewer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
        task: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    // Update average rating
    await this.updateAverageRating(dto.revieweeId);

    return review;
  }

  async getReviewsForUser(userId: string) {
    return this.prisma.review.findMany({
      where: { revieweeId: userId },
      include: {
        reviewer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
        task: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  private async updateAverageRating(userId: string) {
    const reviews = await this.prisma.review.findMany({
      where: { revieweeId: userId },
    });

    if (reviews.length === 0) return;

    const avgRating =
      reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

    // Update tasker profile if user is a tasker
    const taskerProfile = await this.prisma.taskerProfile.findUnique({
      where: { userId },
    });

    if (taskerProfile) {
      await this.prisma.taskerProfile.update({
        where: { userId },
        data: {
          averageRating: Math.round(avgRating * 100) / 100, // Round to 2 decimals
        },
      });
    }
  }
}
