import { InputType } from '@nestjs/graphql';
import { CreateUserInput } from 'src/user/dto/create-user.input';

@InputType()
export class SignupInput extends CreateUserInput {}
