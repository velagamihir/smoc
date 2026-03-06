import pg from "pg";
import config from "./index.js";

const pool = new pg.Pool({
  user: config.db.user,
  password: config.db.password,
  host: config.db.host,
  port: config.db.port,
  database: config.db.database,
});

pool.on("error", (error) => {
  console.error("Unexpected error on idle client", error);
});

export const query = (text, params) => {
  return pool.query(text, params);
};

export const getPool = () => pool;

export default pool;
