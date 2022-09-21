import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CompleteMissionDto } from '../dto/mission.dto';

@Controller('activity')
@ApiTags('activity')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Post()
  @ApiOperation({
    summary: '(팀원)미션 인증하기',
  })
  async completeMission(
    @Req() req: any,
    @Body() completeMissionDto: CompleteMissionDto,
  ) {
    // const result = this.activityService.completeMission(
    //   req.user.id,
    //   completeMissionDto,
    // );
    return {
      code: 200,
      message: '미션 인증하기 완료',
      data: null,
    };
  }

  @Get()
  async detail() {
    return this.activityService.detail();
  }
}
