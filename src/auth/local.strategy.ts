import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UserService } from '../controller/user/user.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private readonly userService: UserService) {
    super({
      usernameField: 'id',
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string): Promise<any> {
    // 인증 확인 코드 작성
    return await this.userService.validateUser(email, password);
  }
}
