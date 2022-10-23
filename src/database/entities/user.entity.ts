import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Activity } from './activity.entity';
import BaseEntity from './base.entity';
import { Group } from './group.entity';
import { UserGroup } from './user_group.entity';

@Entity('user', { schema: 'hells_mate' })
export class User extends BaseEntity {
  @Column({ type: 'varchar', name: 'nickname', comment: '닉네임' })
  nickname: string;

  @Column({
    type: 'varchar',
    name: 'email',
    comment: 'email',
  })
  email: string;

  @Column({
    type: 'varchar',
    name: 'profile',
    comment: '프로필',
    nullable: true,
  })
  profile: string;

  @Column({
    type: 'varchar',
    name: 'password',
    comment: 'password',
    select: false,
  })
  password: string;

  @Column({
    type: 'varchar',
    name: 'refresh_token',
    comment: '리프래쉬 토큰',
    nullable: true,
    select: false,
  })
  refreshToken: string;

  @OneToMany(() => UserGroup, (userGroup) => userGroup.User)
  UserGroup: UserGroup[];

  @OneToMany(() => Activity, (activity) => activity.User)
  Activity: Activity[];
}
