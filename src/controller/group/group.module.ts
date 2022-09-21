import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Activity,
  Group,
  GroupMissionDate,
  GroupMissionDateList,
  User,
  UserGroup,
} from '../../database/entities';

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
