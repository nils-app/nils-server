"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const pool = new pg_1.Pool();
exports.query = pool.query;
exports.default = pool;
pool.on('error', (err, client) => {
    console.error('Postgres: Unexpected error on idle client', err);
});
//# sourceMappingURL=index.js.map