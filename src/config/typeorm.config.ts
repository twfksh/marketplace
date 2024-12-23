import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import * as fs from 'node:fs';

export class TypeOrmConfigService {
    public static envOptions(): TypeOrmModuleOptions {
        return {
            type: 'postgres',
            host: process.env.PG_HOST,
            port: +process.env.PG_PORT,
            username: process.env.PG_USERNAME,
            password: process.env.PG_PASSWORD,
            database: process.env.PG_DATABASE,
            // ssl: {
            //     rejectUnauthorized: true,
            //     ca: fs.readFileSync('./ca.pem'),
            // },
            entities: ['dist/**/**/*.entity.{ts,js}'],
            synchronize: true, // do NOT use in production environment, use migration instead
        }
    }
}
