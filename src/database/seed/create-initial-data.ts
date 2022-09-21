import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { Group, MissionCategory, User } from '../entities';

export class CreateInitialData implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await connection
      .createQueryBuilder()
      .insert()
      .into(User)
      .values([
        {
          id: 1,
          nickname: '서하',
        },
      ])
      .execute();

    await connection
      .createQueryBuilder()
      .insert()
      .into(Group)
      .values([
        {
          id: 1,
          title: '',
        },
      ])
      .execute();

    await connection
      .createQueryBuilder()
      .insert()
      .into(MissionCategory)
      .values([
        {
          id: 1,
          name: '식이조절',
        },
        {
          id: 2,
          name: '일상운동',
        },
      ])
      .execute();
  }
}
