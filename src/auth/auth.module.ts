import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { RoleGuard } from './role.guard';

@Module({
  imports: [
    PassportModule,
    forwardRef(() => UsersModule),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [],
  providers: [AuthService, LocalStrategy, JwtStrategy, RoleGuard],
  exports: [AuthService],
})
export class AuthModule { }
