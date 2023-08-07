import { Prisma } from '@prisma/client';
import { TasksFilterOptions } from 'src/tasks/dto/tasks-filter.dto';

export function getTasksByFilterCriteria(
  filterOptions: TasksFilterOptions,
): Prisma.TaskWhereInput {
  return {
    ...(filterOptions.status && { status: filterOptions.status }),
    ...(filterOptions.query && buildFullTextSearch(filterOptions.query)),
  };
}

function buildFullTextSearch(query: string): Prisma.TaskWhereInput {
  return {
    title: { contains: `%${query}%` },
  };
}
