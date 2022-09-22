import { Module } from '@nestjs/common';
import { MissionService } from './mission.service';
import { MissionController } from './mission.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {Group} from "@/database/entities/group.entity";
import {MissionCategory} from "@/database/entities/mission_category.entity";
import {Activity} from "@/database/entities/activity.entity";
import {GroupMissionDate} from "@/database/entities/group_mission_date.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Group,
      MissionCategory,
      Activity,
      GroupMissionDate,
    ]),
  ],
  controllers: [MissionController],
  providers: [MissionService],
})
export class MissionModule {}
