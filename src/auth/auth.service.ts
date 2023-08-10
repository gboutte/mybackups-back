import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByUsername(username);
    if (user) {
      const isMatch = await bcrypt.compare(pass, user.password);
      if (isMatch) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...result } = user;
        return result;
      } else {
        return null;
      }
    }
    return null;
  }

  async login(user: User) {
    const payload = { username: user.username, sub: user.id };
    const access_token = this.jwtService.sign(payload);

    await this.usersService.save(user);
    return {
      access_token: access_token,
    };
  }
}
