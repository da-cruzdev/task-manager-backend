import { Field, InputType } from '@nestjs/graphql';
import { UserRole } from 'src/common/enums/user-role.enum';

@InputType()
export class UsersFilterOptions {
  @Field({ nullable: true })
  query?: string;

  @Field({ nullable: true })
  role?: UserRole;
}
