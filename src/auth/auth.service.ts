import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  public async validateUser(
    username: string,
    pass: string,
  ): Promise<Omit<User, 'password'> | null> {
    const user: User | undefined =
      await this.usersService.findOneByUsername(username);
    if (user) {
      const isMatch: boolean = await bcrypt.compare(pass, user.password);
      if (isMatch) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: _, ...result }: User = user;
        return result;
      } else {
        return null;
      }
    }
    return null;
  }

  public async login(user: User): Promise<{ access_token: string }> {
    const payload: { username: string; sub: string } = {
      username: user.username,
      sub: user.id,
    };
    const access_token: string = this.jwtService.sign(payload);

    await this.usersService.save(user);
    return {
      access_token: access_token,
    };
  }
}
