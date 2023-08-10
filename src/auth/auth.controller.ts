import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { LoginUserDto } from './dto/login-user.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { Public } from '../global/decorators/public.decorator';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiBody({ type: LoginUserDto })
  @Public()
  async login(@Request() req) {
    return this.authService.login(req.user);
  }
}
