import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SkillsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.skill.findMany({
      orderBy: {
        category: 'asc',
      },
    });
  }

  async findByCategory(category: string) {
    return this.prisma.skill.findMany({
      where: { category },
    });
  }
}
