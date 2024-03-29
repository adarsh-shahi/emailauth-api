import * as dotenv from "dotenv";
import pg from "pg";
const { Pool } = pg;
dotenv.config();

export default new Pool({
	port: process.env.DB_PORT,
	host: process.env.DB_HOST,
	database: process.env.DB_NAME,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	idleTimeoutMillis: 1000,
});
