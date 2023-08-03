import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksResolver } from './tasks.resolver';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotificationsGateway } from 'src/notifications/notifications.gateway';

@Module({
  providers: [TasksResolver, TasksService, PrismaService, NotificationsGateway],
})
export class TasksModule {}
