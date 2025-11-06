import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateOfferDto } from '@mesterpont/types';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Offers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('offers')
export class OffersController {
  constructor(private offersService: OffersService) {}

  @Post()
  async createOffer(@Request() req, @Body() dto: CreateOfferDto) {
    return this.offersService.create(req.user.userId, dto);
  }

  @Put(':id/accept')
  async acceptOffer(@Param('id') id: string, @Request() req) {
    return this.offersService.accept(id, req.user.userId);
  }

  @Put(':id/reject')
  async rejectOffer(@Param('id') id: string, @Request() req) {
    return this.offersService.reject(id, req.user.userId);
  }

  @Get('task/:taskId')
  async getOffersByTask(@Param('taskId') taskId: string) {
    return this.offersService.getOffersByTask(taskId);
  }
}
