const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: process.env.DB || 'trip_planner',
  password: 'postgres',
  port: 5432,
});


const query = (text, params, callback) => {
    return pool.query(text, params, callback)
};

module.exports = {
  query,
  pool
};
