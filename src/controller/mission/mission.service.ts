import { Injectable } from '@nestjs/common';
import { Connection, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { MissionCategory } from '@/database/entities/mission_category.entity';
import {Activity} from "@/database/entities/activity.entity";
import {Group} from "@/database/entities/group.entity";
import {User} from "@/database/entities/user.entity";

class GroupMissionDate {
}

@Injectable()
export class MissionService {
  constructor(
    private connection: Connection,

    @InjectRepository(MissionCategory)
    private missionCategoryRepository: Repository<MissionCategory>,

    @InjectRepository(Activity)
    private activityRepository: Repository<Activity>,

    @InjectRepository(GroupMissionDate)
    private groupMissionDateRepository: Repository<GroupMissionDate>,
  ) {}

  async selectMissionCategory(): Promise<any> {
    const result = await this.missionCategoryRepository.find();
    return result;
  }

  async selectMissionList() {
    // 날짜별 미션 불러오기
    return null;
  }

  async selectMissionDetail(date: any) {
    return null;
  }

  async createActivity(
    userId = 1,
    date: string,
    groupId: number,
    point: number,
  ) {
    const activity = new Activity();
    activity.point = point;
    const groupMissionDate = await this.groupMissionDateRepository
      .createQueryBuilder('groupMissionDate')
      .leftJoinAndSelect('groupMissionDate.Group', 'group')
      .where('group.id=:groupId', { groupId })
      .getOne();
    // activity.GroupMissionDateList = groupMissionDate;
    const group = new Group();
    group.id = groupId;
    activity.Group = group;
    const user = new User();
    user.id = userId;
    activity.User = user;
    const result = await this.activityRepository.save(activity);

    return result;
  }
}
