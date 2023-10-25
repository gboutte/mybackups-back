import { Inject, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class StatusService {
  constructor(
    @Inject(UsersService) private readonly usersService: UsersService,
  ) {}

  async isInstalled(): Promise<boolean> {
    return (await this.usersService.getNumberOfUsers()) > 0;
  }
}
