import {
  Column,
  OneToMany,
  ManyToOne,
  OneToOne,
  JoinColumn,
  Entity,
} from 'typeorm';
import BaseEntity from './base.entity';
import { MissionCategory } from './mission_category.entity';
import { Group } from './group.entity';
import { GroupMissionDate } from './group_mission_date.entity';
import {Activity} from "@/database/entities/activity.entity";

@Entity('group_mission_date_list', { schema: 'hells_mate' })
export class GroupMissionDateList extends BaseEntity {
  @OneToOne(() => Group, (group) => group.GroupMissionDateList)
  Group: Group;

  @Column({ type: 'varchar', name: 'title', comment: '제목' })
  title: string;

  @Column({ type: 'varchar', name: 'content', comment: '내용' })
  content: string;

  @ManyToOne(
    () => MissionCategory,
    (missionCategory) => missionCategory.GroupMissionDateList,
  )
  @JoinColumn([
    { name: 'mission_category_list_id', referencedColumnName: 'id' },
  ])
  MissionCategory: MissionCategory;

  @ManyToOne(
      () => GroupMissionDate,
      (groupMissionDate) => groupMissionDate.GroupMissionDateList,
  )
  @JoinColumn([
    { name: 'group_mission_date', referencedColumnName: 'id' },
  ])
  GroupMissionDate: GroupMissionDate;

  @OneToMany(() => Activity, (activity) => activity.GroupMissionDateList)
  Activity: Activity[];
}
