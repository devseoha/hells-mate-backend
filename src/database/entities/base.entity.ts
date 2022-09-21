import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export default class Base {
  @PrimaryGeneratedColumn()
  id!: number;

  @CreateDateColumn({
    type: 'datetime',
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'datetime',
    name: 'updated_at',
  })
  updatedAt: Date;

  @UpdateDateColumn({
    type: 'datetime',
    name: 'deleted_at',
  })
  deletedAt: Date;
}
