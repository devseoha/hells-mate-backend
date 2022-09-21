import { Column, OneToMany, ManyToOne, OneToOne, Entity } from 'typeorm';
import BaseEntity from './base.entity';
import { GroupMissionDateList } from './group_mission_date_list.entity';

@Entity('mission_category', { schema: 'hellthmate' })
export class MissionCategory extends BaseEntity {
  @Column({ type: 'varchar', name: 'name', comment: '미션 종류' })
  name: string;

  @OneToMany(
    () => GroupMissionDateList,
    (groupMissionDateList) => groupMissionDateList.MissionCategory,
  )
  GroupMissionDateList: GroupMissionDateList[];
}
