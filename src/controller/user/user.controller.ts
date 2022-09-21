import { Controller, Get, Query, Req, Res, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  create(@Req() req: any) {
    return this.userService.test(req.user);
  }

  @Get('/kakao/callback')
  async kakaoLogin(@Query('code') code, @Res({ passthrough: true }) res) {
    const kakaoToken = await this.userService.getKakaoToken(code);
    const userInfo = await this.userService.getUserInfo(kakaoToken);

    console.log({ userInfo });
    const isExistUser = await this.userService.checkUser(userInfo.id);

    if (!isExistUser) {
      const createdUser = this.userService.register(userInfo);
      return {
        code: 201,
        message: 'CREATED',
        data: createdUser,
      };
    }

    const accessToken = await this.userService.getAccessToken(userInfo);

    return {
      code: 200,
      message: 'OK',
      data: { accessToken },
    };
  }

  @ApiOperation({
    summary: '로그인 api',
  })
  @Get('login')
  async login(@Req() req: any) {
    const accessToken = req.headers.authorization;
    console.log(accessToken);
    const { token }: any = await this.userService.decodeAccessToken(
      accessToken.split(' ')[1],
    );

    return this.userService.login(token);
  }
}
