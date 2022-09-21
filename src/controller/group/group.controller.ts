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
    summary: '[완성/서하서하]팀장이 그룹을 생성하는 api',
  })
  @UseGuards(JwtAuthGuard)
  @Post('create')
  async createGroup(@Req() req: any, @Body() data: createGroupDto) {
    const result = await this.groupService.createGroup(req.user.id, data);
    return {
      code: 200,
      message: '그룹이 정상적으로 등록 되었습니다. ',
      data: result,
    };
  }

  @ApiOperation({
    summary: '[완성/서하서하]팀원이 그룹을 수락하는 api',
  })
  @UseGuards(JwtAuthGuard)
  @Get(':id/accept')
  async acceptGroup(
    @Req() req: any,
    @Param('id') id: number,
    @Query('groupId') groupId: number,
  ) {
    const result = await this.groupService.acceptGroup(id, groupId);
    return {
      code: 200,
      message: '그룹 수락',
      data: result,
    };
  }

  @ApiOperation({
    summary: '그룹 정보 조회 with Group_Id',
  })
  @UseGuards(JwtAuthGuard)
  @Get('info/:id')
  async getGroup(@Req() req: any, @Param('id') id: number) {
    //req.user
    const result = await this.groupService.getGroupById(id);
    return {
      code: 200,
      message: '그룹 조회 설공 ',
      data: result,
    };
  }

  @ApiOperation({
    summary: '[완성/서하서하]참여한 그룹리스트 조회 api',
  })
  @UseGuards(OptionalJwtAuthGuard)
  @Get()
  async getGroupList(@Req() req: any) {
    const result = await this.groupService.getGroupList(req.user.id);
    return {
      code: 200,
      message: '그룹 리스트 조회 설공',
      data: result,
    };
  }

  @ApiOperation({
    summary: '완성 - 문동우, 유저 완료도 ',
  })
  @UseGuards(JwtAuthGuard)
  @Get(':groupId')
  async getUserStatus(
    @Req() req: any,
    @Param('groupId') groupId: number,
    @Query('date') date: string,
  ) {
    // //req.user
    // const result = await this.groupService.getGroupById(id);
    // return {
    //   code: 200,
    //   message: '그룹 조회 설공 ',
    //   data: result,
    // };
    const userList = [
      ['김민준', '이도현', '김지수'],
      ['송우진', '김민준', '이수연'],
      ['이수연', '김민준'],
    ];
    const hash = function (str, seed = 0) {
      let h1 = 0xdeadbeef ^ seed,
        h2 = 0x41c6ce57 ^ seed;
      for (let i = 0, ch; i < str.length; i++) {
        ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
      }
      h1 =
        Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^
        Math.imul(h2 ^ (h2 >>> 13), 3266489909);
      h2 =
        Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^
        Math.imul(h1 ^ (h1 >>> 13), 3266489909);
      return 4294967296 * (2097151 & h2) + (h1 >>> 0);
    };

    return {
      code: 200,
      message: '조회 성공',
      data: [
        userList[groupId % 3].map((v) => {
          return {
            name: v,
            point: (Math.abs(hash(v) ^ groupId ^ hash(date)) % 3) * 2 + 1,
          };
        }),
      ],
    };
  }
}
