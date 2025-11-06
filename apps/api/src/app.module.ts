import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { OffersModule } from './modules/offers/offers.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { MessagesModule } from './modules/messages/messages.module';
import { SkillsModule } from './modules/skills/skills.module';
import { FilesModule } from './modules/files/files.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { RedisModule } from './modules/redis/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    RedisModule,
    AuthModule,
    UsersModule,
    TasksModule,
    OffersModule,
    PaymentsModule,
    ReviewsModule,
    MessagesModule,
    SkillsModule,
    FilesModule,
  ],
})
export class AppModule {}
