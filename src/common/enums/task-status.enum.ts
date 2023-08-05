import { TaskStatus } from '@prisma/client';
import { registerEnumType } from '@nestjs/graphql';

export enum TasksStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

registerEnumType(TaskStatus, {
  name: 'TaskStatus',
  description: 'Statut de la tâche',
});
