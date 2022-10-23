import { Column, Entity, JoinColumn, ManyToMany, ManyToOne } from 'typeorm';
import BaseEntity from './base.entity';
import { Group } from './group.entity';
import { User } from './user.entity';

@Entity('user_group', { schema: 'hells_mate' })
export class UserGroup extends BaseEntity {
  @Column({ type: 'int', name: 'group_id', comment: '그룹 아이디' })
  groupId: number;

  @ManyToOne(() => Group, (group) => group.UserGroup)
  @JoinColumn([{ name: 'group_id', referencedColumnName: 'id' }])
  Group: Group;

  @Column({ type: 'int', name: 'user_id', comment: '유저 아이디' })
  userId: number;

  @ManyToOne(() => User, (user) => user.UserGroup)
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  User: User;

  @Column({ type: 'boolean', name: 'is_admin', comment: '팀장 권한 체크', default:false })
  isAdmin: boolean;
}
