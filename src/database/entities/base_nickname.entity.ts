import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import BaseEntity from './base.entity';
import { Group } from './group.entity';
import { GroupMissionDateList } from './group_mission_date_list.entity';
import { User } from './user.entity';

@Entity('base_nickname', { schema: 'hells_mate' })
export class BaseNickname extends BaseEntity {
  @Column({
    type: 'varchar',
    name: 'front_nickname',
    comment: '앞 두단어',
    nullable: true,
  })
  frontNickname: string;

  @Column({
    type: 'varchar',
    name: 'back_nickname',
    comment: '뒤 두단어',
    nullable: true,
  })
  backNickname: string;
}
