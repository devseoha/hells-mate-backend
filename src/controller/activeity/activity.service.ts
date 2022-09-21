import { Activity } from '@/database/entities';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ActivityService {
  constructor(
    @InjectRepository(Activity)
    private activityRepository: Repository<Activity>,
  ) {}

  async completeMission(userId: number, groupId: number, date: string) {
    const activity = await this.activityRepository
      .createQueryBuilder('activity')
      .where('activity.user').andWhere;
    return null;
  }

  async getPointsDateRange(
    userId: number,
    groupId: number,
    startDate: string,
    endDate: string,
  ) {
    return null;
  }

  async detail() {
    // const activity = await this.activityRepository.findOne({
    //   where: {
    //     Group: 1,
    //     GroupMissionDate: 1,
    //   },
    // });

    const points = [1, 3, 5];
    const randomIndex = Math.floor(Math.random() * 3);

    const activity = {
      point: points[Math.floor(Math.random() * 3)],
    };

    return activity;
  }
}
