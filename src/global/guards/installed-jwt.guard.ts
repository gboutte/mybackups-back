import { ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import { Reflector } from '@nestjs/core';
import { IS_INSTALL_KEY } from '../decorators/install.decorator';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class InstalledJwtGuard extends AuthGuard('jwt') {
  constructor(
    @Inject(UsersService) private readonly usersService: UsersService,
    private readonly reflector: Reflector,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const isInstalled = (await this.usersService.getNumberOfUsers()) > 0;

    const isInstallation = this.reflector.get(
      IS_INSTALL_KEY,
      context.getHandler(),
    );

    const accessWithoutJwt = (isInstallation && !isInstalled) || isPublic;

    if (accessWithoutJwt) {
      return true;
    }

    // Check if the result is an Observable
    const result = super.canActivate(context);

    if (result instanceof Observable) {
      // Convert the Observable to a Promise
      const observableResult = result as Observable<boolean>;
      return new Promise<boolean>((resolve) => {
        observableResult.subscribe((value) => {
          resolve(value);
        });
      });
    }

    // If it's not an Observable, simply return the result
    return result;
  }
}
