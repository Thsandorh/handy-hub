import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Request,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';

@ApiTags('Files')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('files')
export class FilesController {
  constructor(private filesService: FilesService) {}

  @Post('upload/avatar')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(
    @Request() req,
    @UploadedFile() file: Express.Multer.File
  ) {
    const url = await this.filesService.uploadFile(file, 'avatars');
    await this.filesService.updateUserAvatar(req.user.userId, url);
    return { url };
  }

  @Post('upload/task-photo')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async uploadTaskPhoto(
    @UploadedFile() file: Express.Multer.File,
    @Body('taskId') taskId: string
  ) {
    const url = await this.filesService.uploadFile(file, 'task-photos');
    await this.filesService.addTaskPhoto(taskId, url);
    return { url };
  }

  @Post('upload/id-document')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async uploadIdDocument(
    @Request() req,
    @UploadedFile() file: Express.Multer.File
  ) {
    const url = await this.filesService.uploadFile(file, 'id-documents');
    await this.filesService.updateTaskerDocuments(req.user.userId, url);
    return { url };
  }

  @Post('upload/selfie')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async uploadSelfie(
    @Request() req,
    @UploadedFile() file: Express.Multer.File
  ) {
    const url = await this.filesService.uploadFile(file, 'selfies');
    await this.filesService.updateTaskerDocuments(
      req.user.userId,
      undefined,
      url
    );
    return { url };
  }
}
