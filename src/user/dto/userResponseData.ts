import { Field, Int, ObjectType } from '@nestjs/graphql';
import { User } from '../entities/user.entity';

@ObjectType()
export class UserResponseData {
  @Field(() => [User], { nullable: true })
  data: User[];

  @Field(() => Int, { nullable: true })
  totalCount: number;
}
