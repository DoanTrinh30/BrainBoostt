import { DataSource } from 'typeorm';
import dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DATABASE_HOST || 'db',
    port: parseInt(process.env.DATABASE_PORT || '5433'),
    username: process.env.DATABASE_USERNAME || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'dong',
    database: process.env.DATABASE_NAME || 'brainboost',
    synchronize: true,
    logging: true,
    entities: ['src/entities/*.ts'],
    migrations: ['src/migrations/*.ts'],
    migrationsTableName: 'migrations',
});
