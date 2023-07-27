import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskInput } from './dto/create-task.input';
import { UpdateTaskInput } from './dto/update-task.input';
import { PrismaService } from 'src/prisma/prisma.service';

import { User } from 'src/user/entities/user.entity';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

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

    return task;
  }

  async findAll() {
    return await this.prisma.task.findMany();
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
    const { assignedTo, ...otherData } = data;
    const udateTask = await this.prisma.task.update({
      where: { id },
      data: {
        ...otherData,
        assignedToId: assignedTo,
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

  async getTaskCreator(taskId: number) {
    return this.prisma.task.findUnique({ where: { id: taskId } }).user();
  }

  async getAssgnedUser(taskId: number) {
    return this.prisma.task.findUnique({ where: { id: taskId } }).assignedTo();
  }
}
