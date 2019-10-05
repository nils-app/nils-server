import { Pool } from "pg";

const pool = new Pool();

export const query = pool.query;

pool.on('error', (err, client) => {
    console.error('Postgres: Unexpected error on idle client', err);
});