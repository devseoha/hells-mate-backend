import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import * as entities from './src/database/entities';

export const ormConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  entities: Object.values(entities),
  autoLoadEntities: true,
  charset: 'utf8mb4',
  synchronize: false,
  logging: true,
  keepConnectionAlive: true,
  replication: {
    master: {
      host: process.env.DB_MASTER_HOST,
      port: 3306,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    },
    slaves: [
      {
        host: process.env.DB_MASTER_HOST,
        port: 3306,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
      },
    ],
  },
};
