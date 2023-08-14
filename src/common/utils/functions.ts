import { Prisma } from '@prisma/client';
import { TasksFilterOptions } from 'src/tasks/dto/tasks-filter.dto';
import { UsersFilterOptions } from 'src/user/dto/users-filter.dto';

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

function buildFullSearch(query: string): Prisma.UserWhereInput {
  return {
    username: { contains: `%${query}%` },
  };
}

export function getUsersByFilter(
  filterOptions: UsersFilterOptions,
): Prisma.UserWhereInput {
  return {
    ...(filterOptions.role && { role: filterOptions.role }),
    ...(filterOptions.query && buildFullSearch(filterOptions.query)),
  };
}
