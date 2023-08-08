import { Injectable, NotFoundException, UseGuards } from '@nestjs/common';
import { CreateTaskInput } from './dto/create-task.input';
import { UpdateTaskInput } from './dto/update-task.input';
import { PrismaService } from 'src/prisma/prisma.service';

import { User } from 'src/user/entities/user.entity';
import { NotificationsGateway } from 'src/notifications/notifications.gateway';
import { getTasksByFilterCriteria } from 'src/common/utils/functions';
import { TasksFilterOptions } from './dto/tasks-filter.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Prisma, Role } from '@prisma/client';

@Injectable()
export class TasksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationGateWay: NotificationsGateway,
  ) {}

  async create(data: CreateTaskInput, user: User) {
    const task = await this.prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        assignedTo: { connect: { id: data.assignedTo } },
        deadline: data.deadline,
        user: { connect: { id: user.id } },
      },
    });

    this.notificationGateWay.sendNotificationToUser(
      data.assignedTo,
      `Nouvelle tâche assignée: ${data.title}`,
    );

    return task;
  }

  async findAll(filterOptions?: TasksFilterOptions) {
    const filter = getTasksByFilterCriteria(filterOptions);

    return await this.prisma.task.findMany({
      where: filter,
    });
  }

  async findOne(id: number) {
    const task = await this.prisma.task.findUnique({
      where: { id: id },
    });

    if (!task) {
      throw new NotFoundException(`La tâche avec l'id ${id} n'existe pas`);
    }

    return task;
  }

  async update(id: number, data: UpdateTaskInput) {
    const { assignedTo, status, ...otherData } = data;
    const udateTask = await this.prisma.task.update({
      where: { id },
      data: {
        ...otherData,
        assignedToId: assignedTo,
        status: status,
      },
    });
    if (!udateTask) {
      throw new NotFoundException(`La tâche avec l'id ${id} n'existe pas`);
    }

    return udateTask;
  }

  async remove(id: number) {
    return await this.prisma.task.delete({
      where: { id },
    });
  }

  async getUserCreatedTasks(user: User, filterOptions?: TasksFilterOptions) {
    const whereClause: Prisma.TaskWhereInput = {
      userId: user.id,
      ...getTasksByFilterCriteria(filterOptions),
    };
    return await this.prisma.task.findMany({
      where: whereClause,
      orderBy: { createAt: 'desc' },
    });
  }

  async getUserAssignedTasks(user: User, filterOptions?: TasksFilterOptions) {
    const whereClause: Prisma.TaskWhereInput = {
      assignedToId: user.id,
      ...getTasksByFilterCriteria(filterOptions),
    };
    return await this.prisma.task.findMany({
      where: whereClause,
      orderBy: { createAt: 'desc' },
    });
  }

  async getTaskCreator(taskId: number) {
    return this.prisma.task.findUnique({ where: { id: taskId } }).user();
  }

  async getAssgnedUser(taskId: number) {
    return this.prisma.task.findUnique({ where: { id: taskId } }).assignedTo();
  }
}
