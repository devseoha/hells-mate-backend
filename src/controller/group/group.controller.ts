import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { GroupService } from './group.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { createGroupDto } from '../dto/group.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '@/auth/optional-jwt-auth.guard';

@Controller('group')
@ApiTags('group')
@ApiBearerAuth()
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @ApiOperation({
    summary: '[완료]팀장이 그룹을 생성하는 api',
  })
  @UseGuards(JwtAuthGuard)
  @Post()
  async createGroup(@Req() req: any, @Body() data: createGroupDto) {
    const result = await this.groupService.createGroup(req.user.id, data);
    return {
      result: true,
      code: 200,
      message: '그룹이 정상적으로 등록 되었습니다. ',
      data: result,
    };
  }

  @ApiOperation({
    summary: '[완성]팀원이 그룹토큰을 이용해 그룹 정보를 읽어오는 api',
  })
  @UseGuards(OptionalJwtAuthGuard)
  @Get(':token')
  async getGroupInfo(@Req() req: any, @Param('token') token: string) {
    const result = await this.groupService.getGroupInfo(req.user.id, token);
    return {
      result: true,
      code: 200,
      message: '그룹 정보를 조회했습니다.',
      data: result,
    };
  }

  @ApiOperation({
    summary: '[완성]팀원이 그룹을 수락하는 pai',
  })
  @UseGuards(JwtAuthGuard)
  @Post(':groupId/accept')
  async acceptGroup(@Req() req: any, @Param('groupId') groupId: number) {
    const result = await this.groupService.acceptGroup(req.user.id, groupId);
    return {
      result: true,
      code: 200,
      message: '그룹 수락',
      data: result,
    };
  }

  @ApiOperation({
    summary: '[완성]그룹 정보 조회 with Group_Id',
  })
  @UseGuards(JwtAuthGuard)
  @Get('info/:id')
  async getGroup(@Req() req: any, @Param('id') id: number) {
    const result = await this.groupService.getGroupById(req.user.id, id);
    return {
      result: true,
      code: 200,
      message: '그룹 조회 설공 ',
      data: result,
    };
  }

  @ApiOperation({
    summary: '[완료]참여한 그룹리스트 조회 api',
  })
  @UseGuards(OptionalJwtAuthGuard)
  @Get()
  async getGroupList(@Req() req: any) {
    const result = await this.groupService.getGroupList(req.user.id);
    return {
      result: true,
      code: 200,
      message: '그룹 리스트 조회 설공',
      data: result,
    };
  }
}
