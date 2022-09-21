import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import BaseEntity from './base.entity';
import { Group } from './group.entity';
import { GroupMissionDate } from './group_mission_date.entity';
import { GroupMissionDateList } from './group_mission_date_list.entity';
import { User } from './user.entity';

@Entity('activity', { schema: 'hellthmate' })
export class Activity extends BaseEntity {
  @ManyToOne(() => User, (user) => user.Activity)
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  User: User;

  @ManyToOne(() => Group, (group) => group.Activity)
  @JoinColumn([{ name: 'group_id', referencedColumnName: 'id' }])
  Group: Group;

  @Column({ type: 'int', name: 'point', comment: '포인트' })
  point: number;

  @ManyToOne(
    () => GroupMissionDate,
    (groupMissionDate) => groupMissionDate.Activity,
  )
  @JoinColumn([{ name: 'group_mission_date_id', referencedColumnName: 'id' }])
  GroupMissionDate: GroupMissionDate;
}
