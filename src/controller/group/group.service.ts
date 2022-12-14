import { BadRequestException, Injectable } from '@nestjs/common';
import { createGroupDto } from '../dto/group.dto';
import { Connection, getConnection, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment-timezone';
import { UserGroup } from '@/database/entities/user_group.entity';
import { Group } from '@/database/entities/group.entity';
import { GroupMissionDateList } from '@/database/entities/group_mission_date_list.entity';
import { GroupMissionDate } from '@/database/entities/group_mission_date.entity';
import { Activity } from '@/database/entities/activity.entity';
import { User } from '@/database/entities/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class GroupService {
  constructor(
    private connection: Connection,
    private jwtService: JwtService,

    @InjectRepository(Activity)
    private activityRepository: Repository<Activity>,

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
  ) {}

  async getUserById(userId: number): Promise<User> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.id=:id', { id: userId })
      .getOne();
    return user;
  }
  async getGroupToken(groupId: number) {
    return this.jwtService.sign(
      { groupId: groupId },
      {
        secret: process.env.JWT_GROUP_TOKEN_SECRET,
        expiresIn: `${process.env.JWT_GROUP_TOKEN_EXPIRATION_TIME}s`,
      },
    );
  }
  async createGroup(userId: number, data: createGroupDto): Promise<any> {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    let createdGroup;

    try {
      const endDate = moment(data.startDate)
        .add(data.dateCnt - 1, 'days')
        .format('yyyyMMDD');
      const group = new Group();
      group.title = data.title;
      group.description = data.description;
      group.startDate = data.startDate;
      group.endDate = endDate;
      createdGroup = await queryRunner.manager.save(group);

      const groupToken = await this.getGroupToken(createdGroup.id);

      createdGroup.token = groupToken;

      await queryRunner.manager.save(createdGroup);

      const userGroup = new UserGroup();
      userGroup.Group = group;

      const user = new User();
      user.id = userId;
      userGroup.User = user;
      userGroup.isAdmin = true;
      await queryRunner.manager.save(userGroup);

      // const arr = [];
      //
      // for (let i = 0; i < data.dateCnt; i++) {
      //   const groupMissionDate = new GroupMissionDate();
      //   groupMissionDate.date = moment(data.startDate).format('yyyyMMDD');
      //   groupMissionDate.Group = group;
      //   arr.push(groupMissionDate);
      //   data.startDate = moment(data.startDate)
      //     .add(1, 'day')
      //     .format('yyyyMMDD');
      // }
      //
      // await queryRunner.manager.save(arr);
      // const arr = [];
      //
      // for (let i = 0; i < data.dateCnt; i++) {
      //   const groupMissionDate = new GroupMissionDate();
      //   groupMissionDate.date = moment(data.startDate).format('yyyyMMDD');
      //   groupMissionDate.Group = group;
      //   arr.push(groupMissionDate);
      //   data.startDate = moment(data.startDate)
      //     .add(1, 'day')
      //     .format('yyyyMMDD');
      // }
      //
      // await queryRunner.manager.save(arr);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
    return createdGroup;
  }

  async getGroupInfo(userId: number, token: string): Promise<Group> {
    let group;
    try {
      const decodeJwt = await this.jwtService.verify(token, {
        secret: process.env.JWT_GROUP_TOKEN_SECRET,
      });
      const groupId = decodeJwt.groupId;
      group = await this.groupRepository
        .createQueryBuilder('group')
        .leftJoinAndSelect('group.UserGroup', 'userGroup')
        .leftJoinAndSelect('userGroup.User', 'user')
        .where('group.id=:groupId', { groupId })
        .getOne();
    } catch (e) {
      throw new BadRequestException('?????? ????????? ??????????????????.');
    }
    return group;
  }

  async acceptGroup(userId: number, groupId: number): Promise<UserGroup> {
    let acceptGroup;
    try {
      const userGroup = new UserGroup();
      const user = new User();
      user.id = userId;
      userGroup.User = user;

      const group = new Group();
      group.id = groupId;
      userGroup.Group = group;
      acceptGroup = await this.userGroupRepository.save(userGroup);
    } catch (e) {
      console.log(e);
      throw new BadRequestException('?????? ????????? ??????????????????.');
    }

    return acceptGroup;
  }

  async getGroupList(userId: number): Promise<any> {
    const myGroupList = await this.groupRepository
      .createQueryBuilder('group')
      .leftJoinAndSelect('group.UserGroup', 'userGroup')
      .where('userGroup.userId=:userId', { userId })
      .getMany();

    const groupIdList = myGroupList.map((x) => {
      return x.id;
    });

    const groupList = await this.groupRepository
      .createQueryBuilder('group')
      .leftJoinAndSelect('group.UserGroup', 'userGroup')
      .leftJoinAndSelect('userGroup.User', 'user')
      .where('userGroup.groupId IN (:groupIdList)', { groupIdList })
      .getMany();
    return groupList;
  }

  async getGroupById(userId: number, groupId: number): Promise<Group> {
    const group = await this.groupRepository
      .createQueryBuilder('group')
      .leftJoinAndSelect('group.UserGroup', 'userGroup')
      .where('group.id=:groupId', { groupId })
      .andWhere('userGroup.userId=:userId', { userId })
      .getOne();

    if (!group) {
      throw new BadRequestException('?????????????????? ??????????????????.');
    }
    return group;
  }
}
