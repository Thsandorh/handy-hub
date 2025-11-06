import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FilesService {
  constructor(private prisma: PrismaService) {}

  // Mock implementation - in production, integrate with AWS S3
  async uploadFile(file: Express.Multer.File, type: string): Promise<string> {
    // TODO: Upload to S3 and return URL
    // For now, return a mock URL
    const mockUrl = `https://mesterpont-uploads.s3.eu-central-1.amazonaws.com/${type}/${Date.now()}-${file.originalname}`;
    console.log(`Mock upload: ${file.originalname} -> ${mockUrl}`);
    return mockUrl;
  }

  async addTaskPhoto(taskId: string, photoUrl: string) {
    return this.prisma.taskPhoto.create({
      data: {
        taskId,
        photoUrl,
      },
    });
  }

  async updateUserAvatar(userId: string, avatarUrl: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { avatarUrl },
    });
  }

  async updateTaskerDocuments(
    userId: string,
    idDocumentUrl?: string,
    selfieUrl?: string
  ) {
    return this.prisma.taskerProfile.update({
      where: { userId },
      data: {
        idDocumentUrl,
        selfieVerificationUrl: selfieUrl,
      },
    });
  }
}
