import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { verifyBcrypt } from 'src/common/common.helpers';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService
  ) { }

  async validateUser(username: string, password: string): Promise<any> {
    const user: User = await this.userService.findOneByUsername(username);
    if (user && verifyBcrypt(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(username: string, password: string) {
    const user = await this.validateUser(username, password);
    if (!user) throw new NotFoundException('Invalid username or password');

    const payload = {
      username: user.username,
      sub: user.id,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
    }
  }
}