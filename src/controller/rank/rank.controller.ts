import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Query,
} from '@nestjs/common';
import { RankService } from './rank.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller('rank')
export class RankController {
  constructor(private readonly rankService: RankService) {}
  @ApiOperation({
    summary: '랭킹 불러오기 api',
  })
  @Get('ranking')
  async selectMissionCategory(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    const result = await this.rankService.selectRanking(startDate, endDate);
    return {
      code: 200,
      message: '랭킹 불러오기 완료',
      data: result,
    };
  }
}
