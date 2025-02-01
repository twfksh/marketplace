import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as fs from 'node:fs';

export class TypeOrmConfigService {
  public static envOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: process.env.PGHOST,
      port: Number(process.env.PGPORT),
      username: process.env.PGUSER,
      password: process.env.PGPASS,
      database: process.env.PGDB,
      ssl: {
        rejectUnauthorized: true,
        ca: fs.readFileSync('./ca.pem'),
      },
      entities: ['dist/**/**/*.entity.{ts,js}'],
      synchronize: true, // do NOT use in production environment, use migration instead
    };
  }
}
