import { Resolver, Mutation, Args, Int } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Auth } from './entities/auth.entity';
import { SignupInput } from './dto/signup.input';
import { SignResponse } from './dto/signResonse';
import { SigninInput } from './dto/signin.input';
import { LogoutResponse } from './dto/logoutResponse';
import { UseGuards } from '@nestjs/common';
import { Public } from './decorators/public.decorator';
import { NewTokenResponse } from './dto/newTokensResponse';
import { CurrentUserId } from './decorators/current-userId.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import { RefreshTokenGuard } from './guards/refreshToken.guard';
import { User } from '@prisma/client';

@Resolver(() => Auth)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Mutation(() => SignResponse)
  Signup(@Args('signupInput') signupInput: SignupInput) {
    return this.authService.signup(signupInput);
  }

  @Public()
  @Mutation(() => SignResponse)
  Signin(@Args('signinInput') signinInput: SigninInput) {
    return this.authService.signin(signinInput);
  }

  @Public()
  @Mutation(() => LogoutResponse)
  Logout(@Args('id', { type: () => Int }) id: number) {
    return this.authService.logout(id);
  }

  @Public()
  @UseGuards(RefreshTokenGuard)
  @Mutation(() => NewTokenResponse)
  GetNewTokens(
    @CurrentUserId() userId: number,
    @CurrentUser('refreshToken') refreshToken: User,
  ) {
    return this.authService.getNewTokens(userId, refreshToken);
  }
}
