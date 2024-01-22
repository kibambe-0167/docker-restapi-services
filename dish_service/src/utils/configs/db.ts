const Pool = require("pg").Pool;

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.HOST_DB,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.PORT_DB,
});

export default pool;
