import { Injectable } from '@nestjs/common';
import { createGroupDto } from '../dto/group.dto';
import {
  Activity,
  Group,
  GroupMissionDate,
  GroupMissionDateList,
  MissionCategory,
  User,
  UserGroup,
} from '../../database/entities';
import { Connection, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import moment from 'moment';

@Injectable()
export class GroupService {
  constructor(
    private connection: Connection,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Group)
    private groupRepository: Repository<Group>,

    @InjectRepository(UserGroup)
    private userGroupRepository: Repository<UserGroup>,

    @InjectRepository(GroupMissionDateList)
    private groupMissionDateListRepository: Repository<GroupMissionDateList>,

    @InjectRepository(GroupMissionDate)
    private groupMissionDateRepository: Repository<GroupMissionDate>,

    @InjectRepository(Activity)
    private activityRepository: Repository<Activity>,
  ) {}

  async getUserById(userId: number): Promise<User> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.id=:id', { id: userId })
      .getOne();
    return user;
  }

  async createGroup(userId: number, data: createGroupDto): Promise<any> {
    const group = new Group();
    group.title = data.title;
    group.content = data.content;
    group.startDate = '20220901';
    group.endDate = '20220907';
    const createdGroup = await this.groupRepository.save(group);

    const userGroup = new UserGroup();
    userGroup.Group = group;
    const user = new User();
    user.id = userId;
    userGroup.User = user;
    userGroup.isAdmin = true;
    await this.userGroupRepository.save(userGroup);

    const arr = [];

    let date = 20220901;
    for (let i = 0; i < 7; i++) {
      const groupMissionDate = new GroupMissionDate();
      // groupMissionDate.date = moment(data.startDate).format('YYYY-MM-DD')
      groupMissionDate.date = String(date);
      groupMissionDate.Group = group;
      arr.push(groupMissionDate);
      date++;
    }
    console.log(arr);
    await this.groupMissionDateRepository.save(arr);

    return createdGroup;
  }

  async acceptGroup(userId: number, groupId: number) {
    const userGroup = new UserGroup();
    const user = new User();
    user.id = userId;
    userGroup.User = user;
    const group = new Group();
    group.id = groupId;
    userGroup.Group = group;
    await this.userGroupRepository.save(userGroup);

    return true;
  }

  async getGroupList(userId = 1): Promise<any> {
    const result: any = {};

    const user: any = await this.userRepository.findOne({
      where: { id: userId },
    });
    const cnt = Math.ceil(Math.random() * 2);
    const arr33 = [2, 3, 2];
    const complete = await this.activityRepository
      .createQueryBuilder('a')
      .leftJoinAndSelect('a.User', 'user')
      .leftJoinAndSelect('a.Group', 'group')
      .where('user.id=:userId', { userId })
      .getMany();

    user.complete = false;

    const userGroupList = await this.groupRepository
      .createQueryBuilder('group')
      .limit(arr33[cnt])
      .orderBy('group.id', 'DESC')
      .getMany();

    const nameList = [
      '김민주',
      '박주형',
      '김미소',
      '이윤정',
      '강소리',
      '이우형',
      '윈터',
      '헬린이',
      '이진형',
      '이진명',
      '임기원',
      '성용',
      '건우',
      '길동',
      '지수',
      '차현우',
      '민준',
      '송희',
    ];

    const groupCategoryId: any = [1, 2, 1, 1];
    let k = 0;
    result.group = userGroupList.map((x: any, i) => {
      const cnt = Math.ceil(Math.random() * 8);
      let name = [];
      ++k;
      for (let j = 0; j < cnt; j++) {
        const cnt2 = Math.ceil(Math.ceil(Math.random() * 16));
        name.push({
          id: ++k,
          nickname: nameList[cnt2],
          complete: Math.random() < 0.5,
        });
      }
      name[0] = user;
      x.names = name;
      name = [];
      x.categoryId = groupCategoryId[i];
      return x;
    });
    return result;
    // const groupList = await Promise.all(
    //   userGroupList.map((userGroup) => {
    //     const group = this.groupRepository
    //       .createQueryBuilder('group')
    //       .where('group.UserGroup=:userGroup', { userGroup: userGroup })
    //       .getOne();
    //     return {
    //       group: group,
    //       isAdmin: userGroup.isAdmin,
    //     };
    //   }),
    // );
    // return groupList;
  }

  async getGroupById(groupId: number): Promise<Group> {
    const group = await this.groupRepository
      .createQueryBuilder('group')
      .where('group.id=:id', { id: groupId })
      .getOne();
    return group;
  }
}
