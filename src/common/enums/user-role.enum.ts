import { registerEnumType } from '@nestjs/graphql';

export enum UserRole {
  SUPERADMIN = 'superAdmin',
  ADMIN = 'admin',
  USER = 'user',
}

registerEnumType(UserRole, {
  name: 'UserRole',
});
