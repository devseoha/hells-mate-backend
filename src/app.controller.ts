import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('random-text')
  @ApiOperation({
    summary: '로딩 시 명언 불러오기 api',
  })
  async getStart(): Promise<any> {
    const result = await this.appService.getHello();
    return {
      code: 200,
      message: '명언 불러오기 성공',
      data: result,
    };
  }
}
