import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import { Reflector } from '@nestjs/core';
import { IS_INSTALL_KEY } from '../decorators/install.decorator';

@Injectable()
export class InstalledGuard implements CanActivate {
  constructor(
    @Inject(UsersService) private readonly usersService: UsersService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isInstalled = (await this.usersService.getNumberOfUsers()) > 0;

    const isInstallation = this.reflector.get(
      IS_INSTALL_KEY,
      context.getHandler(),
    );
    return (isInstallation && !isInstalled) || (!isInstallation && isInstalled);
  }
}
