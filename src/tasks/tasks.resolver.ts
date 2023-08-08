import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { TasksService } from './tasks.service';
import { Task } from './entities/task.entity';
import { CreateTaskInput } from './dto/create-task.input';
import { UpdateTaskInput } from './dto/update-task.input';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from 'src/auth/guards/accessToken.guard';
import { TasksFilterOptions } from './dto/tasks-filter.dto';

@Resolver(() => Task)
export class TasksResolver {
  constructor(private readonly tasksService: TasksService) {}

  @UseGuards(AccessTokenGuard)
  @Mutation(() => Task)
  createTask(
    @Args('createTaskInput') createTaskInput: CreateTaskInput,
    @CurrentUser() user: User,
  ) {
    return this.tasksService.create(createTaskInput, user);
  }

  @Query(() => [Task], { name: 'tasks' })
  findAll(
    @Args('filterOptions', { nullable: true })
    filterOptions?: TasksFilterOptions,
  ) {
    return this.tasksService.findAll(filterOptions);
  }

  @Query(() => Task, { name: 'task' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.tasksService.findOne(id);
  }

  @Query(() => [Task], { name: 'createdTasks' })
  getCreatedTasks(
    @CurrentUser() user: User,
    @Args('filterOptions', { nullable: true })
    filterOptions?: TasksFilterOptions,
  ) {
    return this.tasksService.getUserCreatedTasks(user, filterOptions);
  }

  @Query(() => [Task], { name: 'assignedTasks' })
  getAssignedTasks(
    @CurrentUser() user: User,
    @Args('filterOptions', { nullable: true })
    filterOptions?: TasksFilterOptions,
  ) {
    return this.tasksService.getUserAssignedTasks(user, filterOptions);
  }

  @Mutation(() => Task)
  updateTask(
    @Args('id', { type: () => Int }) id: number,
    @Args('data') updateTaskInput: UpdateTaskInput,
  ) {
    return this.tasksService.update(id, updateTaskInput);
  }

  @Mutation(() => Task)
  removeTask(@Args('id', { type: () => Int }) id: number) {
    return this.tasksService.remove(id);
  }

  @ResolveField(() => User)
  async owner(@Parent() task: Task) {
    const { id } = task;
    return this.tasksService.getTaskCreator(id);
  }

  @ResolveField(() => User)
  async assignUser(@Parent() task: Task) {
    const { id } = task;
    return this.tasksService.getAssgnedUser(id);
  }
}
