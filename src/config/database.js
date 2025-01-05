import {Pool} from 'pg';
import dotenv from 'dotenv';
import { max } from 'pg/lib/defaults';

dotenv.config();

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL must be set');
}

export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    },
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000

});