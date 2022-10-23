import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group } from '@/database/entities/group.entity';
import { User } from '@/database/entities/user.entity';
import { UserGroup } from '@/database/entities/user_group.entity';
import { GroupMissionDate } from '@/database/entities/group_mission_date.entity';
import { GroupMissionDateList } from '@/database/entities/group_mission_date_list.entity';
import { Activity } from '@/database/entities/activity.entity';
import { JwtModule, JwtService } from '@nestjs/jwt';

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
    JwtModule.register({
      secret: process.env.JWT_GROUP_TOKEN_SECRET,
      signOptions: {
        expiresIn: `${process.env.JWT_GROUP_TOKEN_EXPIRATION_TIME}s`,
      },
    }),
  ],
  controllers: [GroupController],
  providers: [GroupService],
})
export class GroupModule {}
