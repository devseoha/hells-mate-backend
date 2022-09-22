import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Activity } from './activity.entity';
import BaseEntity from './base.entity';
import { Group } from './group.entity';
import { GroupMissionDateList } from './group_mission_date_list.entity';

@Entity('group_mission_date', { schema: 'hells_mate' })
export class GroupMissionDate extends BaseEntity {
  @ManyToOne(() => Group, (group) => group.GroupMissionDate)
  @JoinColumn([{ name: 'group_id', referencedColumnName: 'id' }])
  Group: Group;

  @Column({ type: 'varchar', name: 'date', comment: '날짜' })
  date: string;

  @OneToMany(() => GroupMissionDateList, (groupMissionDateList) => groupMissionDateList.GroupMissionDate)
  GroupMissionDateList: GroupMissionDateList[];
}
