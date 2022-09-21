import { Module } from '@nestjs/common';
import { MissionService } from './mission.service';
import { MissionController } from './mission.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Activity,
  Group,
  GroupMissionDate,
  MissionCategory,
  User,
} from '../../database/entities';

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
