const { Pool } = require("pg");
const pool = new Pool({
  host: "localhost",
  port: "5432",
  user: "postgres",
  password: "teste123",
  database: "pevn",
});

module.exports = pool;
