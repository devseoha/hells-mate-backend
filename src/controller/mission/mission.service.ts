import { Injectable } from '@nestjs/common';
import { Connection, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Activity,
  Group,
  GroupMissionDate,
  MissionCategory,
  User,
} from '../../database/entities';

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
    activity.GroupMissionDate = groupMissionDate;
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
