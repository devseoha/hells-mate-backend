import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../database/entities';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from '../../auth/local.strategy';
import { JwtStrategy } from '../../auth/jwt.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PassportModule,
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      signOptions: {
        expiresIn: `${process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME}s`,
      },
    }),
  ],
  controllers: [UserController],
  providers: [UserService, LocalStrategy, JwtStrategy],
})
export class UserModule {}
