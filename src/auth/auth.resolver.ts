import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Auth } from './entities/auth.entity';
import { SignupInput } from './dto/signup.input';
import { SignResponse } from './dto/signResonse';
import { SigninInput } from './dto/signin.input';
import { LogoutResponse } from './dto/logoutResponse';
import { ParseIntPipe } from '@nestjs/common';

@Resolver(() => Auth)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => SignResponse)
  Signup(@Args('signupInput') signupInput: SignupInput) {
    return this.authService.signup(signupInput);
  }

  @Mutation(() => SignResponse)
  Signin(@Args('signinInput') signinInput: SigninInput) {
    return this.authService.signin(signinInput);
  }

  @Mutation(() => LogoutResponse)
  Logout(@Args('id', ParseIntPipe) id: number) {
    return this.authService.logout(id);
  }
}
