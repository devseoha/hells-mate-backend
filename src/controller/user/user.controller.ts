import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { CreateAuthDto } from '@/controller/user/dto/create-auth.dto';
import { LocalAuthGuard } from '@/auth/local-auth.guard';
import { JwtRefreshGuard } from '@/auth/jwt-refresh.guard';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: '회원가입' })
  @Post('/join')
  async join(@Body() data: CreateAuthDto) {
    const result = await this.userService.join(data);
    return {
      result: true,
      code: 200,
      data: {
        id: result.id,
        accessToken: result.accessToken,
        refresh: result.refreshToken,
        message: '가입 되었습니다.',
      },
    };
  }

  @ApiOperation({ summary: '로그인' })
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Req() req) {
    const result = await this.userService.login(req.user);
    return {
      result: true,
      code: 200,
      data: {
        id: result.id,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      },
    };
  }

  @ApiOperation({ summary: '로그아웃' })
  @UseGuards(JwtAuthGuard)
  @Post('/logout')
  async logout(@Req() req) {
    const result = await this.userService.logout(req.user);
    req.logout();
    return {
      result: true,
      code: 200,
      data: {
        message: '정상적으로 로그아웃 되었습니다.',
      },
    };
  }

  @ApiOperation({ summary: '토큰 갱신' })
  @UseGuards(JwtRefreshGuard)
  @Post('/refresh')
  async refresh(@Req() req) {
    return this.userService.login(req.user);
  }
}
