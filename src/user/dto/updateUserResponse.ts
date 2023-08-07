import { ObjectType, Field } from '@nestjs/graphql';
import { User } from '../entities/user.entity';

@ObjectType()
export class UpdateUserResponse {
  @Field(() => User)
  updatedUser: User;

  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;
}
