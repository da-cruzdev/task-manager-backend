import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { UserService } from './user.service';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { Task } from 'src/tasks/entities/task.entity';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from './entities/user.entity';
import { UpdateUserResponse } from './dto/updateUserResponse';
import { UserResponseData } from './dto/userResponseData';
import { UsersFilterOptions } from './dto/users-filter.dto';
import { PaginationOptions } from 'src/tasks/dto/pagination.dto';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => User)
  async createUser(
    @Args('createUserInput') createUserInput: CreateUserInput,
  ): Promise<User> {
    return await this.userService.create(createUserInput);
  }

  @Query(() => UserResponseData, { name: 'users' })
  async findAll(
    @Args('filterOptions', { nullable: true })
    filterOptions?: UsersFilterOptions,
    @Args('paginationOptions', { nullable: true })
    paginationOptions?: PaginationOptions,
  ) {
    return await this.userService.findAll(filterOptions, paginationOptions);
  }

  @Query(() => User, { name: 'user' })
  async findOne(@Args('email') email: string): Promise<User> {
    return await this.userService.findOne(email);
  }

  @Mutation(() => UpdateUserResponse)
  async updateUser(
    @Args('data') updateUserInput: UpdateUserInput,
    @CurrentUser() user: User,
  ): Promise<UpdateUserResponse> {
    return await this.userService.updateUserInfos(user, updateUserInput);
  }

  @Mutation(() => User)
  async removeUser(@Args('id', { type: () => Int }) id: number): Promise<User> {
    return await this.userService.remove(id);
  }

  @Query(() => User, { name: 'getUserInfo' })
  async getUserInfo(@CurrentUser() userId: User) {
    return await this.userService.getUserInfo(userId);
  }

  @ResolveField(() => [Task])
  async createdTasks(@Parent() user: User) {
    const { id } = user;
    return this.userService.getUserCreatedTasks(id);
  }

  @ResolveField(() => [Task])
  async assignedTasks(@Parent() user: User) {
    const { id } = user;
    return this.userService.getUserAssignedTasks(id);
  }
}
