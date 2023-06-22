import dotenv from "dotenv";
const Pool = require('pg').Pool;

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB || 'trip_planner',
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});


module.exports = {
  pool
};
