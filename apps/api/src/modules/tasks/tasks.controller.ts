import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateTaskDto, UpdateTaskDto, TaskFilters } from '@mesterpont/types';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Tasks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Post()
  async createTask(@Request() req, @Body() dto: CreateTaskDto) {
    return this.tasksService.create(req.user.userId, dto);
  }

  @Get()
  async getAllTasks(@Query() filters: TaskFilters) {
    // Convert string query params to numbers
    if (filters.lat) filters.lat = Number(filters.lat);
    if (filters.lng) filters.lng = Number(filters.lng);
    if (filters.radiusKm) filters.radiusKm = Number(filters.radiusKm);
    if (filters.minBudget) filters.minBudget = Number(filters.minBudget);
    if (filters.maxBudget) filters.maxBudget = Number(filters.maxBudget);

    return this.tasksService.findAll(filters);
  }

  @Get(':id')
  async getTaskById(@Param('id') id: string) {
    return this.tasksService.findById(id);
  }

  @Put(':id')
  async updateTask(
    @Param('id') id: string,
    @Request() req,
    @Body() dto: UpdateTaskDto
  ) {
    return this.tasksService.update(id, req.user.userId, dto);
  }
}
