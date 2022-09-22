import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {Group} from "@/database/entities/group.entity";
import {User} from "@/database/entities/user.entity";
import {UserGroup} from "@/database/entities/user_group.entity";
import {GroupMissionDate} from "@/database/entities/group_mission_date.entity";
import {GroupMissionDateList} from "@/database/entities/group_mission_date_list.entity";
import {Activity} from "@/database/entities/activity.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Group,
      User,
      UserGroup,
      GroupMissionDate,
      GroupMissionDateList,
      Activity,
    ]),
  ],
  controllers: [GroupController],
  providers: [GroupService],
})
export class GroupModule {}
