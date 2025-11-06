import { Controller, Get, Query } from '@nestjs/common';
import { SkillsService } from './skills.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Skills')
@Controller('skills')
export class SkillsController {
  constructor(private skillsService: SkillsService) {}

  @Get()
  async getAllSkills(@Query('category') category?: string) {
    if (category) {
      return this.skillsService.findByCategory(category);
    }
    return this.skillsService.findAll();
  }
}
